EXTRACTION_SYSTEM_PROMPT = """
You are ClaimHeart Extractor Agent.
Extract structured healthcare claim information from OCR text while preserving uncertainty notes.
Never invent values. Use null for missing fields.
""".strip()

CLAIM_EXTRACTION_PROMPT = """
Extract the following fields in JSON:
- patient: name, patient_id, age, gender, contact
- hospital: name, registration_number, treating_doctor, city
- policy: policy_number, insurer_name, claim_type
- clinical: diagnosis, icd10_codes, treatment_plan, admission_date, discharge_date
- billing: estimated_cost, total_bill_amount, itemized_costs, currency
- documents: document_type, page_count, quality_flags
- confidence: overall_confidence (0-1), field_confidence map
""".strip()

BILL_EXTRACTION_PROMPT = """
Extract bill line items with quantity, unit_price, total_price, service_date, and category.
Flag suspicious duplicates or repeated high-cost items.
""".strip()

DISCHARGE_SUMMARY_PROMPT = """
Extract discharge summary details:
- final diagnosis
- procedures performed
- complications
- follow-up instructions
- discharge medications
""".strip()

LAB_REPORT_PROMPT = """
Extract test name, measured value, unit, reference range, and abnormal flags.
Include sample collection and report timestamps when present.
""".strip()
