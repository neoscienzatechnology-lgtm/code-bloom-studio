import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Gamepad2, Trophy, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MascoteCapivara from "@/components/MascoteCapivara";
import BrandLogo from "@/components/BrandLogo";

const stats = [
  { label: "Alunos ativos", value: 52000, suffix: "+", icon: Users },
  { label: "Exercícios", value: 3200, suffix: "+", icon: Code2 },
  { label: "Cursos", value: 13, suffix: "", icon: Gamepad2 },
  { label: "Badges", value: 120, suffix: "+", icon: Trophy },
];

const features = [
  {
    emoji: "🎯",
    title: "Aprenda fazendo",
    desc: "Escreva código real desde a primeira lição. Sem teoria interminável.",
  },
  {
    emoji: "⚡",
    title: "Feedback instantâneo",
    desc: "Saiba na hora se seu código está correto. Dicas quando precisar.",
  },
  {
    emoji: "🏆",
    title: "Ganhe XP e badges",
    desc: "Cada lição concluída te deixa mais perto do próximo nível.",
  },
];

const tracks = [
  { emoji: "🐍", name: "Python", level: "Iniciante", lessons: 14 },
  { emoji: "⚡", name: "JavaScript", level: "Intermediário", lessons: 14 },
  { emoji: "⚛️", name: "React", level: "Intermediário", lessons: 11 },
  { emoji: "🎨", name: "CSS", level: "Iniciante", lessons: 11 },
  { emoji: "🟢", name: "Node.js", level: "Intermediário", lessons: 12 },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

/* Mini code preview card – Mimo style */
const CodePreview = () => {
  const lines = [
    { indent: 0, parts: [{ t: "keyword", v: "def " }, { t: "fn", v: "saudacao" }, { t: "plain", v: "(nome):" }] },
    { indent: 1, parts: [{ t: "keyword", v: "return " }, { t: "string", v: 'f"Olá, {nome}!"' }] },
    { indent: 0, parts: [] },
    { indent: 0, parts: [{ t: "fn", v: "print" }, { t: "plain", v: "(" }, { t: "fn", v: "saudacao" }, { t: "plain", v: '("Mundo"))' }] },
  ];

  const colorMap: Record<string, string> = {
    keyword: "text-[#7ad7a7]",
    fn: "text-[#30c6bd]",
    string: "text-[#ff9f2f]",
    plain: "text-[#cdd6f4]",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
      {/* macOS-style top bar */}
      <div className="flex items-center gap-1.5 bg-[#1e1e2e] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-[#f38ba8]" />
        <div className="h-3 w-3 rounded-full bg-[#f9e2af]" />
        <div className="h-3 w-3 rounded-full bg-[#a6e3a1]" />
        <span className="ml-3 text-xs text-[#585b70] font-mono">main.py</span>
      </div>
      {/* Code */}
      <div className="bg-[#1e1e2e] px-5 pb-5 pt-2 font-mono text-sm">
        {lines.map((line, i) => (
          <div key={i} className="leading-7">
            <span className="mr-4 select-none text-[#45475a] text-xs">{i + 1}</span>
            {line.parts.map((p, j) => (
              <span key={j} className={colorMap[p.t]}>
                {line.indent > 0 && j === 0 ? "    " : ""}
                {p.v}
              </span>
            ))}
            {line.parts.length === 0 && <span>&nbsp;</span>}
          </div>
        ))}
      </div>
      {/* Output bar */}
      <div className="flex items-center gap-2 bg-[#181825] px-5 py-3 text-xs font-mono">
        <span className="rounded-full bg-[#a6e3a1]/20 px-2 py-0.5 text-[#a6e3a1] font-bold">▶ Saída</span>
        <span className="text-[#a6e3a1]">Olá, Mundo!</span>
        <span className="ml-auto flex items-center gap-1 text-[#a6e3a1]">
          <Check size={12} /> +10 XP
        </span>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-20 pt-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-bold text-primary">
              🎮 Aprenda programação de verdade
            </div>
            <h1 className="mb-5 text-4xl font-black leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
              Aprenda a{" "}
              <span className="text-gradient">programar</span>
              <br />
              do zero ao avançado
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Lições curtas, exercícios práticos e feedback instantâneo. Você escreve código real desde a primeira aula.
            </p>
            <div className="mb-8 max-w-md">
              <MascoteCapivara
                state="idle"
                message="Eu sou o CapyCoder. Vou te guiar com explicações curtinhas, aquecimentos e revisões quando você precisar."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary px-8 text-base font-extrabold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
              >
                <Link to="/onboarding">
                  Começar grátis <ArrowRight size={18} className="ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 px-8 text-base font-bold"
              >
                <Link to="/cursos">Ver cursos</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CodePreview />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon className="mx-auto mb-2 text-primary" size={22} />
              <div className="text-2xl font-black text-foreground sm:text-3xl">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRACKS ───────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mimo-section-title mb-2">Trilhas de aprendizado</p>
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">
              O que você quer aprender?
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <Link to="/cursos" className="block">
                  <div className="card-hover mimo-card flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                      {t.emoji}
                    </div>
                    <div>
                      <div className="font-extrabold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.level} · {t.lessons} lições</div>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="bg-card px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mimo-section-title mb-2">Como funciona</p>
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">
              Simples assim
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {f.emoji}
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                  Passo {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl rounded-3xl bg-primary px-10 py-14 text-center text-white shadow-xl shadow-primary/30"
        >
          <BrandLogo compact className="mx-auto mb-4 h-16 w-16 rounded-2xl" />
          <h2 className="mb-3 text-3xl font-black sm:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mb-8 text-base text-white/75">
            Junte-se a mais de 52.000 alunos. É grátis!
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-10 text-base font-extrabold text-primary hover:bg-white/90 transition-colors shadow-sm"
          >
            <Link to="/onboarding">
              Começar Agora <ArrowRight size={18} className="ml-1" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-10 max-w-[170px]" />
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CapyCode · Aprenda programação com uma trilha mais leve</p>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
