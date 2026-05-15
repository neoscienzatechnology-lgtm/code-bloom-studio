import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, BookOpen, Clock, Code2, Filter, Lightbulb, Search, X } from "lucide-react";
import { courses } from "@/data/mockData";
import { buildReferenceIndex, filterReferenceEntries, getReferenceLanguages } from "@/utils/referenceIndex";
import { Button } from "@/components/ui/button";

const QUICK_SEARCHES = ["variável", "if", "flexbox", "JOIN", "props", "commit"];

const ReferencePage = () => {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Todos");
  const entries = useMemo(() => buildReferenceIndex(courses), []);
  const languages = useMemo(() => ["Todos", ...getReferenceLanguages(entries)], [entries]);
  const filteredEntries = useMemo(
    () => filterReferenceEntries(entries, query, selectedLanguage),
    [entries, query, selectedLanguage],
  );

  const totalReferences = entries.reduce((sum, entry) => sum + entry.references.length, 0);

  return (
    <main className="min-h-screen bg-background px-4 pb-28 pt-8 sm:px-6 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="mimo-section-title mb-2">Consulta de bolso</p>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-foreground sm:text-4xl">
                Referência rápida para revisar sem sair do ritmo.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Pesquise comandos, conceitos, erros comuns e próximas práticas das aulas. A ideia é funcionar como um guia curto para consultar antes de voltar ao desafio.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-secondary/70 p-4">
                <div className="text-2xl font-black text-foreground">{entries.length}</div>
                <div className="text-xs font-bold text-muted-foreground">aulas indexadas</div>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <div className="text-2xl font-black text-foreground">{totalReferences}</div>
                <div className="text-xs font-bold text-muted-foreground">notas rápidas</div>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <div className="text-2xl font-black text-foreground">{languages.length - 1}</div>
                <div className="text-xs font-bold text-muted-foreground">tecnologias</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background p-3">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Pesquisar na referência rápida</span>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Busque por variável, flexbox, JOIN, props, commit..."
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground -translate-y-1/2"
                    aria-label="Limpar busca"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:max-w-[460px]">
                <Filter size={16} className="shrink-0 text-muted-foreground" />
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setSelectedLanguage(language)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                      selectedLanguage === language
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-foreground">Resultados</h2>
            <p className="text-sm text-muted-foreground">
              {filteredEntries.length} {filteredEntries.length === 1 ? "aula encontrada" : "aulas encontradas"}
            </p>
          </div>
          {(query || selectedLanguage !== "Todos") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedLanguage("Todos");
              }}
              className="rounded-full font-bold"
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Search size={22} />
            </div>
            <h2 className="text-xl font-black text-foreground">Nada encontrado ainda</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Tente buscar por um termo mais curto, como “loop”, “estado”, “select” ou “classe”.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {filteredEntries.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-black text-primary">
                      <span className="rounded-full bg-primary/10 px-2 py-1">{entry.courseLanguage}</span>
                      <span className="text-muted-foreground">{entry.module}</span>
                    </div>
                    <h3 className="text-lg font-black text-foreground">{entry.lessonTitle}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.learningObjective}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-sm font-black text-foreground">
                    {entry.courseEmoji}
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-bold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
                    <BookOpen size={12} /> {entry.courseTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
                    <Clock size={12} /> {entry.estimatedMinutes} min
                  </span>
                </div>

                <div className="space-y-3">
                  {entry.references.length > 0 && (
                    <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary">
                        <Code2 size={14} /> Referência
                      </div>
                      <ul className="space-y-1.5">
                        {entry.references.slice(0, 5).map((item) => (
                          <li key={`${entry.id}-${item}`} className="text-sm leading-relaxed text-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entry.commonMistake && (
                    <div className="rounded-xl border border-quest-orange/20 bg-quest-orange/5 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-quest-orange">
                        <AlertTriangle size={14} /> Erro comum
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{entry.commonMistake}</p>
                    </div>
                  )}

                  {entry.tryItPrompt && (
                    <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-accent">
                        <Lightbulb size={14} /> Tente agora
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{entry.tryItPrompt}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {entry.concepts.slice(0, 3).map((concept) => (
                      <span key={`${entry.id}-${concept}`} className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">
                        {concept}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/editor/${entry.courseId}/${entry.lessonId}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-black text-primary-foreground transition hover:bg-primary/90"
                  >
                    Abrir aula <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default ReferencePage;
