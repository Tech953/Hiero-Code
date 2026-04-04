import { useListGlyphs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Search } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Glyphs() {
  const [systemFilter, setSystemFilter] = useState<any>("all");
  const [search, setSearch] = useState("");
  
  const { data: glyphs, isLoading } = useListGlyphs({ system: systemFilter === "all" ? undefined : systemFilter });

  const filteredGlyphs = glyphs?.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.meaning.toLowerCase().includes(search.toLowerCase())
  );

  const getSystemColor = (system: string) => {
    switch (system) {
      case "egyptian": return "text-amber-500";
      case "sumerian": return "text-blue-500";
      case "mayan": return "text-emerald-500";
      default: return "text-primary";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <Book className="w-8 h-8 text-primary" /> Glyph Library
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Reference catalog of supported symbolic notation.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search glyphs by name or meaning..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card font-mono text-sm border-border"
          />
        </div>
        <Select value={systemFilter} onValueChange={setSystemFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card border-border">
            <SelectValue placeholder="All Systems" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Systems</SelectItem>
            <SelectItem value="egyptian">Egyptian</SelectItem>
            <SelectItem value="sumerian">Sumerian</SelectItem>
            <SelectItem value="mayan">Mayan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <Skeleton key={i} className="h-32 rounded bg-card" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredGlyphs?.map(glyph => (
            <Card key={glyph.id} className="border-border bg-card/50 hover:bg-card transition-colors overflow-hidden group">
              <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className={`text-4xl mb-3 drop-shadow-md transition-transform group-hover:scale-110 ${getSystemColor(glyph.system)}`}>
                  {glyph.symbol}
                </div>
                <div className="font-serif text-sm font-medium leading-tight mb-1">{glyph.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest mt-auto pt-2 border-t border-border/50 w-full">
                  {glyph.system}
                </div>
                {glyph.numericValue > 0 && (
                  <div className="text-[10px] font-mono text-foreground mt-1">
                    Value: {glyph.numericValue}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredGlyphs?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground font-mono text-sm border border-dashed border-border/50 rounded-lg">
              No glyphs found matching the current criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
