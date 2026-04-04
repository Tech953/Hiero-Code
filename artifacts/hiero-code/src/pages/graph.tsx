import { useGetRuneGraph } from "@workspace/api-client-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Maximize2, Network } from "lucide-react";

export default function Graph() {
  const { data: graphData, isLoading, error } = useGetRuneGraph();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  useEffect(() => {
    if (!graphData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Very simple layout and drawing for now
    const nodes = graphData.nodes.map((node, i) => {
      // Circle layout
      const angle = (i / graphData.nodes.length) * 2 * Math.PI;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      return {
        ...node,
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
      };
    });

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(251, 146, 60, 0.15)"; // primary color faint
      
      graphData.edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          // Curve slightly
          const cx = (from.x + to.x) / 2 + (to.y - from.y) * 0.2;
          const cy = (from.y + to.y) / 2 + (from.x - to.x) * 0.2;
          ctx.quadraticCurveTo(cx, cy, to.x, to.y);
          ctx.stroke();

          // Draw small arrow indicator or pulse along the line?
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode?.id === node.id;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 25 : 20, 0, 2 * Math.PI);
        ctx.fillStyle = node.system === "egyptian" ? "rgba(245, 158, 11, 0.1)" : 
                       node.system === "sumerian" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)";
        ctx.fill();
        ctx.strokeStyle = node.system === "egyptian" ? "rgba(245, 158, 11, 0.5)" : 
                         node.system === "sumerian" ? "rgba(59, 130, 246, 0.5)" : "rgba(16, 185, 129, 0.5)";
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Text (Glyph)
        ctx.fillStyle = node.system === "egyptian" ? "#f59e0b" : 
                       node.system === "sumerian" ? "#3b82f6" : "#10b981";
        ctx.font = `${isHovered ? 24 : 18}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.glyphSymbol, node.x, node.y + 2); // slight tweak for vertical alignment
      });

      // Hover tooltip info
      if (hoveredNode) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.strokeStyle = "#fb923c"; // primary
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(hoveredNode.x + 30, hoveredNode.y - 40, 150, 70);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.fillText(hoveredNode.name, hoveredNode.x + 40, hoveredNode.y - 20);
        
        ctx.fillStyle = "#fb923c";
        ctx.fillText(`ASE: ${(hoveredNode.aseVitality * 100).toFixed(0)}%`, hoveredNode.x + 40, hoveredNode.y);
        
        ctx.fillStyle = "#3b82f6";
        ctx.fillText(`Maat: ${(hoveredNode.maatBalance * 100).toFixed(0)}%`, hoveredNode.x + 40, hoveredNode.y + 15);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hovered = nodes.find(n => {
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 25; // radius
      });

      setHoveredNode(hovered || null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [graphData, hoveredNode]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="w-full h-[600px] rounded-lg" />
      </div>
    );
  }

  if (error || !graphData) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-destructive font-mono">Failed to materialize the resonance graph.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <Network className="w-8 h-8 text-primary" /> Resonance Graph
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Visualizing the flow of symbolic logic between inscribed nodes.</p>
      </div>

      <Card className="border-border bg-card flex-1 min-h-[600px] flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Egyptian
            <span className="w-2 h-2 rounded-full bg-blue-500 ml-2"></span> Sumerian
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2"></span> Mayan
          </div>
          <button className="p-2 rounded bg-background/80 backdrop-blur border border-border text-muted-foreground hover:text-primary transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 w-full relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-crosshair"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(30,30,35,0.8) 0%, rgba(20,20,25,1) 100%)' 
            }}
          />
        </div>
      </Card>
    </div>
  );
}
