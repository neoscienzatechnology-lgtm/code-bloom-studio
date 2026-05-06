import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar.tsx";

const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const CoursesPage = lazy(() => import("./pages/CoursesPage.tsx"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage.tsx"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage.tsx"));
const EditorPage = lazy(() => import("./pages/EditorPage.tsx"));
const CheckpointPage = lazy(() => import("./pages/CheckpointPage.tsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.tsx"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage.tsx"));
const DailyReviewPage = lazy(() => import("./pages/DailyReviewPage.tsx"));

const queryClient = new QueryClient();

const PageWithNav = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm font-bold text-muted-foreground">
    Carregando trilha...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<SignUpPage />} />
              <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/cursos" element={<PageWithNav><CoursesPage /></PageWithNav>} />
              <Route path="/trilha" element={<PageWithNav><RoadmapPage /></PageWithNav>} />
              <Route path="/revisao" element={<PageWithNav><DailyReviewPage /></PageWithNav>} />
              <Route path="/cursos/:courseId" element={<PageWithNav><CourseDetailPage /></PageWithNav>} />
              <Route path="/editor/:courseId/:lessonId" element={<PageWithNav><EditorPage /></PageWithNav>} />
              <Route path="/checkpoint/:courseId/:lessonId" element={<PageWithNav><CheckpointPage /></PageWithNav>} />
              <Route path="/projetos" element={<PageWithNav><ProjectsPage /></PageWithNav>} />
              <Route path="/projeto/:projectId" element={<PageWithNav><ProjectPage /></PageWithNav>} />
              <Route path="/dashboard" element={<PageWithNav><DashboardPage /></PageWithNav>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
