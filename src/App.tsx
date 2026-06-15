import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { initAds } from "@/lib/ads";
import { initAnalytics, trackPageview } from "@/lib/analytics";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthReturnHandler from "@/components/AuthReturnHandler";
import ScrollToTop from "@/components/ScrollToTop";
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
const PlaygroundPage = lazy(() => import("./pages/PlaygroundPage.tsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage.tsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.tsx"));
const AccountDeletionPage = lazy(() => import("./pages/AccountDeletionPage.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const PageWithNav = ({ children }: { children: ReactNode }) => (
  <>
    <a
      href="#conteudo"
      className="sr-only rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
    >
      Pular para o conteúdo
    </a>
    <Navbar />
    <div id="conteudo" tabIndex={-1} className="outline-none">
      {children}
    </div>
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
  <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="mb-3 h-8 w-48 rounded-lg bg-muted" />
      <div className="mb-8 h-4 w-72 max-w-full rounded bg-muted/70" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 h-24 w-full rounded-xl bg-muted" />
            <div className="mb-2 h-4 w-3/4 rounded bg-muted/80" />
            <div className="h-3 w-1/2 rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  </div>
);

const PageviewTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);
  return null;
};

const App = () => {
  // AdMob (no-op na web) e telemetria (no-op sem VITE_POSTHOG_KEY)
  useEffect(() => {
    void initAds();
    void initAnalytics();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageviewTracker />
        <AuthProvider>
          <AuthReturnHandler />
          <ErrorBoundary>
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
              <Route path="/playground" element={<ProtectedPageWithNav><PlaygroundPage /></ProtectedPageWithNav>} />
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
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
