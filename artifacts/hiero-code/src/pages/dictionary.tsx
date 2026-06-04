import { useState } from "react";
import { useListDictionary, useGetDictionaryCategories } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Dictionary() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const { data: categories } = useGetDictionaryCategories({ language: "inupiat" });
  const { data, isLoading } = useListDictionary({
    language: "inupiat",
    category: category === "all" ? undefined : category,
    search: search || undefined,
    page,
    pageSize,
  });

  const submitSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <Languages className="w-8 h-8 text-cyan-400" /> Iñupiaq Dictionary
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Arctic Indigenous lexicon — {data?.total?.toLocaleString() ?? "—"} entries across {categories?.length ?? "—"} semantic categories. Best-effort transcription from the source compilation.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search headword or English gloss..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            className="pl-9 bg-card font-mono text-sm border-border"
          />
        </div>
        <Button onClick={submitSearch} className="sm:w-auto">Search</Button>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[260px] bg-card border-border">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.category} value={c.category}>
                {c.category} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded bg-card" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data?.entries.map((entry) => (
              <Card key={entry.id} className="border-border bg-card/50 hover:bg-card transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-serif text-base text-cyan-400 break-words">{entry.headword}</div>
                      <div className="text-sm text-foreground mt-0.5 break-words">{entry.gloss}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {entry.dialects?.map((d) => (
                        <span key={d} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mt-2 pt-2 border-t border-border/50">
                    {entry.category}
                    {entry.subcategory ? ` · ${entry.subcategory}` : ""}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data && data.entries.length === 0 && (
            <div className="py-12 text-center text-muted-foreground font-mono text-sm border border-dashed border-border/50 rounded-lg">
              No entries found matching the current criteria.
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <span className="font-mono text-xs text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
