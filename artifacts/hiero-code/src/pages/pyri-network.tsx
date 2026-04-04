import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

const CHANNELS = ["α", "β", "γ", "δ", "ε", "ζ"] as const;
type Channel = typeof CHANNELS[number];

const SUMERIAN_MAP: Record<Channel, string> = { α: "𒀀", β: "𒁀", γ: "𒂀", δ: "𒄀", ε: "𒅀", ζ: "𒆠" };
const EGYPTIAN_MAP: Record<Channel, string>  = { α: "𓀀", β: "𓁐", γ: "𓂋", δ: "𓄿", ε: "𓅓", ζ: "𓆓" };
const EMOJI_MAP: Record<Channel, string>     = { α: "🌑", β: "🌘", γ: "🌗", δ: "🌖", ε: "🌕", ζ: "🌔" };

type NodeType = "Core" | "Edge" | "Stack" | "Flow";
interface PyriNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  channels: Record<Channel, number>;
  hiero: number;
  energy: number;
  state: number;
  stack: number[];
  articulators: Channel[];
}

interface PyriEdge {
  from: string;
  to: string;
  weight: number;
  channel: string;
  signal: number;
}

const INITIAL_NODES: PyriNode[] = [
  { id: "Core",   label: "Core",   type: "Core",  x: 380, y: 200, channels: { α:0.5, β:0.2, γ:0.7, δ:0.3, ε:0.6, ζ:0.4 }, hiero:0, energy:0.5, state:0, stack:[], articulators:["α","γ"] },
  { id: "Edge1",  label: "Edge 1", type: "Edge",  x: 120, y: 100, channels: { α:0.1, β:0.3, γ:0.2, δ:0.0, ε:0.0, ζ:0.0 }, hiero:1, energy:0.3, state:1, stack:[], articulators:["α"] },
  { id: "Edge2",  label: "Edge 2", type: "Edge",  x: 120, y: 300, channels: { α:0.4, β:0.6, γ:0.1, δ:0.0, ε:0.0, ζ:0.0 }, hiero:2, energy:0.4, state:2, stack:[], articulators:["β"] },
  { id: "Stack1", label: "Stack 1",type: "Stack", x: 600, y: 100, channels: { α:0.0, β:0.0, γ:0.3, δ:0.5, ε:0.0, ζ:0.0 }, hiero:3, energy:0.5, state:3, stack:[], articulators:["δ"] },
  { id: "Stack2", label: "Stack 2",type: "Stack", x: 600, y: 300, channels: { α:0.0, β:0.0, γ:0.2, δ:0.4, ε:0.0, ζ:0.0 }, hiero:4, energy:0.4, state:4, stack:[], articulators:["δ"] },
  { id: "Flow1",  label: "Flow 1", type: "Flow",  x: 820, y: 100, channels: { α:0.0, β:0.0, γ:0.0, δ:0.6, ε:0.1, ζ:0.3 }, hiero:5, energy:0.6, state:5, stack:[], articulators:["ζ"] },
  { id: "Flow2",  label: "Flow 2", type: "Flow",  x: 820, y: 300, channels: { α:0.0, β:0.0, γ:0.0, δ:0.5, ε:0.2, ζ:0.4 }, hiero:6, energy:0.5, state:6, stack:[], articulators:["ε"] },
];

const EDGES: PyriEdge[] = [
  { from:"Edge1",  to:"Core",   weight:0.8, channel:"α → μ0",  signal:0.5 },
  { from:"Edge2",  to:"Core",   weight:0.6, channel:"β → μ1",  signal:0.4 },
  { from:"Core",   to:"Stack1", weight:0.7, channel:"γ → σ0",  signal:0.6 },
  { from:"Core",   to:"Stack2", weight:0.5, channel:"γ → σ1",  signal:0.5 },
  { from:"Stack1", to:"Flow1",  weight:0.9, channel:"δ → δ0",  signal:0.7 },
  { from:"Stack2", to:"Flow2",  weight:0.8, channel:"ε → ε0",  signal:0.6 },
  { from:"Flow1",  to:"Core",   weight:0.4, channel:"δ→μ0 ↺",  signal:0.3 },
  { from:"Flow2",  to:"Edge1",  weight:0.3, channel:"ε→α ↺",   signal:0.2 },
  { from:"Flow1",  to:"Flow2",  weight:0.5, channel:"ζ channel",signal:0.4 },
  { from:"Stack1", to:"Stack2", weight:0.3, channel:"σ modulate",signal:0.3 },
];

const STATES_TABLE = [
  { s:"S₀", α:0, β:0, γ:0, δ:0, ε:0, ζ:0, stack:"—",         next:"S₁", note:"Initialization — void state" },
  { s:"S₁", α:1, β:0, γ:0, δ:0, ε:0, ζ:0, stack:"—",         next:"S₂", note:"α primes γ in next step" },
  { s:"S₂", α:1, β:1, γ:0, δ:0, ε:0, ζ:0, stack:"α prev=1",  next:"S₃", note:"Multi-channel cue (α+β → γ)" },
  { s:"S₃", α:1, β:1, γ:1, δ:0, ε:0, ζ:0, stack:"γ prev=0",  next:"S₄", note:"γ activated, δ primed via stack" },
  { s:"S₄", α:0, β:1, γ:1, δ:1, ε:0, ζ:0, stack:"δ prev=0",  next:"S₅", note:"δ activated by prior γ, β persists" },
  { s:"S₅", α:0, β:0, γ:1, δ:1, ε:1, ζ:0, stack:"δ prev=1",  next:"S₆", note:"ε primes ζ via stack cue" },
  { s:"S₆", α:0, β:0, γ:0, δ:1, ε:1, ζ:1, stack:"ε prev=1",  next:"S₇", note:"Core stabilization resets α" },
  { s:"S₇", α:0, β:0, γ:0, δ:0, ε:1, ζ:1, stack:"ζ prev=0",  next:"S₈", note:"ζ persists, ε begins decay" },
  { s:"S₈", α:0, β:0, γ:0, δ:0, ε:0, ζ:1, stack:"—",         next:"S₀", note:"Loop reset — stable core restored" },
];

function clamp(v: number) { return Math.max(0, Math.min(1, v)); }

const PROPAGATION_COEFFS: Record<Channel, number> = { α:0.6, β:0.7, γ:0.65, δ:0.7, ε:0.6, ζ:0.55 };
const CROSS_INFLUENCE: Record<Channel, Record<Channel, number>> = {
  α: { α:0,    β:0.02, γ:0.08, δ:0.01, ε:0.01, ζ:0.01 },
  β: { α:0.03, β:0,    γ:0.05, δ:0.02, ε:0.01, ζ:0.01 },
  γ: { α:0.01, β:0.02, γ:0,    δ:0.07, ε:0.02, ζ:0.01 },
  δ: { α:0.01, β:0.01, γ:0.03, δ:0,    ε:0.08, ζ:0.02 },
  ε: { α:0.01, β:0.01, γ:0.02, δ:0.03, ε:0,    ζ:0.09 },
  ζ: { α:0.04, β:0.01, γ:0.01, δ:0.02, ε:0.03, ζ:0    },
};

const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string; glow: string }> = {
  Core:  { bg:"#451a03", border:"#f97316", text:"#fb923c", glow:"rgba(249,115,22,0.4)" },
  Edge:  { bg:"#0c1a4d", border:"#3b82f6", text:"#60a5fa", glow:"rgba(59,130,246,0.35)" },
  Stack: { bg:"#0a2a1a", border:"#22c55e", text:"#4ade80", glow:"rgba(34,197,94,0.35)" },
  Flow:  { bg:"#1a0a40", border:"#a855f7", text:"#c084fc", glow:"rgba(168,85,247,0.35)" },
};

function stepNode(node: PyriNode, neighbors: PyriNode[]): PyriNode {
  const newChannels = { ...node.channels };
  for (const ch of CHANNELS) {
    let total = node.channels[ch] * PROPAGATION_COEFFS[ch];
    for (const n of neighbors) {
      for (const other of CHANNELS) {
        total += n.channels[other] * CROSS_INFLUENCE[ch][other] * 0.1;
      }
    }
    newChannels[ch] = clamp(total);
  }
  const dominant = CHANNELS.reduce((a, b) => newChannels[a] > newChannels[b] ? a : b);
  const domIdx = CHANNELS.indexOf(dominant);
  const stackTop = node.stack[node.stack.length - 1] ?? 0;
  const newHiero = (node.hiero + domIdx + stackTop) % 9;
  const newState = newHiero;
  const energy = clamp(CHANNELS.reduce((s, c) => s + newChannels[c], 0) / 6);
  const newStack = [...node.stack];
  if (newChannels[dominant] > 0.7 && newStack.length < 5) newStack.push(newHiero);
  if (newStack.length > 0 && energy < 0.2) newStack.pop();
  return { ...node, channels: newChannels, hiero: newHiero, state: newState, energy, stack: newStack };
}

function PyriNetworkCanvas({ nodes, edges, symbolLayer }: { nodes: PyriNode[]; edges: PyriEdge[]; symbolLayer: string }) {
  const W = 960, H = 420;
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const getChannelDisplay = (ch: Channel, val: number) => {
    const sym = symbolLayer === "greek" ? ch : symbolLayer === "sumerian" ? SUMERIAN_MAP[ch] : symbolLayer === "egyptian" ? EGYPTIAN_MAP[ch] : EMOJI_MAP[ch];
    return `${sym}${val.toFixed(2)}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ background:"transparent" }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
        </marker>
        {Object.entries(NODE_COLORS).map(([type, c]) => (
          <filter key={type} id={`glow-${type}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor={c.glow} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
      </defs>

      {edges.map((e, i) => {
        const from = nodeMap[e.from]; const to = nodeMap[e.to];
        if (!from || !to) return null;
        const mx = (from.x + to.x) / 2; const my = (from.y + to.y) / 2;
        const sig = e.signal;
        const strokeW = 1 + sig * 3;
        const opacity = 0.3 + sig * 0.6;
        const isReturn = e.channel.includes("↺");
        const dx = to.x - from.x; const dy = to.y - from.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy/len * 30; const ny = dx/len * 30;
        const cpx = mx + nx; const cpy = my + ny;
        return (
          <g key={i}>
            <path
              d={isReturn ? `M${from.x},${from.y} Q${cpx},${cpy} ${to.x},${to.y}` : `M${from.x},${from.y} L${to.x},${to.y}`}
              stroke={isReturn ? "#f59e0b" : "#6b7280"}
              strokeWidth={strokeW}
              strokeOpacity={opacity}
              fill="none"
              markerEnd="url(#arrow)"
              strokeDasharray={isReturn ? "4 3" : "none"}
            />
            <text x={isReturn ? cpx : mx} y={isReturn ? cpy - 8 : my - 6} fill="#9ca3af" fontSize="8" textAnchor="middle" fontFamily="monospace">
              {e.channel}
            </text>
          </g>
        );
      })}

      {nodes.map((node) => {
        const c = NODE_COLORS[node.type];
        const r = node.type === "Core" ? 52 : 42;
        const topChans = CHANNELS.slice().sort((a, b) => node.channels[b] - node.channels[a]).slice(0, 3);
        return (
          <g key={node.id} filter={`url(#glow-${node.type})`}>
            <circle cx={node.x} cy={node.y} r={r} fill={c.bg} stroke={c.border} strokeWidth={2} />
            <text x={node.x} y={node.y - 18} fill={c.text} fontSize={node.type==="Core" ? "11" : "10"} textAnchor="middle" fontWeight="bold" fontFamily="serif">
              {node.label}
            </text>
            <text x={node.x} y={node.y - 4} fill="#d1d5db" fontSize="8" textAnchor="middle" fontFamily="monospace">
              S{node.state} ε:{node.energy.toFixed(2)}
            </text>
            {topChans.map((ch, ci) => (
              <text key={ch} x={node.x} y={node.y + 8 + ci*10} fill={c.text} fontSize="8" textAnchor="middle" fontFamily="monospace" opacity={0.9}>
                {getChannelDisplay(ch, node.channels[ch])}
              </text>
            ))}
          </g>
        );
      })}

      <text x="10" y={H - 10} fill="#6b7280" fontSize="9" fontFamily="monospace" dominantBaseline="auto">
        Hiero-Code Pyri Network — Deterministic Micro-State Propagation
      </text>
    </svg>
  );
}

export default function PyriNetwork() {
  const [nodes, setNodes] = useState<PyriNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<PyriEdge[]>(EDGES);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [symbolLayer, setSymbolLayer] = useState<string>("greek");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = useCallback(() => {
    setNodes(prev => {
      const nodeMap = Object.fromEntries(prev.map(n => [n.id, n]));
      return prev.map(node => {
        const neighborIds = EDGES.filter(e => e.from === node.id || e.to === node.id).map(e => e.from === node.id ? e.to : e.from);
        const neighbors = neighborIds.map(id => nodeMap[id]).filter(Boolean);
        return stepNode(node, neighbors);
      });
    });
    setEdges(prev => prev.map(e => {
      const newSig = clamp(e.signal + (Math.sin(tick * 0.3 + e.weight * 5) * 0.05));
      return { ...e, signal: newSig };
    }));
    setTick(t => t + 1);
  }, [tick]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(step, 600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, step]);

  const reset = () => {
    setNodes(INITIAL_NODES);
    setEdges(EDGES);
    setTick(0);
    setRunning(false);
  };

  const coreNode = nodes.find(n => n.id === "Core")!;
  const currentState = STATES_TABLE[coreNode?.state ?? 0];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-4xl">𒀀</span>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Pyri Network</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Dynamic micro-state propagation across Core, Edge, Stack, and Flow Pyri nodes
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl pt-2">
          A deterministic Pyri interpreter — replacing randomness with <strong className="text-amber-400">channel-based propagation</strong> (α–ζ),{" "}
          <strong className="text-blue-400">Hiero-Code transitions</strong>, <strong className="text-emerald-400">stack memory</strong>,{" "}
          and <strong className="text-purple-400">core stabilization logic</strong>. Each node evolves through nine micro-states (S₀–S₈),{" "}
          rendered simultaneously in four symbolic languages: Greek, Sumerian, Egyptian, and Emoji.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { type:"Core", color:"orange", desc:"Central hub. Holds global state vectors μ0–μ2. Orchestrates all connected Pyri." },
          { type:"Edge", color:"blue",   desc:"Interface layer. Channels α, β, γ — handles I/O, sensors, external triggers." },
          { type:"Stack", color:"green", desc:"Computation layer. Micro-states σ0–σn. Intermediate calculations with stack memory." },
          { type:"Flow", color:"purple", desc:"Propagation layer. Channels δ, ε, ζ — transmits signals, feedback loops, priority." },
        ].map(({ type, color, desc }) => (
          <Card key={type} className={`border-${color}-500/30 bg-card`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-mono text-${color}-400`}>{type} Pyri</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-serif">Live Network Visualization</CardTitle>
              <Badge variant="outline" className="font-mono text-xs">Tick {tick}</Badge>
              {currentState && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono text-xs">
                  Core: {currentState.s}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                Symbol:
                {["greek","sumerian","egyptian","emoji"].map(l => (
                  <button key={l} onClick={() => setSymbolLayer(l)} className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider border transition-colors ${symbolLayer===l ? "border-amber-500 text-amber-400 bg-amber-500/10" : "border-border hover:border-border/80"}`}>
                    {l === "greek" ? "α–ζ" : l === "sumerian" ? "𒀀" : l === "egyptian" ? "𓀀" : "🌑"}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={reset} className="gap-1"><RotateCcw className="w-3 h-3" /> Reset</Button>
              <Button size="sm" onClick={() => setRunning(r => !r)} className={`gap-1 ${running ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30" : "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"}`}>
                {running ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Run</>}
              </Button>
              <Button size="sm" variant="outline" onClick={step} disabled={running} className="gap-1"><Zap className="w-3 h-3" /> Step</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden bg-background/60 border border-border/40">
            <PyriNetworkCanvas nodes={nodes} edges={edges} symbolLayer={symbolLayer} />
          </div>
          {currentState && (
            <div className="mt-3 p-3 rounded bg-amber-950/20 border border-amber-500/20 text-xs font-mono space-y-1">
              <span className="text-amber-400 font-bold">{currentState.s} → {currentState.next}</span>
              <span className="text-muted-foreground ml-3">{currentState.note}</span>
              {currentState.stack !== "—" && <span className="text-blue-400 ml-3">Stack: {currentState.stack}</span>}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="states" className="w-full">
        <TabsList className="grid grid-cols-4 bg-card border border-border">
          <TabsTrigger value="states" className="text-xs">Micro-State Table</TabsTrigger>
          <TabsTrigger value="multicultural" className="text-xs">Multi-Cultural Symbols</TabsTrigger>
          <TabsTrigger value="channels" className="text-xs">Channel Propagation</TabsTrigger>
          <TabsTrigger value="code" className="text-xs">Interpreter Core</TabsTrigger>
        </TabsList>

        <TabsContent value="states" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">S₀–S₈ Deterministic Transition Table</CardTitle>
              <p className="text-xs text-muted-foreground">Nine micro-states governing the Pyri network. Each transition is fully deterministic — no randomness, every evolution traceable and interpretable.</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground">
                      <th className="text-left py-2 pr-3">State</th>
                      {CHANNELS.map(ch => <th key={ch} className="text-center px-2 py-2">{ch}</th>)}
                      <th className="text-left px-3 py-2">Stack</th>
                      <th className="text-left px-3 py-2">Next</th>
                      <th className="text-left px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STATES_TABLE.map((row, i) => (
                      <tr key={i} className={`border-b border-border/20 ${coreNode?.state === i ? "bg-amber-500/10" : "hover:bg-muted/20"}`}>
                        <td className="py-2 pr-3 text-amber-400 font-bold">{row.s}</td>
                        {CHANNELS.map(ch => (
                          <td key={ch} className="text-center px-2 py-2">
                            <span className={row[ch as Channel] ? "text-emerald-400 font-bold" : "text-muted-foreground/40"}>
                              {row[ch as Channel]}
                            </span>
                          </td>
                        ))}
                        <td className="px-3 py-2 text-blue-400 text-[10px]">{row.stack}</td>
                        <td className="px-3 py-2 text-purple-400">{row.next}</td>
                        <td className="px-3 py-2 text-muted-foreground text-[10px]">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multicultural" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">Multi-Cultural Symbol Mapping</CardTitle>
              <p className="text-xs text-muted-foreground">
                The Pyri channel logic is fully abstract — α through ζ can be swapped with any symbolic system without changing the underlying deterministic transitions.
                Numerology is a combination of Mayan, Sumerian, and Egyptian.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider font-mono">
                      <th className="text-left py-2 pr-4">Channel</th>
                      <th className="text-center px-3 py-2">Greco-Roman</th>
                      <th className="text-center px-3 py-2">Sumerian</th>
                      <th className="text-center px-3 py-2">Egyptian</th>
                      <th className="text-center px-3 py-2">Emoji Layer</th>
                      <th className="text-left px-3 py-2">Semantic Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHANNELS.map((ch, i) => (
                      <tr key={ch} className="border-b border-border/20 hover:bg-muted/20">
                        <td className="py-3 pr-4 font-mono font-bold text-amber-400">{ch}</td>
                        <td className="text-center px-3 py-3 text-xl">{ch}</td>
                        <td className="text-center px-3 py-3 text-xl">{SUMERIAN_MAP[ch]}</td>
                        <td className="text-center px-3 py-3 text-xl">{EGYPTIAN_MAP[ch]}</td>
                        <td className="text-center px-3 py-3 text-xl">{EMOJI_MAP[ch]}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {["Input priming — α activates γ in next step","Interaction — β cues δ via multi-channel articulation","Activation — γ is the shared output of α+β","Propagation — δ carries state across network hops","Modulation — ε tunes signal weights and decay rate","Priority — ζ governs feedback loop precedence"][i]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-lg bg-amber-950/10 border border-amber-500/20 space-y-2">
                  <h4 className="font-serif font-semibold text-amber-300">Multi-Cultural State S₂ Example</h4>
                  <p className="text-xs text-muted-foreground">Multi-channel cue (α+β → γ) expressed across all four symbol layers simultaneously:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {["Greek: α1 β1 γ0", "Sumerian: 𒀀1 𒁀1 𒂀0", "Egyptian: 𓀀1 𓁐1 𓂋0", "Emoji: 🌑1 🌘1 🌗0"].map(t => (
                      <div key={t} className="bg-background/40 rounded p-2 text-amber-400/80">{t}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-950/10 border border-blue-500/20 space-y-2">
                  <h4 className="font-serif font-semibold text-blue-300">Dynamic Symbol Swapping</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Symbol layers are purely representational proxies — swap them dynamically without affecting logic. A Pyri network can "speak" 
                    in Sumerian one moment, Egyptian the next, while the deterministic transitions remain identical. 
                    Use the symbol selector above the network to switch layers live.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">Channel Propagation Rules</CardTitle>
              <p className="text-xs text-muted-foreground">Five pillars of the Pyri interpreter: channels, Hiero-Code, articulation, stack memory, stabilization.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title:"1. Channel-Based Propagation (α–ζ)", color:"orange", icon:"𒀀", body:"Each micro-state lives on six channels simultaneously. Channels influence each other with propagation coefficients — α boosts γ while damping β. This replaces random perturbation with context-sensitive propagation, letting patterns flow naturally like a digital ecosystem. newChannel[ch] = Σ(neighbor[ch] × coeff[ch]) + Σ(neighbor[other] × crossInfluence[ch][other])." },
                { title:"2. Deterministic Hiero-Code Transitions", color:"amber", icon:"𓂋", body:"Each micro-state has a Hiero-Code signature. Transitions are fully deterministic: HieroCode(state₁) → HieroCode(state₂) based on current channel signals + stack context. nextHiero = (hiero + dominantChannelIndex + stackTop) mod 9. This ensures grammar-like consistency in evolution — every transition is traceable." },
                { title:"3. Multi-Channel Articulation Cues", color:"yellow", icon:"𒁀", body:"Some states are articulators, actively influencing nearby states. State S₂ triggers only if both α AND β are active, showing polyphonic cue logic. Articulators synchronize transitions, creating emergent patterns like waves or crystal growth. for each neighbor: if neighbor.channel[x] < threshold: neighbor.channel[x] += articulator.effect." },
                { title:"4. Stack Memory Influence", color:"blue", icon:"𓅓", body:"Each micro-state can push/pop contextual data to a stack. History-aware transitions: the next state is a function not just of the present, but of prior sequences. Stack depth and memory are tunable to control temporal persistence of patterns. Mirrors function calls or nested macro-runes in Hiero-Code programs." },
                { title:"5. Core Stabilization Logic", color:"green", icon:"𒆠", body:"Prevents runaway divergence or chaotic collapse. If energy > maxThreshold, diffuse excess to neighbors. If energy < minThreshold, amplify channels. Acts as meta-regulator maintaining structural coherence without suppressing emergent complexity. S₆ → S₇ resets α to prevent runaway activation; S₈ loops back to S₀." },
              ].map(({ title, color, icon, body }) => (
                <div key={title} className={`p-4 rounded-lg border border-${color}-500/20 bg-${color}-950/10 space-y-2`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <h4 className={`font-serif font-semibold text-${color}-300 text-sm`}>{title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-mono">{body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">Pyri Interpreter Core — Pseudo-Code</CardTitle>
              <p className="text-xs text-muted-foreground">The full Void-Network scaffold: autonomous PyriNodes with weighted connections, deterministic channel propagation, and cyclic state evolution.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background/60 rounded-lg p-4 font-mono text-xs text-emerald-300 overflow-x-auto border border-border/40 leading-relaxed space-y-1">
                {[
                  "class MicroState:",
                  "    channels = { α:0.0, β:0.0, γ:0.0, δ:0.0, ε:0.0, ζ:0.0 }",
                  "    hiero_code: int          # deterministic S₀–S₈ signature",
                  "    stack: []                # temporal memory",
                  "    articulators: set        # channels that act on neighbors",
                  "    energy: float            # for stabilization",
                  "",
                  "def propagate_channels(state, neighbors, coeffs, cross):",
                  "    for ch in channels:",
                  "        total = state.ch * coeffs[ch]",
                  "        for n in neighbors:",
                  "            for other in channels:",
                  "                total += n.other * cross[ch][other]",
                  "        state.ch = clamp(total, 0.0, 1.0)",
                  "",
                  "def hiero_transition(state):",
                  "    dominant = max(state.channels, key=state.channels.get)",
                  "    stackTop = state.stack[-1] if state.stack else 0",
                  "    state.hiero_code = (state.hiero_code + hash(dominant+stackTop)) % 9",
                  "",
                  "def apply_articulators(state, neighbors):",
                  "    for neighbor in neighbors:",
                  "        for ch in state.articulators:",
                  "            effect = state.channels[ch] * 0.1",
                  "            neighbor.channels[ch] = clamp(neighbor.channels[ch]+effect)",
                  "",
                  "def stabilize(state, neighbors, min=0.1, max=0.9):",
                  "    if state.energy > max:",
                  "        diffuse_energy(neighbors, state.energy - max)",
                  "        state.energy = max",
                  "    elif state.energy < min:",
                  "        amplify_channels(state)",
                  "        state.energy = min",
                  "",
                  "# Void-Network: autonomous cycle-based execution",
                  "class PyriNode:",
                  "    id: uuid              # unique identity",
                  "    state: dict           # micro-state storage",
                  "    connections: list     # [(node, weight), ...]",
                  "    rules: dict           # name → Callable",
                  "",
                  "    def broadcast(self, signal):",
                  "        for node, weight in self.connections:",
                  "            node.receive(signal * weight)",
                  "",
                  "    def cycle(self):",
                  "        for rule_name in self.rules:",
                  "            result = self.execute_rule(rule_name)",
                  "            self.broadcast(result)",
                  "",
                  "# Simulation tick:",
                  "for each_step in range(steps):",
                  "    for node in grid:",
                  "        propagate_channels(node, neighbors)",
                  "        hiero_transition(node)",
                  "        apply_articulators(node, neighbors)",
                  "        update_stack(node)",
                  "        stabilize(node, neighbors)",
                ].map((line, i) => (
                  <div key={i} className={line === "" ? "h-2" : undefined}>
                    {line.startsWith("class") || line.startsWith("def") ? (
                      <span><span className="text-purple-400">{line.split(" ")[0]}</span>{" "}<span className="text-amber-300">{line.slice(line.indexOf(" ")+1)}</span></span>
                    ) : line.startsWith("#") ? (
                      <span className="text-muted-foreground">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 rounded bg-purple-950/20 border border-purple-500/20 text-xs font-mono text-purple-300">
                Deterministic: No randomness. Every transition traceable. Emergent behavior arises from multi-channel interaction + stack memory + articulation — not from chaos.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
