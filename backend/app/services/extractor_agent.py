from __future__ import annotations

import json
import logging
import os
from typing import Any

from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except Exception:  # pragma: no cover - import availability depends on runtime env
    genai = None
    types = None

from app.schemas.bill_schema import BILL_PROMPT
from app.schemas.claim_schema import CLAIM_SCHEMA
from app.schemas.discharge_schema import DISCHARGE_SCHEMA
from app.schemas.pharmacy_schema import PHARMACY_PROMPT
from app.schemas.report_schema import REPORT_SCHEMA
from app.utils.parser import parse_medical_text

load_dotenv()
logger = logging.getLogger(__name__)


class ExtractorAgent:
    """Gemini-backed extractor with parser fallback when keys/API calls fail."""

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.model_id = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self.client = None

        if self.api_key:
            if genai is None:
                logger.warning("google-genai package not available; using fallback parser.")
            else:
                try:
                    self.client = genai.Client(api_key=self.api_key)
                except Exception as exc:
                    logger.warning("Gemini initialization failed; using fallback parser. Details: %s", exc)
        else:
            logger.warning("No GEMINI/GOOGLE API key found; using fallback parser.")

    def _fallback(self, raw_text: str, reason: str) -> str:
        return json.dumps(
            {
                "mode": "fallback_parser",
                "reason": reason,
                "structured_data": parse_medical_text(raw_text),
            }
        )

    def _identify_document_type(self, raw_text: str) -> str:
        if not self.client:
            return "other"

        classification_prompt = f"""
        Analyze the following text from a healthcare document and classify it into one of these categories:
        'bill', 'diagnostic_report', 'discharge_summary', 'pharmacy', 'claim', or 'other'.
        Return ONLY the category name.

        Text Sample: {raw_text[:1000]}
        """
        try:
            response = self.client.models.generate_content(model=self.model_id, contents=classification_prompt)
            return (response.text or "other").strip().lower()
        except Exception as exc:
            logger.warning("Classification failed; defaulting to 'other'. Details: %s", exc)
            return "other"

    def structure_text(self, raw_text: str) -> str:
        if not raw_text.strip():
            return json.dumps({"mode": "fallback_parser", "reason": "empty_input", "structured_data": {}})

        if not self.client:
            return self._fallback(raw_text, "missing_or_invalid_api_key")

        doc_type = self._identify_document_type(raw_text)
        prompt_map = {
            "bill": BILL_PROMPT,
            "diagnostic_report": REPORT_SCHEMA,
            "discharge_summary": DISCHARGE_SCHEMA,
            "pharmacy": PHARMACY_PROMPT,
            "claim": CLAIM_SCHEMA,
        }

        selected_prompt = prompt_map.get(doc_type, "Extract all important medical entities into JSON.")

        try:
            request_kwargs: dict[str, Any] = {
                "model": self.model_id,
                "contents": f"System: You are an expert in {doc_type} analysis. {selected_prompt}\n\nRaw OCR Text:\n{raw_text}",
            }
            if types is not None:
                request_kwargs["config"] = types.GenerateContentConfig(response_mime_type="application/json")

            response = self.client.models.generate_content(**request_kwargs)
            if not response.text:
                return self._fallback(raw_text, "empty_llm_response")
            return response.text
        except Exception as exc:
            logger.warning("Extraction failed; using parser fallback. Details: %s", exc)
            return self._fallback(raw_text, "llm_request_failed")
