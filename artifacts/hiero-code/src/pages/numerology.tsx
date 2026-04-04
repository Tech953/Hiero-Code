import { useGetEgyptianNumerology, useGetSumerianNumerology, useConvertNumber } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowRight, ArrowRightLeft, Calculator, Infinity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Numerology() {
  const { data: egyptian, isLoading: loadingEg } = useGetEgyptianNumerology();
  const { data: sumerian, isLoading: loadingSu } = useGetSumerianNumerology();
  const convertNumber = useConvertNumber();

  const [convVal, setConvVal] = useState("10");
  const [fromSys, setFromSys] = useState("decimal" as any);
  const [toSys, setToSys] = useState("egyptian" as any);
  const [convResult, setConvResult] = useState<any>(null);

  const handleConvert = () => {
    const val = parseFloat(convVal);
    if (isNaN(val)) return;

    convertNumber.mutate({ 
      data: { value: val, fromSystem: fromSys, toSystem: toSys }
    }, {
      onSuccess: (data) => setConvResult(data)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <Infinity className="w-8 h-8 text-primary" /> Numerology References
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Ancient base systems driving the symbolic compute engine.</p>
      </div>

      <Card className="border-primary/20 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2"><Calculator className="w-4 h-4" /> Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Input 
              type="number" 
              value={convVal} 
              onChange={(e) => setConvVal(e.target.value)} 
              className="font-mono bg-background"
            />
            <Select value={fromSys} onValueChange={setFromSys}>
              <SelectTrigger className="w-[180px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="egyptian">Egyptian</SelectItem>
                <SelectItem value="sumerian">Sumerian</SelectItem>
                <SelectItem value="mayan">Mayan</SelectItem>
              </SelectContent>
            </Select>
            <ArrowRightLeft className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <Select value={toSys} onValueChange={setToSys}>
              <SelectTrigger className="w-[180px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="egyptian">Egyptian</SelectItem>
                <SelectItem value="sumerian">Sumerian</SelectItem>
                <SelectItem value="mayan">Mayan</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleConvert} disabled={convertNumber.isPending} className="w-full md:w-auto">
              Convert
            </Button>
          </div>
          
          {convResult && (
            <div className="mt-6 p-4 rounded bg-background border border-border flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-muted-foreground">Result</span>
                <span className="text-2xl text-primary drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]">
                  {convResult.result}
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground border-t border-border/50 pt-2">
                Explanation: {convResult.explanation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="egyptian" className="w-full">
        <TabsList className="bg-muted/50 border border-border flex-wrap h-auto gap-1">
          <TabsTrigger value="egyptian" className="font-mono uppercase tracking-wider text-xs">Egyptian (Base-10)</TabsTrigger>
          <TabsTrigger value="sumerian" className="font-mono uppercase tracking-wider text-xs">Sumerian (Base-60)</TabsTrigger>
          <TabsTrigger value="mayan" className="font-mono uppercase tracking-wider text-xs">Mayan (Base-20)</TabsTrigger>
          <TabsTrigger value="khoisan" className="font-mono uppercase tracking-wider text-xs">Khoisan (Click)</TabsTrigger>
          <TabsTrigger value="alignment" className="font-mono uppercase tracking-wider text-xs">Language Alignment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="egyptian" className="mt-6">
          {loadingEg ? <Skeleton className="h-96 w-full" /> : egyptian && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-amber-500">{egyptian.name}</CardTitle>
                <CardDescription className="font-mono">{egyptian.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {egyptian.symbols.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center p-4 rounded bg-background border border-border/50 hover:border-amber-500/50 transition-colors text-center">
                      <span className="text-4xl text-amber-500 mb-2">{sym.symbol}</span>
                      <span className="font-mono text-sm text-foreground">{sym.value.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{sym.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sumerian" className="mt-6">
          {loadingSu ? <Skeleton className="h-96 w-full" /> : sumerian && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-blue-500">{sumerian.name}</CardTitle>
                <CardDescription className="font-mono">{sumerian.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sumerian.symbols.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center p-4 rounded bg-background border border-border/50 hover:border-blue-500/50 transition-colors text-center">
                      <span className="text-4xl text-blue-500 mb-2">{sym.symbol}</span>
                      <span className="font-mono text-sm text-foreground">{sym.value}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{sym.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mayan" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-emerald-500">Mayan Vigesimal System</CardTitle>
              <CardDescription className="font-mono">Base-20 positional notation written vertically in layers. Quantity is visible as shape — you see the value before you read it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { symbol: "𝋡", value: 0, name: "Shell (Zero)", desc: "The placeholder, the void" },
                  { symbol: "•", value: 1, name: "Dot (One)", desc: "Single dot — one unit" },
                  { symbol: "••", value: 2, name: "Two Dots", desc: "Pair" },
                  { symbol: "•••", value: 3, name: "Three Dots", desc: "Triad" },
                  { symbol: "••••", value: 4, name: "Four Dots", desc: "Four — maximum dots in a row" },
                  { symbol: "—", value: 5, name: "Bar (Five)", desc: "Horizontal bar — the hand" },
                  { symbol: "•\n—", value: 6, name: "One + Bar", desc: "Six: dot over bar" },
                  { symbol: "••\n—", value: 7, name: "Two + Bar", desc: "Seven" },
                  { symbol: "••••\n—", value: 9, name: "Nine", desc: "Bolontiku — nine underworld lords" },
                  { symbol: "—\n—", value: 10, name: "Two Bars", desc: "Ten" },
                  { symbol: "••••\n——", value: 14, name: "Fourteen", desc: "Four dots over two bars" },
                  { symbol: "••••\n———", value: 19, name: "Nineteen", desc: "Maximum single-position value" },
                ].map((m, i) => (
                  <div key={i} className="flex flex-col items-center p-4 rounded bg-background border border-border/50 hover:border-emerald-500/50 transition-colors text-center">
                    <span className="text-4xl text-emerald-500 mb-2 whitespace-pre leading-tight">{m.symbol}</span>
                    <span className="font-mono text-sm text-foreground">{m.value}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{m.name}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                {[
                  { label: "Position 0 (Units)", value: "× 1 = 0–19", color: "text-emerald-400" },
                  { label: "Position 1 (Twenties)", value: "× 20 = 20–380", color: "text-emerald-400" },
                  { label: "Position 2 (Hundreds)", value: "× 400 = 400–7600", color: "text-emerald-400" },
                  { label: "Position 3 (Thousands)", value: "× 8000 = 8000+", color: "text-emerald-400" },
                  { label: "Sacred 20", value: "One full body count (fingers + toes)", color: "text-amber-400" },
                  { label: "Calendrical 18×20", value: "360-day Haab solar year", color: "text-amber-400" },
                ].map((row) => (
                  <div key={row.label} className="p-3 rounded bg-background border border-border/50">
                    <div className="text-xs font-mono text-muted-foreground">{row.label}</div>
                    <div className={`font-mono text-sm mt-1 ${row.color}`}>{row.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="khoisan" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-violet-400">Khoisan Click Phoneme System</CardTitle>
              <CardDescription className="font-mono">
                Multi-channel parallel phonemic encoding. Each click carries 4–6 simultaneous data channels — tongue position, airflow direction, dental/alveolar/lateral placement, accompaniment tone, nasalization. One sound = one parallel data packet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    ipa: "|", roman: "C", name: "Dental Click",
                    description: "Tip of tongue pressed against front teeth and quickly withdrawn",
                    channels: ["Tongue: tip-dental", "Airflow: ingress", "Placement: front-teeth", "Release: forward"],
                    color: "text-violet-400", border: "border-violet-400/30",
                  },
                  {
                    ipa: "‡", roman: "Tc", name: "Alveolar-Palatal Click",
                    description: "Tip of tongue against alveolar ridge and adjacent palate, released sharply downwards",
                    channels: ["Tongue: tip-alveolar", "Airflow: ingress", "Placement: ridge+palate", "Release: sharp-downward"],
                    color: "text-indigo-400", border: "border-indigo-400/30",
                  },
                  {
                    ipa: "!", roman: "Q", name: "Palatal Click",
                    description: "Tongue pressed against upper palate and released sharply downwards — like a cork pulled from a bottle",
                    channels: ["Tongue: full-palate", "Airflow: pressure-build", "Placement: upper-palate", "Release: pop-downward"],
                    color: "text-fuchsia-400", border: "border-fuchsia-400/30",
                  },
                  {
                    ipa: "||", roman: "X", name: "Lateral Click",
                    description: "Click sound produced at the side of the tongue when held pressed against the palate",
                    channels: ["Tongue: lateral-edge", "Airflow: side-channel", "Placement: palate-side", "Release: lateral-slide"],
                    color: "text-pink-400", border: "border-pink-400/30",
                  },
                ].map((c) => (
                  <div key={c.roman} className={`p-5 rounded-lg border ${c.border} bg-background`}>
                    <div className="flex items-start gap-4">
                      <div className={`text-5xl font-mono ${c.color} w-14 text-center`}>{c.roman}</div>
                      <div className="flex-1">
                        <div className={`font-serif font-bold text-lg ${c.color}`}>{c.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">IPA: {c.ipa}</div>
                        <p className="text-sm text-foreground/80 mt-2">{c.description}</p>
                        <div className="grid grid-cols-2 gap-1.5 mt-3">
                          {c.channels.map((ch) => (
                            <div key={ch} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                              <div className={`w-1.5 h-1.5 rounded-full ${c.color.replace("text-", "bg-")}`} />
                              {ch}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded bg-amber-500/5 border border-amber-500/20">
                <div className="font-mono text-xs text-amber-400 uppercase mb-2">Hiero-Code Integration Principle</div>
                <p className="text-sm text-foreground/80">
                  A single Khoisan click macro-node can carry up to 6 simultaneous channels of data, compared to modern speech which is purely serial. 
                  Combined with Sumerian base-60 encoding (60 discrete states per position), one click phoneme encodes 
                  up to 60⁵ ≈ 7.7 billion combinatorial states — orders of magnitude above any alphabetic system.
                </p>
              </div>

              <div>
                <div className="font-mono text-xs uppercase text-muted-foreground mb-3">Alphabetical Sort Order (Index Convention)</div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { order: 1, ipa: "!", roman: "Q" },
                    { order: 2, ipa: "||", roman: "X" },
                    { order: 3, ipa: "|", roman: "C" },
                    { order: 4, ipa: "‡", roman: "Tc" },
                  ].map((row) => (
                    <div key={row.roman} className="p-3 text-center rounded border border-border/50 bg-background">
                      <div className="text-xl font-mono text-violet-400">{row.roman}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">IPA: {row.ipa}</div>
                      <div className="text-[10px] text-muted-foreground">Order {row.order}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-amber-400">Language Alignment — Three Engineering Precedents</CardTitle>
              <CardDescription className="font-mono">
                Sumer, Maya, and Khoisan each independently solved a different information transfer problem. Hiero-Code recombines all three.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Sumerian Base-60", icon: "𒐚", color: "text-amber-400", border: "border-amber-400/20",
                    optimized: "Administrative scalability", mechanism: "Positional base-60 compression",
                    density: "6× decimal density per written slot",
                    sacred: "1 · 6 · 12 · 60",
                    why: "60 is divisible by 2, 3, 4, 5, 6 — perfect for fractions, time, angles, cycles, harmonics without remainder",
                    hiercode: "Positional frame: each rune position holds 60 discrete states",
                  },
                  {
                    name: "Mayan Vigesimal", icon: "𝋡", color: "text-emerald-400", border: "border-emerald-400/20",
                    optimized: "Symbolic + temporal precision", mechanism: "Base-20 layered glyph stacks",
                    density: "Non-linear, spatial — value readable as shape",
                    sacred: "1 · 5 · 20 · 400",
                    why: "Writing is vertical and layered — you see the value before you read it. Position = magnitude order.",
                    hiercode: "Glyph stacks: each rune carries vertical layers of semantic meaning",
                  },
                  {
                    name: "Khoisan Click", icon: "!", color: "text-violet-400", border: "border-violet-400/20",
                    optimized: "Acoustic bandwidth", mechanism: "Multi-channel phonemic encoding",
                    density: "4–6 simultaneous data channels per phoneme",
                    sacred: "| · ‡ · ! · ||",
                    why: "Each click carries tongue position, airflow, placement, tone, nasalization simultaneously — not serial like speech.",
                    hiercode: "Phoneme clicks: spoken rune nodes transmit parallel multi-track data",
                  },
                ].map((sys) => (
                  <div key={sys.name} className={`p-5 rounded-lg border ${sys.border} bg-background space-y-3`}>
                    <div className={`text-4xl ${sys.color}`}>{sys.icon}</div>
                    <div className={`font-serif font-bold text-base ${sys.color}`}>{sys.name}</div>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-[10px] font-mono uppercase text-muted-foreground">Optimized for: </span>{sys.optimized}</div>
                      <div><span className="text-[10px] font-mono uppercase text-muted-foreground">Mechanism: </span>{sys.mechanism}</div>
                      <div><span className="text-[10px] font-mono uppercase text-muted-foreground">Density: </span>{sys.density}</div>
                      <div><span className="text-[10px] font-mono uppercase text-muted-foreground">Sacred Numbers: </span>
                        <span className="font-mono text-amber-400">{sys.sacred}</span>
                      </div>
                      <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground italic">{sys.why}</div>
                      <div className={`text-xs font-mono ${sys.color} pt-1`}>→ {sys.hiercode}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="font-serif font-bold text-amber-400 text-lg">The Combined Architecture</div>
                <p className="text-sm text-foreground/80">
                  Hiero-Code is not a language for conversation. It is a language for recording systems, encoding procedures, teaching craft, preserving technique, and transmitting complex instructions with minimal symbols.
                </p>
                <div className="grid grid-cols-3 gap-3 font-mono text-sm">
                  <div className="text-center p-3 rounded bg-background border border-border/50">
                    <div className="text-amber-400 font-bold">Position</div>
                    <div className="text-xs text-muted-foreground mt-1">Magnitude / Order</div>
                    <div className="text-[10px] text-muted-foreground">from Sumer</div>
                  </div>
                  <div className="text-center p-3 rounded bg-background border border-border/50">
                    <div className="text-emerald-400 font-bold">Stack</div>
                    <div className="text-xs text-muted-foreground mt-1">Semantic Bundle</div>
                    <div className="text-[10px] text-muted-foreground">from Maya</div>
                  </div>
                  <div className="text-center p-3 rounded bg-background border border-border/50">
                    <div className="text-violet-400 font-bold">Click</div>
                    <div className="text-xs text-muted-foreground mt-1">Multi-channel Phoneme</div>
                    <div className="text-[10px] text-muted-foreground">from Khoisan</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
