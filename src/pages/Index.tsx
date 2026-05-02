import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <VideoGrid searchQuery={searchQuery} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
