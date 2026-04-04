import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useCreateRune, useListGlyphs, useListRunes } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, Info, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PROCEDURE_TEMPLATES = [
  {
    group: "Book of the Dead",
    templates: [
      { label: "EMERGE_FROM_TUAT (Ch. I)", code: `def EMERGE_FROM_TUAT(state, context):\n  # Chapter I: Coming Forth by Day\n  # The soul asserts its right to live again\n  output = ASE_AMPLIFY(state, context.aseVitality)\n  return {"output": output, "status": "emerged", "realm": "ayé"}` },
      { label: "OPEN_MOUTH (Ch. XXIII)", code: `def OPEN_MOUTH(state, context):\n  # Chapter XXIII: The mouth is opened\n  # Restores speech / data output capability\n  if state.get("sealed", False):\n    state["sealed"] = False\n    state["voice"] = True\n  return state` },
      { label: "RECALL_NAME (Ch. XXV)", code: `def RECALL_NAME(state, context):\n  # Chapter XXV: Whereby a person remembers their name\n  # Without a name the soul is lost\n  if "name" not in state:\n    state["name"] = context.get("rune_name", "Unknown")\n  return state` },
      { label: "ASE_AMPLIFY (Ch. XXVII)", code: `def ASE_AMPLIFY(state, context):\n  # Chapter XXVII: Words of Power (Heka)\n  # Amplifies àṣẹ vitality through performative utterance\n  vitality = context.get("aseVitality", 0.5)\n  output = state.get("value", 1) * (1 + vitality)\n  return {"value": output, "ase_applied": vitality}` },
      { label: "MAAT_BALANCE (Ch. CXXV)", code: `def MAAT_BALANCE(state, context):\n  # Chapter CXXV: Hall of Two Truths\n  # The heart is weighed against Maat's feather\n  # The 42 Laws of Maat govern the balance\n  balance = context.get("maatBalance", 0.5)\n  input_val = state.get("value", 1)\n  output = input_val * balance\n  deviation = abs(output - input_val) / max(abs(input_val), 1)\n  justified = deviation <= (1 - balance)\n  return {"value": output, "justified": justified, "maat_score": balance}` },
      { label: "PREVENT_SECOND_DEATH (Ch. XLIV)", code: `def PREVENT_SECOND_DEATH(state, context):\n  # Chapter XLIV: Whereby One Dies Not a Second Time\n  # Prevents data loss / null annihilation\n  if state.get("value") is None or state.get("value") == 0:\n    state["value"] = context.get("default", 1)\n  state["protected"] = True\n  return state` },
      { label: "TRANSFORM_FALCON (Ch. LXXVII)", code: `def TRANSFORM_FALCON(state, context):\n  # Chapter LXXVII: Assuming the Form of the Falcon of Gold\n  # Solar transformation — assumes Ra/Horus identity\n  output = state.get("value", 1)\n  output = output * context.get("sumerianResonance", 1) * 1.618\n  return {"value": output, "form": "solar_falcon", "ascended": True}` },
      { label: "ENTER_ELYSIAN (Ch. CX)", code: `def ENTER_ELYSIAN(state, context):\n  # Chapter CX: Sekhet-Hetep — Field of Peace\n  # Arrival in the justified state — steady equilibrium\n  balance = context.get("maatBalance", 0.5)\n  vitality = context.get("aseVitality", 0.5)\n  harmony = (balance + vitality) / 2\n  return {"value": state.get("value", 1), "harmony": harmony, "realm": "sekhet_hetep"}` },
    ]
  },
  {
    group: "Àṣẹ / Yorùbá",
    templates: [
      { label: "ASE_BRIDGE_REALMS", code: `def ASE_BRIDGE_REALMS(state, context):\n  # Àṣẹ bridges órun (otherworld) and ayé (living realm)\n  # The aláàse (one who possesses àṣẹ) connects the realms\n  orun_val = state.get("orun_value", 0)\n  aye_val = state.get("aye_value", state.get("value", 1))\n  bridged = (orun_val + aye_val) * context.get("aseVitality", 0.5)\n  return {"value": bridged, "realm_bridge": True}` },
      { label: "SENSIOTICS_EXPAND", code: `def SENSIOTICS_EXPAND(state, context):\n  # Sensiotics: the study of senses in formation of arts\n  # Expands data through multisensory channels\n  channels = ["sight", "sound", "touch", "taste", "smell"]\n  base = state.get("value", 1)\n  expanded = {ch: base * (i + 1) * 0.2 for i, ch in enumerate(channels)}\n  return {"channels": expanded, "total": sum(expanded.values())}` },
    ]
  },
  {
    group: "Nahua / Teotl",
    templates: [
      { label: "TEOTL_TRANSMUTE", code: `def TEOTL_TRANSMUTE(state, context):\n  # Teotl: eternal self-generating sacred energy\n  # Nature is teotl's flower and song (in xochitl in cuicatl)\n  value = state.get("value", 1)\n  # Teotl oscillates between paired polar forces\n  polar_toggle = context.get("cycle_phase", 0) % 2\n  output = value * (1 + polar_toggle * 0.618)\n  return {"value": output, "teotl_phase": polar_toggle, "flower_song": True}` },
      { label: "THREE_VITAL_FORCES", code: `def THREE_VITAL_FORCES(state, context):\n  # Three animistic Nahua forces\n  # Tonalli (head/solar), Teyolia (heart-fire), Ihiyotl (breath)\n  base = state.get("value", 1)\n  tonalli = base * context.get("aseVitality", 0.5)    # solar force\n  teyolia = base * context.get("maatBalance", 0.5)    # heart-fire\n  ihiyotl = base * (context.get("sumerianResonance", 1) / 60)  # breath\n  return {"tonalli": tonalli, "teyolia": teyolia, "ihiyotl": ihiyotl, "value": tonalli + teyolia + ihiyotl}` },
    ]
  },
  {
    group: "Daoist / Wu-Wei",
    templates: [
      { label: "WU_WEI_FLOW", code: `def WU_WEI_FLOW(state, context):\n  # Wu-wei: selfless action — acting without selfish motive\n  # The Dao flows through non-resistance\n  value = state.get("value", 1)\n  # Do not force the value; let it settle at natural balance\n  natural = value * context.get("maatBalance", 0.5)\n  return {"value": natural, "wu_wei": True, "forced": False}` },
      { label: "YIN_YANG_BALANCE", code: `def YIN_YANG_BALANCE(state, context):\n  # Yin: inward, receptive, feminine\n  # Yang: outward, active, masculine\n  value = state.get("value", 1)\n  yin = value * 0.5   # inward receptive\n  yang = value * 0.5  # outward active\n  center = (yin + yang) / 2  # center point between opposites\n  return {"yin": yin, "yang": yang, "center": center, "value": center}` },
    ]
  },
];

export default function RuneNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createRune = useCreateRune();
  const { data: glyphs } = useListGlyphs();
  const { data: runes } = useListRunes();

  const [formData, setFormData] = useState({
    name: "",
    glyph: "",
    glyphSymbol: "",
    system: "egyptian" as any,
    scale: "macro" as any,
    aseVitality: 0.5,
    maatBalance: 0.5,
    sumerianResonance: 1,
    procedureCode: "def invoke(state, context):\n  # Define ritual procedure here\n  return state",
    connections: [] as number[],
  });

  const handleSystemChange = (system: string) => {
    setFormData(prev => ({ ...prev, system }));
  };

  const handleScaleChange = (scale: string) => {
    setFormData(prev => ({ ...prev, scale }));
  };

  const handleGlyphChange = (glyphId: string) => {
    const selectedGlyph = glyphs?.find(g => g.id.toString() === glyphId);
    if (selectedGlyph) {
      setFormData(prev => ({ 
        ...prev, 
        glyph: selectedGlyph.name,
        glyphSymbol: selectedGlyph.symbol,
        system: selectedGlyph.system as any
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.glyphSymbol || !formData.procedureCode) {
      toast({ title: "Incomplete Ritual", description: "Name, symbol, and procedure are required.", variant: "destructive" });
      return;
    }

    createRune.mutate({ data: formData }, {
      onSuccess: (data) => {
        toast({ title: "Rune Inscribed", description: "The node has been added to the sanctuary." });
        setLocation(`/runes/${data.id}`);
      },
      onError: () => {
        toast({ title: "Inscription Failed", description: "Could not write to the tablets.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <Link href="/runes" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Runes
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Inscribe New Rune</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Add a new symbolic processing node to the sanctuary.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Rune Identity</CardTitle>
                <CardDescription className="font-mono text-xs">The symbolic representation and naming</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">Common Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Ankh Vitality Node" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="font-serif bg-background border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-wider">Select Glyph</Label>
                  <Select onValueChange={handleGlyphChange}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Choose a symbol from the library..." />
                    </SelectTrigger>
                    <SelectContent>
                      {glyphs?.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          <div className="flex items-center gap-4">
                            <span className="text-xl text-primary">{g.symbol}</span>
                            <span>{g.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{g.system}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider">System</Label>
                    <Select value={formData.system} onValueChange={handleSystemChange}>
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="egyptian">Egyptian</SelectItem>
                        <SelectItem value="sumerian">Sumerian</SelectItem>
                        <SelectItem value="mayan">Mayan</SelectItem>
                        <SelectItem value="khoisan">Khoisan</SelectItem>
                        <SelectItem value="celestial">Celestial / Outer Space</SelectItem>
                        <SelectItem value="temporal">Temporal / Cyclical</SelectItem>
                        <SelectItem value="elemental">Elemental / Material</SelectItem>
                        <SelectItem value="biological">Biological / Ecological</SelectItem>
                        <SelectItem value="geological">Geological / Planetary</SelectItem>
                        <SelectItem value="atmospheric">Atmospheric / Weather</SelectItem>
                        <SelectItem value="energy">Energy / Field Phenomena</SelectItem>
                        <SelectItem value="cognitive">Cognitive / Abstract</SelectItem>
                        <SelectItem value="synthetic">Synthetic / Cultural</SelectItem>
                        <SelectItem value="dimensional">Dimensional / Multi-Realm</SelectItem>
                        <SelectItem value="pyri">Pyri (Emotion Node)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider">Scale</Label>
                    <Select value={formData.scale} onValueChange={handleScaleChange}>
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="macro">Macro (System)</SelectItem>
                        <SelectItem value="micro">Micro (Local)</SelectItem>
                        <SelectItem value="particle">Particle / Indivisible</SelectItem>
                        <SelectItem value="temporal">Temporal (Time-Phase)</SelectItem>
                        <SelectItem value="s-tier">S-Tier (Biological)</SelectItem>
                        <SelectItem value="field">Field / Wave</SelectItem>
                        <SelectItem value="void">Void (Nameless)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.glyphSymbol && (
                  <div className="flex items-center justify-center p-8 border border-dashed border-border/50 rounded-lg bg-background">
                    <div className="text-6xl text-primary drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                      {formData.glyphSymbol}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  Procedure Code
                </CardTitle>
                <CardDescription className="font-mono text-xs">The symbolic logic executed when invoked. Select a template or write your own.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-wider text-orange-400/80">Load Ritual Template</Label>
                  <div className="space-y-3">
                    {PROCEDURE_TEMPLATES.map((group) => (
                      <div key={group.group}>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">{group.group}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.templates.map((t) => (
                            <button
                              key={t.label}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, procedureCode: t.code }))}
                              className={`text-[10px] px-2 py-1 rounded border transition-colors font-mono ${
                                formData.procedureCode === t.code
                                  ? "bg-orange-950/30 border-orange-500/50 text-orange-300"
                                  : "border-border/50 text-muted-foreground hover:border-orange-500/30 hover:text-orange-400"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Textarea 
                  value={formData.procedureCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, procedureCode: e.target.value }))}
                  className="min-h-[250px] font-mono text-sm bg-[#1a1b1e] border-[#2c2d31] text-[#c9d1d9]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Harmonics</CardTitle>
                <CardDescription className="font-mono text-xs">Energetic properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="font-mono text-xs uppercase tracking-wider text-amber-500">ASE Vitality</Label>
                    <span className="font-mono text-xs">{(formData.aseVitality * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[formData.aseVitality]} 
                    max={1} 
                    step={0.01} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, aseVitality: v[0] }))}
                    className="[&_[role=slider]]:border-amber-500 [&_[role=slider]]:bg-amber-500"
                  />
                  <p className="text-[10px] text-muted-foreground">Yorùbá àṣẹ — the performative power that is the vital/life force underlying all existence. Everything possesses àṣẹ. Grounds rune influence during propagation.</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between">
                    <Label className="font-mono text-xs uppercase tracking-wider text-blue-500">Maat Balance</Label>
                    <span className="font-mono text-xs">{(formData.maatBalance * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[formData.maatBalance]} 
                    max={1} 
                    step={0.01} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, maatBalance: v[0] }))}
                    className="[&_[role=slider]]:border-blue-500 [&_[role=slider]]:bg-blue-500"
                  />
                  <p className="text-[10px] text-muted-foreground">The 42 Laws of Maat — affirmations of integrity recited in the Hall of Two Truths. Governs systemic stability; the heart weighed against Maat's feather.</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <Label htmlFor="resonance" className="font-mono text-xs uppercase tracking-wider">Sumerian Resonance (Base-60)</Label>
                  <Input 
                    id="resonance" 
                    type="number"
                    min="1"
                    max="60"
                    value={formData.sumerianResonance}
                    onChange={(e) => setFormData(prev => ({ ...prev, sumerianResonance: parseFloat(e.target.value) || 1 }))}
                    className="font-mono bg-background border-border/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Connections</CardTitle>
                <CardDescription className="font-mono text-xs">Link to existing runes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {runes?.length ? runes.map(r => (
                    <label key={r.id} className="flex items-center space-x-3 space-y-0 p-2 rounded border border-border/50 bg-background hover:bg-muted transition-colors cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.connections.includes(r.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, connections: [...prev.connections, r.id] }));
                          } else {
                            setFormData(prev => ({ ...prev, connections: prev.connections.filter(id => id !== r.id) }));
                          }
                        }}
                        className="rounded border-primary/50 text-primary focus:ring-primary h-4 w-4"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg text-primary">{r.glyphSymbol}</span>
                        <span className="text-sm font-serif">{r.name}</span>
                      </div>
                    </label>
                  )) : (
                    <div className="text-xs text-muted-foreground italic flex items-center gap-2 p-2">
                      <Info className="w-3 h-3" /> No existing runes to connect to.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={createRune.isPending} className="w-full gap-2 font-mono uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground">
              {createRune.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {createRune.isPending ? "Inscribing..." : "Inscribe Rune"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
