
Objetivo

- Transformar os 8 cursos em cursos com conteúdo real dentro do app, em vez de deixar só o card e um editor genérico.

Diagnóstico atual

- `src/data/mockData.ts` só tem metadados dos cursos e 1 exercício fixo (`codeExercise`).
- `src/pages/CoursesPage.tsx` envia todos os cursos para o mesmo `/editor`.
- `src/pages/EditorPage.tsx` está hardcoded para um único exercício de Python.
- Não existe página de curso nem rota por curso/lição, então hoje realmente “não tem conteúdo” conectado para nenhum curso.

Plano de implementação

1. Reestruturar os dados dos cursos
- Expandir o mock para ter conteúdo por curso: descrição, objetivos, módulos, lições e exercícios.
- Adicionar conteúdo para todos os 8 cursos já existentes:
  - Python do Zero ao Herói
  - JavaScript Moderno
  - React & TypeScript
  - CSS Mágico
  - Node.js Backend
  - SQL & Bancos de Dados
  - Git & GitHub Pro
  - Algoritmos & Estruturas
- Cada curso terá várias lições reais no app, com título, explicação, código inicial, solução, dicas e recompensa em XP.
- Alinhar o total de lições exibido com o conteúdo realmente cadastrado.

2. Criar página individual de curso
- Adicionar uma rota como `/cursos/:courseId`.
- Mostrar visão geral do curso, nível, duração, módulos e lista de lições.
- Incluir CTA de “Começar curso” e “Continuar de onde parei”.

3. Tornar o editor dinâmico
- Trocar o editor fixo por rota com parâmetros, por exemplo `/editor/:courseId/:lessonId`.
- Carregar no editor o conteúdo correto da lição escolhida.
- Atualizar topo, progresso, dicas, código inicial, validação e XP conforme a lição atual.
- Fazer o botão “Próximo” navegar para a próxima lição do mesmo curso.

4. Conectar catálogo e dashboard ao conteúdo real
- Fazer os cards de `CoursesPage` abrirem a página do curso correto.
- Fazer os cards do dashboard levarem para a lição atual do curso correspondente.
- Ajustar progressos e contagens para refletirem os novos dados.

5. Revisão de consistência
- Padronizar todos os textos em PT-BR.
- Garantir que nenhum curso fique sem conteúdo visível.
- Revisar estados de progresso, curso concluído, primeira lição e última lição.

Detalhes técnicos

- Vou manter tudo em dados mockados/TypeScript, sem backend.
- A estrutura ideal é separar:
  - resumo do curso (catálogo/dashboard)
  - conteúdo do curso (módulos/lições/exercícios)
- Como o editor é demo, a correção de cada lição será por regra simples baseada em solução/saída esperada.
- Também vou substituir usos frágeis de classe dinâmica de cor quando necessário, para não quebrar estilos no Tailwind.

Resultado esperado

- Cada curso terá conteúdo navegável próprio.
- O catálogo deixará de ser só vitrine e passará a abrir um curso de verdade.
- O editor mostrará exercícios diferentes para cada curso/lição.
- Nenhum curso ficará vazio.
