import type { Course, Lesson, PracticeActivity, PracticeActivityType, QuizQuestion } from "@/data/mockData";

type AlgorithmLessonDraft = {
  id: string;
  title: string;
  module: string;
  learningObjective: string;
  description: string;
  explanation: string;
  analogy: string;
  example: string;
  codeExample: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  summary: string;
  nextStep: string;
  tryItPrompt: string;
  commonMistake: string;
  reference: string[];
  concepts: string[];
  contrastExample?: {
    wrong: string;
    right: string;
    explanation: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    success: string;
    error: string;
    hint: string;
  };
  practice: {
    type?: PracticeActivityType;
    title: string;
    prompt: string;
    code?: string;
    options?: string[];
    correctAnswer: string | string[];
    success: string;
    error: string;
    hint: string;
  };
  xpReward?: number;
};

function quiz(draft: AlgorithmLessonDraft["quiz"]): QuizQuestion[] {
  return [
    {
      question: draft.question,
      options: draft.options,
      correctIndex: draft.correctIndex,
      explanation: draft.success,
      successFeedback: draft.success,
      errorFeedback: draft.error,
      hint: draft.hint,
    },
  ];
}

function practice(id: string, draft: AlgorithmLessonDraft["practice"]): PracticeActivity[] {
  return [
    {
      id: `${id}-practice`,
      type: draft.type ?? "mini-challenge",
      title: draft.title,
      prompt: draft.prompt,
      code: draft.code,
      options: draft.options,
      correctAnswer: draft.correctAnswer,
      successFeedback: draft.success,
      errorFeedback: draft.error,
      hint: draft.hint,
    },
  ];
}

function lesson(draft: AlgorithmLessonDraft): Lesson {
  return {
    id: draft.id,
    title: draft.title,
    module: draft.module,
    level: "Intermediário",
    estimatedMinutes: 8,
    description: draft.description,
    theory: `${draft.explanation}

Exemplo prático:
${draft.example}

Erro comum:
${draft.commonMistake}

Referência rápida:
${draft.reference.map((item) => `- ${item}`).join("\n")}`,
    starterCode: draft.starterCode,
    solution: draft.solution,
    expectedOutput: draft.expectedOutput,
    hints: draft.hints,
    xpReward: draft.xpReward ?? 20,
    learningObjective: draft.learningObjective,
    analogy: draft.analogy,
    example: draft.example,
    codeExample: draft.codeExample,
    summary: draft.summary,
    nextStep: draft.nextStep,
    tryItPrompt: draft.tryItPrompt,
    commonMistake: draft.commonMistake,
    contrastExample: draft.contrastExample,
    reference: draft.reference,
    concepts: draft.concepts,
    quiz: quiz(draft.quiz),
    practiceActivities: practice(draft.id, draft.practice),
  };
}

const lessons = [
  lesson({
    id: "8-1",
    title: "Complexidade sem susto",
    module: "Algoritmos 1 - Como medir soluções",
    learningObjective: "Entender Big O como uma forma de comparar crescimento de trabalho.",
    description: "Compare O(1), O(n), O(log n) e O(n²) usando exemplos pequenos.",
    explanation:
      "Big O descreve como o trabalho cresce quando a entrada aumenta. Não mede segundos exatos; mede tendência. Uma busca que olha todos os itens cresce diferente de uma busca que divide a lista ao meio.",
    analogy:
      "É como comparar caminhos para entregar cartas: ir casa por casa cresce muito mais que usar uma lista organizada por bairro.",
    example: "for item in lista:\n    print(item)  # O(n)",
    codeExample: "lista[0]  # O(1)",
    starterCode: "# Responda a complexidade de um loop simples\n",
    solution: "O(n)",
    expectedOutput: "O(n)",
    hints: ["Um loop percorre a lista.", "Se a lista dobra, o trabalho dobra.", "Isso é crescimento linear."],
    summary: "Você leu Big O como comparação de crescimento, não como cronômetro.",
    nextStep: "Vamos comparar busca linear e busca binária.",
    tryItPrompt: "Classifique mentalmente acessar lista[0] e percorrer lista inteira.",
    commonMistake: "Somar detalhes pequenos demais. Em Big O, focamos no termo que mais cresce.",
    reference: ["O(1): constante.", "O(log n): divide o problema.", "O(n): percorre itens.", "O(n²): loop aninhado."],
    concepts: ["big-o", "complexity", "analysis"],
    contrastExample: {
      wrong: "for item in lista:\n    for outro in lista:\n        comparar(item, outro)  # O(n²)",
      right: "for item in lista:\n    comparar(item)  # O(n)",
      explanation:
        "Cada loop sozinho é `O(n)`. **Aninhados**, o trabalho cresce `n × n = O(n²)` — para listas grandes, a diferença é gigante.",
    },
    quiz: {
      question: "Um loop que passa por todos os itens costuma ser...",
      options: ["O(n)", "O(1)", "O(n²)", "O(log n)"],
      correctIndex: 0,
      success: "Isso. Um loop simples cresce junto com o tamanho da lista.",
      error: "Ainda não. Se há n itens e você olha todos, o crescimento é linear.",
      hint: "Um item a mais vira uma repetição a mais.",
    },
    practice: {
      type: "predict-output",
      title: "Leia o crescimento",
      prompt: "Qual complexidade representa dois loops aninhados sobre a mesma lista?",
      options: ["O(n²)", "O(n)", "O(1)", "O(log n)"],
      correctAnswer: "O(n²)",
      success: "Boa. Para cada item externo, o loop interno percorre vários itens.",
      error: "Quase. Loop dentro de loop costuma multiplicar o trabalho.",
      hint: "Pense em n vezes n.",
    },
  }),
  lesson({
    id: "8-2",
    title: "Busca linear",
    module: "Algoritmos 2 - Encontrar dados",
    learningObjective: "Percorrer uma lista até encontrar um alvo.",
    description: "Use busca linear para listas pequenas ou não ordenadas.",
    explanation:
      "Busca linear verifica um item por vez. Ela é simples, funciona em lista não ordenada e é uma boa primeira estratégia. O custo no pior caso é olhar todos os itens.",
    analogy:
      "É como procurar uma chave olhando bolso por bolso até encontrar.",
    example: "for item in nomes:\n    if item == alvo:\n        print('encontrei')",
    codeExample: "alvo in lista",
    starterCode: "# Procure Ana na lista\n",
    solution: 'nomes = ["Bia", "Ana", "Caio"]\nfor nome in nomes:\n    if nome == "Ana":\n        print("encontrei")',
    expectedOutput: "encontrei",
    hints: ["Percorra com for.", "Compare cada nome com Ana.", "Mostre quando encontrar."],
    summary: "Você implementou a forma mais direta de busca.",
    nextStep: "Agora vamos usar ordenação para buscar mais rápido.",
    tryItPrompt: "Procure um número em uma lista usando for e if.",
    commonMistake: "Usar busca binária em lista não ordenada. Primeiro a lista precisa estar em ordem.",
    reference: ["Busca linear olha item por item.", "Funciona sem ordenar.", "Pior caso é O(n).", "É ótima para começar simples."],
    concepts: ["linear-search", "loops", "comparison"],
    contrastExample: {
      wrong: "# busca binária em lista NÃO ordenada\nlista = [3, 1, 7, 4]\n# meio = lista[len(lista)//2]  # não confiável!",
      right: "# busca linear funciona em qualquer ordem\nfor item in lista:\n    if item == alvo:\n        return True",
      explanation:
        "Busca binária **exige lista ordenada** — sem ordem, descartar metade é chute. Busca linear é o caminho seguro quando a lista não está ordenada.",
    },
    quiz: {
      question: "Quando a busca linear é aceitável?",
      options: ["Quando a lista é pequena ou não ordenada", "Somente com árvores", "Nunca", "Apenas com SQL"],
      correctIndex: 0,
      success: "Certo. Simplicidade também é uma qualidade quando o problema é pequeno.",
      error: "Ainda não. Busca linear é simples e funciona mesmo sem ordenação.",
      hint: "Ela não exige preparação dos dados.",
    },
    practice: {
      type: "fill-code",
      title: "Complete a comparação",
      prompt: "Complete para encontrar o alvo.",
      code: "if item ____ alvo:",
      correctAnswer: "==",
      success: "Perfeito. Comparação de igualdade usa ==.",
      error: "Quase. Um sinal só atribui; dois sinais comparam.",
      hint: "Use o operador de igualdade.",
    },
  }),
  lesson({
    id: "8-3",
    title: "Busca binária",
    module: "Algoritmos 2 - Encontrar dados",
    learningObjective: "Dividir uma lista ordenada pela metade para encontrar um alvo.",
    description: "Entenda por que busca binária é O(log n).",
    explanation:
      "Busca binária só funciona em lista ordenada. Ela compara o alvo com o meio e descarta metade da lista a cada passo. Por isso cresce muito devagar mesmo com muitos itens.",
    analogy:
      "É como procurar uma palavra no dicionário: você abre no meio e decide se vai para antes ou depois.",
    example: "meio = (inicio + fim) // 2",
    codeExample: "if lista[meio] < alvo: inicio = meio + 1",
    starterCode: "# Procure 7 em uma lista ordenada\n",
    solution:
      "lista = [1, 3, 5, 7, 9]\nalvo = 7\ninicio = 0\nfim = len(lista) - 1\nwhile inicio <= fim:\n    meio = (inicio + fim) // 2\n    if lista[meio] == alvo:\n        print(meio)\n        break\n    if lista[meio] < alvo:\n        inicio = meio + 1\n    else:\n        fim = meio - 1",
    expectedOutput: "3",
    hints: ["Calcule o meio.", "Compare lista[meio] com alvo.", "Descarte metade."],
    summary: "Você reduziu o espaço de busca pela metade a cada passo.",
    nextStep: "Vamos ordenar dados e comparar estratégias.",
    tryItPrompt: "Explique por que a lista precisa estar ordenada antes da busca binária.",
    commonMistake: "Atualizar inicio/fim sem excluir o meio. Isso pode criar loop infinito.",
    reference: ["Exige lista ordenada.", "Divide pela metade.", "Complexidade O(log n).", "Atualize início ou fim a cada rodada."],
    concepts: ["binary-search", "logarithmic", "sorted-data"],
    contrastExample: {
      wrong: "while inicio <= fim:\n    meio = (inicio + fim) // 2\n    if lista[meio] < alvo:\n        inicio = meio  # NÃO exclui o meio\n    else:\n        fim = meio",
      right: "while inicio <= fim:\n    meio = (inicio + fim) // 2\n    if lista[meio] < alvo:\n        inicio = meio + 1\n    else:\n        fim = meio - 1",
      explanation:
        "Sem `+ 1`/`- 1`, o meio fica incluído na próxima rodada — quando `inicio == fim == meio`, o loop **nunca termina** (loop infinito).",
    },
    quiz: {
      question: "Qual pré-requisito da busca binária?",
      options: ["Lista ordenada", "Lista vazia", "Dois bancos", "CSS Grid"],
      correctIndex: 0,
      success: "Isso. Sem ordem, descartar metade não é confiável.",
      error: "Ainda não. A busca binária depende da ordem dos itens.",
      hint: "Pense no dicionário.",
    },
    practice: {
      type: "predict-output",
      title: "Meio da lista",
      prompt: "Em [1, 3, 5, 7, 9], qual valor está no índice 2?",
      options: ["5", "3", "7", "2"],
      correctAnswer: "5",
      success: "Boa. O meio inicial ajuda a decidir a direção.",
      error: "Quase. Índices começam em zero.",
      hint: "Conte 0, 1, 2.",
    },
  }),
  lesson({
    id: "8-4",
    title: "Ordenação por comparação",
    module: "Algoritmos 3 - Organizar dados",
    learningObjective: "Entender a ideia por trás de algoritmos de ordenação.",
    description: "Compare Bubble Sort como didática e sort() como ferramenta prática.",
    explanation:
      "Ordenar é reorganizar itens por uma regra. Bubble Sort é didático porque mostra comparações e trocas, mas é lento em listas grandes. Em projetos reais, use funções nativas; em estudo, entenda o custo.",
    analogy:
      "É como organizar cartas na mão: comparar pares ajuda a aprender, mas existem jeitos mais rápidos quando a pilha cresce.",
    example: "numeros = [3, 1, 2]\nnumeros.sort()",
    codeExample: "sorted([3, 1, 2])",
    starterCode: "# Ordene a lista usando função nativa\n",
    solution: "numeros = [5, 3, 8, 1]\nnumeros.sort()\nprint(numeros)",
    expectedOutput: "[1, 3, 5, 8]",
    hints: ["Use sort().", "A lista muda no lugar.", "Mostre depois de ordenar."],
    summary: "Você separou algoritmo didático de ferramenta prática.",
    nextStep: "Vamos estudar pilha e fila como estruturas de controle.",
    tryItPrompt: "Ordene nomes em ordem alfabética com sorted().",
    commonMistake: "Implementar ordenação manual em produção sem necessidade. Use a ferramenta nativa quando possível.",
    reference: ["Ordenar aplica uma regra.", "Bubble Sort é O(n²).", "sort() é a escolha prática em Python.", "sorted() devolve nova lista."],
    concepts: ["sorting", "bubble-sort", "python-sort"],
    contrastExample: {
      wrong: "# Bubble Sort manual em produção\nfor i in range(len(lista)):\n    for j in range(len(lista)-1):\n        if lista[j] > lista[j+1]:\n            lista[j], lista[j+1] = lista[j+1], lista[j]",
      right: "# usa a função nativa do Python\nlista.sort()",
      explanation:
        "Bubble Sort é didático mas é `O(n²)`. Em produção, `sort()` usa **Timsort** (`O(n log n)`) — muito mais rápido em listas grandes.",
    },
    quiz: {
      question: "Por que Bubble Sort aparece tanto em estudos?",
      options: ["Porque é didático para ver comparações", "Porque é sempre o mais rápido", "Porque substitui banco", "Porque não usa loops"],
      correctIndex: 0,
      success: "Certo. Ele ajuda a visualizar trocas, mesmo não sendo eficiente.",
      error: "Ainda não. Bubble Sort é simples de entender, mas não é o mais rápido.",
      hint: "Pense em valor didático.",
    },
    practice: {
      type: "fill-code",
      title: "Ordene no lugar",
      prompt: "Complete para ordenar a lista existente.",
      code: "numeros.____()",
      correctAnswer: "sort",
      success: "Perfeito. sort() ordena a própria lista.",
      error: "Quase. A função de lista se chama sort.",
      hint: "É ordenar em inglês.",
    },
  }),
  lesson({
    id: "8-5",
    title: "Pilha: último entra, primeiro sai",
    module: "Algoritmos 4 - Estruturas",
    learningObjective: "Usar pilha para modelar desfazer, navegação e chamadas.",
    description: "Entenda LIFO usando append e pop.",
    explanation:
      "Pilha segue LIFO: o último item a entrar é o primeiro a sair. Em Python, lista com append e pop simula bem essa ideia. Pilhas aparecem em desfazer, histórico de telas e call stack.",
    analogy:
      "É uma pilha de pratos: você coloca no topo e retira do topo.",
    example: "pilha.append('A')\npilha.append('B')\nprint(pilha.pop())",
    codeExample: "pilha[-1]",
    starterCode: "# Simule uma pilha com duas ações\n",
    solution: 'pilha = []\npilha.append("abrir")\npilha.append("editar")\nprint(pilha.pop())',
    expectedOutput: "editar",
    hints: ["Use append para empilhar.", "Use pop para retirar do topo.", "O último sai primeiro."],
    summary: "Você modelou um fluxo LIFO.",
    nextStep: "Vamos comparar com fila, que funciona no sentido oposto.",
    tryItPrompt: "Modele um histórico de desfazer com três ações.",
    commonMistake: "Usar pilha quando a ordem precisa ser justa. Para atendimento em ordem de chegada, use fila.",
    reference: ["Pilha é LIFO.", "append adiciona no topo.", "pop remove do topo.", "peek vê o topo sem remover."],
    concepts: ["stack", "lifo", "data-structures"],
    contrastExample: {
      wrong: '# atendimento como pilha (LIFO)\natendimento = []\natendimento.append("Ana")  # 1ª a chegar\natendimento.append("Bia")  # 2ª\nprint(atendimento.pop())  # atende "Bia" — quem chegou por último!',
      right: '# fila com deque (FIFO)\nfrom collections import deque\natendimento = deque()\natendimento.append("Ana")\natendimento.append("Bia")\nprint(atendimento.popleft())  # atende "Ana", quem chegou primeiro',
      explanation:
        "Pilha é **LIFO** — quem chega por último sai antes. Para atendimento por **ordem de chegada**, use **fila** (FIFO).",
    },
    quiz: {
      question: "Em uma pilha, qual item sai primeiro?",
      options: ["O último que entrou", "O primeiro que entrou", "Um item aleatório", "Sempre o menor"],
      correctIndex: 0,
      success: "Isso. Pilha é LIFO.",
      error: "Ainda não. Na pilha, o topo sai primeiro.",
      hint: "Pense em pratos empilhados.",
    },
    practice: {
      type: "predict-output",
      title: "Preveja o pop",
      prompt: "O que aparece?",
      code: "pilha = []\npilha.append('A')\npilha.append('B')\nprint(pilha.pop())",
      options: ["B", "A", "AB", "Nada"],
      correctAnswer: "B",
      success: "Boa. B entrou por último e saiu primeiro.",
      error: "Quase. pop remove o topo da pilha.",
      hint: "Último a entrar, primeiro a sair.",
    },
  }),
  lesson({
    id: "8-6",
    title: "Fila: primeiro entra, primeiro sai",
    module: "Algoritmos 4 - Estruturas",
    learningObjective: "Usar fila para processar itens por ordem de chegada.",
    description: "Entenda FIFO em tarefas, atendimento e BFS.",
    explanation:
      "Fila segue FIFO: o primeiro item a entrar é o primeiro a sair. Ela modela atendimento, tarefas pendentes e processamento em ordem. Em Python, collections.deque é mais adequada que lista para remover do início.",
    analogy:
      "É uma fila de mercado: quem chegou primeiro é atendido primeiro.",
    example: "from collections import deque\nfila = deque(['A', 'B'])\nprint(fila.popleft())",
    codeExample: "fila.append('C')",
    starterCode: "# Simule uma fila com deque\n",
    solution: "from collections import deque\nfila = deque(['A', 'B'])\nfila.append('C')\nprint(fila.popleft())",
    expectedOutput: "A",
    hints: ["Use deque.", "append entra no fim.", "popleft sai do começo."],
    summary: "Você modelou processamento FIFO.",
    nextStep: "Vamos ver recursão e caso base.",
    tryItPrompt: "Modele uma fila com três nomes e atenda o primeiro.",
    commonMistake: "Usar pop(0) em listas grandes. Funciona, mas pode ser lento; deque é melhor para fila.",
    reference: ["Fila é FIFO.", "deque cria fila eficiente.", "append adiciona no fim.", "popleft remove do início."],
    concepts: ["queue", "fifo", "deque"],
    contrastExample: {
      wrong: 'fila = ["Ana", "Bia", "Caio"]\nfila.pop(0)  # O(n) — desloca todos os outros',
      right: 'from collections import deque\nfila = deque(["Ana", "Bia", "Caio"])\nfila.popleft()  # O(1)',
      explanation:
        "`pop(0)` em lista é `O(n)` porque precisa **deslocar** todos os outros itens. `deque.popleft()` é `O(1)` — a estrutura é feita pra isso.",
    },
    quiz: {
      question: "Qual estrutura é mais adequada para fila em Python?",
      options: ["collections.deque", "string", "CSS", "git branch"],
      correctIndex: 0,
      success: "Certo. deque remove do começo com eficiência.",
      error: "Ainda não. Lista funciona em exemplo pequeno, mas deque é melhor para fila.",
      hint: "Fica em collections.",
    },
    practice: {
      type: "fill-code",
      title: "Atenda o primeiro",
      prompt: "Complete para remover do início da fila.",
      code: "fila.____()",
      correctAnswer: "popleft",
      success: "Perfeito. popleft remove quem chegou primeiro.",
      error: "Quase. pop remove do fim; fila precisa sair do início.",
      hint: "É pop pela esquerda.",
    },
  }),
  lesson({
    id: "8-7",
    title: "Recursão e caso base",
    module: "Algoritmos 5 - Estratégias",
    learningObjective: "Identificar caso base e passo recursivo.",
    description: "Use recursão sem cair em repetição infinita.",
    explanation:
      "Recursão acontece quando uma função chama a si mesma. Para funcionar, precisa de caso base, que para a repetição, e passo recursivo, que aproxima o problema do caso base. Sem isso, a função nunca termina.",
    analogy:
      "É como subir uma escada perguntando 'já cheguei?' a cada degrau. O caso base é o topo.",
    example: "def contar(n):\n    if n == 0:\n        return\n    contar(n - 1)",
    codeExample: "return n * fatorial(n - 1)",
    starterCode: "# Complete o caso base\n",
    solution: "def contagem(n):\n    if n == 0:\n        return 'fim'\n    return contagem(n - 1)\nprint(contagem(3))",
    expectedOutput: "fim",
    hints: ["Crie caso base n == 0.", "A chamada deve diminuir n.", "Retorne quando chegar ao fim."],
    summary: "Você separou a parada da repetição.",
    nextStep: "Vamos usar grafos para modelar conexões.",
    tryItPrompt: "Explique o caso base de fatorial(1).",
    commonMistake: "Chamar a função com o mesmo valor. O problema precisa ficar menor a cada chamada.",
    reference: ["Recursão chama a própria função.", "Caso base para.", "Passo recursivo reduz o problema.", "Sem caso base, há loop infinito."],
    concepts: ["recursion", "base-case", "strategy"],
    contrastExample: {
      wrong: "def contar(n):\n    return contar(n - 1)  # cadê o caso base?",
      right: 'def contar(n):\n    if n == 0:\n        return "fim"\n    return contar(n - 1)',
      explanation:
        "Sem **caso base**, a função chama a si mesma para sempre — `RecursionError` / stack overflow. O caso base é a condição que **para** a recursão.",
    },
    quiz: {
      question: "O que evita recursão infinita?",
      options: ["Caso base", "CSS", "SELECT", "git push"],
      correctIndex: 0,
      success: "Isso. O caso base encerra a sequência de chamadas.",
      error: "Ainda não. A função precisa saber quando parar.",
      hint: "É a condição de parada.",
    },
    practice: {
      type: "identify-error",
      title: "Chamada perigosa",
      prompt: "Qual problema existe?",
      code: "def contar(n):\n    return contar(n)",
      options: ["A chamada não reduz o problema", "return não existe", "n precisa ser texto", "Falta HTML"],
      correctAnswer: "A chamada não reduz o problema",
      success: "Boa. A recursão precisa caminhar para o caso base.",
      error: "Quase. A função se chama para sempre com o mesmo valor.",
      hint: "O valor de n nunca muda.",
    },
  }),
  lesson({
    id: "8-8",
    title: "Grafos e conexões",
    module: "Algoritmos 6 - Redes",
    learningObjective: "Representar conexões usando lista de adjacência.",
    description: "Modele relações entre pontos antes de buscar caminhos.",
    explanation:
      "Grafo é um conjunto de nós conectados por arestas. Ele modela mapas, redes sociais, dependências e rotas. Uma lista de adjacência guarda, para cada nó, seus vizinhos.",
    analogy:
      "É como um mapa de estações: cada estação conhece as estações ligadas a ela.",
    example: 'grafo = {"A": ["B", "C"], "B": ["A"], "C": ["A"]}',
    codeExample: 'grafo["A"]',
    starterCode: "# Crie um grafo pequeno\n",
    solution: 'grafo = {"A": ["B"], "B": ["A", "C"], "C": ["B"]}\nprint(grafo["B"])',
    expectedOutput: "A",
    hints: ["Use dicionário.", "Cada chave é um nó.", "Cada valor é lista de vizinhos."],
    summary: "Você representou conexões como dados.",
    nextStep: "Vamos percorrer grafos com BFS.",
    tryItPrompt: "Modele três páginas conectadas por links.",
    commonMistake: "Pensar que grafo precisa ser visual. Ele pode começar como um dicionário simples.",
    reference: ["Nó representa elemento.", "Aresta representa conexão.", "Lista de adjacência guarda vizinhos.", "Grafos podem ser direcionados ou não."],
    concepts: ["graphs", "adjacency-list", "modeling"],
    contrastExample: {
      wrong: '# tentando representar grafo só com strings\ngrafo = "A-B, A-C, B-C"  # difícil de consultar',
      right: 'grafo = {"A": ["B", "C"], "B": ["A", "C"], "C": ["A", "B"]}\nprint(grafo["A"])  # ["B", "C"]',
      explanation:
        "String é difícil de consultar. **Dicionário de adjacência** (`{nó: [vizinhos]}`) deixa `grafo[\"A\"]` devolver os vizinhos direto.",
    },
    quiz: {
      question: "O que uma aresta representa?",
      options: ["Uma conexão", "Um tipo de cor", "Um commit", "Um número aleatório"],
      correctIndex: 0,
      success: "Certo. Arestas conectam nós.",
      error: "Ainda não. Nó é o ponto; aresta é a ligação.",
      hint: "Pense em linha entre dois pontos.",
    },
    practice: {
      type: "fill-code",
      title: "Acesse vizinhos",
      prompt: "Complete para ver vizinhos de A.",
      code: "grafo[____]",
      correctAnswer: "\"A\"",
      success: "Perfeito. A chave A aponta para seus vizinhos.",
      error: "Quase. Use a chave do nó entre aspas.",
      hint: "A é texto.",
    },
  }),
  lesson({
    id: "8-9",
    title: "BFS: busca em largura",
    module: "Algoritmos 6 - Redes",
    learningObjective: "Percorrer um grafo por camadas usando fila.",
    description: "Use BFS para encontrar caminhos curtos em grafos sem peso.",
    explanation:
      "BFS visita primeiro os vizinhos próximos e depois avança para os próximos níveis. Por usar fila, ela preserva ordem de descoberta. Em grafos sem peso, BFS ajuda a encontrar o menor número de passos.",
    analogy:
      "É como procurar uma pessoa perguntando primeiro aos amigos diretos, depois aos amigos dos amigos.",
    example: "fila = deque([inicio])\nvisitados = {inicio}",
    codeExample: "for vizinho in grafo[atual]: ...",
    starterCode: "# Ordem conceitual de BFS\n",
    solution: "passos = ['fila', 'visitados', 'vizinhos']\nprint(passos[0])",
    expectedOutput: "fila",
    hints: ["BFS usa fila.", "Guarde visitados.", "Adicione vizinhos ainda não vistos."],
    summary: "Você entendeu BFS como expansão por camadas.",
    nextStep: "Feche a trilha planejando uma estratégia para problemas.",
    tryItPrompt: "Explique por que BFS usa fila e não pilha.",
    commonMistake: "Não guardar visitados. Em grafo com ciclo, isso pode repetir nós para sempre.",
    reference: ["BFS usa fila.", "Visitados evita repetição.", "Percorre por camadas.", "Em grafo sem peso, encontra menor número de arestas."],
    concepts: ["bfs", "graphs", "queue"],
    contrastExample: {
      wrong: "fila = deque([inicio])\n# sem visitados!\nwhile fila:\n    atual = fila.popleft()\n    for vizinho in grafo[atual]:\n        fila.append(vizinho)  # ciclo vira loop infinito",
      right: "fila = deque([inicio])\nvisitados = {inicio}\nwhile fila:\n    atual = fila.popleft()\n    for vizinho in grafo[atual]:\n        if vizinho not in visitados:\n            visitados.add(vizinho)\n            fila.append(vizinho)",
      explanation:
        "Sem `visitados`, BFS em grafo com **ciclo** re-adiciona o mesmo nó para sempre. O conjunto garante que cada nó é processado **uma vez**.",
    },
    quiz: {
      question: "Qual estrutura BFS usa?",
      options: ["Fila", "Pilha", "Tabela CSS", "Commit"],
      correctIndex: 0,
      success: "Isso. Fila mantém a ordem por camadas.",
      error: "Ainda não. DFS usa pilha; BFS usa fila.",
      hint: "Primeiro que entra, primeiro que sai.",
    },
    practice: {
      type: "order-steps",
      title: "Fluxo BFS",
      prompt: "Ordene a ideia de uma BFS.",
      options: ["Colocar início na fila", "Marcar início como visitado", "Remover primeiro da fila", "Adicionar vizinhos não visitados"],
      correctAnswer: ["Colocar início na fila", "Marcar início como visitado", "Remover primeiro da fila", "Adicionar vizinhos não visitados"],
      success: "Boa. Esse fluxo evita ciclos e mantém camadas.",
      error: "Quase. Você precisa iniciar a fila antes de processar.",
      hint: "Comece pelo nó inicial.",
    },
  }),
  lesson({
    id: "8-10",
    title: "Projeto: escolha a estratégia",
    module: "Algoritmos 7 - Projeto guiado",
    learningObjective: "Escolher uma estrutura e uma estratégia para um problema simples.",
    description: "Transforme um problema em entrada, estrutura, algoritmo e saída.",
    explanation:
      "Algoritmos ficam úteis quando você escolhe estratégia pelo problema. Precisa desfazer? Pilha. Atender em ordem? Fila. Encontrar em lista ordenada? Busca binária. Conexões? Grafo. A habilidade é justificar a escolha.",
    analogy:
      "É como escolher ferramenta antes de consertar algo: martelo, chave e fita métrica resolvem problemas diferentes.",
    example: "Problema: atendimento por ordem de chegada -> fila",
    codeExample: "entrada -> estrutura -> algoritmo -> saída",
    starterCode: "# Escolha estrutura para atendimento em ordem\n",
    solution: "estrutura = 'fila'\nprint(estrutura)",
    expectedOutput: "fila",
    hints: ["Ordem de chegada lembra fila.", "Desfazer lembra pilha.", "Conexões lembram grafo."],
    summary: "Você conectou problema, estrutura e algoritmo.",
    nextStep: "Depois disso, pratique projetos de busca, ordenação e simulação.",
    tryItPrompt: "Escolha a estrutura para um botão desfazer e justifique.",
    commonMistake: "Escolher algoritmo pelo nome bonito. Comece pela necessidade do usuário e pelas restrições.",
    reference: ["Pilha resolve desfazer.", "Fila resolve ordem de chegada.", "Busca binária exige ordenação.", "Grafo modela conexões.", "Big O ajuda a comparar custo."],
    concepts: ["strategy", "data-structures", "project"],
    contrastExample: {
      wrong: '# "vou usar busca binária porque é mais rápida"\nlista = ["Ana", "Caio", "Bia"]  # NÃO ordenada\nbusca_binaria(lista, "Bia")  # resultado imprevisível',
      right: '# parte das restrições: lista pequena e não ordenada\nlista = ["Ana", "Caio", "Bia"]\nfor nome in lista:\n    if nome == "Bia":\n        return True',
      explanation:
        "Escolher pelo nome bonito ignora **pré-requisitos** (busca binária exige lista ordenada). Comece pelas **restrições** do problema, depois escolha a ferramenta.",
    },
    quiz: {
      question: "Qual estrutura combina com desfazer?",
      options: ["Pilha", "Fila", "Grafo", "CSS"],
      correctIndex: 0,
      success: "Certo. Desfazer usa a ação mais recente primeiro.",
      error: "Ainda não. Desfazer volta pelo último passo realizado.",
      hint: "Último a entrar, primeiro a sair.",
    },
    practice: {
      type: "mini-challenge",
      title: "Escolha consciente",
      prompt: "Para atender chamados por ordem de chegada, qual estrutura usar?",
      options: ["fila", "pilha", "busca binária", "árvore"],
      correctAnswer: "fila",
      success: "Boa. Fila preserva justiça de chegada.",
      error: "Quase. Atendimento em ordem pede FIFO.",
      hint: "Primeiro que entra, primeiro que sai.",
    },
    xpReward: 25,
  }),
];

export const modernAlgorithmCourse: Course = {
  id: "8",
  title: "Algoritmos e Estruturas",
  language: "Lógica",
  emoji: "ALG",
  level: "Intermediário",
  duration: "4h",
  students: 3200,
  progress: 0,
  color: "primary",
  tags: ["Algoritmos", "Estruturas", "Entrevistas"],
  description:
    "Aprenda a escolher estratégias para busca, ordenação, pilhas, filas, recursão e grafos sem decorar código gigante.",
  lessons,
};
