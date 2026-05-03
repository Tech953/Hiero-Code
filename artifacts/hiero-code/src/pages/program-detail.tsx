import { useGetProgram, useRunProgram } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Play, Activity, Clock, Shield, ArrowDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProgramDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: program, isLoading, error } = useGetProgram(id);
  const runProgram = useRunProgram();
  const { toast } = useToast();

  const [executing, setExecuting] = useState(false);
  const [trace, setTrace] = useState<any>(null);

  const handleExecute = () => {
    setExecuting(true);
    setTrace(null);
    runProgram.mutate({ id }, {
      onSuccess: (data) => {
        setTrace(data);
        setExecuting(false);
        toast({ title: "Sequence Complete", description: `Final Output: ${data.finalOutput}` });
      },
      onError: () => {
        setExecuting(false);
        toast({ title: "Execution Failed", description: "The sequence could not be completed.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-6 p-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error || !program) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6 text-destructive font-mono">Program not found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/programs" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Incantations
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3 break-words leading-tight">
              <span className="shrink-0">📜</span> <span className="min-w-0 break-words">{program.title}</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm break-words">{program.description}</p>
          </div>
          <Button onClick={handleExecute} disabled={executing} className="gap-2 font-mono uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
            {executing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {executing ? "Processing Sequence..." : "Run Sequence"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Hiero-Code Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] rounded bg-[#1a1b1e] border border-[#2c2d31] p-4 overflow-auto font-mono text-sm text-[#c9d1d9] whitespace-pre-wrap break-all">
              {program.code}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Execution Trace</CardTitle>
          </CardHeader>
          <CardContent>
            {!trace ? (
              <div className="h-[400px] flex items-center justify-center border border-dashed border-border/50 rounded text-muted-foreground font-mono text-sm bg-muted/20">
                {executing ? (
                  <span className="flex items-center gap-2 animate-pulse"><Activity className="w-4 h-4" /> Manifesting logic...</span>
                ) : "Run sequence to view execution trace"}
              </div>
            ) : (
              <div className="h-[400px] overflow-y-auto space-y-4 pr-2">
                <div className="flex gap-4 p-3 rounded bg-primary/10 border border-primary/20 mb-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Final Output</span>
                    <div className="text-xl font-mono text-primary">{trace.finalOutput}</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Duration</span>
                    <div className="text-sm font-mono flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" /> {trace.duration}ms</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Maat Score</span>
                    <div className="text-sm font-mono flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500" /> {(trace.maatScore * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className="space-y-0 relative">
                  {trace.steps.map((step: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary z-10 shadow-[0_0_10px_rgba(251,146,60,0.1)]">
                          {step.glyphSymbol}
                        </div>
                        {index < trace.steps.length - 1 && (
                          <div className="w-px h-full min-h-[30px] bg-border/50 my-1 relative">
                            <ArrowDown className="w-3 h-3 text-muted-foreground absolute top-1/2 -left-1.5 transform -translate-y-1/2" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 pb-6 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-serif text-sm font-medium">{step.runeName}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">Step {step.stepIndex}</span>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground mb-2">{step.description}</div>
                        <div className="flex items-center gap-3 text-xs font-mono bg-muted/30 p-2 rounded border border-border/50">
                          <span className="text-muted-foreground">In: <span className="text-foreground">{step.input}</span></span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Out: <span className="text-primary">{step.output}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
