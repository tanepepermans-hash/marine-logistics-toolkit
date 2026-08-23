import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Refund Policy | ${siteConfig.name}`,
};

// Placeholder legal copy — replace with your own reviewed refund policy before launch.
export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy">
      <p>
        Because {siteConfig.name} is an instantly-delivered digital product, all sales are
        generally final once the materials have been accessed.
      </p>
      <p>
        <strong>Made a mistake or had a checkout issue?</strong> If you experienced a technical
        problem during checkout or download, contact us within 14 days at{" "}
        <a className="text-ocean-700 underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{" "}
        and we will make it right.
      </p>
      <p>
        This policy does not affect any statutory rights you may have under the consumer
        protection laws applicable in your jurisdiction.
      </p>
    </LegalPage>
  );
}
