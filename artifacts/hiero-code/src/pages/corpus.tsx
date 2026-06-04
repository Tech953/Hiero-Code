import { useState } from "react";
import { useListStelae, useGetStelaeFacets } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollText, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const AMBER = "text-amber-400";

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-xs">
      <span className="font-mono uppercase tracking-wider text-muted-foreground shrink-0 w-24">{label}</span>
      <span className="text-foreground/90 break-words">{value}</span>
    </div>
  );
}

export default function Corpus() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dynasty, setDynasty] = useState("all");
  const [objectType, setObjectType] = useState("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const pageSize = 20;

  const { data: facets } = useGetStelaeFacets();
  const { data, isLoading } = useListStelae({
    dynasty: dynasty === "all" ? undefined : dynasty,
    objectType: objectType === "all" ? undefined : objectType,
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
          <ScrollText className="w-8 h-8 text-amber-400" /> Stelae Corpus
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          British Museum Hieroglyphic Texts from Egyptian Stelae (T. G. H. James, 1961) —{" "}
          {facets?.total?.toLocaleString() ?? "—"} catalogued Old Kingdom objects across 42 plates.
          Best-effort transcription from the source compilation.
        </p>
      </div>

      {/* facet summary chips */}
      {facets && (
        <div className="flex flex-wrap gap-2">
          {facets.dynasties.slice(0, 6).map((d) => (
            <button
              key={d.value}
              onClick={() => reset(setDynasty)(dynasty === d.value ? "all" : d.value)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors ${
                dynasty === d.value
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {d.value} · {d.count}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search title, provenance, BM number, or full description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            className="pl-9 bg-card font-mono text-sm border-border"
          />
        </div>
        <Button onClick={submitSearch} className="sm:w-auto">Search</Button>
        <Select value={dynasty} onValueChange={reset(setDynasty)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card border-border">
            <SelectValue placeholder="All Dynasties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dynasties</SelectItem>
            {facets?.dynasties.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.value} ({d.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={objectType} onValueChange={reset(setObjectType)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card border-border">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {facets?.objectTypes.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.value} ({d.count})
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
                          <div className={`font-serif text-base ${AMBER} break-words`}>
                            {entry.title}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground font-mono">
                            <span>{entry.objectType}</span>
                            {entry.dynasty && <span>· {entry.dynasty}</span>}
                            {entry.material && <span>· {entry.material}</span>}
                            {entry.provenance && <span>· {entry.provenance}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {entry.bmNumber && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              BM {entry.bmNumber}
                            </span>
                          )}
                          {entry.plate && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              Pl. {entry.plate}
                            </span>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </button>

                    {open && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                        {entry.description && (
                          <p className="text-sm text-foreground/90 leading-relaxed">{entry.description}</p>
                        )}
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                          <Field label="Material" value={entry.material} />
                          <Field label="Provenance" value={entry.provenance} />
                          <Field label="Dimensions" value={entry.dimensions} />
                          <Field label="Date" value={entry.date} />
                          <Field label="Acquisition" value={entry.acquisition} />
                          <Field label="Preservation" value={entry.preservation} />
                          <Field label="Bibliography" value={entry.bibliography} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {data && data.entries.length === 0 && (
            <div className="py-12 text-center text-muted-foreground font-mono text-sm border border-dashed border-border/50 rounded-lg">
              No catalogue objects match the current criteria.
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
