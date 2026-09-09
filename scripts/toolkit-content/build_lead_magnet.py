"""
Standalone one-page "Emergency Vessel Shipment Checklist" — the free lead
magnet given away in exchange for an email address (see Bonus.tsx /
/api/lead). Reuses the same content and icon system as build_pdf.py so it
stays visually identical to the bonus page inside the paid toolkit, but
ships as its own small public PDF with a footer CTA for the full product.
"""
import build_pdf as b

CSS = b.CSS + """
body { padding: 0; }
.wrap { max-width: 700px; margin: 0 auto; padding: 26mm 20mm; }
.cta-footer {
  margin-top: 28px; border-radius: 14px; padding: 20px 24px;
  background: linear-gradient(135deg, #0a1930, #0b2036);
  color: #fff; text-align: center;
}
.cta-footer .eyebrow { color: #7dd0fa; font-size: 8.5pt; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
.cta-footer h4 { margin: 8px 0 4px; font-size: 13pt; }
.cta-footer p { margin: 0; font-size: 9.5pt; color: #b9c6d6; }
.cta-footer .link { display: inline-block; margin-top: 12px; background: linear-gradient(to bottom, #3fb6f2, #0b73b3); color: #fff; text-decoration: none; font-weight: 700; font-size: 9.5pt; padding: 9px 20px; border-radius: 999px; }
"""


def build():
    cats = ""
    for c in b.BONUS_CHECKLIST:
        rows = "".join(
            f'<div class="check-row"><div class="box"></div><div>{b.esc(item)}</div></div>' for item in c["items"]
        )
        h_icon = b.icon_badge(b.BONUS_ICONS.get(c["category"], "check-square"), size=18, icon_size=10, tone="tint")
        cats += f'<div class="bonus-cat"><h4>{h_icon}{b.esc(c["category"])}</h4>{rows}</div>'

    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<title>Emergency Vessel Shipment Checklist</title>
<style>{CSS}</style>
</head><body>
<div class="wrap">
  <div class="section-head">
    {b.icon_badge("anchor", size=40, icon_size=19)}
    <div>
      <div class="eyebrow">Free Checklist</div>
      <h2>Emergency Vessel Shipment Checklist</h2>
      <p>A compact one-page checklist for urgent vessel shipments — work through it top to bottom.</p>
    </div>
  </div>

  <div class="bonus-card">
    <div class="bh">
      <div class="bh-left">{b.icon_badge("anchor", size=32, icon_size=16)}<h2>Emergency Vessel Shipment</h2></div>
      <span>One-Page Checklist</span>
    </div>
    <div class="bonus-grid">{cats}</div>
  </div>

  <div class="cta-footer">
    <div class="eyebrow">Marine Logistics Operator Toolkit</div>
    <h4>Want the full toolkit this checklist came from?</h4>
    <p>{b.BASE_EMAIL_TEMPLATE_COUNT} email templates, {b.BASE_CHECKLIST_COUNT} checklists, {b.WORKFLOW_COUNT} shipment problem workflows and AI operator prompts — built for daily use, not read once and shelved.</p>
    <span class="link">Get the Toolkit — marinelogisticstoolkit.com</span>
  </div>
</div>
</body></html>"""


if __name__ == "__main__":
    with open("lead-magnet.html", "w", encoding="utf-8") as f:
        f.write(build())
    print("wrote lead-magnet.html")
