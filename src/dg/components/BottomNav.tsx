"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/dg/components/nav";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-900/95 backdrop-blur lg:hidden">
      <div className="flex overflow-x-auto px-1 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dg-training" ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[64px] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                active ? "text-hazard-orange" : "text-mist-400"
              }`}
            >
              <Icon size={19} />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
