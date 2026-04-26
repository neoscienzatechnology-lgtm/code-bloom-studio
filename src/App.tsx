import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Navbar from "./components/Navbar.tsx";
import CoursesPage from "./pages/CoursesPage.tsx";
import RoadmapPage from "./pages/RoadmapPage.tsx";
import CourseDetailPage from "./pages/CourseDetailPage.tsx";
import EditorPage from "./pages/EditorPage.tsx";
import CheckpointPage from "./pages/CheckpointPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";

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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<SignUpPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/cursos" element={<PageWithNav><CoursesPage /></PageWithNav>} />
            <Route path="/trilha" element={<PageWithNav><RoadmapPage /></PageWithNav>} />
            <Route path="/cursos/:courseId" element={<PageWithNav><CourseDetailPage /></PageWithNav>} />
            <Route path="/editor/:courseId/:lessonId" element={<PageWithNav><EditorPage /></PageWithNav>} />
            <Route path="/checkpoint/:courseId/:lessonId" element={<PageWithNav><CheckpointPage /></PageWithNav>} />
            <Route path="/dashboard" element={<PageWithNav><ProtectedRoute><DashboardPage /></ProtectedRoute></PageWithNav>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
