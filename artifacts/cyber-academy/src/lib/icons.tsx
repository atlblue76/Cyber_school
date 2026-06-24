import {
  Building2,
  Network,
  ShieldCheck,
  Scale,
  GitBranch,
  Radar,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Network,
  ShieldCheck,
  Scale,
  GitBranch,
  Radar,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? BookOpen;
}
