from pathlib import Path

import pytest


@pytest.fixture
def image_path() -> str:
	return str(Path(__file__).resolve().parents[1] / "app" / "docs" / "image.png")
