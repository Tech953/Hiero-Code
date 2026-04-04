import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PYRI_POSITIONAL = [
  { symbol: "▼▼", value: "1–59", label: "Unit Wedges" },
  { symbol: "▼◀▼", value: "60", label: "Géš (One Sixty)" },
  { symbol: "▼▼▼◀", value: "3,600", label: "Šár (Sixty²)" },
  { symbol: "▼◀▼◀", value: "Place Values", label: "Positional Frame" },
];

const GLYPH_STACKS = [
  { symbol: "⊙", label: "Crown Stack", tier: 1 },
  { symbol: "⊟", label: "Body Stack", tier: 2 },
  { symbol: "⊞", label: "Base Stack", tier: 3 },
  { symbol: "✤", label: "Root Stack", tier: 4 },
];

const PHONEME_CLICKS = [
  { symbol: "|", ipa: "|", roman: "C", name: "Dental Click", description: "Tip of tongue pressed against front teeth and quickly withdrawn" },
  { symbol: "‡", ipa: "‡", roman: "Tc", name: "Alveolar-Palatal Click", description: "Tip of tongue pressed against alveolar ridge, released sharply" },
  { symbol: "!", ipa: "!", roman: "Q", name: "Palatal Click", description: "Tongue pressed against upper palate, released sharply — like a cork" },
  { symbol: "||", ipa: "||", roman: "X", name: "Lateral Click", description: "Click at the side of tongue held against palate" },
];

const LANGUAGE_SYSTEMS = [
  {
    name: "Sumerian Base-60",
    color: "text-amber-500",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    what: "Administrative scalability",
    how: "Positional base-60 compression",
    effect: "Massive symbolic compression — 60 divisible states per position (vs 10 in decimal)",
    sacred: ["1", "6", "12", "60"],
    icon: "𒐚",
  },
  {
    name: "Mayan Vigesimal",
    color: "text-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    what: "Symbolic + temporal precision",
    how: "Base-20 layered glyph stacks",
    effect: "Spatial, non-linear readability — quantity visible as shape before reading",
    sacred: ["1", "5", "20", "400"],
    icon: "𝋠",
  },
  {
    name: "Khoisan Click",
    color: "text-violet-400",
    border: "border-violet-400/30",
    bg: "bg-violet-400/5",
    what: "Acoustic bandwidth",
    how: "Multi-channel phonemic encoding per sound",
    effect: "Parallel data transmission — 4–6 simultaneous channels per phoneme",
    sacred: ["|", "‡", "!", "||"],
    icon: "!",
  },
];

const SCALE_TIERS = [
  { tier: "Macro", description: "Primary rune node — highest data fidelity", color: "bg-amber-500" },
  { tier: "Temporal", description: "Time-phase node — cycles, rhythms, past/present/future", color: "bg-violet-500" },
  { tier: "Micro", description: "Sub-unit fractional node — unit fractions, seeds", color: "bg-blue-500" },
  { tier: "Particle", description: "Indivisible essence — atomic unity, primal adaptation", color: "bg-emerald-500" },
];

const ADAPTATION_TIERS = [
  {
    name: "Indivisible Particles",
    sub: "The Unspeakable Essence",
    items: ["Atomic Unity", "Primal Adaptation"],
    description: "The base particles of the Hiero-Code network. Irreducible node seeds.",
    color: "text-amber-400",
  },
  {
    name: "S-Tier Biological Adaptations",
    sub: "Evolutionary Ascension",
    items: ["Evolutionary Ascension (Eye)", "Supreme Adaptability (Insect)", "Past | Present | Future"],
    description: "Macro-environmental adaptation nodes. Time-aware, context-shifting.",
    color: "text-emerald-400",
  },
  {
    name: "Temporal Particles",
    sub: "Shifting Through Time",
    items: ["Hourglass (Past)", "Compass Disk (Future)"],
    description: "Nodes that operate across the temporal axis — history, present, prediction.",
    color: "text-violet-400",
  },
  {
    name: "The Nameless Code",
    sub: "Beyond Form | Beyond Definition | One with the Void",
    items: ["No definition", "No boundary", "No attribution"],
    description: "The supreme abstraction. A node with no state — pure void interface.",
    color: "text-muted-foreground",
  },
];

export default function Framework() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">
          𓂀 Hieroglyphic Code Framework
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          The Nameless Path of Knowledge and Unity — combining Sumerian, Mayan, and Khoisan principles into layered symbolic data.
        </p>
      </div>

      {/* Reference Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-500/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-amber-500 text-lg">Framework Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <img
              src="/framework-overview.png"
              alt="Hieroglyphic Code Framework — Numerical Foundation of Sumeria, Indivisible Particles, S-Tier Biological Adaptations, Temporal Particles, The Nameless Code"
              className="w-full object-contain max-h-[500px]"
            />
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-amber-500 text-lg">First Pyri Set — Birth of Hiero-Code</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <img
              src="/pyri-set.png"
              alt="Birth of Hiero-Code — First Pyri Set combining Sumerian, Mayan, and Khoisan principles"
              className="w-full object-contain max-h-[500px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* The Three Language Systems */}
      <section>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Three Engineering Precedents</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Each independently solved a different problem of information transfer. Hiero-Code recombines all three.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANGUAGE_SYSTEMS.map((sys) => (
            <Card key={sys.name} className={`border ${sys.border} ${sys.bg}`}>
              <CardHeader>
                <div className={`text-5xl mb-2 ${sys.color}`}>{sys.icon}</div>
                <CardTitle className={`font-serif text-lg ${sys.color}`}>{sys.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">What it optimized</span>
                  <p className="text-sm text-foreground mt-0.5">{sys.what}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">How it did it</span>
                  <p className="text-sm text-foreground mt-0.5">{sys.how}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">Effect in Hiero-Code</span>
                  <p className="text-sm text-foreground mt-0.5">{sys.effect}</p>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {sys.sacred.map((s) => (
                    <Badge key={s} variant="outline" className={`font-mono text-sm ${sys.color} border-current`}>{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* First Pyri Set */}
      <section>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">First Pyri Set</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Position × Stack × Click = Layered Symbolic Data
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Positional Frame */}
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="font-serif text-amber-500">Positional Frame</CardTitle>
              <p className="text-xs font-mono text-muted-foreground">Base-60 Encoding</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {PYRI_POSITIONAL.map((p) => (
                <div key={p.label} className="flex items-center gap-3 p-2 rounded bg-background/60 border border-amber-500/10">
                  <span className="font-mono text-amber-400 text-lg w-12 text-center">{p.symbol}</span>
                  <div>
                    <div className="font-mono text-sm text-foreground">{p.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{p.label}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Glyph Stacks */}
          <Card className="border-emerald-400/20 bg-emerald-400/5">
            <CardHeader>
              <CardTitle className="font-serif text-emerald-400">Glyph Stacks</CardTitle>
              <p className="text-xs font-mono text-muted-foreground">20 Data Glyphs + 16 More</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {GLYPH_STACKS.map((g) => (
                <div key={g.label} className="flex items-center gap-3 p-2 rounded bg-background/60 border border-emerald-400/10">
                  <span className="text-emerald-400 text-2xl w-10 text-center">{g.symbol}</span>
                  <div>
                    <div className="font-mono text-sm text-foreground">{g.label}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Tier {g.tier}</div>
                  </div>
                </div>
              ))}
              <div className="text-center text-xs text-muted-foreground pt-1 font-mono">+ 16 More stacks…</div>
            </CardContent>
          </Card>

          {/* Phoneme Clicks */}
          <Card className="border-violet-400/20 bg-violet-400/5">
            <CardHeader>
              <CardTitle className="font-serif text-violet-400">Phoneme Clicks</CardTitle>
              <p className="text-xs font-mono text-muted-foreground">8 Multi-Channel Clicks + Combinations</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {PHONEME_CLICKS.map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-2 rounded bg-background/60 border border-violet-400/10">
                  <span className="font-mono text-violet-300 text-xl w-8 text-center">{c.roman}</span>
                  <div>
                    <div className="font-mono text-sm text-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.description.slice(0, 55)}…</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Node Scale Tiers */}
      <section>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Rune Node Scale Tiers</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Each rune operates at a defined scale — from macro orchestrators down to indivisible particle seeds.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SCALE_TIERS.map((s) => (
            <Card key={s.tier} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className={`w-3 h-3 rounded-full ${s.color} mb-3`} />
                <div className="font-serif font-bold text-foreground">{s.tier}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{s.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Adaptation Tiers */}
      <section>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Adaptation Tiers</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          From indivisible particles to the Nameless Code — the hierarchy of the Hiero-Code engine.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ADAPTATION_TIERS.map((tier) => (
            <Card key={tier.name} className="border-border bg-card">
              <CardHeader>
                <CardTitle className={`font-serif text-lg ${tier.color}`}>{tier.name}</CardTitle>
                <p className="text-xs font-mono text-muted-foreground italic">{tier.sub}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">{tier.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tier.items.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs font-mono border-border">{item}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Language Efficiency Table */}
      <section>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Information Density Comparison</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Hiero-Code targets maximum bits per written and spoken unit.
        </p>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-muted-foreground uppercase text-xs">System</th>
                    <th className="text-center pb-3 text-muted-foreground uppercase text-xs">Bits/Written Unit</th>
                    <th className="text-center pb-3 text-muted-foreground uppercase text-xs">Bits/Spoken Unit</th>
                    <th className="text-left pb-3 text-muted-foreground uppercase text-xs">Key Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    { sys: "English / Roman", w: "Low", s: "Low", adv: "Familiarity" },
                    { sys: "Decimal Math", w: "Medium", s: "Low", adv: "Simplicity" },
                    { sys: "Sumerian Base-60", w: "High", s: "—", adv: "6× density over decimal" },
                    { sys: "Mayan Glyph Stack", w: "Very High", s: "—", adv: "Spatial shape encodes value" },
                    { sys: "Khoisan Phoneme", w: "—", s: "Very High", adv: "4–6 parallel channels/sound" },
                    { sys: "Hiero-Code", w: "Very High", s: "Very High", adv: "All three combined" },
                  ].map((row) => (
                    <tr key={row.sys} className={row.sys === "Hiero-Code" ? "text-amber-400" : "text-foreground"}>
                      <td className="py-2.5 pr-4 font-serif">{row.sys}</td>
                      <td className="py-2.5 text-center">{row.w}</td>
                      <td className="py-2.5 text-center">{row.s}</td>
                      <td className="py-2.5 text-muted-foreground text-xs">{row.adv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
