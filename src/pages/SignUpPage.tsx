import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { readJson, STORAGE_KEYS } from "@/lib/storage";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import LiveBackdrop from "@/components/LiveBackdrop";
import { getAuthRedirect } from "@/utils/authRedirect";
import { reportAuthError } from "@/utils/authErrors";

const SignUpPage = () => {
  const { user, signUp, signInWithGoogle, loading } = useAuth();
  const location = useLocation();
  const redirectTo = getAuthRedirect(location, "/onboarding");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  // Quem fez a aula de demonstração já tem progresso local — dizer isso aqui
  // é o melhor argumento para completar o cadastro. #revisao-2.2
  const trialProgress = useMemo(
    () => readJson<{ completedLessons?: string[] }>(STORAGE_KEYS.progress, {})?.completedLessons?.length ?? 0,
    [],
  );

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const resend = async () => {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      toast.error(reportAuthError(error, "signup-resend"));
      return;
    }
    setResendIn(60);
    toast.success("Enviamos o link de novo. Confira a caixa de entrada e o spam.");
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signUp(email, password, name);
    setSubmitting(false);
    if (error) {
      toast.error(reportAuthError(error, "signup"));
    } else {
      setSent(true);
      setResendIn(60);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    const { error } = await signInWithGoogle(redirectTo);
    setGoogleSubmitting(false);

    if (error) {
      toast.error(reportAuthError(error, "signup-google"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LiveBackdrop posterClass="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ct-surface w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 [&>span]:hidden">
            <span className="text-2xl">🚀</span>
            <BrandLogo className="h-14 max-w-[220px]" />
          </Link>
          <h1 className="text-2xl font-black">{sent ? "Confirme seu e-mail" : "Criar conta grátis"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sent ? "Falta um passo para salvar seu progresso." : "Comece sua aventura no mundo da programação!"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Enviamos um link de confirmação para{" "}
              <strong className="text-foreground">{email}</strong>. Abra a mensagem para ativar sua conta —
              confira também o spam.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-full font-bold"
              disabled={resendIn > 0}
              onClick={resend}
            >
              {resendIn > 0 ? `Reenviar em ${resendIn}s` : "Reenviar e-mail"}
            </Button>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-xs font-bold text-muted-foreground underline-offset-4 hover:underline"
            >
              Usar outro e-mail
            </button>
          </div>
        ) : (
        <>
        {trialProgress > 0 && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-left">
            <PartyPopper size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Sua aula já está salva neste aparelho.</strong> Crie a conta
              para guardar o progresso e continuar de onde parou em qualquer celular.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="mb-1.5 block text-sm font-bold">Nome</label>
            <Input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="bg-secondary/50"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-bold">Email</label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-secondary/50"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-bold">Senha</label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="bg-secondary/50"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-[#4DE84A] to-[#1C8F2A] font-extrabold shadow-lg shadow-primary/25"
          >
            {submitting ? "Criando conta..." : "Começar grátis"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">ou</span></div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full font-bold"
          disabled={googleSubmitting}
          onClick={handleGoogleSignIn}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {googleSubmitting ? "Abrindo Google..." : "Cadastrar com Google"}
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-bold text-primary hover:underline"
          >
            Entrar
          </Link>
        </p>
        </>
        )}
      </motion.div>
    </div>
  );
};

export default SignUpPage;
