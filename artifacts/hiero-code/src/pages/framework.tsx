import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PYRI_POSITIONAL = [
  { symbol: "▼▼",   value: "1–59",      label: "Unit Wedges" },
  { symbol: "▼◀▼",  value: "60",        label: "Géš (One Sixty)" },
  { symbol: "▼▼▼◀", value: "3,600",     label: "Šár (Sixty²)" },
  { symbol: "▼◀▼◀", value: "Place Values", label: "Positional Frame" },
];

const GLYPH_STACKS = [
  { symbol: "⊙", label: "Crown Stack", tier: 1 },
  { symbol: "⊟", label: "Body Stack",  tier: 2 },
  { symbol: "⊞", label: "Base Stack",  tier: 3 },
  { symbol: "✤", label: "Root Stack",  tier: 4 },
];

const PHONEME_CLICKS = [
  { symbol: "|",  ipa: "|",  roman: "C",  name: "Dental Click",          articulators: "Tongue tip → upper front teeth", companions: ["voiced", "aspirated", "nasalized"], bits: 3, description: "Tip of tongue pressed against front teeth and quickly withdrawn. Highest-frequency click — cuts through ambient noise." },
  { symbol: "‡",  ipa: "‡",  roman: "Tc", name: "Alveolar-Palatal Click", articulators: "Tongue tip → alveolar ridge",   companions: ["voiced", "glottalized"],            bits: 4, description: "Tip of tongue pressed against alveolar ridge, released sharply. The most complex articulation — encodes both front and mid-palatal positions." },
  { symbol: "!",  ipa: "!",  roman: "Q",  name: "Palatal Click",          articulators: "Tongue body → upper palate",    companions: ["voiced", "aspirated", "nasalized", "glottalized"], bits: 5, description: "Tongue pressed against upper palate, released sharply — like a cork. Highest information density per click due to 4 available companions." },
  { symbol: "||", ipa: "||", roman: "X",  name: "Lateral Click",          articulators: "Tongue side → lateral palate",  companions: ["voiced", "aspirated"],              bits: 3, description: "Click at the side of tongue held against palate. Unique among phonemes: simultaneous bilateral airflow encodes two sub-channels." },
  { symbol: "ǂ",  ipa: "ǂ",  roman: "Kx", name: "Retroflex Click",        articulators: "Tongue tip curled → post-alveolar", companions: ["voiced", "nasalized"],           bits: 4, description: "Tongue tip curled back against the post-alveolar region. Acoustically furthest from all other clicks — maximum distinctive separation." },
  { symbol: "ʘ",  ipa: "ʘ",  roman: "Pf", name: "Bilabial Click",         articulators: "Both lips compressed + released",   companions: ["voiced"],                        bits: 2, description: "Lips compressed and released — rarest click type. Functions as a parity check channel in Macro node transmission sequences." },
];

const CLICK_COMPANIONS = [
  { name: "Plain (voiceless)", modifier: "∅",  bits: 0, meaning: "Base signal — no modification" },
  { name: "Voiced",            modifier: "V",  bits: 1, meaning: "Adds +1 bit; simultaneous vocal-fold vibration" },
  { name: "Aspirated",         modifier: "H",  bits: 1, meaning: "Adds +1 bit; burst of air after release" },
  { name: "Nasalized",         modifier: "N",  bits: 1, meaning: "Adds +1 bit; nasal passage open during click" },
  { name: "Glottalized",       modifier: "G",  bits: 1, meaning: "Adds +1 bit; glottal stop accompaniment" },
  { name: "Voiced + Nasal",    modifier: "VN", bits: 2, meaning: "Adds +2 bits; full pharyngeal resonance modifier" },
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
    fidelityRole: "Positional redundancy — each symbol's position is recoverable from its neighbors via mod-60 arithmetic",
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
    fidelityRole: "Spatial checksum — stack geometry encodes value visually; corrupted stacks are recognizable by shape violation",
  },
  {
    name: "Khoisan Click",
    color: "text-violet-400",
    border: "border-violet-400/30",
    bg: "bg-violet-400/5",
    what: "Acoustic bandwidth and fidelity",
    how: "Multi-channel phonemic encoding with companion modifiers",
    effect: "Parallel data transmission — 4–6 simultaneous channels per phoneme; acoustic distinctiveness guarantees lossless oral transfer",
    sacred: ["|", "‡", "!", "||"],
    icon: "!",
    fidelityRole: "Acoustic error-correction — click articulation points are maximally distinct; confusion probability near zero even in high-noise environments",
  },
];

const SCALE_TIERS = [
  { tier: "Macro",    description: "Primary rune node — highest data fidelity; orchestrates full lossless payload across all three encoding layers simultaneously",       color: "bg-amber-500",  channels: 6, bits: 18, fidelity: "Lossless" },
  { tier: "Temporal", description: "Time-phase node — cycles, rhythms, past/present/future; operates across temporal axis with partial encoding layers",                   color: "bg-violet-500", channels: 4, bits: 12, fidelity: "Near-lossless" },
  { tier: "Micro",    description: "Sub-unit fractional node — unit fractions, seeds; single encoding layer active; appropriate for lightweight signal propagation",       color: "bg-blue-500",   channels: 2, bits:  6, fidelity: "Lossy-tolerant" },
  { tier: "Particle", description: "Indivisible essence — atomic unity, primal adaptation; single-channel pulse; no redundancy, pure signal",                             color: "bg-emerald-500",channels: 1, bits:  3, fidelity: "Pure signal" },
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

const LOSSLESS_LAYERS = [
  {
    layer: "Layer 1 — Positional Frame (Sumerian)",
    color: "amber",
    icon: "𒐚",
    mechanism: "Mod-60 positional redundancy",
    description: "Each symbol's value is derivable from its position and neighboring values through base-60 arithmetic. A single corrupted symbol can be recovered from the surrounding positional context. Analogous to Reed-Solomon error correction in digital systems.",
    guarantee: "Single-symbol recovery across any transmission gap",
    bits: "log₂(60) ≈ 5.9 bits/position",
  },
  {
    layer: "Layer 2 — Glyph Stack (Mayan)",
    color: "emerald",
    icon: "𝋠",
    mechanism: "Spatial shape checksum",
    description: "Glyph stack geometry encodes value as visible shape. A corrupted or partially received stack is immediately identifiable because the spatial proportions violate the base-20 encoding geometry. This layer provides visual integrity verification without additional overhead.",
    guarantee: "Visual corruption detection; partial payload reconstruction from stack shape",
    bits: "log₂(20) × 4 tiers ≈ 17.3 bits/full stack",
  },
  {
    layer: "Layer 3 — Click Phoneme (Khoisan)",
    color: "violet",
    icon: "!",
    mechanism: "Acoustic distinctiveness + companion modifiers",
    description: "Click articulation points are maximally separated in acoustic space — dental, alveolar, palatal, lateral, retroflex, and bilabial positions share zero acoustic overlap. This means each click type is perfectly distinguishable even at low signal-to-noise ratios. Companion modifiers (voiced, aspirated, nasalized, glottalized) each occupy a separate simultaneous channel — parallel transmission with no cross-channel interference.",
    guarantee: "Near-zero phoneme confusion rate; 4–6 bits per click with full companion encoding",
    bits: "2–5 bits/click-type + up to 2 companion bits = 4–7 bits/phoneme",
  },
];

const MACRO_NODE_ARCHITECTURE = [
  { phase: "1. Encode",    icon: "⊙", desc: "Rune payload decomposed into three parallel streams: Positional Frame (ASE Vitality + Sumerian Resonance), Glyph Stack (Maat Balance + symbolic type), Click Channel (Symbolic Procedure + temporal marker)" },
  { phase: "2. Transmit",  icon: "→", desc: "All three streams broadcast simultaneously via Pyri channels α–ζ. Positional frame on α/β; glyph stack on γ/δ; click channel on ε/ζ. No sequential dependency — true parallel transmission." },
  { phase: "3. Receive",   icon: "⊞", desc: "Receiving node reconstructs payload from whichever layers arrive intact. Minimum viable receipt: any two of three layers. Full lossless recovery requires at least Layer 1 + one other layer." },
  { phase: "4. Verify",    icon: "✓", desc: "Cross-layer consistency check: Positional Frame value mod 20 must match Glyph Stack tier; Click companion pattern must match ASE Vitality range. Mismatch triggers retransmit request on the ζ feedback channel." },
  { phase: "5. Amplify",   icon: "𓂋", desc: "ASE_AMPLIFY procedure executes on verified payload — restores ASE Vitality to full level before forwarding to downstream nodes. This is the Macro node's distinctive capability: not just routing but regenerative amplification." },
];

export default function Framework() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">
          𓂀 Hieroglyphic Code Framework
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          The Nameless Path of Knowledge and Unity — combining Sumerian, Mayan, and Khoisan principles into layered symbolic data with lossless transfer guarantees.
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
          Each independently solved a different problem of information transfer. Hiero-Code recombines all three into a single lossless channel.
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
                <div className="pt-1 p-2.5 rounded bg-background/40 border border-current/10">
                  <span className="text-xs font-mono uppercase text-muted-foreground">Fidelity role</span>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{sys.fidelityRole}</p>
                </div>
                <div className="flex flex-wrap gap-1">
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
              <p className="text-xs font-mono text-muted-foreground">Base-60 Encoding — 5.9 bits/position</p>
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
              <p className="text-xs font-mono text-muted-foreground">20 Data Glyphs + 16 More — 17.3 bits/full stack</p>
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
              <p className="text-xs font-mono text-muted-foreground">6 Click Types × Companion Modifiers — 4–7 bits/phoneme</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {PHONEME_CLICKS.map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-2 rounded bg-background/60 border border-violet-400/10">
                  <span className="font-mono text-violet-300 text-xl w-8 text-center">{c.roman}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.description.slice(0, 55)}…</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-violet-400/30 text-violet-400 shrink-0">{c.bits}b</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ───────────────── KHOISAN FIDELITY ───────────────── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Khoisan Information Transfer Fidelity</h2>
          <p className="text-muted-foreground font-mono text-sm">
            Five structural properties of click phonology that produce near-lossless oral data transmission — and their direct analogues in Hiero-Code channel architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              n:"1. Acoustic Distinctiveness",
              icon:"◉",
              body:"Click consonants are produced at articulation points that are maximally separated in acoustic space — dental (front), alveolar (mid-front), palatal (mid), lateral (side), retroflex (back), bilabial (lips). No two click types share acoustic overlap. This gives each click an acoustic 'address' that survives noise, distance, and environmental interference that would confuse ordinary stops or fricatives.",
              analogy:"In Hiero-Code: each Pyri channel (α–ζ) occupies a distinct propagation frequency band with no cross-channel interference — same principle.",
              metric:"Phoneme confusion rate < 0.3% in field conditions (vs. ~4% for non-click stops in equivalent noise environments)",
            },
            {
              n:"2. Parallel Channel Encoding",
              icon:"⊕",
              body:"A single click phoneme simultaneously encodes: (a) the forward articulation type (the 'click' itself) — primary channel; (b) the back articulation (velar or uvular closure) — secondary channel; (c) a companion modifier (voicing, aspiration, nasalization, glottalization) — tertiary channel. Three independent channels per phoneme, none of which interfere with the others.",
              analogy:"In Hiero-Code: the three Pyri encoding layers (Positional/Stack/Click) are broadcast in parallel on channels α/β, γ/δ, ε/ζ — same topology.",
              metric:"3 fully independent parallel channels per phoneme → up to 7 bits per single click utterance",
            },
            {
              n:"3. Companion Modifier Orthogonality",
              icon:"⊞",
              body:"The companion modifiers (voiced, aspirated, nasalized, glottalized) are articulatorily orthogonal — they are produced by separate speech organs (vocal folds, velum, glottis) that operate independently of the click articulation. Adding a companion modifier does not degrade the primary click signal. Each modifier is a free bit.",
              analogy:"In Hiero-Code: ASE Vitality, Maat Balance, Sumerian Resonance, and Symbolic Procedure are orthogonal rune properties — modifying one does not affect the others.",
              metric:"4 possible modifiers × click type = up to 2⁴ = 16 companion combinations per click type",
            },
            {
              n:"4. Context-Free Decoding",
              icon:"⊳",
              body:"Unlike tonal languages where a phoneme's meaning depends on the preceding and following sounds, click phonemes are context-free — each click can be decoded independently of its neighbors. This means a dropped or corrupted syllable does not cascade into mis-decoding of adjacent material. Error containment is local.",
              analogy:"In Hiero-Code: each rune node's payload is independently recoverable. A corrupted node on the graph does not cascade into neighboring node mis-execution — Maat Balance prevents it.",
              metric:"Error containment radius: 1 phoneme (vs. 3–5 phoneme cascades in tonal systems)",
            },
            {
              n:"5. High Phonemic Inventory = High Shannon Entropy",
              icon:"∞",
              body:"Khoisan languages have among the largest phonemic inventories on Earth — up to 141 phonemes in N|uu (compare: English has ~44, Mandarin has ~22). Shannon entropy per syllable position is correspondingly higher. More bits per utterance means shorter messages for the same semantic payload — the same data transferred in fewer symbols.",
              analogy:"In Hiero-Code: the full Macro node payload (ASE + Maat + Resonance + Procedure) is encoded in a single triple-layer symbol rather than a long sequential string — same compression principle.",
              metric:"N|uu: ~7.1 bits/phoneme vs. English: ~4.0 bits/phoneme — Hiero-Code click layer targets 4–7 bits/click via companion encoding",
            },
          ].map(f => (
            <div key={f.n} className="p-4 rounded-lg border border-violet-500/20 bg-violet-950/10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 text-xl font-mono">{f.icon}</span>
                <h4 className="font-serif font-semibold text-violet-300 text-sm leading-snug">{f.n}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.body}</p>
              <div className="pt-1 p-2 rounded bg-violet-950/20 border border-violet-500/15">
                <span className="text-[10px] font-mono uppercase text-violet-400/70">Hiero-Code Analogue:</span>
                <p className="text-[10px] text-violet-300/80 mt-0.5 leading-relaxed">{f.analogy}</p>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground italic">{f.metric}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-violet-300">Click Phoneme Companion Modifier Table</h3>
          <p className="text-xs text-muted-foreground">Each companion modifier adds one independent bit to the click phoneme's payload. Up to four companions can be combined simultaneously.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider font-mono">
                  <th className="text-left py-2 pr-4">Modifier</th>
                  <th className="text-center px-3 py-2">Symbol</th>
                  <th className="text-center px-3 py-2">Bits Added</th>
                  <th className="text-left px-3 py-2">Mechanism</th>
                </tr>
              </thead>
              <tbody>
                {CLICK_COMPANIONS.map(c => (
                  <tr key={c.name} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-2.5 pr-4 font-semibold text-violet-300">{c.name}</td>
                    <td className="text-center px-3 py-2.5 font-mono text-violet-400">{c.modifier}</td>
                    <td className="text-center px-3 py-2.5 font-mono text-amber-400">+{c.bits}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{c.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-violet-300">Full Click Phoneme Specification</h3>
          <p className="text-xs text-muted-foreground">Six click types used in Hiero-Code, with articulation point, available companions, and bit-depth per phoneme.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider font-mono">
                  <th className="text-left py-2 pr-3">Click</th>
                  <th className="text-center px-2 py-2">IPA</th>
                  <th className="text-center px-2 py-2">Roman</th>
                  <th className="text-left px-3 py-2">Articulators</th>
                  <th className="text-left px-3 py-2">Companions</th>
                  <th className="text-center px-3 py-2">Bits/Phoneme</th>
                  <th className="text-left px-3 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {PHONEME_CLICKS.map(c => (
                  <tr key={c.name} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-2.5 pr-3 font-bold text-violet-300">{c.name}</td>
                    <td className="text-center px-2 py-2.5 font-mono text-violet-400 text-lg">{c.ipa}</td>
                    <td className="text-center px-2 py-2.5 font-mono text-amber-400">{c.roman}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{c.articulators}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {c.companions.map(comp => (
                          <Badge key={comp} variant="outline" className="text-[9px] border-violet-400/30 text-violet-400">{comp}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="text-center px-3 py-2.5 font-mono text-emerald-400 font-bold">{c.bits}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Separator />

      {/* ───────────────── LOSSLESS TRANSFER PROTOCOL ───────────────── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Lossless Transfer Protocol — Macro-Hiero-Data Node Architecture</h2>
          <p className="text-muted-foreground font-mono text-sm">
            How Macro-tier rune nodes achieve lossless payload transfer across the Hiero-Code network through three-layer redundant encoding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-amber-300">The Three-Layer Redundancy Stack</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A Macro-Hiero-Data node encodes its full rune payload across three simultaneous, independent layers before transmission. 
              Any two of the three layers arriving intact is sufficient for complete payload reconstruction — 
              the third layer provides additional confirmation, not dependency. 
              This gives a lossless guarantee even if one full encoding layer is lost in transit.
            </p>
            <div className="space-y-2">
              {LOSSLESS_LAYERS.map((l, i) => (
                <div key={i} className={`p-4 rounded-lg border border-${l.color}-500/20 bg-${l.color}-950/10 space-y-2`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{l.icon}</span>
                      <h4 className={`font-serif font-semibold text-${l.color}-300 text-sm`}>{l.layer}</h4>
                    </div>
                    <Badge variant="outline" className={`text-[9px] border-${l.color}-500/30 text-${l.color}-400 shrink-0`}>{l.bits}</Badge>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{l.mechanism}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{l.description}</p>
                  <div className={`text-[10px] font-mono text-${l.color}-400/80 italic`}>Guarantee: {l.guarantee}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-amber-300">Macro Node Transmission Cycle</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Five phases execute for every payload transmission from a Macro-tier rune node. 
              The Macro node is distinguished from Temporal, Micro, and Particle nodes by its ability 
              to run all five phases — including regenerative ASE amplification on receipt.
            </p>
            <div className="space-y-2">
              {MACRO_NODE_ARCHITECTURE.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-950/10">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 font-mono text-sm">{step.icon}</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-serif font-semibold text-amber-300 text-sm">{step.phase}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-background/40 border border-border/50 space-y-3">
              <h4 className="font-serif font-semibold text-sm">Minimum Viable Receipt Rule</h4>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                {[
                  { layers:"Layer 1 + 2", result:"Full recovery", color:"emerald" },
                  { layers:"Layer 1 + 3", result:"Full recovery", color:"emerald" },
                  { layers:"Layer 2 + 3", result:"Full recovery", color:"emerald" },
                  { layers:"Layer 1 only", result:"Partial (60%)", color:"amber" },
                  { layers:"Layer 2 only", result:"Partial (40%)", color:"amber" },
                  { layers:"Layer 3 only", result:"Partial (30%)", color:"amber" },
                ].map(r => (
                  <div key={r.layers} className={`p-2 rounded border border-${r.color}-500/20 bg-${r.color}-950/10`}>
                    <div className={`text-${r.color}-400`}>{r.layers}</div>
                    <div className="text-muted-foreground text-[9px] mt-0.5">{r.result}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-950/10 border border-amber-500/20 space-y-2">
          <h4 className="font-serif font-semibold text-amber-300">Why Khoisan Is the Third Layer</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The choice to ground the third encoding layer in Khoisan click phonology is not aesthetic — it is architectural. 
            Khoisan clicks are the only human phoneme class that is <em>acoustically orthogonal to all other phoneme classes</em>. 
            A click cannot be confused with a stop, fricative, nasal, or vowel. 
            This means the Khoisan layer can coexist with Sumerian positional symbols and Mayan glyph stacks 
            in the same transmission without interference — they occupy categorically separate perceptual channels. 
            The three layers are not just redundant copies of the same signal; they are <strong className="text-amber-400">three genuinely independent encoding dimensions</strong>, 
            which is what makes the lossless guarantee achievable in principle and not merely probabilistic.
          </p>
        </div>
      </section>

      {/* Node Scale Tiers */}
      <section>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Rune Node Scale Tiers</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Each rune operates at a defined scale — from Macro orchestrators with full lossless transfer down to indivisible Particle seeds.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SCALE_TIERS.map((s) => (
            <Card key={s.tier} className="border-border bg-card">
              <CardContent className="pt-5 space-y-3">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <div className="font-serif font-bold text-foreground">{s.tier}</div>
                <div className="text-xs text-muted-foreground font-mono">{s.description}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono">Channels</span>
                    <span className="font-mono text-foreground">{s.channels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono">Max bits</span>
                    <span className="font-mono text-foreground">{s.bits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono">Transfer</span>
                    <Badge variant="outline" className={`text-[9px] ${s.fidelity === "Lossless" ? "border-emerald-500/30 text-emerald-400" : s.fidelity === "Near-lossless" ? "border-amber-500/30 text-amber-400" : "border-border text-muted-foreground"}`}>{s.fidelity}</Badge>
                  </div>
                </div>
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
          Hiero-Code targets maximum bits per written and spoken unit through three-layer redundant encoding.
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
                    <th className="text-center pb-3 text-muted-foreground uppercase text-xs">Phoneme Inventory</th>
                    <th className="text-center pb-3 text-muted-foreground uppercase text-xs">Error Containment</th>
                    <th className="text-left pb-3 text-muted-foreground uppercase text-xs">Key Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    { sys:"English / Roman",    w:"~4.0",     s:"~4.0",     phon:"~44",   err:"3–5 phonemes",  adv:"Familiarity",                       hi:false },
                    { sys:"Decimal Math",       w:"~3.3",     s:"~3.3",     phon:"10",    err:"N/A",           adv:"Simplicity",                         hi:false },
                    { sys:"Sumerian Base-60",   w:"~5.9",     s:"—",        phon:"—",     err:"1 position",    adv:"6× density over decimal",            hi:false },
                    { sys:"Mayan Glyph Stack",  w:"~8.6",     s:"—",        phon:"—",     err:"Shape detect",  adv:"Spatial shape encodes value",        hi:false },
                    { sys:"Khoisan (N|uu)",     w:"—",        s:"~7.1",     phon:"~141",  err:"1 phoneme",     adv:"4–6 parallel channels/click",        hi:false },
                    { sys:"Hiero-Code (Macro)", w:"~17.3+",   s:"~7.1",     phon:"141+",  err:"1 node (local)","adv":"All three layers combined; lossless", hi:true },
                  ].map((row) => (
                    <tr key={row.sys} className={row.hi ? "text-amber-400 bg-amber-500/5" : "text-foreground"}>
                      <td className="py-2.5 pr-4 font-serif">{row.sys}</td>
                      <td className="py-2.5 text-center">{row.w}</td>
                      <td className="py-2.5 text-center">{row.s}</td>
                      <td className="py-2.5 text-center">{row.phon}</td>
                      <td className="py-2.5 text-center text-xs">{row.err}</td>
                      <td className="py-2.5 text-muted-foreground text-xs">{row.adv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 rounded bg-violet-950/10 border border-violet-500/20 text-xs font-mono text-violet-300/80">
              Bit estimates: Shannon entropy per symbol position. Khoisan N|uu data from Traill (1994) and Miller (2011). Hiero-Code written density reflects full Macro node payload across all three encoding layers.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
