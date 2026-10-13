"""Export the toolkit content from build_pdf.py to JSON for the online toolkit.

The PDF and the online toolkit (/toolkit) share one source of truth: the data
structures at the top of build_pdf.py. Run this after editing that content:

    python3 scripts/toolkit-content/export_json.py

It writes src/content/toolkit-content.json, which is only ever imported by
server code, so it never ships in the public JavaScript bundle.
"""

import json
import re
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import build_pdf as b  # noqa: E402

OUT = os.path.join(HERE, "..", "..", "src", "content", "toolkit-content.json")


# The PDF source wraps long sentences by hand to fit the page. Pasted into an
# email client those hard breaks look broken, so rejoin a line break that
# falls mid-sentence (the next line starting lowercase or with "(").
_MIDSENTENCE = re.compile(r"([^\n])\n(?=[a-z(])")


def reflow(text):
    return _MIDSENTENCE.sub(r"\1 ", text)


def reflow_templates(category):
    return {
        **category,
        "templates": [{**t, "body": reflow(t["body"])} for t in category["templates"]],
    }


def pairs(rows):
    return [{"term": t, "definition": d} for t, d in rows]


def regions(rows):
    return [
        {"region": region, "codes": [{"code": c, "name": n} for c, n in codes]}
        for region, codes in rows
    ]


data = {
    "quickStart": b.QUICK_START,
    "emailCategories": [reflow_templates(c) for c in b.EMAIL_CATEGORIES],
    "checklists": b.CHECKLISTS,
    "workflows": b.WORKFLOWS,
    "prompts": [{**p, "prompt": reflow(p["prompt"])} for p in b.AI_PROMPTS],
    "glossary": pairs(b.GLOSSARY),
    "incoterms": pairs(b.INCOTERMS),
    "airCarrierCodes": regions(b.AIR_CARRIER_CODES),
    "airportCodes": regions(b.AIRPORT_CODES),
    "emergencyChecklist": b.BONUS_CHECKLIST,
    "premium": {
        "emailCategory": reflow_templates(b.PREMIUM_EMAIL_CATEGORY),
        "checklist": b.PREMIUM_CHECKLIST,
    },
}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)

n_templates = sum(len(c["templates"]) for c in b.EMAIL_CATEGORIES)
print(
    f"wrote {os.path.relpath(OUT)}: {n_templates} templates, "
    f"{len(b.CHECKLISTS)} checklists, {len(b.WORKFLOWS)} workflows, {len(b.AI_PROMPTS)} prompts"
)
