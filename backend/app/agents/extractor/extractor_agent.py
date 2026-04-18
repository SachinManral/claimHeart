from app.services.extractor_agent import ExtractorAgent


def run_extractor_with_fallback(raw_text: str) -> str:
    agent = ExtractorAgent()
    return agent.structure_text(raw_text)
