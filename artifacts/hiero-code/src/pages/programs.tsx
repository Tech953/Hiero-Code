import { useListPrograms, useDeleteProgram } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Code2, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListProgramsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Programs() {
  const { data: programs, isLoading } = useListPrograms();
  const deleteProgram = useDeleteProgram();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Erase this program from the archives?")) {
      deleteProgram.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Program Erased", description: "The scroll has been destroyed." });
          queryClient.invalidateQueries({ queryKey: getListProgramsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
            <Code2 className="w-8 h-8 text-primary" /> Incantations
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">Sequences of symbolic logic and procedure execution.</p>
        </div>
        <Button className="gap-2 font-mono uppercase tracking-wider text-xs" variant="outline" disabled>
          <Plus className="w-4 h-4" /> Draft Scroll (Soon)
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-border bg-card">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : programs?.length === 0 ? (
        <Card className="border-dashed border-border/50 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl text-muted-foreground mb-4">📜</div>
            <h3 className="text-xl font-serif font-medium text-foreground">The scrolls are empty</h3>
            <p className="text-muted-foreground font-mono text-sm mt-2 max-w-md">
              No procedure sequences have been recorded. 
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs?.map(program => (
            <Card key={program.id} className="border-border bg-card hover:border-primary/40 transition-colors flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-serif text-primary flex items-center justify-between">
                  {program.title}
                  <span className="text-[10px] uppercase font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {program.runeIds.length} Nodes
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{program.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="w-full h-24 rounded bg-[#1a1b1e] border border-[#2c2d31] p-3 overflow-hidden font-mono text-[10px] text-[#c9d1d9] opacity-70">
                  {program.code}
                </div>
              </CardContent>
              <CardFooter className="pt-0 gap-2">
                <Link href={`/programs/${program.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full gap-2 text-xs font-mono uppercase tracking-wider">
                    Unfurl Scroll <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(program.id)} className="shrink-0 bg-destructive/10 text-destructive border-destructive/20">
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
