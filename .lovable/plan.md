

## Plano: Expandir conteúdo dos cursos e criar curso de HTML

### Resumo
Adicionar novas lições aos cursos existentes e criar um curso completo de HTML (curso 9).

### Alterações no arquivo `src/data/mockData.ts`

**1. Novas lições para cursos existentes**

| Curso | Lições atuais | Novas lições a adicionar |
|-------|--------------|--------------------------|
| Python (1) | 8 | +2: List Comprehension, Try/Except |
| JavaScript (2) | 8 | +2: Spread/Rest, Classes |
| React (3) | 6 | +2: Custom Hooks, useContext |
| CSS (4) | 6 | +2: Pseudo-elementos, Transitions |
| Node.js (5) | 6 | +2: JWT Auth, MVC Pattern |
| SQL (6) | 6 | +2: Subqueries, CREATE TABLE |
| Git (7) | 5 | +1: git stash |
| Algoritmos (8) | 6 | +2: Hash Table, Árvore Binária |

**2. Novo curso: HTML Fundamentos (id: "9")**

Curso Iniciante com 8 lições:
1. Estrutura básica (DOCTYPE, html, head, body)
2. Títulos e parágrafos (h1-h6, p)
3. Links e âncoras (a href)
4. Imagens (img src, alt)
5. Listas (ul, ol, li)
6. Tabelas (table, tr, th, td)
7. Formulários (form, input, button)
8. Semântica (header, main, section, footer, nav, article)

Cada lição terá: theory, starterCode, solution, expectedOutput, hints, xpReward e quiz quando relevante.

### Detalhes técnicos
- Arquivo modificado: `src/data/mockData.ts`
- Nenhuma mudança em componentes ou rotas (o catálogo já renderiza dinamicamente)
- O curso de HTML usará emoji 📄, level "Iniciante", ~15h, cor "quest-yellow", tag "Novo"

