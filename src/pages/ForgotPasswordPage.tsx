import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border/30 bg-card p-8"
      >
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 [&>span]:hidden">
            <span className="text-2xl">🚀</span>
            <BrandLogo className="h-14 max-w-[220px]" />
          </Link>
          <h1 className="text-2xl font-black">Recuperar senha</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sent ? "Verifique seu email!" : "Digite seu email para receber o link de recuperação"}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Enviamos um link de recuperação para <strong className="text-foreground">{email}</strong>. Verifique sua caixa de entrada e spam.
            </p>
            <Button
              variant="outline"
              className="rounded-full font-bold"
              onClick={() => setSent(false)}
            >
              Enviar novamente
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-secondary/50"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-[#4DE84A] to-[#1C8F2A] font-extrabold shadow-lg shadow-primary/25"
            >
              {submitting ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Voltar ao login
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
