from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.core.config import settings


@dataclass
class VectorMatch:
    id: str
    score: float
    metadata: dict[str, Any]


class PolicyVectorStore:
    """Pinecone-backed vector store with in-memory fallback for local/dev."""

    def __init__(self):
        self._client = None
        self._index = None
        self._memory_vectors: list[dict[str, Any]] = []
        self.index_name = settings.pinecone_index_name

        if settings.pinecone_api_key:
            try:
                from pinecone import Pinecone, ServerlessSpec

                self._client = Pinecone(api_key=settings.pinecone_api_key)
                existing = {item["name"] for item in self._client.list_indexes()}
                if self.index_name not in existing:
                    self._client.create_index(
                        name=self.index_name,
                        dimension=settings.pinecone_dimension,
                        metric=settings.pinecone_metric,
                        spec=ServerlessSpec(cloud=settings.pinecone_cloud, region=settings.pinecone_region),
                    )
                self._index = self._client.Index(self.index_name)
            except Exception:
                self._client = None
                self._index = None

    @property
    def using_pinecone(self) -> bool:
        return self._index is not None

    def upsert_policy_chunks(self, chunks: list[dict[str, Any]]) -> dict[str, Any]:
        if self.using_pinecone:
            vectors = [
                {
                    "id": chunk["id"],
                    "values": chunk["embedding"],
                    "metadata": {
                        "text": chunk.get("text", ""),
                        "policy_id": chunk.get("policy_id"),
                        "section": chunk.get("section"),
                        "page_number": chunk.get("page_number"),
                    },
                }
                for chunk in chunks
            ]
            self._index.upsert(vectors=vectors)
            return {"stored": len(vectors), "provider": "pinecone"}

        self._memory_vectors.extend(chunks)
        return {"stored": len(chunks), "provider": "in_memory"}

    def search(self, query_embedding: list[float], top_k: int = 5, metadata_filter: dict[str, Any] | None = None) -> list[VectorMatch]:
        if self.using_pinecone:
            raw = self._index.query(
                vector=query_embedding,
                top_k=top_k,
                filter=metadata_filter,
                include_metadata=True,
            )
            return [
                VectorMatch(id=match["id"], score=float(match.get("score", 0)), metadata=match.get("metadata", {}))
                for match in raw.get("matches", [])
            ]

        # In-memory fallback: zero-score deterministic filter-only results.
        matches: list[VectorMatch] = []
        for item in self._memory_vectors:
            meta = {
                "text": item.get("text", ""),
                "policy_id": item.get("policy_id"),
                "section": item.get("section"),
                "page_number": item.get("page_number"),
            }
            if metadata_filter and any(meta.get(k) != v for k, v in metadata_filter.items()):
                continue
            matches.append(VectorMatch(id=item.get("id", "unknown"), score=0.0, metadata=meta))
            if len(matches) >= top_k:
                break
        return matches
