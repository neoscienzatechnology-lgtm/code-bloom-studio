

## Problema

A validação atual (linha 58 de `EditorPage.tsx`) faz apenas:
```js
code.includes(lesson.expectedOutput) || code.includes(lesson.solution)
```
Isso exige que o código contenha exatamente a string esperada — qualquer espaço extra, acento diferente ou variação faz falhar.

## Plano: Sistema de correção flexível

### 1. Criar função de normalização e comparação (`src/utils/codeValidator.ts`)

- **Normalizar** ambos os textos (código do aluno e solução/output esperado) antes de comparar:
  - Remover espaços extras e trailing whitespace
  - Normalizar acentos (Unicode NFC/NFD → comparação sem acento como fallback)
  - Ignorar diferenças entre aspas simples/duplas
  - Colapsar múltiplos espaços em um
  - Trim de cada linha
- **Comparação em 3 níveis**:
  1. **Exata** → match perfeito (100% XP)
  2. **Flexível** → match após normalização (100% XP, com toast "Correto!")
  3. **Quase certo** → similaridade alta (ex: distância de Levenshtein ou tokens-chave presentes) → mostrar feedback parcial: "Quase lá! Veja a diferença:" com diff visual

### 2. Atualizar `handleRun` em `EditorPage.tsx`

- Substituir a verificação `code.includes()` pela nova função de validação
- Mostrar feedback diferenciado:
  - **Correto**: confetti + XP (como hoje)
  - **Quase certo**: mensagem amarela mostrando o que falta ajustar, sem penalizar
  - **Errado**: mensagem de erro (como hoje)

### 3. Feedback visual de "quase certo"

- Nova cor amarela/warning no painel de output
- Texto como: "Quase certo! Seu código está funcionalmente correto. Pequenas diferenças encontradas."
- Se a resposta é funcionalmente equivalente (só difere em espaços/acentos), **considerar como correta** e dar o XP

### Arquivos modificados
- `src/utils/codeValidator.ts` (novo)
- `src/pages/EditorPage.tsx` (atualizar handleRun)

