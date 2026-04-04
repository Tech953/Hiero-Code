import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Valence = "Positive" | "Neutral" | "Negative";
type Arousal = "Low" | "Medium" | "High";

interface EmojiNode {
  symbol: string;
  eyes: string;
  mouth: string;
  gesture: string;
  valence: Valence;
  arousal: Arousal;
  notes: string;
}

const EYE_VARIANTS = [
  { pair: [">", "<"], label: ">.<", valence: "Negative" as Valence, arousal: "High" as Arousal },
  { pair: ["^", "^"], label: "^.^", valence: "Positive" as Valence, arousal: "Low" as Arousal },
  { pair: ["0", "0"], label: "0.0", valence: "Neutral" as Valence, arousal: "Medium" as Arousal },
  { pair: ["@", "@"], label: "@.@", valence: "Neutral" as Valence, arousal: "High" as Arousal },
  { pair: ["*", "*"], label: "*_*", valence: "Positive" as Valence, arousal: "High" as Arousal },
  { pair: ["$", "$"], label: "$.$", valence: "Positive" as Valence, arousal: "Medium" as Arousal },
  { pair: ["-", "-"], label: "-.-", valence: "Negative" as Valence, arousal: "Low" as Arousal },
  { pair: ["~", "~"], label: "~.~", valence: "Neutral" as Valence, arousal: "Low" as Arousal },
  { pair: ["U", "U"], label: "U.U", valence: "Negative" as Valence, arousal: "Low" as Arousal },
  { pair: ["X", "X"], label: "X_X", valence: "Negative" as Valence, arousal: "Medium" as Arousal },
  { pair: ["3", "3"], label: "3_3", valence: "Neutral" as Valence, arousal: "Low" as Arousal },
  { pair: ["+", "+"], label: "+.+", valence: "Positive" as Valence, arousal: "Medium" as Arousal },
];

const MOUTH_VARIANTS = [
  { m: ".", label: "dot", valence: "Neutral" as Valence },
  { m: "_", label: "flat", valence: "Neutral" as Valence },
  { m: "3", label: "open", valence: "Positive" as Valence },
  { m: "o", label: "surprised", valence: "Neutral" as Valence },
  { m: "v", label: "sad", valence: "Negative" as Valence },
  { m: "w", label: "wavy", valence: "Positive" as Valence },
  { m: "P", label: "tongue", valence: "Positive" as Valence },
  { m: "~", label: "wavy-alt", valence: "Neutral" as Valence },
];

const GESTURES = [
  { g: "", label: "None" },
  { g: "\\(-.-)/", label: "Shrug/Surrender" },
  { g: "\\(^.^)/", label: "Waving/Joy" },
  { g: "(T_T)", label: "Crying" },
  { g: "\\(O_O)/", label: "Shock" },
  { g: "\\(*_*)/", label: "Awe" },
  { g: "\\(>.<)/", label: "Frustration gesture" },
  { g: ";;", label: "Sweat drops" },
];

const NOTES_MAP: Record<string, string> = {
  ">.<": "Frustration / embarrassment",
  "^.^": "Happiness / satisfaction",
  "0.0": "Shock / blank stare",
  "@.@": "Overstimulation / dizzy",
  "*_*": "Awe / love-struck",
  "$.$": "Greed / motivation",
  "-.-": "Boredom / deadpan",
  "~.~": "Sleepy / indifference",
  "U.U": "Defeat / resignation",
  "X_X": "Done / defeated",
  "3_3": "Dreamy / indifferent",
  "+.+": "Focus / interest",
};

function buildEmoji(eye: typeof EYE_VARIANTS[0], mouth: typeof MOUTH_VARIANTS[0], gesture: typeof GESTURES[0]): EmojiNode {
  const [L, R] = eye.pair;
  const sep = mouth.m === "." ? "." : mouth.m === "_" ? "_" : mouth.m;
  const symbol = gesture.g
    ? `${gesture.g.includes("(") ? gesture.g.split("(")[0] : ""}(${L}${sep}${R})${gesture.g.includes("/") ? "/" : ""}`
    : `${L}${sep}${R}`;
  const fullSymbol = gesture.g ? `${L}${sep}${R} ${gesture.g}` : `${L}${sep}${R}`;

  const valMap: Record<Valence, number> = { Positive: 1, Neutral: 0, Negative: -1 };
  const eyeV = valMap[eye.valence];
  const mouthV = valMap[mouth.valence];
  const combined = eyeV + mouthV;
  const valence: Valence = combined > 0 ? "Positive" : combined < 0 ? "Negative" : "Neutral";

  const baseNote = NOTES_MAP[eye.label] || `${eye.label} expression`;
  const gestureNote = gesture.label !== "None" ? ` + ${gesture.label}` : "";

  return {
    symbol: fullSymbol,
    eyes: `${eye.pair[0]} ${eye.pair[1]}`,
    mouth: mouth.m,
    gesture: gesture.label,
    valence,
    arousal: eye.arousal,
    notes: baseNote + gestureNote,
  };
}

const ALL_EMOJIS: EmojiNode[] = [];
for (const eye of EYE_VARIANTS) {
  for (const mouth of MOUTH_VARIANTS) {
    for (const gesture of GESTURES) {
      ALL_EMOJIS.push(buildEmoji(eye, mouth, gesture));
    }
  }
}

const VALENCE_COLOR: Record<Valence, string> = {
  Positive: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  Neutral: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Negative: "text-red-400 border-red-400/30 bg-red-400/5",
};

const AROUSAL_DOT: Record<Arousal, string> = {
  Low: "bg-blue-400",
  Medium: "bg-amber-400",
  High: "bg-red-400",
};

const KHOISAN_CLICKS = [
  { symbol: "|", roman: "C", ipa: "|", name: "Dental Click", description: "Tip of tongue against front teeth, quickly withdrawn", channels: ["Tongue position", "Ingress airflow", "Dental placement"] },
  { symbol: "‡", roman: "Tc", ipa: "‡", name: "Alveolar-Palatal Click", description: "Tip of tongue against alveolar ridge and adjacent palate, released sharply downwards", channels: ["Alveolar contact", "Palatal friction", "Sharp release"] },
  { symbol: "!", roman: "Q", ipa: "!", name: "Palatal Click", description: "Tongue pressed against upper palate and released sharply — like a cork pulled from a bottle", channels: ["Full palate contact", "Pressure build", "Pop release"] },
  { symbol: "||", roman: "X", ipa: "||", name: "Lateral Click", description: "Click at the side of tongue held pressed against palate", channels: ["Lateral tongue", "Side airflow", "Palate slide"] },
];

const EMOTION_VECTORS = [
  { name: "High Arousal Positive", symbol: "*_*", valence: 1, arousal: 1, gestureCode: 0, notes: "Awe / love-struck — strong engagement modeling" },
  { name: "Low Arousal Positive", symbol: "^.^", valence: 1, arousal: -1, gestureCode: 0, notes: "Contentment / pleasure — reward signal" },
  { name: "High Arousal Negative", symbol: ">.<", valence: -1, arousal: 1, gestureCode: 0, notes: "Frustration — mild distress node" },
  { name: "Low Arousal Negative", symbol: "U.U", valence: -1, arousal: -1, gestureCode: 0, notes: "Defeat / resignation — passive state" },
  { name: "Neutral Overstimulation", symbol: "@.@", valence: 0, arousal: 1, gestureCode: 2, notes: "Sensory overload — trigger scanning node" },
  { name: "Neutral Dormant", symbol: "3_3", valence: 0, arousal: -1, gestureCode: 0, notes: "Fatigue / passive — low-energy node" },
  { name: "Motivated", symbol: "$.$", valence: 1, arousal: 0, gestureCode: 1, notes: "Incentive / motivation — goal-seeking node" },
  { name: "Surrender Gesture", symbol: "\\(-.-)/", valence: -1, arousal: 0, gestureCode: 3, notes: "Motor-expression mapping — gestural node" },
];

export default function Emotions() {
  const [search, setSearch] = useState("");
  const [valenceFilter, setValenceFilter] = useState<"all" | Valence>("all");
  const [arousalFilter, setArousalFilter] = useState<"all" | Arousal>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 48;

  const filtered = ALL_EMOJIS.filter((e) => {
    if (search && !e.symbol.toLowerCase().includes(search.toLowerCase()) && !e.notes.toLowerCase().includes(search.toLowerCase())) return false;
    if (valenceFilter !== "all" && e.valence !== valenceFilter) return false;
    if (arousalFilter !== "all" && e.arousal !== arousalFilter) return false;
    return true;
  });

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">
          ^.^ Pyri Emotion Nodes
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          QUERTY-derived micro-expression library — {ALL_EMOJIS.length} emoji macro-nodes for ML emotional state embedding. Valence × Arousal × Gesture = Emotion Vector.
        </p>
      </div>

      {/* Khoisan Multi-Channel Phonemes */}
      <section>
        <h2 className="text-xl font-serif font-bold text-foreground mb-1">Khoisan Click Phonemes</h2>
        <p className="text-muted-foreground font-mono text-xs mb-4">
          Each click carries 4–6 parallel channels of information — tongue position, airflow, placement, accompaniment, nasalization. One sound = 4–6 data streams.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {KHOISAN_CLICKS.map((c) => (
            <Card key={c.name} className="border-violet-400/20 bg-violet-400/5">
              <CardHeader className="pb-2">
                <div className="text-4xl text-violet-300 font-mono mb-1">{c.roman}</div>
                <CardTitle className="font-serif text-violet-400 text-base">{c.name}</CardTitle>
                <p className="text-[10px] font-mono text-muted-foreground">IPA: {c.ipa}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-foreground/80">{c.description}</p>
                <div className="space-y-1">
                  {c.channels.map((ch) => (
                    <div key={ch} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
                      {ch}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Emotion Vectors */}
      <section>
        <h2 className="text-xl font-serif font-bold text-foreground mb-1">Core Emotion Vectors</h2>
        <p className="text-muted-foreground font-mono text-xs mb-4">
          Canonical emotion macro-nodes mapped to [valence, arousal, gesture_code] for ML embedding in Pyri networks.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EMOTION_VECTORS.map((v) => (
            <Card key={v.name} className="border-border bg-card">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-mono text-amber-400 mb-2">{v.symbol}</div>
                <div className="font-serif text-sm text-foreground font-bold">{v.name}</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px] font-mono">V:{v.valence > 0 ? "+" : ""}{v.valence}</Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">A:{v.arousal > 0 ? "+" : ""}{v.arousal}</Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">G:{v.gestureCode}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 font-mono">{v.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Full 672-Symbol Matrix */}
      <section>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">Full QUERTY Matrix</h2>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              {ALL_EMOJIS.length} combinations — {EYE_VARIANTS.length} eye variants × {MOUTH_VARIANTS.length} mouths × {GESTURES.length} gestures
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search symbol or notes…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-48 font-mono text-sm bg-background"
            />
            <Select value={valenceFilter} onValueChange={(v) => { setValenceFilter(v as any); setPage(0); }}>
              <SelectTrigger className="w-32 bg-background text-sm"><SelectValue placeholder="Valence" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Valence</SelectItem>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={arousalFilter} onValueChange={(v) => { setArousalFilter(v as any); setPage(0); }}>
              <SelectTrigger className="w-32 bg-background text-sm"><SelectValue placeholder="Arousal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Arousal</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs font-mono text-muted-foreground mb-3">
          Showing {Math.min(filtered.length, PAGE_SIZE)} of {filtered.length} results
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {paginated.map((e, i) => (
            <div
              key={i}
              className={`p-2 rounded border text-center ${VALENCE_COLOR[e.valence]} hover:opacity-80 transition-opacity cursor-default`}
            >
              <div className="font-mono text-sm leading-tight break-all text-foreground">{e.symbol}</div>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${AROUSAL_DOT[e.arousal]}`} title={`Arousal: ${e.arousal}`} />
                <span className="text-[9px] uppercase text-muted-foreground">{e.valence.slice(0, 3)}</span>
              </div>
              <div className="text-[9px] text-muted-foreground mt-0.5 truncate" title={e.notes}>{e.notes.split(" ").slice(0, 3).join(" ")}</div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded border border-border text-sm font-mono disabled:opacity-30 hover:bg-muted"
            >
              ← Prev
            </button>
            <span className="text-sm font-mono text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded border border-border text-sm font-mono disabled:opacity-30 hover:bg-muted"
            >
              Next →
            </button>
          </div>
        )}

        {/* Eye Reference */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase">Eye Variants ({EYE_VARIANTS.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {EYE_VARIANTS.map((e) => (
                  <span key={e.label} className={`font-mono text-sm px-2 py-0.5 rounded border ${VALENCE_COLOR[e.valence]}`}>{e.label}</span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase">Mouth Variants ({MOUTH_VARIANTS.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOUTH_VARIANTS.map((m) => (
                  <span key={m.m} className="font-mono text-lg px-2 py-0.5 rounded border border-amber-500/20 text-amber-400">{m.m}</span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase">Gestures ({GESTURES.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {GESTURES.filter(g => g.g).map((g) => (
                  <span key={g.g} className="font-mono text-sm px-2 py-0.5 rounded border border-violet-400/20 text-violet-300">{g.label}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
