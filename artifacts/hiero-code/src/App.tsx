import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Runes from "@/pages/runes";
import RuneDetail from "@/pages/rune-detail";
import RuneNew from "@/pages/rune-new";
import Graph from "@/pages/graph";
import Programs from "@/pages/programs";
import ProgramDetail from "@/pages/program-detail";
import Numerology from "@/pages/numerology";
import Glyphs from "@/pages/glyphs";
import Dictionary from "@/pages/dictionary";
import Corpus from "@/pages/corpus";
import Iconography from "@/pages/iconography";
import NorthwestArt from "@/pages/northwest-art";
import InuitSymbology from "@/pages/inuit-symbology";
import MayaGlyphs from "@/pages/maya-glyphs";
import NativeAmericanArt from "@/pages/native-american-art";
import PolarBear from "@/pages/polar-bear";
import TibetanSymbols from "@/pages/tibetan-symbols";
import Framework from "@/pages/framework";
import Emotions from "@/pages/emotions";
import Cosmology from "@/pages/cosmology";
import PyriNetwork from "@/pages/pyri-network";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/runes/new" component={RuneNew} />
        <Route path="/runes/:id" component={RuneDetail} />
        <Route path="/runes" component={Runes} />
        <Route path="/graph" component={Graph} />
        <Route path="/programs/:id" component={ProgramDetail} />
        <Route path="/programs" component={Programs} />
        <Route path="/numerology" component={Numerology} />
        <Route path="/glyphs" component={Glyphs} />
        <Route path="/dictionary" component={Dictionary} />
        <Route path="/corpus" component={Corpus} />
        <Route path="/iconography" component={Iconography} />
        <Route path="/northwest-art" component={NorthwestArt} />
        <Route path="/inuit-symbology" component={InuitSymbology} />
        <Route path="/maya-glyphs" component={MayaGlyphs} />
        <Route path="/native-american-art" component={NativeAmericanArt} />
        <Route path="/polar-bear" component={PolarBear} />
        <Route path="/tibetan-symbols" component={TibetanSymbols} />
        <Route path="/framework" component={Framework} />
        <Route path="/emotions" component={Emotions} />
        <Route path="/cosmology" component={Cosmology} />
        <Route path="/pyri-network" component={PyriNetwork} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
