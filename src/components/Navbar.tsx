"use client";

import { useEffect, useState } from "react";
import { Anchor, Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import CheckoutButton from "@/components/CheckoutButton";
import { siteConfig } from "@/config/site";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "What's Included", href: "#whats-included" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-navy-900/85 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex items-center justify-between py-3.5">
        <a href="#product" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
            <Anchor className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="text-sm font-semibold leading-tight text-white sm:text-base">
            Marine Logistics
            <span className="block text-[11px] font-medium text-mist-400">Operator Toolkit</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-mist-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CheckoutButton label={`Get Toolkit — ${siteConfig.currencySymbol}${siteConfig.tiers.standard.price}`} size="md" showArrow={false} />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-white/10 bg-navy-900/98 backdrop-blur-lg lg:hidden">
          <Container className="flex flex-col gap-1 py-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-mist-200 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 px-3">
              <CheckoutButton
                label={`Get Toolkit — ${siteConfig.currencySymbol}${siteConfig.tiers.standard.price}`}
                size="md"
                showArrow={false}
                className="w-full"
              />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
