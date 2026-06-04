import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Library,
  Activity,
  Book,
  Grid,
  Code,
  Compass,
  Moon,
  Sun,
  ScrollText,
  Smile,
  ChevronDown,
  ChevronRight,
  Orbit,
  Network,
  Menu,
  Languages,
  Flower2,
  Feather,
  Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(true);
  const [refsOpen, setRefsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const mainNav = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/runes", label: "Runes", icon: Library },
    { href: "/graph", label: "Graph", icon: Grid },
    { href: "/programs", label: "Programs", icon: Code },
    { href: "/numerology", label: "Numerology", icon: Compass },
    { href: "/glyphs", label: "Glyphs", icon: Book },
    { href: "/dictionary", label: "Dictionary", icon: Languages },
    { href: "/corpus", label: "Stelae Corpus", icon: ScrollText },
    { href: "/iconography", label: "Hindu Iconography", icon: Flower2 },
    { href: "/northwest-art", label: "Northwest Coast Art", icon: Feather },
    { href: "/inuit-symbology", label: "Inuit Symbology", icon: Snowflake },
  ];

  const refNav = [
    { href: "/framework", label: "Framework", icon: ScrollText },
    { href: "/emotions", label: "Emotion Nodes", icon: Smile },
    { href: "/cosmology", label: "Cosmologies", icon: Orbit },
    { href: "/pyri-network", label: "Pyri Network", icon: Network },
  ];

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  const navLink = (item: { href: string; label: string; icon: React.ElementType }) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
          active
            ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(251,146,60,0.1)]"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <item.icon className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    );
  };

  const Brand = ({ onClick }: { onClick?: () => void }) => (
    <Link href="/" onClick={onClick} className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 shrink-0 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md border border-primary/20">
        𓋹
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-serif font-bold text-lg leading-none tracking-wide text-foreground truncate">
          Hiero-Code
        </span>
        <span className="text-[10px] uppercase tracking-widest text-primary/80 truncate">
          Symbolic Compute
        </span>
      </div>
    </Link>
  );

  const SidebarBody = () => (
    <>
      <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
        {mainNav.map(navLink)}

        <div className="pt-3">
          <button
            onClick={() => setRefsOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {refsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            Reference
          </button>
          {refsOpen && <div className="space-y-1 mt-1">{refNav.map(navLink)}</div>}
        </div>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border/50 hover:bg-muted"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Light Ritual" : "Dark Ritual"}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background w-full">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 border-r border-border bg-card flex-col shrink-0">
        <div className="p-6">
          <Brand />
        </div>
        <SidebarBody />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card sticky top-0 z-40">
        <Brand />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation" className="shrink-0">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-card flex flex-col">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="p-6">
              <Brand onClick={() => setMobileOpen(false)} />
            </div>
            <SidebarBody />
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-y-auto relative md:h-[100dvh]">
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        ></div>
        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
