import { Anchor } from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

const links = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refunds" },
  { label: "Contact", href: `mailto:${siteConfig.contactEmail}` },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 py-12">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
              <Anchor className="h-4 w-4 text-white" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-white">{siteConfig.name}</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-mist-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-mist-500 sm:mx-0 sm:text-left">
          {siteConfig.name} is an independent educational and operational reference product. It is
          not affiliated with any carrier, port authority, customs body or regulatory
          organization. Dangerous goods, customs and regulatory decisions must always be verified
          with qualified professionals. &copy; {new Date().getFullYear()} {siteConfig.name}. All
          rights reserved.
        </p>

        {/* Legal disclosure required for an EU commercial website ("informatieplicht") —
            fill in your real registered business details before going live. */}
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-mist-500 sm:mx-0 sm:text-left">
          [YOUR REGISTERED BUSINESS NAME] &middot; KvK [KVK NUMBER] &middot; [BUSINESS ADDRESS]
          {" "}&middot; VAT/BTW [VAT NUMBER, if applicable]
        </p>
      </Container>
    </footer>
  );
}
