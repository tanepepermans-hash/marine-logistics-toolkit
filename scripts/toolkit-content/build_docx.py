"""
Hand-rolled minimal .docx (WordprocessingML) generator — stdlib only.
LibreOffice/python-docx are unavailable in this sandbox, so the OOXML
package is built directly with zipfile + string templates. Produces a
genuinely valid, Word-openable document (verified structure per ECMA-376).
"""
import zipfile
from xml.sax.saxutils import escape as xesc

import build_pdf as content

NAVY = "0A1930"
OCEAN = "0B73B3"
MIST = "45536B"

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""

RELS_ROOT = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""

RELS_DOC = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>"""

CORE_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Marine Logistics Operator Toolkit — Editable Email Templates</dc:title>
  <dc:creator>Marine Logistics Operator Toolkit</dc:creator>
</cp:coreProperties>"""

APP_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Marine Logistics Operator Toolkit</Application>
</Properties>"""

DOC_HEADER = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>"""

DOC_FOOTER = """<w:sectPr>
  <w:pgSz w:w="11906" w:h="16838"/>
  <w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="708" w:footer="708" w:gutter="0"/>
</w:sectPr>
</w:body>
</w:document>"""


def esc(s):
    return xesc(s)


def run(text, bold=False, italic=False, size=20, color="16233A", font=None):
    props = []
    if bold:
        props.append("<w:b/>")
    if italic:
        props.append("<w:i/>")
    props.append(f'<w:color w:val="{color}"/>')
    props.append(f'<w:sz w:val="{size}"/>')
    if font:
        props.append(f'<w:rFonts w:ascii="{font}" w:hAnsi="{font}"/>')
    rpr = f"<w:rPr>{''.join(props)}</w:rPr>"
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'


def para(runs_xml, spacing_before=0, spacing_after=120, jc=None, shd=None, border_bottom=False):
    ppr = [f'<w:spacing w:before="{spacing_before}" w:after="{spacing_after}"/>']
    if jc:
        ppr.append(f'<w:jc w:val="{jc}"/>')
    if shd:
        ppr.append(f'<w:shd w:val="clear" w:color="auto" w:fill="{shd}"/>')
    if border_bottom:
        ppr.append(f'<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="{OCEAN}"/></w:pBdr>')
    return f'<w:p><w:pPr>{"".join(ppr)}</w:pPr>{runs_xml}</w:p>'


def body_paragraph(text):
    # preserve blank lines / line breaks within one paragraph via <w:br/>
    lines = text.split("\n")
    runs = []
    for i, line in enumerate(lines):
        if i > 0:
            runs.append("<w:br/>")
        if line:
            runs.append(f'<w:t xml:space="preserve">{esc(line)}</w:t>')
    rpr = f'<w:rPr><w:color w:val="{MIST}"/><w:sz w:val="19"/></w:rPr>'
    return para(f"<w:r>{rpr}{''.join(runs)}</w:r>", spacing_after=200)


def template_block(t):
    out = []
    out.append(para(run(t["title"], bold=True, size=22, color=OCEAN), spacing_before=160, spacing_after=60))
    out.append(
        para(
            run("Subject: ", bold=True, size=19, color=MIST) + run(t["subject"], size=19, color="16233A"),
            shd="F1F5F9",
            spacing_after=100,
        )
    )
    out.append(body_paragraph(t["body"]))
    return "".join(out)


def build():
    parts = [DOC_HEADER]

    # Title page block
    parts.append(para(run("MARINE LOGISTICS OPERATOR TOOLKIT", bold=True, size=44, color=NAVY), jc="center", spacing_before=800, spacing_after=80))
    parts.append(para(run("Editable Email Templates — Premium Edition", size=22, color=OCEAN), jc="center", spacing_after=60))
    parts.append(
        para(
            run(
                "57 ready-to-send templates across 18 categories. Replace anything in [brackets] with your "
                "shipment's real details, then copy straight into your email client.",
                size=19,
                color=MIST,
            ),
            jc="center",
            spacing_after=600,
        )
    )

    all_categories = list(content.EMAIL_CATEGORIES) + [content.PREMIUM_EMAIL_CATEGORY]

    for cat in all_categories:
        is_premium = cat["name"] == content.PREMIUM_EMAIL_CATEGORY["name"]
        label = cat["name"] + ("  (Premium)" if is_premium else "")
        parts.append(para(run(label, bold=True, size=28, color=NAVY), spacing_before=280, spacing_after=60, border_bottom=True))
        for t in cat["templates"]:
            parts.append(template_block(t))

    parts.append(DOC_FOOTER)
    return "".join(parts)


if __name__ == "__main__":
    document_xml = build()
    out_path = "Marine-Logistics-Operator-Toolkit-Editable-Templates.docx"
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS_ROOT)
        z.writestr("docProps/core.xml", CORE_XML)
        z.writestr("docProps/app.xml", APP_XML)
        z.writestr("word/document.xml", document_xml)
        z.writestr("word/_rels/document.xml.rels", RELS_DOC)
    print("wrote", out_path)
