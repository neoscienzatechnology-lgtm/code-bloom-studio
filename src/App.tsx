import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Navbar from "./components/Navbar.tsx";
import CoursesPage from "./pages/CoursesPage.tsx";
import EditorPage from "./pages/EditorPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";

const queryClient = new QueryClient();

const PageWithNav = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cursos" element={<PageWithNav><CoursesPage /></PageWithNav>} />
          <Route path="/editor" element={<PageWithNav><EditorPage /></PageWithNav>} />
          <Route path="/dashboard" element={<PageWithNav><DashboardPage /></PageWithNav>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
