import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
};

// Placeholder legal copy — replace with your own reviewed terms before launch.
export default function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions">
      <p>
        By purchasing or using {siteConfig.name}, you agree to the following terms.
      </p>
      <p>
        <strong>Product.</strong> {siteConfig.name} is a digital, downloadable reference product
        consisting of email templates, checklists, workflows and AI prompts. It is provided for
        educational and operational reference purposes only.
      </p>
      <p>
        <strong>No professional advice.</strong> The toolkit does not constitute legal, customs,
        dangerous goods or regulatory advice. Always confirm requirements with qualified
        professionals, carriers and the relevant authorities.
      </p>
      <p>
        <strong>License.</strong> Your purchase grants you a personal, non-transferable license to
        use the toolkit. Redistribution or resale of the materials is not permitted. Team
        licensing is available on request — see our{" "}
        <a className="text-ocean-700 underline" href="#faq">
          FAQ
        </a>
        .
      </p>
      <p>
        <strong>Contact.</strong> Questions about these terms can be sent to{" "}
        <a className="text-ocean-700 underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
