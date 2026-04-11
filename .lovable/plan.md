

# Adicionar conteúdo educativo às lições

## Problema
Cada lição tem apenas uma instrução curta do exercício (ex: "Use print() para exibir..."), mas **não explica o conceito** antes. O aluno não tem como aprender o que precisa para resolver o exercício.

## Solução

### 1. Adicionar campo `theory` à interface Lesson
Um novo campo de texto longo com a explicação teórica do conceito, incluindo exemplos de código e explicações didáticas em PT-BR.

```typescript
export interface Lesson {
  id: string;
  title: string;
  description: string;   // instrução do exercício (mantém)
  theory: string;         // NOVO: explicação teórica do conceito
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  xpReward: number;
}
```

### 2. Escrever conteúdo teórico para todas as lições dos 8 cursos
Cada `theory` terá 3-6 parágrafos explicando:
- O que é o conceito
- Como funciona (sintaxe)
- Exemplos comentados
- Quando usar

Exemplo para "Olá, Mundo!":
> "Em Python, usamos a função `print()` para exibir texto na tela. Ela é uma das funções mais básicas e importantes da linguagem. Para exibir um texto, coloque-o entre aspas dentro dos parênteses: `print("seu texto aqui")`. Aspas simples ou duplas funcionam..."

### 3. Atualizar o EditorPage para exibir a teoria
No painel de instruções (lado esquerdo), mostrar a teoria antes da instrução do exercício, com formatação visual clara:
- Seção "📖 Aprenda" com a teoria, usando blocos de código estilizados
- Separador visual
- Seção "🎯 Exercício" com a instrução atual (`description`)

### Escopo
- **Arquivo modificado**: `src/data/mockData.ts` (adicionar `theory` a ~64 lições nos 8 cursos)
- **Arquivo modificado**: `src/pages/EditorPage.tsx` (renderizar teoria no painel esquerdo)
- Manter tudo em PT-BR, sem backend

