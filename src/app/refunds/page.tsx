import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Refund Policy | ${siteConfig.name}`,
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy">
      <p>
        <strong>Right of withdrawal.</strong> If you are a consumer in the European Union, you
        normally have a 14-day right of withdrawal on online purchases. Because{" "}
        {siteConfig.name} is delivered to you instantly as a digital download, that right can
        only be waived with your explicit consent given before payment — which is exactly what
        the required checkbox on the checkout page asks you to confirm. By checking that box and
        completing your purchase, you agree that delivery starts immediately and that you give up
        your right of withdrawal once you have downloaded or accessed the materials.
      </p>
      <p>
        <strong>Our goodwill policy anyway.</strong> Even though the law no longer requires it
        once you&apos;ve downloaded the toolkit, if it genuinely isn&apos;t what you expected,
        email us within 14 days of your purchase at{" "}
        <a className="text-ocean-700 underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{" "}
        and tell us why. We review every request individually and refund it if the request is
        reasonable — we&apos;d rather have a satisfied customer or a fair refund than a dispute.
      </p>
      <p>
        <strong>Checkout or technical problems.</strong> If you were charged but never received
        working access to your purchase (a broken download link, a failed payment that still
        charged your card, etc.), contact us and we will fix it or refund you in full — that is
        never subject to any waiting period.
      </p>
      <p>
        This policy does not limit any statutory rights you may have under the consumer
        protection laws applicable in your country.
      </p>
    </LegalPage>
  );
}
