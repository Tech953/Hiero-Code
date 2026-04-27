import { useGetRune, useExecuteRune } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Play, Activity, Clock, Shield, Box, Zap, Globe, Cpu } from "lucide-react";
import { useState } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { getGetRuneQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function RuneDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: rune, isLoading, error } = useGetRune(id, { query: { enabled: !!id } });
  const executeRune = useExecuteRune();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [executing, setExecuting] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);

  const handleExecute = () => {
    setExecuting(true);
    executeRune.mutate({ id, data: {} }, {
      onSuccess: (data) => {
        setResult(data);
        setExecuting(false);
        toast({ title: "Rune Executed", description: `Output: ${data.output}` });
        queryClient.invalidateQueries({ queryKey: getGetRuneQueryKey(id) });
      },
      onError: () => {
        setExecuting(false);
        toast({ title: "Execution Failed", description: "The ritual was interrupted.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !rune) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-destructive font-mono">This rune cannot be found or has been shattered.</p>
          <Link href="/runes" className="mt-4 inline-block">
            <Button variant="outline">Return to Archives</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getSystemColor = (system: string) => {
    switch (system) {
      case "egyptian": return "text-amber-500 border-amber-500/20 bg-amber-500/10";
      case "sumerian": return "text-blue-500 border-blue-500/20 bg-blue-500/10";
      case "mayan": return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
      default: return "text-primary border-primary/20 bg-primary/10";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/runes" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Runes
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center text-2xl text-primary shadow-inner shrink-0">
              {rune.glyphSymbol}
            </div>
            <span className="min-w-0 break-words leading-tight">{rune.name}</span>
          </h1>
          <Button onClick={handleExecute} disabled={executing} className="gap-2 font-mono uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
            {executing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {executing ? "Channeling..." : "Execute Ritual"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card relative overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-40 h-40 blur-3xl opacity-10 rounded-full pointer-events-none ${
              rune.system === 'egyptian' ? 'bg-amber-500' : rune.system === 'sumerian' ? 'bg-blue-500' : 'bg-emerald-500'
            }`} />
            <CardHeader>
              <CardTitle className="text-lg font-serif">Essence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">System</span>
                  <div className={`inline-flex px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest border ${getSystemColor(rune.system)}`}>
                    {rune.system}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">Scale</span>
                  <div className="inline-flex px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest border border-border bg-muted/50 text-foreground">
                    {rune.scale}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">Identifier</span>
                  <div className="font-mono text-xs text-foreground truncate" title={rune.glyph}>{rune.glyph}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">Executions</span>
                  <div className="font-mono text-xs text-foreground">{rune.executionCount}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-mono">
                    <span className="text-muted-foreground">ASE Vitality</span>
                    <span className="text-amber-500">{(rune.aseVitality * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rune.aseVitality * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-mono">
                    <span className="text-muted-foreground">Maat Balance</span>
                    <span className="text-blue-500">{(rune.maatBalance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rune.maatBalance * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/30">
                <Link href="/cosmology" className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-amber-400 transition-colors">
                  <span className="text-amber-500">𓂝</span> Cosmological Sources →
                </Link>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-top-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-serif text-primary flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Manifestation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-background border border-border">
                  <span className="text-xs font-mono text-muted-foreground">Output:</span>
                  <span className="font-mono text-lg text-primary">{result.output}</span>
                </div>
                {result.steps && result.steps.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">Trace:</span>
                    <div className="space-y-1">
                      {result.steps.map((step: string, i: number) => (
                        <div key={i} className="text-xs font-mono text-foreground/80 pl-2 border-l-2 border-primary/30 py-1">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border bg-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Procedure Inscription
              </CardTitle>
              <CardDescription className="font-mono text-xs">The symbolic logic executed when this rune is invoked.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="w-full h-full min-h-[300px] rounded-md bg-[#1a1b1e] border border-[#2c2d31] p-4 overflow-auto font-mono text-sm leading-relaxed text-[#c9d1d9] whitespace-pre-wrap break-all relative group">
                <div className="absolute top-2 right-2 text-[10px] text-muted-foreground/30 pointer-events-none font-sans uppercase tracking-widest">Read-Only</div>
                {rune.procedureCode}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
