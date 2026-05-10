import { Link, useLocation } from "react-router-dom";
import { Bell, FolderKanban, Home, LogIn, LogOut, Menu, Target, User, X, Zap } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { to: "/dashboard", label: "Início", icon: Home },
  { to: "/cursos", label: "Trilhas", icon: Target },
  { to: "/editor/1/1-1", label: "Praticar", icon: Zap },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/perfil", label: "Perfil", icon: User },
];

const desktopLinks = [
  { to: "/dashboard", label: "Início" },
  { to: "/cursos", label: "Trilhas" },
  { to: "/revisao", label: "Praticar" },
  { to: "/projetos", label: "Projetos" },
  { to: "/perfil", label: "Perfil" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalXp } = useProgress();

  const isActive = (to: string, label: string) => {
    if (label === "Trilhas") return location.pathname.startsWith("/cursos");
    if (label === "Praticar") return location.pathname.startsWith("/editor") || location.pathname.startsWith("/revisao");
    if (label === "Projetos") return location.pathname.startsWith("/projeto");
    return location.pathname === to;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center">
            <BrandLogo className="h-12 max-w-[190px]" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {desktopLinks.map((link) => (
              <Link
                key={`${link.to}-${link.label}`}
                to={link.to}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  isActive(link.to, link.label)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold">
              <Zap size={15} className="text-accent" />
              <span>{totalXp.toLocaleString()} XP</span>
            </div>
            {user ? (
              <>
                <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <Bell size={18} />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-quest-orange" />
                </button>
                <button
                  onClick={signOut}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                  <LogIn size={16} /> Entrar
                </button>
              </Link>
            )}
          </div>

          <button className="rounded-lg p-2 text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50 md:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {desktopLinks.map((link) => (
                  <Link
                    key={`${link.to}-${link.label}`}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-bold ${
                      isActive(link.to, link.label) ? "bg-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <button
                    onClick={signOut}
                    className="mt-2 rounded-lg bg-secondary px-4 py-3 text-left text-sm font-bold text-muted-foreground"
                  >
                    Sair
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground"
                  >
                    <LogIn size={16} /> Entrar
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={`${link.to}-${link.label}`}
                to={link.to}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${
                  isActive(link.to, link.label) ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
