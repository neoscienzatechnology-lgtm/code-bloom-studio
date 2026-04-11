import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SignUpPage = () => {
  const { user, signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signUp(email, password, name);
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao cadastrar: " + error.message);
    } else {
      toast.success("Conta criada! Verifique seu email para confirmar.");
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
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-black">Code<span className="text-primary">Quest</span></span>
          </Link>
          <h1 className="text-2xl font-black">Criar conta grátis</h1>
          <p className="text-sm text-muted-foreground mt-1">Comece sua aventura no mundo da programação!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold">Nome</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="bg-secondary/50"
            />
          </div>
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
          <div>
            <label className="mb-1.5 block text-sm font-bold">Senha</label>
            <Input
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
            className="w-full rounded-full bg-gradient-to-r from-primary to-quest-pink font-extrabold shadow-lg shadow-primary/25"
          >
            {submitting ? "Criando conta..." : "Começar Grátis 🎮"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
