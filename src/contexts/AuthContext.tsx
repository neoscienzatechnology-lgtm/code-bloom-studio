import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearOAuthRedirect, storeOAuthRedirect } from "@/utils/oauthRedirect";
import { identifyUser, resetAnalyticsUser, trackOnce } from "@/lib/analytics";
import { resetLocalProgress } from "@/hooks/useProgress";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (redirectTo: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Confirmar o e-mail é o degrau invisível do funil: o cadastro é enviado aqui
// e a conta só nasce quando o link é aberto — possivelmente noutro aparelho,
// horas depois. Sem este evento não dá para saber se a perda está no formulário
// ou na caixa de entrada. Só o id da conta sai daqui (nunca o e-mail).
function trackAccountActivation(user: User): void {
  const confirmedAt = user.email_confirmed_at ?? user.confirmed_at;
  if (!confirmedAt) return;
  const createdAt = Date.parse(user.created_at ?? "");
  const minutesToConfirm = Number.isNaN(createdAt)
    ? null
    : Math.max(0, Math.round((Date.parse(confirmedAt) - createdAt) / 60000));

  trackOnce(`email_confirmed:${user.id}`, "email_confirmed", {
    provider: user.app_metadata?.provider ?? "email",
    minutesToConfirm,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      // Telemetria: identifica só pelo id da conta (sem e-mail/nome)
      if (session?.user) {
        identifyUser(session.user.id);
        trackAccountActivation(session.user);
      } else {
        resetAnalyticsUser();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) trackAccountActivation(session.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signInWithGoogle = async (redirectTo: string) => {
    storeOAuthRedirect(redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      clearOAuthRedirect();
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Evita que o progresso/estudo de uma conta vaze para a próxima no mesmo
    // aparelho (o merge na nuvem partiria do estado local antigo). #checkup-1
    resetLocalProgress();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
