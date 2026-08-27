import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
};

// IMPORTANT — before going live, fill in [YOUR REGISTERED BUSINESS NAME] and
// [BUSINESS ADDRESS] below with your real registered business details.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how {siteConfig.name}, operated by [YOUR REGISTERED BUSINESS
        NAME] ([BUSINESS ADDRESS]) (&quot;we&quot;, &quot;us&quot;), collects, uses and protects
        your personal data when you visit this website, sign up for the free checklist, or
        purchase the toolkit, in line with the EU General Data Protection Regulation (GDPR/AVG).
      </p>
      <p>
        <strong>What we collect and why.</strong>
      </p>
      <p>
        — <strong>Purchases:</strong> our payment processor, Stripe, collects the information
        needed to process payment (name, email, payment details). We never see or store your full
        card details. Legal basis: performance of the purchase contract.
      </p>
      <p>
        — <strong>Free checklist opt-in:</strong> if you request the free Emergency Vessel
        Shipment Checklist, we collect your email address to send it and, unless you unsubscribe,
        occasional related emails. Legal basis: your consent, which you can withdraw at any time
        by unsubscribing or emailing us.
      </p>
      <p>
        — <strong>DG Training progress:</strong> your quiz answers, XP, streaks and mistakes in
        the DG Training app are stored only in your own browser&apos;s local storage. We do not
        receive or store this data on our servers.
      </p>
      <p>
        <strong>How long we keep it.</strong> We keep purchase and email records for as long as
        needed to fulfil the purchase, meet tax/accounting obligations, and handle support
        requests, and no longer than necessary for those purposes.
      </p>
      <p>
        <strong>Third parties.</strong> Payment processing is handled by Stripe; email delivery
        for the free checklist may be handled by a third-party email/webhook tool. We do not sell
        your personal data to anyone. Review Stripe&apos;s own privacy policy for details on how
        it handles your data.
      </p>
      <p>
        <strong>Your rights.</strong> Under GDPR, you can ask us to access, correct or delete your
        personal data, or object to how we use it, by emailing us at the address below. If you
        believe we have not handled your data properly, you also have the right to complain to
        your own country&apos;s data protection authority.
      </p>
      <p>
        <strong>Cookies.</strong> This site does not use advertising or tracking cookies. Any
        strictly necessary technical storage (such as remembering your DG Training progress) stays
        in your own browser and is never sent to us.
      </p>
      <p>
        <strong>Contact.</strong> Questions about this policy, or a request to exercise your
        rights, can be sent to{" "}
        <a className="text-ocean-700 underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
