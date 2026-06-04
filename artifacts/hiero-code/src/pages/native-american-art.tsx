import { useState } from "react";
import { useListNativeAmericanArt, useGetNativeAmericanArtFacets } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const GLYPH = "text-amber-400";

export default function NativeAmericanArt() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const pageSize = 20;

  const { data: facets } = useGetNativeAmericanArtFacets();
  const { data, isLoading } = useListNativeAmericanArt({
    category: category === "all" ? undefined : category,
    search: search || undefined,
    page,
    pageSize,
  });

  const submitSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
    setExpanded(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <Palette className="w-8 h-8 text-amber-400" /> Native American Art
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Evolution of Native American Art: Traditional to Contemporary — the 2016 exhibition catalog
          of the University of Central Oklahoma Art Collections (Max Chambers Library). Foreword essay,
          artist profiles, catalogued artworks, and the full bibliography.{" "}
          {facets?.total?.toLocaleString() ?? "—"} reference entries.
          Best-effort transcription of an OCR-scanned exhibition program.
        </p>
      </div>

      {facets && (
        <div className="flex flex-wrap gap-2">
          {facets.categories.map((c) => (
            <button
              key={c.value}
              onClick={() => reset(setCategory)(category === c.value ? "all" : c.value)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors ${
                category === c.value
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c.value} · {c.count}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search titles, summaries, and text..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            className="pl-9 bg-card font-mono text-sm border-border"
          />
        </div>
        <Button onClick={submitSearch} className="sm:w-auto">Search</Button>
        <Select value={category} onValueChange={reset(setCategory)}>
          <SelectTrigger className="w-full sm:w-[220px] bg-card border-border">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {facets?.categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.value} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded bg-card" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data?.entries.map((entry) => {
              const open = expanded === entry.id;
              return (
                <Card key={entry.id} className="border-border bg-card/50 hover:bg-card transition-colors">
                  <CardContent className="p-4">
                    <button
                      className="w-full text-left"
                      onClick={() => setExpanded(open ? null : entry.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className={`font-serif text-base ${GLYPH} break-words`}>
                            {entry.title}
                          </div>
                          {entry.summary && (
                            <div className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {entry.summary}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {entry.category}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </button>

                    {open && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        {entry.body ? (
                          <div className="text-sm text-foreground/90 leading-relaxed space-y-3 whitespace-pre-wrap">
                            {entry.body}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No text recorded in the source.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {data && data.entries.length === 0 && (
            <div className="py-12 text-center text-muted-foreground font-mono text-sm border border-dashed border-border/50 rounded-lg">
              No Native American Art entries match the current criteria.
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => { setPage((p) => Math.max(1, p - 1)); setExpanded(null); }}
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
                onClick={() => { setPage((p) => Math.min(data.totalPages, p + 1)); setExpanded(null); }}
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
