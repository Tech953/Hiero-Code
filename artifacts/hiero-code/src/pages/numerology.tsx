import { useGetEgyptianNumerology, useGetSumerianNumerology, useConvertNumber } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowRight, ArrowRightLeft, Calculator, Infinity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Numerology() {
  const { data: egyptian, isLoading: loadingEg } = useGetEgyptianNumerology();
  const { data: sumerian, isLoading: loadingSu } = useGetSumerianNumerology();
  const convertNumber = useConvertNumber();

  const [convVal, setConvVal] = useState("10");
  const [fromSys, setFromSys] = useState("decimal" as any);
  const [toSys, setToSys] = useState("egyptian" as any);
  const [convResult, setConvResult] = useState<any>(null);

  const handleConvert = () => {
    const val = parseFloat(convVal);
    if (isNaN(val)) return;

    convertNumber.mutate({ 
      data: { value: val, fromSystem: fromSys, toSystem: toSys }
    }, {
      onSuccess: (data) => setConvResult(data)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
          <Infinity className="w-8 h-8 text-primary" /> Numerology References
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Ancient base systems driving the symbolic compute engine.</p>
      </div>

      <Card className="border-primary/20 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2"><Calculator className="w-4 h-4" /> Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Input 
              type="number" 
              value={convVal} 
              onChange={(e) => setConvVal(e.target.value)} 
              className="font-mono bg-background"
            />
            <Select value={fromSys} onValueChange={setFromSys}>
              <SelectTrigger className="w-[180px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="egyptian">Egyptian</SelectItem>
                <SelectItem value="sumerian">Sumerian</SelectItem>
                <SelectItem value="mayan">Mayan</SelectItem>
              </SelectContent>
            </Select>
            <ArrowRightLeft className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <Select value={toSys} onValueChange={setToSys}>
              <SelectTrigger className="w-[180px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="egyptian">Egyptian</SelectItem>
                <SelectItem value="sumerian">Sumerian</SelectItem>
                <SelectItem value="mayan">Mayan</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleConvert} disabled={convertNumber.isPending} className="w-full md:w-auto">
              Convert
            </Button>
          </div>
          
          {convResult && (
            <div className="mt-6 p-4 rounded bg-background border border-border flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-muted-foreground">Result</span>
                <span className="text-2xl text-primary drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]">
                  {convResult.result}
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground border-t border-border/50 pt-2">
                Explanation: {convResult.explanation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="egyptian" className="w-full">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="egyptian" className="font-mono uppercase tracking-wider text-xs">Egyptian (Base-10)</TabsTrigger>
          <TabsTrigger value="sumerian" className="font-mono uppercase tracking-wider text-xs">Sumerian (Base-60)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="egyptian" className="mt-6">
          {loadingEg ? <Skeleton className="h-96 w-full" /> : egyptian && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-amber-500">{egyptian.name}</CardTitle>
                <CardDescription className="font-mono">{egyptian.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {egyptian.symbols.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center p-4 rounded bg-background border border-border/50 hover:border-amber-500/50 transition-colors text-center">
                      <span className="text-4xl text-amber-500 mb-2">{sym.symbol}</span>
                      <span className="font-mono text-sm text-foreground">{sym.value.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{sym.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sumerian" className="mt-6">
          {loadingSu ? <Skeleton className="h-96 w-full" /> : sumerian && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-blue-500">{sumerian.name}</CardTitle>
                <CardDescription className="font-mono">{sumerian.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sumerian.symbols.map((sym, i) => (
                    <div key={i} className="flex flex-col items-center p-4 rounded bg-background border border-border/50 hover:border-blue-500/50 transition-colors text-center">
                      <span className="text-4xl text-blue-500 mb-2">{sym.symbol}</span>
                      <span className="font-mono text-sm text-foreground">{sym.value}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{sym.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
