#!/usr/bin/env python3
"""
Guards against the exact bug class this repo shipped with: hardcoded counts
("10 Shipment Problem Workflows", "12 AI Operator prompts", ...) drifting out
of sync with the actual toolkit content once someone adds/removes a
template, checklist, workflow or prompt.

Run this after editing scripts/toolkit-content/build_pdf.py, or whenever the
counts quoted on the marketing site (Hero.tsx, Features.tsx, Pricing.tsx)
change. It does NOT touch the generated PDFs/DOCX/XLSX themselves — those
already derive their numbers from build_pdf.py's constants directly, so
regenerating them (see README.md) is always in sync by construction. This
script only catches drift in the hand-written site copy, which has no such
guarantee.

Exits non-zero and prints every mismatch if something is out of sync.
"""
import re
import sys
from pathlib import Path

TOOLKIT_DIR = Path(__file__).resolve().parent
REPO_ROOT = TOOLKIT_DIR.parent.parent
SRC = REPO_ROOT / "src" / "components"

sys.path.insert(0, str(TOOLKIT_DIR))
import build_pdf as b  # noqa: E402

errors = []


def check_pattern(file_path: Path, pattern: str, expected: int, description: str):
    text = file_path.read_text(encoding="utf-8")
    m = re.search(pattern, text)
    if not m:
        errors.append(
            f"{file_path.relative_to(REPO_ROOT)}: {description} — pattern not found "
            f"(content may have changed shape; update check_counts.py). Pattern: {pattern!r}"
        )
        return
    found = int(m.group(1))
    if found != expected:
        errors.append(
            f"{file_path.relative_to(REPO_ROOT)}: {description} says {found}, "
            f"but the actual content has {expected}."
        )


def check_list_length(file_path: Path, array_name: str, expected: int, description: str):
    text = file_path.read_text(encoding="utf-8")
    m = re.search(rf"const {array_name} = \[(.*?)\n\];", text, re.S)
    if not m:
        errors.append(
            f"{file_path.relative_to(REPO_ROOT)}: {description} — array `{array_name}` not found "
            f"(update check_counts.py)."
        )
        return
    found = len(re.findall(r'"\s*[^"\n]*"\s*,', m.group(1)))
    if found != expected:
        errors.append(
            f"{file_path.relative_to(REPO_ROOT)}: {description} — `{array_name}` lists {found} items, "
            f"but the actual content has {expected}."
        )


# --- Hero.tsx --------------------------------------------------------------
hero = SRC / "Hero.tsx"
check_pattern(hero, r'"(\d+) Email Templates"', b.BASE_EMAIL_TEMPLATE_COUNT, "trust badge")
check_pattern(hero, r'"(\d+) Checklists"', b.BASE_CHECKLIST_COUNT, "trust badge")

# --- Features.tsx ------------------------------------------------------------
features = SRC / "Features.tsx"
check_pattern(features, r'title: "(\d+) Professional Email Templates"', b.BASE_EMAIL_TEMPLATE_COUNT, "card title")
check_pattern(features, r'title: "(\d+) Operational Checklists"', b.BASE_CHECKLIST_COUNT, "card title")
check_pattern(features, r'title: "(\d+) Shipment Problem Workflows"', b.WORKFLOW_COUNT, "card title")
check_list_length(features, "emailTemplates", b.BASE_EMAIL_CATEGORY_COUNT, "sample list")
check_list_length(features, "checklists", b.BASE_CHECKLIST_COUNT, "sample list")
check_list_length(features, "workflows", b.WORKFLOW_COUNT, "sample list")

# --- Pricing.tsx -------------------------------------------------------------
pricing = SRC / "Pricing.tsx"
check_pattern(pricing, r'"(\d+) professional email templates"', b.BASE_EMAIL_TEMPLATE_COUNT, "Standard tier bullet")
check_pattern(pricing, r'"(\d+) operational checklists"', b.BASE_CHECKLIST_COUNT, "Standard tier bullet")
check_pattern(pricing, r'"(\d+) shipment problem workflows"', b.WORKFLOW_COUNT, "Standard tier bullet")
check_pattern(pricing, r'"(\d+) AI Operator prompts"', b.AI_PROMPT_COUNT, "Standard tier bullet")
check_pattern(pricing, r'"(\d+) extra Advanced Operator templates"', b.PREMIUM_BONUS_TEMPLATE_COUNT, "Premium tier bullet")
check_pattern(pricing, r"all (\d+) templates", b.PREMIUM_EMAIL_TEMPLATE_COUNT, "Premium tier bullet")

if errors:
    print(f"FAIL — {len(errors)} count mismatch(es) found:\n")
    for e in errors:
        print(f"  - {e}")
    print(
        "\nFix by updating the hardcoded copy above to match, or by regenerating\n"
        "the toolkit content if the counts themselves should have changed."
    )
    sys.exit(1)

print("OK — all site copy counts match the actual toolkit content.")
