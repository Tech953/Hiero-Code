import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useCreateRune, useListGlyphs, useListRunes } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Save, Loader2, Info, BookOpen,
  Pencil, Eraser, Trash2, Layers, Library, Pen,
  Sparkles, Copy, Blend, ChevronRight, RotateCcw, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ───────── Procedure templates ─────────
const PROCEDURE_TEMPLATES = [
  {
    group: "Book of the Dead",
    templates: [
      { label: "EMERGE_FROM_TUAT (Ch. I)", code: `def EMERGE_FROM_TUAT(state, context):\n  # Chapter I: Coming Forth by Day\n  output = ASE_AMPLIFY(state, context.aseVitality)\n  return {"output": output, "status": "emerged", "realm": "ayé"}` },
      { label: "OPEN_MOUTH (Ch. XXIII)", code: `def OPEN_MOUTH(state, context):\n  # Chapter XXIII: The mouth is opened\n  if state.get("sealed", False):\n    state["sealed"] = False\n    state["voice"] = True\n  return state` },
      { label: "RECALL_NAME (Ch. XXV)", code: `def RECALL_NAME(state, context):\n  # Chapter XXV: Whereby a person remembers their name\n  if "name" not in state:\n    state["name"] = context.get("rune_name", "Unknown")\n  return state` },
      { label: "ASE_AMPLIFY (Ch. XXVII)", code: `def ASE_AMPLIFY(state, context):\n  # Chapter XXVII: Words of Power (Heka)\n  vitality = context.get("aseVitality", 0.5)\n  output = state.get("value", 1) * (1 + vitality)\n  return {"value": output, "ase_applied": vitality}` },
      { label: "MAAT_BALANCE (Ch. CXXV)", code: `def MAAT_BALANCE(state, context):\n  # Chapter CXXV: Hall of Two Truths\n  balance = context.get("maatBalance", 0.5)\n  input_val = state.get("value", 1)\n  output = input_val * balance\n  deviation = abs(output - input_val) / max(abs(input_val), 1)\n  justified = deviation <= (1 - balance)\n  return {"value": output, "justified": justified, "maat_score": balance}` },
      { label: "PREVENT_SECOND_DEATH (Ch. XLIV)", code: `def PREVENT_SECOND_DEATH(state, context):\n  # Chapter XLIV: Whereby One Dies Not a Second Time\n  if state.get("value") is None or state.get("value") == 0:\n    state["value"] = context.get("default", 1)\n  state["protected"] = True\n  return state` },
      { label: "TRANSFORM_FALCON (Ch. LXXVII)", code: `def TRANSFORM_FALCON(state, context):\n  # Chapter LXXVII: Assuming the Form of the Falcon of Gold\n  output = state.get("value", 1) * context.get("sumerianResonance", 1) * 1.618\n  return {"value": output, "form": "solar_falcon", "ascended": True}` },
      { label: "ENTER_ELYSIAN (Ch. CX)", code: `def ENTER_ELYSIAN(state, context):\n  # Chapter CX: Sekhet-Hetep — Field of Peace\n  balance = context.get("maatBalance", 0.5)\n  vitality = context.get("aseVitality", 0.5)\n  harmony = (balance + vitality) / 2\n  return {"value": state.get("value", 1), "harmony": harmony, "realm": "sekhet_hetep"}` },
    ]
  },
  {
    group: "Àṣẹ / Yorùbá",
    templates: [
      { label: "ASE_BRIDGE_REALMS", code: `def ASE_BRIDGE_REALMS(state, context):\n  orun_val = state.get("orun_value", 0)\n  aye_val = state.get("aye_value", state.get("value", 1))\n  bridged = (orun_val + aye_val) * context.get("aseVitality", 0.5)\n  return {"value": bridged, "realm_bridge": True}` },
      { label: "SENSIOTICS_EXPAND", code: `def SENSIOTICS_EXPAND(state, context):\n  channels = ["sight", "sound", "touch", "taste", "smell"]\n  base = state.get("value", 1)\n  expanded = {ch: base * (i + 1) * 0.2 for i, ch in enumerate(channels)}\n  return {"channels": expanded, "total": sum(expanded.values())}` },
    ]
  },
  {
    group: "Nahua / Teotl",
    templates: [
      { label: "TEOTL_TRANSMUTE", code: `def TEOTL_TRANSMUTE(state, context):\n  value = state.get("value", 1)\n  polar_toggle = context.get("cycle_phase", 0) % 2\n  output = value * (1 + polar_toggle * 0.618)\n  return {"value": output, "teotl_phase": polar_toggle, "flower_song": True}` },
      { label: "THREE_VITAL_FORCES", code: `def THREE_VITAL_FORCES(state, context):\n  base = state.get("value", 1)\n  tonalli = base * context.get("aseVitality", 0.5)\n  teyolia = base * context.get("maatBalance", 0.5)\n  ihiyotl = base * (context.get("sumerianResonance", 1) / 60)\n  return {"tonalli": tonalli, "teyolia": teyolia, "ihiyotl": ihiyotl, "value": tonalli + teyolia + ihiyotl}` },
    ]
  },
  {
    group: "Daoist / Wu-Wei",
    templates: [
      { label: "WU_WEI_FLOW", code: `def WU_WEI_FLOW(state, context):\n  value = state.get("value", 1)\n  natural = value * context.get("maatBalance", 0.5)\n  return {"value": natural, "wu_wei": True, "forced": False}` },
      { label: "YIN_YANG_BALANCE", code: `def YIN_YANG_BALANCE(state, context):\n  value = state.get("value", 1)\n  yin = value * 0.5\n  yang = value * 0.5\n  center = (yin + yang) / 2\n  return {"yin": yin, "yang": yang, "center": center, "value": center}` },
    ]
  },
];

// ───────── Stroke interpretation matrix ─────────
type StrokePoint = { x: number; y: number; pressure: number };
type Stroke = StrokePoint[];

interface Interpretation {
  strokeCount: number;
  hasClosedLoops: boolean;
  symmetryScore: number;
  angularityScore: number;
  totalLength: number;
  avgPressure: number;
  enclosureRatio: number;
  suggestedAse: number;
  suggestedMaat: number;
  suggestedResonance: number;
  suggestedSystem: string;
  glyphMatch: string;
  confidence: string;
  features: { label: string; value: string; implies: string; color: string }[];
}

function interpretStrokes(strokes: Stroke[]): Interpretation {
  if (strokes.length === 0) {
    return {
      strokeCount: 0, hasClosedLoops: false, symmetryScore: 0.5, angularityScore: 0.5,
      totalLength: 0, avgPressure: 0.5, enclosureRatio: 0,
      suggestedAse: 0.5, suggestedMaat: 0.5, suggestedResonance: 1,
      suggestedSystem: "egyptian", glyphMatch: "𓂀", confidence: "No strokes yet",
      features: []
    };
  }

  const strokeCount = strokes.length;

  // Total path length
  let totalLength = 0;
  strokes.forEach(stroke => {
    for (let i = 1; i < stroke.length; i++) {
      const dx = stroke[i].x - stroke[i-1].x;
      const dy = stroke[i].y - stroke[i-1].y;
      totalLength += Math.sqrt(dx*dx + dy*dy);
    }
  });

  // Closed loops: first and last point within 20px
  const hasClosedLoops = strokes.some(stroke => {
    if (stroke.length < 5) return false;
    const dx = stroke[0].x - stroke[stroke.length-1].x;
    const dy = stroke[0].y - stroke[stroke.length-1].y;
    return Math.sqrt(dx*dx + dy*dy) < 25;
  });

  // Average pressure across all points
  let totalPressure = 0, pointCount = 0;
  strokes.forEach(stroke => {
    stroke.forEach(pt => { totalPressure += pt.pressure; pointCount++; });
  });
  const avgPressure = pointCount > 0 ? totalPressure / pointCount : 0.5;

  // Bounding box for symmetry
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  strokes.forEach(stroke => stroke.forEach(pt => {
    minX = Math.min(minX, pt.x); maxX = Math.max(maxX, pt.x);
    minY = Math.min(minY, pt.y); maxY = Math.max(maxY, pt.y);
  }));
  const midX = (minX + maxX) / 2;
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  // Symmetry: count points left vs right of midX
  let leftPts = 0, rightPts = 0;
  strokes.forEach(stroke => stroke.forEach(pt => {
    if (pt.x < midX) leftPts++; else rightPts++;
  }));
  const totalPts = leftPts + rightPts;
  const symmetryScore = totalPts > 0 ? 1 - Math.abs(leftPts - rightPts) / totalPts : 0.5;

  // Angularity: average angle change between consecutive segments
  let totalAngleChange = 0, angleCount = 0;
  strokes.forEach(stroke => {
    for (let i = 2; i < stroke.length; i++) {
      const ax = stroke[i-1].x - stroke[i-2].x;
      const ay = stroke[i-1].y - stroke[i-2].y;
      const bx = stroke[i].x - stroke[i-1].x;
      const by = stroke[i].y - stroke[i-1].y;
      const dot = ax*bx + ay*by;
      const magA = Math.sqrt(ax*ax + ay*ay);
      const magB = Math.sqrt(bx*bx + by*by);
      if (magA > 0 && magB > 0) {
        const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magB)));
        totalAngleChange += Math.acos(cosAngle);
        angleCount++;
      }
    }
  });
  const angularityScore = angleCount > 0 ? Math.min(1, (totalAngleChange / angleCount) / Math.PI) : 0.5;

  // Enclosure ratio: rough approximation from bounding box vs path length
  const bboxArea = width * height;
  const enclosureRatio = hasClosedLoops ? Math.min(1, bboxArea / (totalLength * totalLength + 1)) : 0;

  // Derive harmonic values
  const suggestedAse = Math.min(1, Math.max(0.1,
    (strokeCount / 8) * 0.5 + avgPressure * 0.3 + (1 - angularityScore) * 0.2
  ));

  const suggestedMaat = Math.min(1, Math.max(0.1,
    symmetryScore * 0.5 + (hasClosedLoops ? 0.25 : 0) + enclosureRatio * 0.25
  ));

  const resonanceFactor = Math.max(1, Math.min(60, Math.round(
    (totalLength / 200) * 12 + strokeCount * 3
  )));
  const suggestedResonance = resonanceFactor;

  // System suggestion from angularity
  let suggestedSystem = "egyptian";
  if (angularityScore > 0.7) suggestedSystem = "sumerian";
  else if (angularityScore < 0.3) suggestedSystem = "mayan";
  else if (hasClosedLoops && symmetryScore > 0.6) suggestedSystem = "celestial";
  else if (strokeCount >= 6) suggestedSystem = "cognitive";

  // Glyph suggestion from drawing characteristics
  const glyphSuggestions: Record<string, string> = {
    egyptian: "𓂀",
    sumerian: "▼▼▼",
    mayan: "◈",
    celestial: "✦",
    cognitive: "⊕",
    energy: "⚡",
  };
  const glyphMatch = glyphSuggestions[suggestedSystem] || "𓂀";

  const confidence = strokeCount < 2 ? "Low — draw more" : strokeCount < 5 ? "Medium" : "High";

  const features: Interpretation["features"] = [
    {
      label: "Stroke Count",
      value: `${strokeCount}`,
      implies: strokeCount <= 2 ? "Minimal / particle-scale" : strokeCount <= 5 ? "Moderate vitality" : "High vitality — dynamic node",
      color: "amber"
    },
    {
      label: "Closed Loops",
      value: hasClosedLoops ? "Yes" : "No",
      implies: hasClosedLoops ? "Enclosed form → balanced, high Maat" : "Open form → active, lower equilibrium",
      color: "blue"
    },
    {
      label: "Bilateral Symmetry",
      value: `${(symmetryScore * 100).toFixed(0)}%`,
      implies: symmetryScore > 0.7 ? "High symmetry → strong Maat" : symmetryScore > 0.4 ? "Partial symmetry" : "Asymmetric — dynamic tension",
      color: "blue"
    },
    {
      label: "Stroke Curvature",
      value: angularityScore > 0.6 ? "Angular" : angularityScore < 0.35 ? "Curved" : "Mixed",
      implies: angularityScore > 0.6 ? "Angular → cuneiform / Sumerian" : angularityScore < 0.35 ? "Flowing → Mayan / organic" : "Mixed → Egyptian balanced",
      color: "emerald"
    },
    {
      label: "Input Pressure",
      value: avgPressure > 0.7 ? "Heavy" : avgPressure > 0.4 ? "Medium" : "Light",
      implies: avgPressure > 0.6 ? "Strong pressure → amplified àṣẹ vitality" : "Light touch → subtle resonance",
      color: "amber"
    },
    {
      label: "Path Length",
      value: `${totalLength.toFixed(0)}px`,
      implies: totalLength > 600 ? "Extended path → high Sumerian resonance" : totalLength > 200 ? "Moderate extension" : "Compact form",
      color: "purple"
    },
    {
      label: "Enclosure Area",
      value: hasClosedLoops ? `${(enclosureRatio * 100).toFixed(1)}%` : "—",
      implies: enclosureRatio > 0.3 ? "High enclosure → contained energy" : "Open energy flow",
      color: "rose"
    },
  ];

  return {
    strokeCount, hasClosedLoops, symmetryScore, angularityScore,
    totalLength, avgPressure, enclosureRatio,
    suggestedAse, suggestedMaat, suggestedResonance,
    suggestedSystem, glyphMatch, confidence, features
  };
}

// ───────── Drawing Canvas Component ─────────
interface DrawingCanvasProps {
  onInterpret: (interp: Interpretation, dataUrl: string) => void;
}

type Tool = "pen" | "eraser";

function DrawingCanvas({ onInterpret }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [strokeColor, setStrokeColor] = useState("#f97316");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [hasStylusInput, setHasStylusInput] = useState(false);
  const [currentPressure, setCurrentPressure] = useState(0.5);
  const strokesRef = useRef<Stroke[]>([]);

  strokesRef.current = strokes;

  const redraw = useCallback((strokeList: Stroke[], active: StrokePoint[] = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid background
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    const drawStroke = (stroke: StrokePoint[], color: string) => {
      if (stroke.length < 2) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < stroke.length; i++) {
        const pressure = stroke[i].pressure;
        const width = Math.max(1, strokeWidth * (0.5 + pressure));
        ctx.beginPath();
        ctx.moveTo(stroke[i-1].x, stroke[i-1].y);
        ctx.lineTo(stroke[i].x, stroke[i].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.shadowColor = color;
        ctx.shadowBlur = pressure * 6;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    strokeList.forEach(stroke => drawStroke(stroke, strokeColor));
    if (active.length > 1) drawStroke(active, tool === "eraser" ? "#1a1b1e" : strokeColor);
  }, [strokeColor, strokeWidth, tool]);

  useEffect(() => { redraw(strokes); }, [strokes, redraw]);

  const getPoint = (e: React.PointerEvent): StrokePoint => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pressure = e.pressure > 0 ? e.pressure : 0.5;
    if (e.pointerType === "pen") {
      setHasStylusInput(true);
      setCurrentPressure(e.pressure);
    } else {
      setCurrentPressure(0.5);
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pt = getPoint(e);
    setCurrentStroke([pt]);
    redraw(strokes, [pt]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const pt = getPoint(e);
    setCurrentStroke(prev => {
      const next = [...prev, pt];
      redraw(strokesRef.current, next);
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pt = getPoint(e);
    setCurrentStroke(prev => {
      const finalStroke = [...prev, pt];
      let nextStrokes: Stroke[];
      if (tool === "eraser") {
        // Erase strokes that overlap with current path
        nextStrokes = strokesRef.current.filter(stroke =>
          !stroke.some(sp =>
            finalStroke.some(ep => {
              const dx = sp.x - ep.x; const dy = sp.y - ep.y;
              return Math.sqrt(dx*dx + dy*dy) < 20;
            })
          )
        );
      } else {
        nextStrokes = [...strokesRef.current, finalStroke];
      }
      setStrokes(nextStrokes);
      // Interpret and export
      const interp = interpretStrokes(nextStrokes);
      const canvas = canvasRef.current;
      if (canvas) onInterpret(interp, canvas.toDataURL("image/png"));
      redraw(nextStrokes, []);
      return [];
    });
  };

  const undo = () => {
    setStrokes(prev => {
      const next = prev.slice(0, -1);
      const interp = interpretStrokes(next);
      const canvas = canvasRef.current;
      if (canvas) onInterpret(interp, canvas.toDataURL("image/png"));
      redraw(next);
      return next;
    });
  };

  const clear = () => {
    setStrokes([]);
    const interp = interpretStrokes([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onInterpret(interp, canvas.toDataURL("image/png"));
    }
  };

  const PALETTE = [
    { color: "#f97316", label: "Solar" },
    { color: "#3b82f6", label: "Nile" },
    { color: "#10b981", label: "Mayan" },
    { color: "#a855f7", label: "Void" },
    { color: "#ffffff", label: "Light" },
    { color: "#ef4444", label: "Mars" },
  ];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-md border border-border/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors ${tool === "pen" ? "bg-amber-500/20 text-amber-300 border-r border-amber-500/30" : "bg-background text-muted-foreground hover:text-foreground border-r border-border/50"}`}
          >
            <Pen className="w-3 h-3" /> Pen
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors ${tool === "eraser" ? "bg-rose-500/20 text-rose-300" : "bg-background text-muted-foreground hover:text-foreground"}`}
          >
            <Eraser className="w-3 h-3" /> Erase
          </button>
        </div>

        <div className="flex gap-1">
          {PALETTE.map(p => (
            <button
              key={p.color}
              type="button"
              title={p.label}
              onClick={() => setStrokeColor(p.color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${strokeColor === p.color ? "scale-125 border-white" : "border-transparent hover:scale-110"}`}
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] font-mono text-muted-foreground">Width</span>
          <input
            type="range" min={1} max={12} value={strokeWidth}
            onChange={e => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-amber-500"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-4">{strokeWidth}</span>
        </div>

        <button type="button" onClick={undo} title="Undo last stroke"
          className="p-1.5 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={clear} title="Clear canvas"
          className="p-1.5 rounded border border-border/50 text-muted-foreground hover:text-rose-400 hover:border-rose-500/30 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-border/50 bg-[#0e0f12]">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full touch-none cursor-crosshair"
          style={{ display: "block" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {strokes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Pencil className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground/50 text-sm font-mono">Draw your rune symbol here</p>
            <p className="text-muted-foreground/30 text-xs font-mono mt-1">Mouse · Stylus · Draw-pad — pressure sensitive</p>
          </div>
        )}
        {hasStylusInput && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/50 rounded px-2 py-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400">Stylus</span>
            <div className="w-12 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${currentPressure * 100}%` }} />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/40">
          {strokes.length} stroke{strokes.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

// ───────── Rune Composer — pick from existing runes ─────────
interface ComposerProps {
  runes: any[];
  onInherit: (field: string, value: any) => void;
}

function RuneComposer({ runes, onInherit }: ComposerProps) {
  const [selected, setSelected] = useState<any | null>(null);
  const [blendTargets, setBlendTargets] = useState<number[]>([]);

  const handleBlend = () => {
    const targets = runes.filter(r => blendTargets.includes(r.id));
    if (targets.length === 0) return;
    const avgAse = targets.reduce((s, r) => s + (r.aseVitality ?? 0.5), 0) / targets.length;
    const avgMaat = targets.reduce((s, r) => s + (r.maatBalance ?? 0.5), 0) / targets.length;
    const avgRes = targets.reduce((s, r) => s + (r.sumerianResonance ?? 1), 0) / targets.length;
    onInherit("aseVitality", Math.round(avgAse * 100) / 100);
    onInherit("maatBalance", Math.round(avgMaat * 100) / 100);
    onInherit("sumerianResonance", Math.round(avgRes));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Select a rune below to inherit its glyph, harmonics, or procedure. Or check multiple runes to blend their harmonic values.
        </p>
      </div>

      {/* Blend controls */}
      {blendTargets.length >= 2 && (
        <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-950/15 flex items-center justify-between">
          <div className="text-xs text-purple-300">
            <span className="font-mono">{blendTargets.length} runes selected</span> — blend their harmonics
          </div>
          <Button type="button" size="sm" onClick={handleBlend}
            className="h-7 text-[10px] font-mono bg-purple-600 hover:bg-purple-500 gap-1">
            <Blend className="w-3 h-3" /> Blend Harmonics
          </Button>
        </div>
      )}

      {/* Rune grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {runes.map(r => (
          <div key={r.id}
            className={`relative rounded-lg border p-3 cursor-pointer transition-all ${
              selected?.id === r.id
                ? "border-amber-500/60 bg-amber-950/20"
                : "border-border/50 bg-background hover:border-border hover:bg-muted/20"
            }`}
            onClick={() => setSelected(selected?.id === r.id ? null : r)}
          >
            <input
              type="checkbox"
              className="absolute top-2 right-2 w-3 h-3 accent-purple-500"
              checked={blendTargets.includes(r.id)}
              onClick={e => e.stopPropagation()}
              onChange={e => {
                if (e.target.checked) setBlendTargets(prev => [...prev, r.id]);
                else setBlendTargets(prev => prev.filter(id => id !== r.id));
              }}
            />
            <div className="text-2xl text-primary mb-1">{r.glyphSymbol}</div>
            <div className="text-[10px] font-serif text-foreground leading-tight truncate">{r.name}</div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase mt-0.5">{r.system}</div>
            <div className="flex gap-1 mt-1.5">
              <div className="h-0.5 flex-1 rounded-full bg-amber-500/30">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${(r.aseVitality ?? 0.5) * 100}%` }} />
              </div>
              <div className="h-0.5 flex-1 rounded-full bg-blue-500/30">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${(r.maatBalance ?? 0.5) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inherit panel */}
      {selected && (
        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-950/10 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-primary">{selected.glyphSymbol}</span>
            <div>
              <div className="font-serif font-bold text-foreground">{selected.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">{selected.system} · {selected.scale}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onInherit("glyphSymbol", selected.glyphSymbol)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors">
              <Copy className="w-3 h-3" /> Use Glyph
            </button>
            <button type="button" onClick={() => { onInherit("aseVitality", selected.aseVitality); onInherit("maatBalance", selected.maatBalance); onInherit("sumerianResonance", selected.sumerianResonance); }}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors">
              <Sparkles className="w-3 h-3" /> Inherit Harmonics
            </button>
            <button type="button" onClick={() => onInherit("procedureCode", selected.procedureCode)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors">
              <BookOpen className="w-3 h-3" /> Use Procedure
            </button>
            <button type="button" onClick={() => { onInherit("glyphSymbol", selected.glyphSymbol); onInherit("aseVitality", selected.aseVitality); onInherit("maatBalance", selected.maatBalance); onInherit("sumerianResonance", selected.sumerianResonance); onInherit("system", selected.system); onInherit("scale", selected.scale); }}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors">
              <Layers className="w-3 h-3" /> Clone All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded bg-background/50 border border-border/30">
              <div className="text-amber-400">ASE</div>
              <div className="text-foreground font-bold">{((selected.aseVitality ?? 0.5) * 100).toFixed(0)}%</div>
            </div>
            <div className="p-2 rounded bg-background/50 border border-border/30">
              <div className="text-blue-400">MAAT</div>
              <div className="text-foreground font-bold">{((selected.maatBalance ?? 0.5) * 100).toFixed(0)}%</div>
            </div>
            <div className="p-2 rounded bg-background/50 border border-border/30">
              <div className="text-muted-foreground">RES</div>
              <div className="text-foreground font-bold">{selected.sumerianResonance ?? 1}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────── Interpretation Matrix Display ─────────
function InterpretationMatrixPanel({ interp }: { interp: Interpretation | null }) {
  if (!interp || interp.strokeCount === 0) {
    return (
      <div className="p-4 rounded-lg border border-border/30 bg-background/30 text-center space-y-2">
        <div className="text-muted-foreground/40 text-2xl">◌</div>
        <p className="text-xs text-muted-foreground font-mono">Draw strokes to generate symbolic interpretation</p>
      </div>
    );
  }

  const colorMap: Record<string, string> = {
    amber: "text-amber-400 border-amber-500/20 bg-amber-950/10",
    blue: "text-blue-400 border-blue-500/20 bg-blue-950/10",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10",
    purple: "text-purple-400 border-purple-500/20 bg-purple-950/10",
    rose: "text-rose-400 border-rose-500/20 bg-rose-950/10",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Interpretation Matrix
        </div>
        <Badge variant="outline" className="text-[9px] font-mono">
          Confidence: {interp.confidence}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded border border-amber-500/25 bg-amber-950/15 text-center">
          <div className="text-amber-400 text-[9px] font-mono uppercase">Suggested ASE</div>
          <div className="text-amber-300 font-bold text-sm">{(interp.suggestedAse * 100).toFixed(0)}%</div>
        </div>
        <div className="p-2 rounded border border-blue-500/25 bg-blue-950/15 text-center">
          <div className="text-blue-400 text-[9px] font-mono uppercase">Suggested Maat</div>
          <div className="text-blue-300 font-bold text-sm">{(interp.suggestedMaat * 100).toFixed(0)}%</div>
        </div>
        <div className="p-2 rounded border border-border/30 bg-background/30 text-center">
          <div className="text-muted-foreground text-[9px] font-mono uppercase">Resonance</div>
          <div className="text-foreground font-bold text-sm">{interp.suggestedResonance}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-2 rounded border border-border/30 bg-background/30">
        <div className="text-xl text-primary">{interp.glyphMatch}</div>
        <div className="flex-1">
          <div className="text-[10px] font-mono text-muted-foreground">Suggested system</div>
          <div className="text-xs font-semibold capitalize">{interp.suggestedSystem}</div>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono capitalize">{interp.suggestedSystem}</Badge>
      </div>

      <div className="space-y-1">
        {interp.features.map(f => (
          <div key={f.label} className={`flex items-start gap-2 p-2 rounded border text-[10px] ${colorMap[f.color] || ""}`}>
            <div className="w-28 shrink-0 font-mono uppercase tracking-wider opacity-70">{f.label}</div>
            <div className="w-16 shrink-0 font-bold">{f.value}</div>
            <div className="flex-1 opacity-80">{f.implies}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────── Main Page ─────────
type SymbolTab = "library" | "compose" | "draw";

export default function RuneNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createRune = useCreateRune();
  const { data: glyphs } = useListGlyphs();
  const { data: runes } = useListRunes();

  const [symbolTab, setSymbolTab] = useState<SymbolTab>("library");
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [drawnPreview, setDrawnPreview] = useState<string | null>(null);
  const [customSymbol, setCustomSymbol] = useState("");

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

  const setField = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleGlyphChange = (glyphId: string) => {
    const g = glyphs?.find(g => g.id.toString() === glyphId);
    if (g) setFormData(prev => ({ ...prev, glyph: g.name, glyphSymbol: g.symbol, system: g.system as any }));
  };

  const handleDrawInterpret = (interp: Interpretation, dataUrl: string) => {
    setInterpretation(interp);
    setDrawnPreview(dataUrl);
  };

  const applyInterpretation = () => {
    if (!interpretation) return;
    setFormData(prev => ({
      ...prev,
      aseVitality: interpretation.suggestedAse,
      maatBalance: interpretation.suggestedMaat,
      sumerianResonance: interpretation.suggestedResonance,
      system: interpretation.suggestedSystem as any,
      glyphSymbol: prev.glyphSymbol || interpretation.glyphMatch,
      glyph: prev.glyph || `Drawn-${Date.now()}`,
    }));
    toast({ title: "Harmonics Applied", description: "Interpretation matrix values applied to your rune." });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = formData.glyphSymbol || customSymbol;
    if (!formData.name || !symbol || !formData.procedureCode) {
      toast({ title: "Incomplete Ritual", description: "Name, symbol, and procedure are required.", variant: "destructive" });
      return;
    }
    const payload = { ...formData, glyphSymbol: symbol };
    createRune.mutate({ data: payload }, {
      onSuccess: (data) => {
        toast({ title: "Rune Inscribed", description: "The node has been added to the sanctuary." });
        setLocation(`/runes/${data.id}`);
      },
      onError: () => {
        toast({ title: "Inscription Failed", description: "Could not write to the tablets.", variant: "destructive" });
      }
    });
  };

  const activeSymbol = formData.glyphSymbol || customSymbol;

  const SYMBOL_TABS: { id: SymbolTab; label: string; icon: React.ReactNode }[] = [
    { id: "library", label: "Glyph Library", icon: <Library className="w-3.5 h-3.5" /> },
    { id: "compose", label: "Compose from Runes", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "draw", label: "Draw Symbol", icon: <Pen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <Link href="/runes" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Runes
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Inscribe New Rune</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Add a new symbolic processing node to the sanctuary — draw, compose, or select from the glyph library.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — identity + symbol creation */}
          <div className="lg:col-span-2 space-y-6">

            {/* Rune Identity */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-serif">Rune Identity</CardTitle>
                <CardDescription className="font-mono text-xs">Name, scale and symbolic system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">Common Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ankh Vitality Node"
                    value={formData.name}
                    onChange={e => setField("name", e.target.value)}
                    className="font-serif bg-background border-border/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider">System</Label>
                    <Select value={formData.system} onValueChange={v => setField("system", v)}>
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["egyptian","sumerian","mayan","khoisan","celestial","temporal","elemental","biological","geological","atmospheric","energy","cognitive","synthetic","dimensional","pyri"].map(s => (
                          <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider">Scale</Label>
                    <Select value={formData.scale} onValueChange={v => setField("scale", v)}>
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
              </CardContent>
            </Card>

            {/* Symbol Creation — tabbed */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Symbol Creation</CardTitle>
                <CardDescription className="font-mono text-xs">Pick from the glyph library, compose from existing runes, or draw freehand</CardDescription>
              </CardHeader>

              {/* Tab bar */}
              <div className="flex border-b border-border/50 px-6">
                {SYMBOL_TABS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSymbolTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-b-2 -mb-px transition-colors ${
                      symbolTab === t.id
                        ? "border-amber-500 text-amber-300"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <CardContent className="pt-4 space-y-4">

                {/* Library tab */}
                {symbolTab === "library" && (
                  <div className="space-y-4">
                    <Select onValueChange={handleGlyphChange}>
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue placeholder="Choose a symbol from the library..." />
                      </SelectTrigger>
                      <SelectContent>
                        {glyphs?.map(g => (
                          <SelectItem key={g.id} value={g.id.toString()}>
                            <div className="flex items-center gap-3">
                              <span className="text-xl text-primary">{g.symbol}</span>
                              <span>{g.name}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{g.system}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="space-y-2">
                      <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Or enter custom Unicode / character</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Paste any symbol — 𓂀 ⊕ ✦ ◈ ⟁ …"
                          value={customSymbol}
                          onChange={e => setCustomSymbol(e.target.value.slice(0, 4))}
                          className="font-mono bg-background border-border/50 text-xl text-center"
                        />
                        {customSymbol && (
                          <Button type="button" variant="outline" size="sm"
                            onClick={() => { setField("glyphSymbol", customSymbol); setCustomSymbol(""); }}>
                            Use
                          </Button>
                        )}
                      </div>
                    </div>

                    {activeSymbol && (
                      <div className="flex items-center justify-center p-8 border border-dashed border-border/50 rounded-lg bg-background">
                        <div className="text-6xl text-primary drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                          {activeSymbol}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Compose tab */}
                {symbolTab === "compose" && (
                  <RuneComposer
                    runes={runes ?? []}
                    onInherit={(field, value) => setField(field, value)}
                  />
                )}

                {/* Draw tab */}
                {symbolTab === "draw" && (
                  <div className="space-y-4">
                    <DrawingCanvas onInterpret={handleDrawInterpret} />

                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground font-mono">
                        After drawing, apply the interpretation to auto-fill harmonics
                      </div>
                      <Button
                        type="button"
                        disabled={!interpretation || interpretation.strokeCount === 0}
                        onClick={applyInterpretation}
                        className="gap-1.5 text-xs font-mono bg-amber-600 hover:bg-amber-500 shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Apply Interpretation
                      </Button>
                    </div>

                    {/* Interpretation Matrix */}
                    <InterpretationMatrixPanel interp={interpretation} />

                    {/* Custom symbol after drawing */}
                    <div className="space-y-2 pt-2 border-t border-border/30">
                      <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Assign symbol for this drawn rune
                      </Label>
                      <div className="flex gap-2 items-center">
                        <span className="text-2xl text-primary w-10 text-center">
                          {activeSymbol || interpretation?.glyphMatch || "◌"}
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        <Input
                          placeholder="Type or paste symbol..."
                          value={customSymbol}
                          onChange={e => setCustomSymbol(e.target.value.slice(0, 4))}
                          className="font-mono bg-background border-border/50 text-center text-lg"
                        />
                        {customSymbol && (
                          <Button type="button" variant="outline" size="sm"
                            onClick={() => { setField("glyphSymbol", customSymbol); setCustomSymbol(""); }}>
                            Set
                          </Button>
                        )}
                        {interpretation?.glyphMatch && !formData.glyphSymbol && (
                          <Button type="button" variant="outline" size="sm"
                            onClick={() => setField("glyphSymbol", interpretation.glyphMatch)}>
                            Use {interpretation.glyphMatch}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Procedure Code */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  Procedure Code
                </CardTitle>
                <CardDescription className="font-mono text-xs">The symbolic logic executed when invoked. Select a template or write your own.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="font-mono text-xs uppercase tracking-wider text-orange-400/80">Ritual Templates</Label>
                  {PROCEDURE_TEMPLATES.map(group => (
                    <div key={group.group}>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">{group.group}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.templates.map(t => (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => setField("procedureCode", t.code)}
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
                <Textarea
                  value={formData.procedureCode}
                  onChange={e => setField("procedureCode", e.target.value)}
                  className="min-h-[220px] font-mono text-sm bg-[#1a1b1e] border-[#2c2d31] text-[#c9d1d9]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column — harmonics + connections + submit */}
          <div className="lg:col-span-1 space-y-6">

            {/* Symbol preview */}
            {activeSymbol && (
              <Card className="border-amber-500/20 bg-amber-950/10">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <div className="text-5xl text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]">
                    {activeSymbol}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">{formData.glyph || "Custom symbol"}</div>
                </CardContent>
              </Card>
            )}

            {/* Harmonics */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif flex items-center justify-between">
                  Harmonics
                  {interpretation && interpretation.strokeCount > 0 && (
                    <button type="button" onClick={applyInterpretation}
                      className="text-[9px] font-mono text-amber-400 border border-amber-500/30 rounded px-2 py-0.5 hover:bg-amber-500/10 transition-colors flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> From Drawing
                    </button>
                  )}
                </CardTitle>
                <CardDescription className="font-mono text-xs">Energetic properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="font-mono text-xs uppercase tracking-wider text-amber-500">ASE Vitality</Label>
                    <span className="font-mono text-xs">{(formData.aseVitality * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[formData.aseVitality]}
                    max={1} step={0.01}
                    onValueChange={v => setField("aseVitality", v[0])}
                    className="[&_[role=slider]]:border-amber-500 [&_[role=slider]]:bg-amber-500"
                  />
                  <p className="text-[10px] text-muted-foreground">Yorùbá àṣẹ — performative vital force. Grounds rune influence during propagation.</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex justify-between">
                    <Label className="font-mono text-xs uppercase tracking-wider text-blue-500">Maat Balance</Label>
                    <span className="font-mono text-xs">{(formData.maatBalance * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[formData.maatBalance]}
                    max={1} step={0.01}
                    onValueChange={v => setField("maatBalance", v[0])}
                    className="[&_[role=slider]]:border-blue-500 [&_[role=slider]]:bg-blue-500"
                  />
                  <p className="text-[10px] text-muted-foreground">42 Laws of Maat — governs systemic stability and equilibrium.</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <Label className="font-mono text-xs uppercase tracking-wider">Sumerian Resonance (Base-60)</Label>
                  <Input
                    type="number" min="1" max="60"
                    value={formData.sumerianResonance}
                    onChange={e => setField("sumerianResonance", parseFloat(e.target.value) || 1)}
                    className="font-mono bg-background border-border/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Connections */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Connections</CardTitle>
                <CardDescription className="font-mono text-xs">Link to existing runes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {runes?.length ? runes.map(r => (
                    <label key={r.id} className="flex items-center space-x-3 p-2 rounded border border-border/50 bg-background hover:bg-muted transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.connections.includes(r.id)}
                        onChange={e => {
                          if (e.target.checked) setField("connections", [...formData.connections, r.id]);
                          else setField("connections", formData.connections.filter((id: number) => id !== r.id));
                        }}
                        className="rounded border-primary/50 text-primary focus:ring-primary h-4 w-4"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg text-primary">{r.glyphSymbol}</span>
                        <div>
                          <span className="text-xs font-serif">{r.name}</span>
                          <div className="text-[9px] font-mono text-muted-foreground uppercase">{r.system}</div>
                        </div>
                      </div>
                    </label>
                  )) : (
                    <div className="text-xs text-muted-foreground italic flex items-center gap-2 p-2">
                      <Info className="w-3 h-3" /> No existing runes to connect.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={createRune.isPending}
              className="w-full gap-2 font-mono uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {createRune.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {createRune.isPending ? "Inscribing..." : "Inscribe Rune"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
