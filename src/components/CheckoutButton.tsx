"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

type CheckoutButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "dark";
  size?: "md" | "lg";
  className?: string;
  showArrow?: boolean;
};

const variantClasses: Record<NonNullable<CheckoutButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-b from-ocean-400 to-ocean-600 text-white shadow-glow hover:from-ocean-300 hover:to-ocean-500 focus-visible:outline-ocean-300",
  secondary:
    "bg-white text-navy-900 shadow-premium hover:bg-mist-100 focus-visible:outline-white",
  dark: "bg-navy-900 text-white border border-white/10 hover:bg-navy-800 focus-visible:outline-ocean-300",
};

const sizeClasses: Record<NonNullable<CheckoutButtonProps["size"]>, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

export default function CheckoutButton({
  label,
  variant = "primary",
  size = "lg",
  className = "",
  showArrow = true,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPaymentLink = siteConfig.stripePaymentLink.length > 0;

  async function handleClick() {
    if (hasPaymentLink) {
      window.location.href = siteConfig.stripePaymentLink;
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout is not available yet.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Checkout is not connected yet. Add your Stripe details in .env.local.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        className={`group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-80 sm:w-auto ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <>
            {label}
            {showArrow && (
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            )}
          </>
        )}
      </button>
      {error && (
        <p role="alert" className="max-w-xs text-center text-xs text-ocean-300/90">
          {error}
        </p>
      )}
    </div>
  );
}
