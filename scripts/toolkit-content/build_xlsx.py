"""
Hand-rolled minimal .xlsx (SpreadsheetML) generator — stdlib only.
Same rationale as build_docx.py: no pip/npm/LibreOffice available, so the
OOXML package is built directly with zipfile + string templates.
"""
import zipfile
from xml.sax.saxutils import escape as xesc

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""

RELS_ROOT = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""

WORKBOOK_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Shipment Tracker" sheetId="1" r:id="rId1"/></sheets>
</workbook>"""

WORKBOOK_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

CORE_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Marine Logistics Shipment Tracker</dc:title>
  <dc:creator>Marine Logistics Operator Toolkit</dc:creator>
</cp:coreProperties>"""

APP_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Marine Logistics Operator Toolkit</Application>
</Properties>"""

STYLES_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="10"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="16"/><color rgb="FF0A1930"/><name val="Calibri"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0A1930"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF7F9FC"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFDBE3EE"/></left>
      <right style="thin"><color rgb="FFDBE3EE"/></right>
      <top style="thin"><color rgb="FFDBE3EE"/></top>
      <bottom style="thin"><color rgb="FFDBE3EE"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="4">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1"/>
  </cellXfs>
</styleSheet>"""

COLUMNS = [
    ("Reference", 14),
    ("Vessel / Flight", 18),
    ("ETD", 12),
    ("Cargo (pcs / kg)", 16),
    ("DG Status", 12),
    ("Documents Status", 18),
    ("Customs Status", 16),
    ("Current Step", 22),
    ("Next Action", 26),
    ("Deadline", 14),
    ("Owner", 12),
    ("Notes", 30),
]

SAMPLE_ROWS = [
    ["SHIP-1042", "MSC Antwerp Trader", "2026-09-02", "3 / 78", "Non-DG", "Complete", "Cleared", "Awaiting onboard delivery", "Confirm gate cut-off with trucker", "2026-09-02 12:00", "J. Peeters", "Priority — vessel cut-off is tight"],
    ["SHIP-1043", "AF 1234 (Air)", "2026-09-04", "1 / 22", "Non-DG", "Missing invoice", "Pending", "Waiting on shipper documents", "Chase shipper for commercial invoice", "2026-09-03 17:00", "M. de Groot", ""],
    ["SHIP-1044", "CMA Rotterdam Star", "2026-09-06", "5 / 340", "DG — Class 9", "Complete", "Cleared", "DG pre-check in progress", "Confirm carrier accepts DG class", "2026-09-05 09:00", "J. Peeters", "Confirm MSDS attached"],
]


def col_letter(idx):
    """0-indexed -> Excel column letter."""
    letters = ""
    idx += 1
    while idx > 0:
        idx, rem = divmod(idx - 1, 26)
        letters = chr(65 + rem) + letters
    return letters


def cell(col_idx, row_idx, value, style=1):
    ref = f"{col_letter(col_idx)}{row_idx}"
    text = xesc(str(value))
    return f'<c r="{ref}" t="inlineStr" s="{style}"><is><t xml:space="preserve">{text}</t></is></c>'


def build_sheet():
    n_cols = len(COLUMNS)
    last_col = col_letter(n_cols - 1)

    cols_xml = "<cols>" + "".join(
        f'<col min="{i+1}" max="{i+1}" width="{w}" customWidth="1"/>' for i, (_, w) in enumerate(COLUMNS)
    ) + "</cols>"

    rows_xml = []

    # Row 1: title
    title_row = f'<row r="1" ht="26">' + cell(0, 1, "Marine Logistics Shipment Tracker", style=2) + "</row>"
    rows_xml.append(title_row)

    # Row 2: header
    header_cells = "".join(cell(i, 2, name, style=1) for i, (name, _) in enumerate(COLUMNS))
    rows_xml.append(f'<row r="2" ht="30">{header_cells}</row>')

    # Data rows
    r = 3
    for row_data in SAMPLE_ROWS:
        data_cells = "".join(cell(i, r, val, style=0) for i, val in enumerate(row_data))
        rows_xml.append(f'<row r="{r}">{data_cells}</row>')
        r += 1

    # A few extra blank (bordered) rows ready to fill in
    for _ in range(12):
        blank_cells = "".join(cell(i, r, "", style=0) for i in range(n_cols))
        rows_xml.append(f'<row r="{r}">{blank_cells}</row>')
        r += 1

    last_row = r - 1
    dimension = f"A1:{last_col}{last_row}"

    sheet_data = "".join(rows_xml)

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="{dimension}"/>
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0">
      <pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  {cols_xml}
  <sheetData>{sheet_data}</sheetData>
</worksheet>"""


if __name__ == "__main__":
    sheet_xml = build_sheet()
    out_path = "Marine-Logistics-Shipment-Tracker.xlsx"
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS_ROOT)
        z.writestr("docProps/core.xml", CORE_XML)
        z.writestr("docProps/app.xml", APP_XML)
        z.writestr("xl/workbook.xml", WORKBOOK_XML)
        z.writestr("xl/_rels/workbook.xml.rels", WORKBOOK_RELS)
        z.writestr("xl/styles.xml", STYLES_XML)
        z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
    print("wrote", out_path)
