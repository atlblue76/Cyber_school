import { Link, useLocation } from "wouter";
import { Terminal, LayoutDashboard, GraduationCap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/exams", label: "Exam Prep", icon: GraduationCap, exact: false },
  { href: "/progress", label: "Progress", icon: Activity, exact: false },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const isActive = (href: string, exact: boolean) =>
    exact ? location === href : location === href || location.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="font-mono text-sm font-semibold tracking-tight">
                CyberBuild<span className="text-primary"> Academy</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                Build a company. Learn to defend it.
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          CyberBuild Academy — an interactive path to CompTIA Security+ and CySA+.
        </div>
      </footer>
    </div>
  );
}
