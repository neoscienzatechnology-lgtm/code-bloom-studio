import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { readString, writeString, STORAGE_KEYS } from "@/lib/storage";

const CONFIDENCE_PREFIX = STORAGE_KEYS.confidencePrefix;
const EXPLAIN_PREFIX = STORAGE_KEYS.selfExplainPrefix;

const confidenceLabels = ["Nunca vi isso", "Inseguro", "Mais ou menos", "Confiante", "Posso ensinar"];

export const ConfidenceCheck = ({ lessonId }: { lessonId: string }) => {
  const storageKey = `${CONFIDENCE_PREFIX}${lessonId}`;
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const saved = readString(storageKey);
    setValue(saved ? Number(saved) : null);
  }, [storageKey]);

  const pick = (n: number) => {
    setValue(n);
    writeString(storageKey, String(n));
  };

  return (
    <div className="mb-4 rounded-xl border border-border bg-background/70 p-3">
      <div className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
        Antes de começar: quanto você já domina este tema?
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Nível de confiança de 1 a 5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => pick(n)}
            aria-pressed={value === n}
            aria-label={`${n} - ${confidenceLabels[n - 1]}`}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black transition-colors ${
              value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {value !== null && (
        <p className="mt-2 text-xs font-bold text-muted-foreground">
          Você marcou {value}/5 — {confidenceLabels[value - 1]}. Vamos firmar esse tema juntos.
        </p>
      )}
    </div>
  );
};

export const SelfExplain = ({ lessonId }: { lessonId: string }) => {
  const storageKey = `${EXPLAIN_PREFIX}${lessonId}`;
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(readString(storageKey) ?? "");
    setSaved(false);
  }, [storageKey]);

  const save = () => {
    writeString(storageKey, text.trim());
    setSaved(true);
  };

  return (
    <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
      <label htmlFor="self-explain" className="mb-1 block text-sm font-black text-foreground">
        Em 1 frase: por que a sua solução funcionou?
      </label>
      <p className="mb-2 text-xs text-muted-foreground">
        Explicar com as suas palavras fixa melhor do que só acertar. (opcional)
      </p>
      <textarea
        id="self-explain"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setSaved(false);
        }}
        rows={2}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        placeholder="Ex: usei aspas para o computador entender que era um texto..."
      />
      <button
        type="button"
        onClick={save}
        disabled={!text.trim()}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {saved ? (
          <>
            <Check size={13} /> Salvo
          </>
        ) : (
          "Salvar reflexão"
        )}
      </button>
    </div>
  );
};
