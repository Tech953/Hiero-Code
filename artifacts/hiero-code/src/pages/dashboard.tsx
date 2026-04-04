import { useGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Code, Layers, Library, Sparkles, Scale, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useGetStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-destructive font-mono">Failed to load sanctuary statistics. The connection to the archives is severed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <span className="text-primary text-4xl">𓁹</span> Sanctuary Overview
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Monitor the vitality and balance of the symbolic compute engine.</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">Total Runes</CardTitle>
            <Library className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">{stats.totalRunes}</div>
            <p className="text-xs text-muted-foreground mt-1">Nodes inscribed</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">Active Programs</CardTitle>
            <Code className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">{stats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground mt-1">Procedures recorded</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">Avg ASE Vitality</CardTitle>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-amber-500">{(stats.avgAseVitality * 100).toFixed(1)}%</div>
            <Progress value={stats.avgAseVitality * 100} className="h-1 mt-2 bg-muted [&>div]:bg-amber-500" />
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">System Balance</CardTitle>
            <Scale className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-blue-500">{(stats.avgMaatBalance * 100).toFixed(1)}%</div>
            <Progress value={stats.avgMaatBalance * 100} className="h-1 mt-2 bg-muted [&>div]:bg-blue-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Systems Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">System Distribution</CardTitle>
            <CardDescription className="font-mono text-xs">Runes categorized by origin language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.runesBySystem).map(([system, count]) => {
                const total = stats.totalRunes;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                const systemIcons: Record<string, string> = {
                  egyptian: "𓂋",
                  sumerian: "𒀭",
                  mayan: "𖼀"
                };

                const systemColors: Record<string, string> = {
                  egyptian: "text-amber-500",
                  sumerian: "text-blue-500",
                  mayan: "text-emerald-500"
                };

                return (
                  <div key={system} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2 capitalize font-medium">
                        <span className={`text-xl ${systemColors[system] || "text-primary"}`}>{systemIcons[system] || "•"}</span>
                        {system}
                      </span>
                      <span className="font-mono text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2 bg-muted" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Recent Incantations</CardTitle>
            <CardDescription className="font-mono text-xs">Latest recorded activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-md bg-muted/30 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      {activity.type === 'execution' ? <Activity className="w-4 h-4 text-primary" /> : <History className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground font-mono text-sm border border-dashed rounded-md border-border/50">
                  No recent activity recorded in the archives.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
