import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValid(true);
    } else {
      // Also check if user has an active session from the recovery link
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setValid(true);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem!");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Link inválido ou expirado.</p>
          <Link to="/esqueci-senha" className="text-primary font-bold hover:underline">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-quest-pink/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border/30 bg-card p-8"
      >
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-black">Code<span className="text-primary">Quest</span></span>
          </Link>
          <h1 className="text-2xl font-black">Nova senha</h1>
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Senha atualizada com sucesso! Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold">Nova senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-secondary/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold">Confirmar senha</label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-secondary/50"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-primary to-quest-pink font-extrabold shadow-lg shadow-primary/25"
            >
              {submitting ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
