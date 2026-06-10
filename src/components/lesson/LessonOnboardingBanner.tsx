import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readString, writeString, STORAGE_KEYS } from "@/lib/storage";

const ONBOARDING_KEY = STORAGE_KEYS.editorOnboarding;

const LessonOnboardingBanner = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const seen = readString(ONBOARDING_KEY);
    if (!seen) setShowOnboarding(true);
  }, []);

  const dismissOnboarding = () => {
    writeString(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  };

  return (
    <AnimatePresence>
      {showOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="border-b border-primary/20 bg-primary/5 px-4 py-3"
        >
          <div className="mx-auto flex max-w-screen-2xl items-center gap-3 sm:gap-4">
            <Info size={18} className="shrink-0 text-primary" />
            <div className="flex-1 text-xs text-muted-foreground">
              <div className="lg:hidden">
                Avance pelas mini-etapas da aula: uma ideia, uma ação e um teste por vez.
              </div>
              <div className="hidden flex-wrap gap-x-6 gap-y-1 lg:flex">
                <span>
                  <strong className="text-foreground">Esquerda:</strong> leia a teoria e o exercício
                </span>
                <span>
                  <strong className="text-foreground">Direita:</strong> escreva seu código
                </span>
                <span>
                  <strong className="text-foreground">Executar:</strong> testa sua resposta
                </span>
                <span>
                  <strong className="text-foreground">Dicas:</strong> aparecem se você travar
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissOnboarding}
              className="shrink-0 h-7 rounded-full text-xs"
            >
              Entendi
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LessonOnboardingBanner;
