import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
};

// IMPORTANT — before going live, replace the bracketed [PLACEHOLDER] values
// below with your real registered business details (see SellerIdentity).
// Everything else on this page is ready to use as-is.
function SellerIdentity() {
  return (
    <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-navy-800">
      <strong>Seller.</strong> {siteConfig.name} is operated by [YOUR REGISTERED BUSINESS NAME],
      registered in [COUNTRY OF REGISTRATION] under company number [REGISTRATION NUMBER], located
      at [BUSINESS ADDRESS]. VAT number: [VAT NUMBER, if applicable].
    </p>
  );
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions">
      <SellerIdentity />
      <p>
        By purchasing or using {siteConfig.name}, you agree to the following terms.
      </p>
      <p>
        <strong>Product.</strong> {siteConfig.name} is a digital, downloadable reference product
        consisting of email templates, checklists, workflows and AI prompts, and (for tiers that
        include it) access to the DG Training Academy web app. It is provided for educational and
        operational reference purposes only.
      </p>
      <p>
        <strong>No professional advice.</strong> The toolkit does not constitute legal, customs,
        dangerous goods or regulatory advice. Always confirm requirements with qualified
        professionals, carriers and the relevant authorities. DG Training is a study aid, not an
        official or regulatory Dangerous Goods certification.
      </p>
      <p>
        <strong>Instant digital delivery &amp; right of withdrawal.</strong> As an EU consumer,
        you normally have a 14-day right to withdraw from an online purchase. Because this product
        is delivered to you instantly, you are asked to explicitly confirm at checkout that you
        want immediate access and that doing so waives that 14-day right once the materials are
        downloaded or accessed. See our{" "}
        <a className="text-ocean-700 underline" href="/refunds">
          Refund Policy
        </a>{" "}
        for what happens if something goes wrong anyway.
      </p>
      <p>
        <strong>License.</strong> Your purchase grants you a personal, non-transferable license to
        use the toolkit for your own work. Redistribution, resale, or sharing the files or your
        account access with others is not permitted. Team licensing is available on request —
        contact us using the details below.
      </p>
      <p>
        <strong>Price and payment.</strong> All prices are shown in EUR and, where applicable,
        include VAT calculated for your country as required under EU digital-goods VAT rules.
        The price shown at checkout is the total price you pay — as a digital product delivered
        instantly, there is no shipping, handling, or any other additional cost. Payment is
        processed securely by Stripe; we never see or store your full card details.
      </p>
      <p>
        <strong>Liability.</strong> The toolkit and DG Training content are provided &quot;as
        is&quot;, without warranty of completeness for every possible situation. To the maximum
        extent permitted by law, we are not liable for indirect or consequential damages arising
        from use of the materials. Nothing in these terms limits liability that cannot be excluded
        under applicable consumer protection law.
      </p>
      <p>
        <strong>Governing law.</strong> These terms are governed by the law of [COUNTRY OF
        REGISTRATION], without prejudice to any mandatory consumer protection rules of your own
        country of residence if you are an EU consumer.
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
