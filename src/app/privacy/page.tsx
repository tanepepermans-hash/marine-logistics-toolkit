import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
};

// Placeholder legal copy — replace with your own reviewed privacy policy before launch.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how {siteConfig.name} (&quot;we&quot;, &quot;us&quot;)
        collects, uses and protects information when you visit this website or purchase the
        toolkit.
      </p>
      <p>
        <strong>Information we collect.</strong> When you make a purchase, our payment processor
        (Stripe) collects the information required to process payment, such as your name, email
        address and payment details. We do not store your card details on our servers.
      </p>
      <p>
        <strong>How we use information.</strong> We use your email address to deliver your
        purchase, send order confirmations, and respond to support requests.
      </p>
      <p>
        <strong>Third parties.</strong> Payment processing is handled by Stripe. Please review
        Stripe&apos;s own privacy policy for details on how it handles your data.
      </p>
      <p>
        <strong>Contact.</strong> Questions about this policy can be sent to{" "}
        <a className="text-ocean-700 underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
