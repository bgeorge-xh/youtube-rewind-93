import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PortWiki from "./pages/PortWiki";
import PortNews from "./pages/PortNews";
import PortMail from "./pages/PortMail";
import PortMailLanding from "./pages/PortMailLanding";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wiki" element={<PortWiki />} />
            <Route path="/news" element={<PortNews />} />
            <Route path="/portmail" element={<PortMailLanding />} />
            <Route path="/mail" element={<PortMail />} />
            <Route path="/watch/:id" element={<VideoPlayer />} />
            <Route path="/channel/:id" element={<Channel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
