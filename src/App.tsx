
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { initDatabase } from "./services/database";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

const App = () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Initialize database when app starts
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        console.log("Database initialized successfully");
        setDbInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        setDbError("Failed to initialize database. Using fallback JSON data.");
      }
    };
    
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              {dbError && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-600" role="alert">
                  <p>{dbError}</p>
                </div>
              )}
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
