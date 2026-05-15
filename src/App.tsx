import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

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
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.tsx"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage.tsx"));
const DailyReviewPage = lazy(() => import("./pages/DailyReviewPage.tsx"));
const WeakConceptsPage = lazy(() => import("./pages/WeakConceptsPage.tsx"));
const ReferencePage = lazy(() => import("./pages/ReferencePage.tsx"));
const MascoteDemoPage = lazy(() => import("./pages/MascoteDemoPage.tsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage.tsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.tsx"));
const AccountDeletionPage = lazy(() => import("./pages/AccountDeletionPage.tsx"));

const queryClient = new QueryClient();

const PageWithNav = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

const ProtectedPageWithNav = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <PageWithNav>{children}</PageWithNav>
  </ProtectedRoute>
);

const ProtectedPage = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
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
              <Route path="/onboarding" element={<ProtectedPage><OnboardingPage /></ProtectedPage>} />
              <Route path="/cursos" element={<ProtectedPageWithNav><CoursesPage /></ProtectedPageWithNav>} />
              <Route path="/trilha" element={<ProtectedPageWithNav><RoadmapPage /></ProtectedPageWithNav>} />
              <Route path="/revisao" element={<ProtectedPageWithNav><DailyReviewPage /></ProtectedPageWithNav>} />
              <Route path="/pontos-fracos" element={<ProtectedPageWithNav><WeakConceptsPage /></ProtectedPageWithNav>} />
              <Route path="/referencia" element={<ProtectedPageWithNav><ReferencePage /></ProtectedPageWithNav>} />
              <Route path="/mascote" element={<ProtectedPageWithNav><MascoteDemoPage /></ProtectedPageWithNav>} />
              <Route path="/privacidade" element={<PageWithNav><PrivacyPolicyPage /></PageWithNav>} />
              <Route path="/termos" element={<PageWithNav><TermsPage /></PageWithNav>} />
              <Route path="/excluir-conta" element={<PageWithNav><AccountDeletionPage /></PageWithNav>} />
              <Route path="/cursos/:courseId" element={<ProtectedPageWithNav><CourseDetailPage /></ProtectedPageWithNav>} />
              <Route path="/editor/:courseId/:lessonId" element={<ProtectedPageWithNav><EditorPage /></ProtectedPageWithNav>} />
              <Route path="/checkpoint/:courseId/:lessonId" element={<ProtectedPageWithNav><CheckpointPage /></ProtectedPageWithNav>} />
              <Route path="/projetos" element={<ProtectedPageWithNav><ProjectsPage /></ProtectedPageWithNav>} />
              <Route path="/projeto/:projectId" element={<ProtectedPageWithNav><ProjectPage /></ProtectedPageWithNav>} />
              <Route path="/dashboard" element={<ProtectedPageWithNav><DashboardPage /></ProtectedPageWithNav>} />
              <Route path="/perfil" element={<ProtectedPageWithNav><ProfilePage /></ProtectedPageWithNav>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
