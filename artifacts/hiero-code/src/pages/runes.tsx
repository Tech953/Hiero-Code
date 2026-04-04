import { useListRunes, useDeleteRune } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Trash2, Activity, Shield, Box, Globe, Zap, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListRunesQueryKey } from "@workspace/api-client-react";

export default function Runes() {
  const { data: runes, isLoading } = useListRunes();
  const deleteRune = useDeleteRune();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to shatter this rune?")) {
      deleteRune.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Rune Shattered", description: "The node has been removed from the sanctuary." });
          queryClient.invalidateQueries({ queryKey: getListRunesQueryKey() });
        }
      });
    }
  };

  const getSystemColor = (system: string) => {
    switch (system) {
      case "egyptian": return "text-amber-500 border-amber-500/20 bg-amber-500/10";
      case "sumerian": return "text-blue-500 border-blue-500/20 bg-blue-500/10";
      case "mayan": return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
      default: return "text-primary border-primary/20 bg-primary/10";
    }
  };

  const getScaleIcon = (scale: string) => {
    switch (scale) {
      case "macro": return <Globe className="w-3 h-3" />;
      case "micro": return <Box className="w-3 h-3" />;
      case "particle": return <Zap className="w-3 h-3" />;
      case "temporal": return <Activity className="w-3 h-3" />;
      default: return <Box className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
            <span className="text-primary text-4xl">𓏞</span> Runes
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">The inscribed nodes of the symbolic compute engine.</p>
        </div>
        <Link href="/runes/new">
          <Button className="gap-2 font-mono uppercase tracking-wider text-xs">
            <Plus className="w-4 h-4" /> Inscribe Rune
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="border-border bg-card">
              <CardHeader className="pb-2">
                <Skeleton className="h-16 w-16 rounded-md mb-2" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div><Skeleton className="h-4 w-full" /><Skeleton className="h-2 w-full mt-2" /></div>
                <div><Skeleton className="h-4 w-full" /><Skeleton className="h-2 w-full mt-2" /></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : runes?.length === 0 ? (
        <Card className="border-dashed border-border/50 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl text-muted-foreground mb-4">𓆣</div>
            <h3 className="text-xl font-serif font-medium text-foreground">The tablets are blank</h3>
            <p className="text-muted-foreground font-mono text-sm mt-2 max-w-md">
              No symbolic nodes have been inscribed in the sanctuary. Create your first rune to begin computation.
            </p>
            <Link href="/runes/new" className="mt-6">
              <Button variant="outline">Inscribe First Rune</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {runes?.map((rune, i) => (
            <Card key={rune.id} className="border-border bg-card hover:border-primary/40 transition-all duration-300 group overflow-hidden relative" style={{ animationDelay: `${i * 50}ms` }}>
              {/* Subtle background glow based on system */}
              <div className={`absolute -right-10 -top-10 w-40 h-40 blur-3xl opacity-10 rounded-full pointer-events-none transition-opacity group-hover:opacity-20 ${
                rune.system === 'egyptian' ? 'bg-amber-500' : rune.system === 'sumerian' ? 'bg-blue-500' : 'bg-emerald-500'
              }`} />
              
              <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-16 h-16 rounded-md bg-background border border-border flex items-center justify-center text-4xl text-primary shadow-inner">
                    {rune.glyphSymbol}
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest border flex items-center gap-1 ${getSystemColor(rune.system)}`}>
                    {rune.system}
                  </div>
                </div>
                <CardTitle className="text-xl font-serif mt-2">{rune.name}</CardTitle>
                <CardDescription className="font-mono text-xs flex items-center gap-1">
                  {getScaleIcon(rune.scale)} <span className="uppercase tracking-wider">{rune.scale} scale</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /> ASE Vitality</span>
                    <span className="text-amber-500">{(rune.aseVitality * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={rune.aseVitality * 100} className="h-1.5 bg-muted [&>div]:bg-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500" /> Maat Balance</span>
                    <span className="text-blue-500">{(rune.maatBalance * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={rune.maatBalance * 100} className="h-1.5 bg-muted [&>div]:bg-blue-500" />
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-muted-foreground border-t border-border/50">
                  <span>Resonance:</span>
                  <span className="text-foreground">{rune.sumerianResonance.toFixed(2)}</span>
                  <span className="mx-auto"></span>
                  <span>Conns:</span>
                  <span className="text-foreground">{rune.connections?.length || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 relative z-10 gap-2">
                <Link href={`/runes/${rune.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full gap-2 text-xs font-mono uppercase tracking-wider">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(rune.id)} className="shrink-0 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Need to mock Sparkles if not available
function Sparkles(props: any) {
  return <Activity {...props} />;
}
