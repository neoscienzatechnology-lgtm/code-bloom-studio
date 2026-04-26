## 🎯 Objetivo

Transformar o campo `theory` de cada uma das **103 lições** (em **9 cursos**) num material **totalmente autodidata** seguindo um template padronizado de **6 seções**, e fazer o **Professor IA** consumir essa teoria no contexto da edge function para que tutor e material falem a mesma língua (mesmas analogias, mesmos termos, mesmo nível de profundidade).

---

## 📐 Template padrão de teoria (6 seções)

Cada lição passará a seguir rigorosamente esta estrutura no campo `theory`:

```
# {Título do conceito}

## 💡 O que é
{1-2 frases diretas explicando o conceito.}

## 🌍 Analogia do mundo real
{Comparação concreta — ex: "variável é como uma etiqueta colada num pote".}

## 🔧 Sintaxe e como funciona
{Forma canônica + breve explicação de cada parte.}
  exemplo_de_sintaxe()

## 📚 Exemplos comentados
{3 exemplos, do mais simples ao mais elaborado, cada linha com comentário.}

## ⚠️ Erros comuns
• {Pegadinha 1 — o que evitar}
• {Pegadinha 2}
• {Pegadinha 3}

## 🚀 Quando usar na prática
{Cenários reais onde o aluno aplicaria isso fora do exercício.}
```

O `TheoryRenderer.tsx` atual já suporta `#`, `##`, `•`, blocos indentados de código, **negrito** e \`código\` — então o template renderiza bonito sem mudanças no componente.

---

## 📋 Etapas de execução (entrega faseada)

Como são 103 lições de alta qualidade manual, vou dividir em **5 entregas** para você revisar e confirmar entre cada uma:

### **Fase 1 — Infraestrutura + Curso 1 (Python — 14 lições)**
1. Atualizar `supabase/functions/ai-tutor/index.ts`:
   - Adicionar a teoria completa da lição (`ctx.theory`) ao bloco de contexto enviado à IA.
   - Reforçar no system prompt: *"Use as mesmas analogias e termos do material da lição (fornecido abaixo). Não invente terminologia conflitante."*
2. Atualizar `EditorPage.tsx` / `CheckpointPage.tsx` / `ProjectPage.tsx` para passar `theory` no `lessonContext` do `<AITutor />`.
3. Atualizar a interface `LessonContext` na edge function para aceitar `theory`.
4. Reescrever as **14 lições do curso "Python do Zero ao Herói"** seguindo o template de 6 seções.

### **Fase 2 — Curso 2 (JavaScript Moderno — ~14 lições)**
Reescrever todas as teorias do curso de JavaScript no template.

### **Fase 3 — Curso 3 (React — ~12 lições)**
Reescrever todas as teorias do curso de React.

### **Fase 4 — Cursos 4, 5 e 6** (próximos 3 cursos da lista)
Reescrever no mesmo template.

### **Fase 5 — Cursos 7, 8 e 9** (últimos 3 cursos)
Fechar a reescrita das 103 lições.

> Entre cada fase eu paro, descrevo o que foi feito, e aguardo seu **OK** antes de seguir.

---

## 🤖 Mudanças no Professor IA (Fase 1)

**`supabase/functions/ai-tutor/index.ts`** — adicionar:

```ts
interface LessonContext {
  // ... campos atuais ...
  theory?: string;  // NOVO
}

// dentro de buildSystemPrompt:
if (ctx.theory) ctxParts.push(`Material teórico oficial da lição:\n${ctx.theory}`);
```

E reforçar nos princípios pedagógicos:
> *"8. Sempre que explicar um conceito, use as mesmas analogias, exemplos e termos do material teórico fornecido acima. Se o aluno usar uma palavra diferente, gentilmente conecte-a ao termo do material."*

**Frontend** — passar `theory: lesson.theory` no `lessonContext` em `EditorPage`, `ProjectPage` e (quando aplicável) `CheckpointPage`.

---

## ✅ Critérios de aceitação

- [ ] Toda lição tem teoria com as 6 seções (O que é / Analogia / Sintaxe / Exemplos / Erros comuns / Quando usar).
- [ ] O `TheoryRenderer` continua renderizando tudo corretamente (validamos visualmente após cada fase).
- [ ] O Professor IA recebe `theory` no contexto e usa as mesmas analogias/termos.
- [ ] Build (`tsc`) limpo após cada fase.
- [ ] Nenhuma quebra na navegação Roadmap → Lição → Editor → Checkpoint → Projeto.

---

## ⚠️ Riscos e mitigações

- **Tamanho do prompt da IA**: enviar a teoria completa aumenta tokens. Mitigação: o Gemini Flash tem janela enorme e a teoria por lição fica em ~600-900 palavras — impacto desprezível.
- **`mockData.ts` é grande (5016 linhas)**: vou usar `code--line_replace` por trecho e nunca reescrever o arquivo inteiro de uma vez.
- **Risco de quebrar template strings**: vou preservar escapes (\\`, \\$, \\n) dentro das backticks de cada `theory`.

---

## 📦 Arquivos que serão alterados

- `supabase/functions/ai-tutor/index.ts` (1x, na Fase 1)
- `src/pages/EditorPage.tsx` (1x, na Fase 1)
- `src/pages/ProjectPage.tsx` (1x, na Fase 1)
- `src/pages/CheckpointPage.tsx` (1x, na Fase 1, se passar contexto à IA)
- `src/data/mockData.ts` (em todas as fases, trechos por curso)

Pronto para começar pela **Fase 1 (Python + integração com IA)** assim que aprovar.