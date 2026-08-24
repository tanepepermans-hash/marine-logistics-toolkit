# Toolkit Content Generator

These scripts generate the actual product files served by the app —
`private/toolkit/` (paid) and `public/downloads/` (the free lead magnet).
They are **not** part of the Next.js app and don't run at build/deploy
time. Run them locally whenever you want to edit the content (templates,
checklists, workflows, prompts, tracker).

All four use only the Python standard library — no `pip install` needed.

## Files

- `build_pdf.py` — all toolkit copy lives here (edit this file to change
  templates/checklists/workflows/prompts/bonus content), plus the HTML/CSS
  that turns it into the PDF layout. Running it writes `toolkit.html`
  (Standard) and `toolkit-premium.html` (Premium, includes the extra
  "Advanced Operator Templates" section).
- `build_docx.py` — builds the editable Word version of all templates
  (Premium only) directly as OOXML, importing its content from
  `build_pdf.py`.
- `build_xlsx.py` — builds the Shipment Tracker Excel file (Premium only),
  also hand-built as OOXML.
- `build_lead_magnet.py` — builds the free, public one-page checklist PDF
  given away in exchange for an email (see README section 8), reusing the
  same `BONUS_CHECKLIST` content and icons as `build_pdf.py`.

## Regenerating everything

```bash
cd scripts/toolkit-content

# 1. Regenerate the HTML
python3 build_pdf.py

# 2. Turn the HTML into PDFs (requires a Chromium/Chrome binary)
CHROME=google-chrome   # or chromium, or the path to any Chrome/Chromium build
"$CHROME" --headless --disable-gpu --no-sandbox \
  --print-to-pdf=Marine-Logistics-Operator-Toolkit.pdf \
  --no-pdf-header-footer toolkit.html
"$CHROME" --headless --disable-gpu --no-sandbox \
  --print-to-pdf=Marine-Logistics-Operator-Toolkit-Premium.pdf \
  --no-pdf-header-footer toolkit-premium.html

# 3. Regenerate the editable Premium extras
python3 build_docx.py
python3 build_xlsx.py

# 4. Bundle the Premium ZIP
python3 -c "
import zipfile
with zipfile.ZipFile('marine-logistics-operator-toolkit-premium.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write('Marine-Logistics-Operator-Toolkit-Premium.pdf')
    z.write('Marine-Logistics-Operator-Toolkit-Editable-Templates.docx')
    z.write('Marine-Logistics-Shipment-Tracker.xlsx')
"

# 5. Copy the two deliverables into the app
cp Marine-Logistics-Operator-Toolkit.pdf ../../private/toolkit/marine-logistics-operator-toolkit.pdf
cp marine-logistics-operator-toolkit-premium.zip ../../private/toolkit/marine-logistics-operator-toolkit-premium.zip

# 6. Regenerate + copy the free lead magnet (only needed if you edited
#    BONUS_CHECKLIST in build_pdf.py)
python3 build_lead_magnet.py
"$CHROME" --headless --disable-gpu --no-sandbox \
  --print-to-pdf=emergency-vessel-shipment-checklist.pdf \
  --no-pdf-header-footer lead-magnet.html
cp emergency-vessel-shipment-checklist.pdf ../../public/downloads/emergency-vessel-shipment-checklist.pdf
```

> **Why hand-built OOXML instead of python-docx/openpyxl/LibreOffice?** In
> the sandbox this project was built in, `pip`/`npm` installs and
> LibreOffice were both unavailable, so `build_docx.py`/`build_xlsx.py`
> write valid `.docx`/`.xlsx` zip archives directly. If you have
> `python-docx` / `openpyxl` available locally, feel free to swap these
> scripts for those libraries — the output only needs to match the same
> two filenames referenced by the app.
