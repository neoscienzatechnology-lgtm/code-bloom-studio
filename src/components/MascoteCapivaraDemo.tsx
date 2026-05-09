import { useState } from "react";
import { Button } from "@/components/ui/button";
import MascoteCapivara, { type MascoteCapivaraState } from "@/components/MascoteCapivara";

const demoStates: Array<{ state: MascoteCapivaraState; label: string }> = [
  { state: "idle", label: "Parado" },
  { state: "success", label: "Acerto" },
  { state: "error", label: "Erro" },
  { state: "thinking", label: "Pensando" },
  { state: "celebrate", label: "Conquista" },
  { state: "loading", label: "Carregando" },
];

const MascoteCapivaraDemo = () => {
  const [currentState, setCurrentState] = useState<MascoteCapivaraState>("idle");

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="mimo-section-title mb-2">Mascote</p>
        <h1 className="text-3xl font-black text-foreground sm:text-4xl">CapyCoder animado</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Um componente reutilizável para feedback, carregamento, celebração e estados de apoio durante a
          jornada de aprendizagem.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {demoStates.map((item) => (
            <Button
              key={item.state}
              type="button"
              variant={currentState === item.state ? "default" : "outline"}
              onClick={() => setCurrentState(item.state)}
              className="rounded-full text-xs font-bold"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <MascoteCapivara state={currentState} />
    </section>
  );
};

export default MascoteCapivaraDemo;
