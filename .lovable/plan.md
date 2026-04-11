

# Melhorar visual da seção de teoria

## Problema
A teoria é renderizada como um bloco cinza de texto puro (`whitespace-pre-line`), sem destaque visual para títulos, código, listas ou conceitos importantes. Tudo parece igual.

## Solução
Criar uma função de parsing no `EditorPage` que transforma o texto da teoria em elementos visuais ricos, detectando padrões do conteúdo existente:

### Regras de formatação automática
1. **Blocos de código** — linhas que começam com espaços e contêm `→` ou `=` ou `print(` etc. → renderizar em `<code>` com fundo escuro e fonte mono
2. **Títulos de seção** — linhas que terminam com `:` (ex: "Como funciona:", "Exemplos:") → renderizar em negrito com cor primária
3. **Itens de lista** — linhas que começam com `•` → renderizar com bullet estilizado e cor de destaque
4. **Texto entre crases** — `código` inline → renderizar com fundo e cor accent
5. **Primeiro parágrafo** — texto introdutório → renderizar com fonte ligeiramente maior e cor mais clara

### Visual
- Seções separadas com espaçamento e bordas sutis
- Blocos de código com fundo `hsl(250,20%,8%)` e borda accent
- Títulos de seção com ícone decorativo e cor `primary`
- Bullets com cor `accent` em vez de cinza
- Fundo geral com gradiente sutil de `primary/5` para `accent/5`

### Arquivos modificados
- `src/pages/EditorPage.tsx` — substituir o `<div>{lesson.theory}</div>` por um componente que faz o parsing e renderiza com cores/estilos ricos

