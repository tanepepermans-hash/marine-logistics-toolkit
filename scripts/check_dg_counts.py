#!/usr/bin/env python3
"""
Guards against the same bug class found in scripts/toolkit-content/: the DG
Training Academy's question count is hardcoded as "162" in two marketing
spots (DgTraining.tsx, Pricing.tsx) instead of being derived from
QUESTION_COUNT in src/dg/data/questions.ts. Nothing enforces that they stay
in sync when a question is added or removed — this script does.

Run it after editing src/dg/data/questions.ts. Uses only the standard
library (counts `id: "..."` entries with a regex rather than parsing
TypeScript properly, since that's all this needs).

Exits non-zero and prints every mismatch if something is out of sync.
"""
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SRC = REPO_ROOT / "src"

errors = []


def count_questions() -> int:
    text = (SRC / "dg" / "data" / "questions.ts").read_text(encoding="utf-8")
    return len(re.findall(r'\bid:\s*"[^"]+"', text))


def check_pattern(file_path: Path, pattern: str, expected: int, description: str):
    text = file_path.read_text(encoding="utf-8")
    m = re.search(pattern, text)
    if not m:
        errors.append(
            f"{file_path.relative_to(REPO_ROOT)}: {description} — pattern not found "
            f"(content may have changed shape; update check_dg_counts.py). Pattern: {pattern!r}"
        )
        return
    found = int(m.group(1))
    if found != expected:
        errors.append(
            f"{file_path.relative_to(REPO_ROOT)}: {description} says {found}, "
            f"but questions.ts actually has {expected} questions."
        )


def count_quiz_mode_tiles() -> int:
    text = (SRC / "app" / "dg-training" / "quiz" / "page.tsx").read_text(encoding="utf-8")
    m = re.search(r"const MODES = \[(.*?)\n\] as const;", text, re.S)
    if not m:
        errors.append("src/app/dg-training/quiz/page.tsx: MODES array not found (update check_dg_counts.py)")
        return -1
    return len(re.findall(r'\bmode:\s*"[^"]+"', m.group(1)))


expected_count = count_questions()
expected_mode_count = count_quiz_mode_tiles()

check_pattern(
    SRC / "components" / "DgTraining.tsx",
    r"(\d+) practice questions",
    expected_count,
    "trust badge",
)
check_pattern(
    SRC / "components" / "Pricing.tsx",
    r"(\d+) practice questions across all \d+ hazard classes",
    expected_count,
    "DG tier bullet",
)
if expected_mode_count >= 0:
    check_pattern(
        SRC / "components" / "DgTraining.tsx",
        r"(\d+) quiz modes",
        expected_mode_count,
        "trust badge",
    )
    check_pattern(
        SRC / "components" / "Pricing.tsx",
        r"(\d+) quiz modes",
        expected_mode_count,
        "DG tier bullet",
    )

if errors:
    print(f"FAIL — {len(errors)} count mismatch(es) found:\n")
    for e in errors:
        print(f"  - {e}")
    print(
        "\nFix by updating the hardcoded copy above to match the real question count."
    )
    sys.exit(1)

print(f"OK — {expected_count} questions, and all site copy agrees.")
