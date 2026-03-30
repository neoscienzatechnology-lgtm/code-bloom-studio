import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Gamepad2, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const stats = [
  { label: "Alunos ativos", value: 52000, suffix: "+", icon: Users },
  { label: "Exercícios", value: 3200, suffix: "+", icon: Code2 },
  { label: "Cursos", value: 45, suffix: "", icon: Gamepad2 },
  { label: "Badges para coletar", value: 120, suffix: "+", icon: Trophy },
];

const steps = [
  { emoji: "🎯", title: "Escolha sua trilha", desc: "Python, JavaScript, React e muito mais. Comece pelo seu interesse." },
  { emoji: "💻", title: "Pratique codando", desc: "Editor interativo com feedback instantâneo. Aprenda fazendo." },
  { emoji: "🏆", title: "Suba de nível", desc: "Ganhe XP, colete badges e desbloqueie conquistas épicas." },
];

const testimonials = [
  { name: "Ana Silva", badge: "Nível 28", avatar: "👩‍💻", text: "CodeQuest me fez aprender Python em 3 meses, jogando!" },
  { name: "Carlos Dev", badge: "Nível 25", avatar: "👨‍💻", text: "Nunca imaginei que programar podia ser tão divertido. Viciei nos streaks!" },
  { name: "Maria Code", badge: "Nível 24", avatar: "👩‍🎓", text: "Os badges me motivam demais. Já completei 5 cursos!" },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
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
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const typingLines = [
  'def hello():',
  '    print("Olá, Mundo!")',
  '',
  'hello() # 🚀 +10 XP!',
];

const HeroCodeAnimation = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => (prev < typingLines.length ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-border/50 bg-secondary/50 p-5 font-mono text-sm backdrop-blur-sm">
      <div className="mb-3 flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-destructive/70" />
        <div className="h-3 w-3 rounded-full bg-quest-yellow/70" />
        <div className="h-3 w-3 rounded-full bg-accent/70" />
      </div>
      {typingLines.slice(0, visibleLines).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="leading-7"
        >
          <span className="text-muted-foreground mr-3 select-none">{i + 1}</span>
          {line.includes("def") && <><span className="text-quest-pink">def</span> <span className="text-quest-blue">hello</span><span className="text-foreground">():</span></>}
          {line.includes("print") && <><span className="text-foreground">    </span><span className="text-quest-blue">print</span><span className="text-foreground">(</span><span className="text-accent">"Olá, Mundo!"</span><span className="text-foreground">)</span></>}
          {line.includes("hello()") && <><span className="text-quest-blue">hello</span><span className="text-foreground">() </span><span className="text-muted-foreground"># 🚀 +10 XP!</span></>}
          {line === '' && <span>&nbsp;</span>}
        </motion.div>
      ))}
      {visibleLines < typingLines.length && (
        <span className="inline-block h-5 w-2 animate-blink border-r-2 border-accent" />
      )}
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-quest-pink/10 blur-[100px]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">
              <span>🎮</span> Aprenda jogando
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Aprenda a{" "}
              <span className="text-gradient">programar</span>
              <br />
              como se fosse um{" "}
              <span className="text-accent">jogo</span> 🚀
            </h1>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground">
              Ganhe XP, colete badges, suba de nível e desbloqueie conquistas
              enquanto domina Python, JavaScript, React e muito mais.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-quest-pink px-8 text-base font-extrabold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                <Link to="/cursos">
                  Começar Grátis <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-border/50 px-8 text-base font-bold">
                <Link to="/editor">Experimentar Editor</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="animate-float"
          >
            <HeroCodeAnimation />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/30 bg-secondary/30 px-4 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon className="mx-auto mb-2 text-primary" size={24} />
              <div className="text-2xl font-black sm:text-3xl">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-3xl font-black sm:text-4xl"
          >
            Como funciona? <span className="text-primary">É simples!</span>
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="card-hover rounded-2xl border border-border/30 bg-card p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {step.emoji}
                </div>
                <div className="mb-1 text-sm font-bold text-primary">Passo {i + 1}</div>
                <h3 className="mb-2 text-xl font-extrabold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-3xl font-black sm:text-4xl"
          >
            O que nossos <span className="text-accent">alunos</span> dizem
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card-hover rounded-2xl border border-border/30 bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-quest-pink text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs font-bold text-primary">{t.badge}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-quest-pink/10 p-10 text-center sm:p-16"
        >
          <div className="mb-4 text-5xl">🎮</div>
          <h2 className="mb-4 text-3xl font-black sm:text-4xl">
            Pronto para a <span className="text-gradient">aventura</span>?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Junte-se a mais de 52.000 alunos e comece sua jornada de programação hoje. É grátis!
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-quest-pink px-10 text-base font-extrabold shadow-lg shadow-primary/25 animate-pulse-glow">
            <Link to="/cursos">
              Começar Agora <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <span className="font-black">Code<span className="text-primary">Quest</span></span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 CodeQuest. Aprenda programação jogando.</p>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" className="text-sm hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-sm hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="text-sm hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
