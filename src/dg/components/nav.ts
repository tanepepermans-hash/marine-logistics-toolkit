import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Boxes,
  CalendarCheck,
  RotateCcw,
  TrendingUp,
  Search,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Requires DG Training Academy Premium (see PremiumGate). */
  premium?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dg-training", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dg-training/learn", label: "Learn", icon: BookOpen },
  { href: "/dg-training/quiz", label: "Quiz", icon: Brain, premium: true },
  { href: "/dg-training/classes", label: "DG Classes", icon: Boxes },
  { href: "/dg-training/daily", label: "Daily Challenge", icon: CalendarCheck, premium: true },
  { href: "/dg-training/mistakes", label: "Mistakes", icon: RotateCcw, premium: true },
  { href: "/dg-training/progress", label: "Progress", icon: TrendingUp, premium: true },
  { href: "/dg-training/reference", label: "Reference", icon: Search },
];
