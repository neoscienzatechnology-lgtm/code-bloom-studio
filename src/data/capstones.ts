/**
 * Capstones — projetos finais DE VERDADE.
 *
 * Diferente dos antigos projetos gerados por template (mesmas 3 etapas para
 * qualquer tema, `tarefas = ["planejar","construir","testar"]`), cada capstone
 * constrói UM artefato: a etapa N começa do resultado da etapa N-1 e a última
 * entrega algo que o aluno mostraria para alguém. #revisao-lote2
 *
 * Regras ao escrever um novo capstone:
 * - 4 a 6 etapas encadeadas (o `starterCode` da etapa N contém a solução da N-1);
 * - `expectedOutput` é a saída REAL — em Python isso é verificado rodando o
 *   código (o app executa no Pyodide e compara stdout exato);
 * - `starterCode` nunca pode passar na validação sozinho (teste garante isso).
 */
import type { Project } from "@/data/projects";

const pythonExpenseReport: Project = {
  id: "proj-py-monthly-report",
  courseId: "1",
  title: "Relatório de gastos do mês",
  emoji: "💸",
  language: "Python",
  goal: "Construir, do zero, um relatório que soma seus gastos, aponta o que passou do limite e mostra o maior vilão do mês.",
  description:
    "Projeto final do curso de Python: cada etapa acrescenta uma peça ao mesmo programa até virar um relatório completo que você pode adaptar para os seus gastos reais.",
  xpReward: 120,
  summary: [
    "Dicionário para guardar dados com rótulo",
    "Função com return para não repetir cálculo",
    "for percorrendo categorias",
    "if/else aplicando uma regra de negócio",
    "f-string formatando dinheiro",
    "max() com chave para encontrar o maior valor",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Guarde os gastos por categoria",
      description:
        "Crie um dicionário `gastos` com três categorias (mercado 250.0, transporte 80.0 e lazer 60.0) e mostre a soma de todos os valores.",
      starterCode: "# Crie o dicionário de gastos e mostre a soma\n",
      solution: 'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\nprint(sum(gastos.values()))',
      expectedOutput: "390.0",
      hints: [
        "Dicionário usa chaves: {\"mercado\": 250.0}.",
        "`gastos.values()` devolve só os valores.",
        "`sum(...)` soma tudo de uma vez.",
      ],
      concepts: ["dicionários", "sum", "print"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Uma função para o total",
      description:
        "Crie a função `total_do_mes(valores)` que devolve a soma dos valores e mostre o total formatado como `Total do mês: R$ 390.00`.",
      starterCode:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\n\n# Crie a função total_do_mes e mostre o total formatado\n',
      solution:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\n\ndef total_do_mes(valores):\n    return sum(valores.values())\n\nprint(f"Total do mês: R$ {total_do_mes(gastos):.2f}")',
      expectedOutput: "Total do mês: R$ 390.00",
      hints: [
        "A função começa com `def total_do_mes(valores):`.",
        "Use `return` para devolver a soma — sem return a função não entrega nada.",
        "`:.2f` dentro da f-string mostra sempre duas casas decimais.",
      ],
      concepts: ["funções", "return", "f-strings"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Liste categoria por categoria",
      description:
        "Percorra o dicionário com `for` e mostre uma linha por categoria, no formato `mercado: R$ 250.00`.",
      starterCode:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\n\n# Percorra as categorias e mostre uma linha para cada uma\n',
      solution:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\n\nfor categoria, valor in gastos.items():\n    print(f"{categoria}: R$ {valor:.2f}")',
      expectedOutput: "mercado: R$ 250.00\ntransporte: R$ 80.00\nlazer: R$ 60.00",
      hints: [
        "`gastos.items()` entrega a chave e o valor juntos.",
        "`for categoria, valor in gastos.items():` guarda os dois em cada volta.",
        "O print fica indentado, dentro do for.",
      ],
      concepts: ["for", "items", "f-strings"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Avise o que passou do limite",
      description:
        "Com um limite de 100.0, marque as categorias acima dele acrescentando ` (acima do limite)` no fim da linha.",
      starterCode:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\nlimite = 100.0\n\nfor categoria, valor in gastos.items():\n    # Mostre o alerta quando o valor passar do limite\n    print(f"{categoria}: R$ {valor:.2f}")',
      solution:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\nlimite = 100.0\n\nfor categoria, valor in gastos.items():\n    if valor > limite:\n        print(f"{categoria}: R$ {valor:.2f} (acima do limite)")\n    else:\n        print(f"{categoria}: R$ {valor:.2f}")',
      expectedOutput:
        "mercado: R$ 250.00 (acima do limite)\ntransporte: R$ 80.00\nlazer: R$ 60.00",
      hints: [
        "A comparação é `if valor > limite:`.",
        "O `else` cuida das categorias que estão dentro do limite.",
        "Repare que só o texto extra muda entre os dois prints.",
      ],
      concepts: ["if/else", "comparação", "regra de negócio"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — Encontre o maior gasto",
      description: "Descubra a categoria com o maior valor e mostre `Maior gasto: mercado (R$ 250.00)`.",
      starterCode:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\n\n# Descubra a categoria com o maior valor\n',
      solution:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\n\nmaior = max(gastos, key=gastos.get)\nprint(f"Maior gasto: {maior} (R$ {gastos[maior]:.2f})")',
      expectedOutput: "Maior gasto: mercado (R$ 250.00)",
      hints: [
        "`max(gastos, key=gastos.get)` compara pelos valores e devolve a chave.",
        "Sem o `key`, o max compararia os nomes das categorias em ordem alfabética.",
        "`gastos[maior]` pega o valor daquela categoria.",
      ],
      concepts: ["max", "dicionários", "chave de comparação"],
    },
    {
      id: "step-6",
      title: "Etapa 6 — O relatório completo",
      description:
        "Junte tudo: título, uma linha por categoria com o alerta, o total e o maior gasto. Esse é o programa que você leva para casa.",
      starterCode:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\nlimite = 100.0\n\ndef total_do_mes(valores):\n    return sum(valores.values())\n\n# Monte o relatório completo usando o que você já construiu\n',
      solution:
        'gastos = {"mercado": 250.0, "transporte": 80.0, "lazer": 60.0}\nlimite = 100.0\n\ndef total_do_mes(valores):\n    return sum(valores.values())\n\nprint("Relatório do mês")\nfor categoria, valor in gastos.items():\n    if valor > limite:\n        print(f"{categoria}: R$ {valor:.2f} (acima do limite)")\n    else:\n        print(f"{categoria}: R$ {valor:.2f}")\nmaior = max(gastos, key=gastos.get)\nprint(f"Total: R$ {total_do_mes(gastos):.2f}")\nprint(f"Maior gasto: {maior}")',
      expectedOutput:
        "Relatório do mês\nmercado: R$ 250.00 (acima do limite)\ntransporte: R$ 80.00\nlazer: R$ 60.00\nTotal: R$ 390.00\nMaior gasto: mercado",
      hints: [
        "Comece pelo título com um print simples.",
        "Reaproveite o for da etapa 4 sem mudar nada.",
        "Total e maior gasto vêm depois do loop, sem indentação.",
      ],
      concepts: ["programa completo", "funções", "for", "if/else", "f-strings"],
    },
  ],
};

const jsShoppingCart: Project = {
  id: "proj-js-cart",
  courseId: "2",
  title: "Carrinho de compras",
  emoji: "🛒",
  language: "JavaScript",
  goal: "Montar a lógica de um carrinho: itens, subtotal, frete grátis por regra e o resumo final do pedido.",
  description:
    "Projeto final do curso de JavaScript. Cada etapa acrescenta uma regra real de e-commerce ao mesmo carrinho, até fechar o resumo do pedido.",
  xpReward: 120,
  summary: [
    "Objetos representando produtos",
    "Array de itens do pedido",
    "reduce somando o subtotal",
    "Condição definindo frete grátis",
    "Template literals no resumo",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Os produtos do carrinho",
      description:
        "Crie o array `carrinho` com três objetos (`{ nome, preco }`): teclado 150, mouse 90 e monitor 700. Mostre quantos itens ele tem.",
      starterCode: "// Crie o array carrinho com três produtos\n",
      solution:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\nconsole.log(carrinho.length);',
      expectedOutput: "3",
      hints: [
        "Cada produto é um objeto: { nome: \"teclado\", preco: 150 }.",
        "Os objetos ficam dentro de colchetes, separados por vírgula.",
        "`.length` conta quantos itens o array tem.",
      ],
      concepts: ["arrays", "objetos", "length"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Some o subtotal",
      description: "Calcule o subtotal somando o preço de todos os produtos e mostre `Subtotal: 940`.",
      starterCode:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\n// Some os preços e mostre o subtotal\n',
      solution:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\nconst subtotal = carrinho.reduce((soma, item) => soma + item.preco, 0);\nconsole.log(`Subtotal: ${subtotal}`);',
      expectedOutput: "Subtotal: 940",
      hints: [
        "`reduce` acumula um valor percorrendo o array.",
        "O `0` no final é o valor inicial da soma.",
        "Template literal usa crase e ${ } para juntar texto com valor.",
      ],
      concepts: ["reduce", "acumulador", "template literals"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Regra do frete grátis",
      description:
        "Pedidos a partir de 500 têm frete grátis; abaixo disso o frete custa 30. Mostre `Frete: 0`.",
      starterCode:
        "const subtotal = 940;\n// Defina o frete conforme a regra e mostre o valor\n",
      solution:
        'const subtotal = 940;\nconst frete = subtotal >= 500 ? 0 : 30;\nconsole.log(`Frete: ${frete}`);',
      expectedOutput: "Frete: 0",
      hints: [
        "A condição pode ser um if/else ou o operador ternário.",
        "`subtotal >= 500` responde se o frete é grátis.",
        "Guarde o resultado numa constante `frete`.",
      ],
      concepts: ["condição", "operador ternário", "regra de negócio"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Liste os itens",
      description: "Mostre uma linha por produto no formato `teclado - R$ 150`.",
      starterCode:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\n// Mostre uma linha para cada produto\n',
      solution:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\ncarrinho.forEach((item) => {\n  console.log(`${item.nome} - R$ ${item.preco}`);\n});',
      expectedOutput: "teclado - R$ 150\nmouse - R$ 90\nmonitor - R$ 700",
      hints: [
        "`forEach` executa uma função para cada item.",
        "Dentro dela, `item.nome` e `item.preco` acessam o objeto.",
        "O texto do meio (` - R$ `) faz parte do template literal.",
      ],
      concepts: ["forEach", "objetos", "template literals"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — Resumo do pedido",
      description:
        "Junte tudo: itens, subtotal, frete e total a pagar. Esse é o resumo que apareceria na tela de checkout.",
      starterCode:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\n// Monte o resumo completo do pedido\n',
      solution:
        'const carrinho = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 90 },\n  { nome: "monitor", preco: 700 },\n];\nconst subtotal = carrinho.reduce((soma, item) => soma + item.preco, 0);\nconst frete = subtotal >= 500 ? 0 : 30;\ncarrinho.forEach((item) => {\n  console.log(`${item.nome} - R$ ${item.preco}`);\n});\nconsole.log(`Subtotal: ${subtotal}`);\nconsole.log(`Frete: ${frete}`);\nconsole.log(`Total: ${subtotal + frete}`);',
      expectedOutput:
        "teclado - R$ 150\nmouse - R$ 90\nmonitor - R$ 700\nSubtotal: 940\nFrete: 0\nTotal: 940",
      hints: [
        "Reaproveite o reduce e o ternário das etapas anteriores.",
        "Primeiro a lista de itens, depois os três totais.",
        "O total é `subtotal + frete`.",
      ],
      concepts: ["programa completo", "reduce", "condição", "forEach"],
    },
  ],
};

const foundationSavings: Project = {
  id: "proj-foundation-savings",
  courseId: "10",
  title: "Cofrinho de metas",
  emoji: "🐷",
  language: "JavaScript",
  goal: "Acompanhar uma meta de economia: quanto falta, quanto já foi guardado e se a meta foi batida.",
  description:
    "Projeto final dos Fundamentos. Você usa variável, operador, condição, função e repetição — na ordem em que aprendeu — para montar um acompanhamento de meta.",
  xpReward: 100,
  summary: [
    "Variáveis com nomes que explicam",
    "Operadores para calcular a diferença",
    "if/else decidindo a mensagem",
    "Função com parâmetro e return",
    "Repetição somando depósitos",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — A meta e o que já tem",
      description:
        "Crie `meta` valendo 1200 e `guardado` valendo 450. Mostre quanto ainda falta para bater a meta.",
      starterCode: "// Crie meta e guardado, depois mostre quanto falta\n",
      solution: "const meta = 1200;\nconst guardado = 450;\nconsole.log(meta - guardado);",
      expectedOutput: "750",
      hints: [
        "Números não levam aspas.",
        "Quanto falta é a meta menos o que já foi guardado.",
        "Mostre o resultado da conta direto no console.log.",
      ],
      concepts: ["variáveis", "operadores"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Bateu a meta?",
      description:
        "Use if/else: se `guardado` for maior ou igual à meta, mostre `Meta batida`; senão, mostre `Ainda falta`.",
      starterCode: "const meta = 1200;\nconst guardado = 450;\n// Decida a mensagem com if/else\n",
      solution:
        'const meta = 1200;\nconst guardado = 450;\nif (guardado >= meta) {\n  console.log("Meta batida");\n} else {\n  console.log("Ainda falta");\n}',
      expectedOutput: "Ainda falta",
      hints: [
        "A comparação é `guardado >= meta`.",
        "Cada caminho tem o seu console.log.",
        "Com 450 guardados de 1200, o programa cai no else.",
      ],
      concepts: ["condição", "if/else", "comparação"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Uma função que calcula o que falta",
      description:
        "Crie a função `quantoFalta(meta, guardado)` que devolve a diferença e mostre o resultado chamando ela.",
      starterCode: "// Crie a função quantoFalta e use ela\n",
      solution:
        "function quantoFalta(meta, guardado) {\n  return meta - guardado;\n}\n\nconsole.log(quantoFalta(1200, 450));",
      expectedOutput: "750",
      hints: [
        "A função recebe dois parâmetros entre parênteses.",
        "`return` devolve o resultado para quem chamou.",
        "Sem chamar a função, nada aparece na tela.",
      ],
      concepts: ["funções", "parâmetros", "return"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Somando os depósitos do mês",
      description:
        "Você guardou 150, 200 e 100 neste mês. Use uma repetição para somar os três depósitos e mostrar o total.",
      starterCode: "const depositos = [150, 200, 100];\n// Some os depósitos com uma repetição\n",
      solution:
        "const depositos = [150, 200, 100];\nlet total = 0;\nfor (let i = 0; i < depositos.length; i++) {\n  total = total + depositos[i];\n}\nconsole.log(total);",
      expectedOutput: "450",
      hints: [
        "Comece o total em 0 antes do loop.",
        "`depositos[i]` pega um depósito por vez.",
        "A soma acontece dentro do for; o console.log fica fora.",
      ],
      concepts: ["repetição", "acumulador", "listas"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — O acompanhamento completo",
      description:
        "Junte tudo: some os depósitos, calcule quanto falta com a sua função e mostre as duas linhas do acompanhamento.",
      starterCode:
        "const meta = 1200;\nconst depositos = [150, 200, 100];\n// Monte o acompanhamento usando a função e a repetição\n",
      solution:
        'const meta = 1200;\nconst depositos = [150, 200, 100];\n\nfunction quantoFalta(meta, guardado) {\n  return meta - guardado;\n}\n\nlet guardado = 0;\nfor (let i = 0; i < depositos.length; i++) {\n  guardado = guardado + depositos[i];\n}\n\nconsole.log("Guardado: " + guardado);\nif (guardado >= meta) {\n  console.log("Meta batida");\n} else {\n  console.log("Falta: " + quantoFalta(meta, guardado));\n}',
      expectedOutput: "Guardado: 450\nFalta: 750",
      hints: [
        "Primeiro o loop soma, depois a condição decide a mensagem.",
        "Reaproveite a função da etapa 3 sem mudar nada.",
        "Junte texto e número com o sinal de +.",
      ],
      concepts: ["programa completo", "funções", "repetição", "condição"],
    },
  ],
};

// Capstone de SQL: roda no SQLite de verdade (ver sqlSandbox.ts). Os
// `expectedOutput` foram gerados executando as consultas contra o banco.
const sqlStoreReport: Project = {
  id: "proj-sql-store-report",
  courseId: "6",
  title: "Relatório da loja em SQL",
  emoji: "🗄️",
  language: "SQL",
  goal: "Responder cinco perguntas reais de negócio consultando o banco da loja — da lista de estoque ao ranking de clientes.",
  description:
    "Projeto final do curso de SQL. Cada etapa é uma pergunta que um gerente faria, e sua consulta roda num SQLite de verdade: o que vale é o resultado que volta.",
  xpReward: 130,
  summary: [
    "SELECT com WHERE para filtrar linhas",
    "ORDER BY e LIMIT para rankings",
    "GROUP BY com COUNT para contar por grupo",
    "JOIN ligando duas tabelas pela chave",
    "SUM por cliente: o relatório final",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — O que ainda temos em estoque",
      description: "Liste `nome` e `estoque` dos produtos com estoque maior que zero.",
      starterCode: "-- Produtos disponíveis para venda\n",
      solution: "SELECT nome, estoque\nFROM produtos\nWHERE estoque > 0;",
      expectedOutput: "nome | estoque\n--------------\nTeclado | 8\nMonitor | 3\nMousepad | 25\nCabo HDMI | 12",
      hints: [
        "Escolha as colunas logo depois do SELECT.",
        "A tabela é produtos.",
        "O filtro vai no WHERE: estoque > 0.",
      ],
      concepts: ["SELECT", "WHERE"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Os três mais caros",
      description: "Mostre `nome` e `preco` dos três produtos mais caros, do maior para o menor.",
      starterCode: "-- Ranking de preço\n",
      solution: "SELECT nome, preco\nFROM produtos\nORDER BY preco DESC\nLIMIT 3;",
      expectedOutput: "nome | preco\n------------\nMonitor | 700\nTeclado | 150\nMouse | 90",
      hints: [
        "ORDER BY define a ordem do resultado.",
        "DESC ordena do maior para o menor.",
        "LIMIT corta o resultado nas primeiras linhas.",
      ],
      concepts: ["ORDER BY", "LIMIT"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Quantos produtos por categoria",
      description: "Conte quantos produtos existem em cada `categoria`.",
      starterCode: "-- Contagem por categoria\n",
      solution: "SELECT categoria, COUNT(*)\nFROM produtos\nGROUP BY categoria;",
      expectedOutput: "categoria | COUNT(*)\n--------------------\ncabo | 1\nperiferico | 3\ntela | 1",
      hints: [
        "GROUP BY junta as linhas que têm o mesmo valor.",
        "COUNT(*) conta as linhas de cada grupo.",
        "A coluna do GROUP BY também aparece no SELECT.",
      ],
      concepts: ["GROUP BY", "COUNT"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Pedidos com o nome do cliente",
      description:
        "Junte `pedidos` e `clientes` pela chave `cliente_id` e mostre o id do pedido, o nome do cliente e o total.",
      starterCode: "-- Pedidos com o nome de quem comprou\n",
      solution:
        "SELECT pedidos.id, clientes.nome, pedidos.total\nFROM pedidos\nJOIN clientes ON pedidos.cliente_id = clientes.id;",
      expectedOutput: "id | nome | total\n-----------------\n10 | Ana Souza | 240\n11 | Bruno Lima | 90\n12 | Ana Souza | 700",
      hints: [
        "JOIN liga as duas tabelas.",
        "A condição do ON é pedidos.cliente_id = clientes.id.",
        "Use tabela.coluna quando o nome existir nas duas.",
      ],
      concepts: ["JOIN", "chave estrangeira"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — Quanto cada cliente já gastou",
      description:
        "O relatório final: some o total dos pedidos por cliente e ordene do maior gasto para o menor, chamando a soma de `gasto`.",
      starterCode: "-- Ranking de clientes por valor gasto\n",
      solution:
        "SELECT clientes.nome, SUM(pedidos.total) AS gasto\nFROM pedidos\nJOIN clientes ON pedidos.cliente_id = clientes.id\nGROUP BY clientes.nome\nORDER BY gasto DESC;",
      expectedOutput: "nome | gasto\n------------\nAna Souza | 940\nBruno Lima | 90",
      hints: [
        "Comece do JOIN da etapa anterior.",
        "SUM(pedidos.total) soma os valores de cada grupo.",
        "AS dá um nome à coluna calculada, e dá para ordenar por ele.",
      ],
      concepts: ["JOIN", "GROUP BY", "SUM", "alias"],
    },
  ],
};

// HTML e CSS não têm saída de execução: o gabarito é um marcador que precisa
// existir no código — mesma convenção das lições desses cursos.
const htmlPortfolio: Project = {
  id: "proj-html-portfolio",
  courseId: "9",
  title: "Página de portfólio",
  emoji: "💼",
  language: "HTML",
  goal: "Escrever, do zero, a estrutura semântica de uma página de portfólio — cabeçalho, sobre, projetos e contato.",
  description:
    "Projeto final de HTML. Cada etapa acrescenta um bloco à MESMA página, na ordem em que um navegador (e um leitor de tela) lê o documento.",
  xpReward: 110,
  summary: [
    "header com identificação e navegação",
    "section e h2 organizando o conteúdo",
    "listas para conjuntos de itens",
    "formulário com label associado ao input",
    "documento completo com lang e title",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Cabeçalho da página",
      description: "Crie um `<header>` com seu nome em `<h1>` e um `<nav>` com links para #sobre e #projetos.",
      starterCode: "<!-- Cabeçalho do portfólio -->\n",
      solution:
        '<header>\n  <h1>Ana Souza</h1>\n  <nav>\n    <a href="#sobre">Sobre</a>\n    <a href="#projetos">Projetos</a>\n  </nav>\n</header>',
      expectedOutput: "<header>",
      hints: [
        "O h1 é o título principal — só um por página.",
        "Links de navegação ficam dentro de nav.",
        'Um link interno aponta para o id: href="#sobre".',
      ],
      concepts: ["header", "h1", "nav", "âncora"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Seção sobre você",
      description: 'Adicione uma `<section id="sobre">` com um `<h2>` e um parágrafo de apresentação.',
      starterCode: "<header>\n  <h1>Ana Souza</h1>\n</header>\n<!-- Adicione a seção Sobre -->\n",
      solution:
        '<header>\n  <h1>Ana Souza</h1>\n</header>\n<section id="sobre">\n  <h2>Sobre mim</h2>\n  <p>Estudo programação e construo pequenos projetos para praticar.</p>\n</section>',
      expectedOutput: '<section id="sobre">',
      hints: [
        "section agrupa um assunto da página.",
        "O id é o que faz o link #sobre funcionar.",
        "Depois do h1 vem h2 — a hierarquia não pula níveis.",
      ],
      concepts: ["section", "id", "hierarquia de títulos"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Lista de projetos",
      description: 'Crie uma `<section id="projetos">` com um `<h2>` e uma lista `<ul>` de três projetos.',
      starterCode: "<!-- Seção de projetos com uma lista -->\n",
      solution:
        '<section id="projetos">\n  <h2>Projetos</h2>\n  <ul>\n    <li>Calculadora em JavaScript</li>\n    <li>Relatório de gastos em Python</li>\n    <li>Página de portfólio em HTML</li>\n  </ul>\n</section>',
      expectedOutput: "<ul>",
      hints: [
        "ul é uma lista sem ordem; cada item é um li.",
        "Cada projeto vira um li.",
        "A seção precisa do id para o link do menu funcionar.",
      ],
      concepts: ["ul", "li", "listas"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Formulário de contato",
      description: "Adicione um `<form>` com um `<label>` ligado a um `<input>` de e-mail e um botão de enviar.",
      starterCode: "<!-- Formulário de contato acessível -->\n",
      solution:
        '<form>\n  <label for="email">Seu e-mail</label>\n  <input id="email" type="email" name="email">\n  <button type="submit">Enviar</button>\n</form>',
      expectedOutput: '<label for="email">',
      hints: [
        "O for do label precisa ser igual ao id do input.",
        'type="email" ajuda o teclado do celular e a validação.',
        "É esse par label/input que faz o leitor de tela anunciar o campo.",
      ],
      concepts: ["form", "label", "input", "acessibilidade"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — A página completa",
      description:
        "Junte tudo num documento válido: doctype, html com lang, head com title e o body com header, seções, formulário e footer.",
      starterCode: "<!-- Monte o documento completo -->\n",
      solution:
        '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Portfólio de Ana Souza</title>\n</head>\n<body>\n  <header>\n    <h1>Ana Souza</h1>\n    <nav>\n      <a href="#sobre">Sobre</a>\n      <a href="#projetos">Projetos</a>\n    </nav>\n  </header>\n  <section id="sobre">\n    <h2>Sobre mim</h2>\n    <p>Estudo programação e construo pequenos projetos para praticar.</p>\n  </section>\n  <section id="projetos">\n    <h2>Projetos</h2>\n    <ul>\n      <li>Calculadora em JavaScript</li>\n      <li>Relatório de gastos em Python</li>\n      <li>Página de portfólio em HTML</li>\n    </ul>\n  </section>\n  <form>\n    <label for="email">Seu e-mail</label>\n    <input id="email" type="email" name="email">\n    <button type="submit">Enviar</button>\n  </form>\n  <footer>\n    <p>Feito por Ana Souza</p>\n  </footer>\n</body>\n</html>',
      expectedOutput: "<!DOCTYPE html>",
      hints: [
        "O lang no html diz o idioma para leitores de tela e buscadores.",
        "title é o que aparece na aba do navegador.",
        "Reaproveite os blocos que você já escreveu, na ordem em que aparecem.",
      ],
      concepts: ["documento HTML", "head", "body", "footer"],
    },
  ],
};

const cssProfileCard: Project = {
  id: "proj-css-profile-card",
  courseId: "4",
  title: "Cartão de perfil responsivo",
  emoji: "🎨",
  language: "CSS",
  goal: "Estilizar um cartão de perfil do zero: cores, espaçamento, layout em flex, estado de hover e adaptação ao celular.",
  description:
    "Projeto final de CSS. Cada etapa acrescenta uma camada ao MESMO cartão, na ordem em que se estiliza de verdade: base, espaço, layout, interação e responsividade.",
  xpReward: 110,
  summary: [
    "Seletor de classe e cores",
    "Box model: padding, borda e raio",
    "Flexbox alinhando avatar e texto",
    "Hover como retorno visual",
    "Media query adaptando ao celular",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — A base do cartão",
      description: "Crie a classe `.cartao` com fundo branco, cor de texto escura e largura máxima de 360px.",
      starterCode: "/* Estilo base do cartão */\n",
      solution: ".cartao {\n  background: #ffffff;\n  color: #1b2a22;\n  max-width: 360px;\n}",
      expectedOutput: ".cartao",
      hints: [
        "Um seletor de classe começa com ponto.",
        "background define o fundo; color, o texto.",
        "max-width impede o cartão de esticar demais.",
      ],
      concepts: ["seletor de classe", "cores", "max-width"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Respiro e borda",
      description: "Dê `padding` de 20px, borda arredondada de 16px e uma borda fina cinza ao cartão.",
      starterCode:
        ".cartao {\n  background: #ffffff;\n  color: #1b2a22;\n  max-width: 360px;\n}\n/* Acrescente respiro e borda */\n",
      solution:
        ".cartao {\n  background: #ffffff;\n  color: #1b2a22;\n  max-width: 360px;\n  padding: 20px;\n  border: 1px solid #d9e2dc;\n  border-radius: 16px;\n}",
      expectedOutput: "border-radius: 16px",
      hints: [
        "padding é o espaço DENTRO do elemento.",
        "border pede espessura, estilo e cor.",
        "border-radius arredonda os cantos.",
      ],
      concepts: ["box model", "padding", "border-radius"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Avatar e texto lado a lado",
      description: "Use Flexbox em `.cartao` para alinhar avatar e texto na horizontal, com 16px entre eles.",
      starterCode: ".cartao {\n  padding: 20px;\n  border-radius: 16px;\n}\n/* Alinhe o conteúdo com flex */\n",
      solution:
        ".cartao {\n  padding: 20px;\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}",
      expectedOutput: "display: flex",
      hints: [
        "display: flex coloca os filhos em linha.",
        "align-items: center alinha pelo meio na vertical.",
        "gap cria o espaço entre os itens sem margin.",
      ],
      concepts: ["flexbox", "align-items", "gap"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Retorno visual no hover",
      description: "Faça o cartão ganhar sombra ao passar o mouse, com uma transição suave.",
      starterCode: ".cartao {\n  padding: 20px;\n  border-radius: 16px;\n}\n/* Acrescente transição e hover */\n",
      solution:
        ".cartao {\n  padding: 20px;\n  border-radius: 16px;\n  transition: box-shadow 0.2s ease;\n}\n\n.cartao:hover {\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n}",
      expectedOutput: ".cartao:hover",
      hints: [
        ":hover é o estado de quando o ponteiro está em cima.",
        "A transição fica no elemento normal, não no :hover.",
        "box-shadow recebe deslocamento, desfoque e cor.",
      ],
      concepts: ["hover", "transition", "box-shadow"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — Adaptado ao celular",
      description:
        "Em telas de até 480px, empilhe o conteúdo do cartão (coluna) e centralize. Esse é o cartão final.",
      starterCode:
        ".cartao {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n  border-radius: 16px;\n}\n/* Adapte para telas pequenas */\n",
      solution:
        ".cartao {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n  border-radius: 16px;\n}\n\n@media (max-width: 480px) {\n  .cartao {\n    flex-direction: column;\n    text-align: center;\n  }\n}",
      expectedOutput: "@media (max-width: 480px)",
      hints: [
        "A media query cria regras só para certas larguras.",
        "flex-direction: column empilha os filhos.",
        "As regras de dentro sobrescrevem as de fora naquela largura.",
      ],
      concepts: ["media query", "responsividade", "flex-direction"],
    },
  ],
};

// Node sem servidor de verdade: o worker não tem `http`, então o capstone
// constrói a LÓGICA da API (dados, handlers, roteador, respostas) em
// JavaScript puro — que roda e é corrigido pela saída real.
const nodeTaskApi: Project = {
  id: "proj-node-task-api-real",
  courseId: "5",
  title: "API de tarefas (lógica completa)",
  emoji: "🟢",
  language: "JavaScript",
  goal: "Construir o miolo de uma API REST: dados em memória, handlers, roteador e respostas com status — a parte que realmente decide o comportamento do backend.",
  description:
    "Projeto final de Node.js. Em vez de decorar `http.createServer`, você escreve o que um framework chamaria: as funções que criam, listam e concluem tarefas, e o roteador que devolve status e corpo.",
  xpReward: 130,
  summary: [
    "Estado em memória e função de listagem",
    "Handler de criação devolvendo o recurso criado",
    "Atualização com tratamento de id inexistente",
    "Roteador despachando método + caminho",
    "Respostas com status: 200, 201, 404",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Os dados e a listagem",
      description:
        "Crie o array `tarefas` com duas tarefas ({ id, titulo, feita }) e a função `listar()` que devolve esse array. Mostre a lista em JSON.",
      starterCode: "// Dados em memória e a função listar\n",
      solution:
        'const tarefas = [\n  { id: 1, titulo: "Estudar rotas", feita: false },\n  { id: 2, titulo: "Escrever testes", feita: true },\n];\n\nfunction listar() {\n  return tarefas;\n}\n\nconsole.log(JSON.stringify(listar()));',
      expectedOutput:
        '[{"id":1,"titulo":"Estudar rotas","feita":false},{"id":2,"titulo":"Escrever testes","feita":true}]',
      hints: [
        "Cada tarefa é um objeto com id, titulo e feita.",
        "listar() só precisa devolver o array com return.",
        "JSON.stringify mostra o array como a API responderia.",
      ],
      concepts: ["estado em memória", "função", "JSON"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Criar uma tarefa",
      description:
        "Escreva `criar(titulo)`: ela gera o próximo id, adiciona a tarefa (feita: false) e devolve a tarefa criada. Mostre o retorno.",
      starterCode:
        'const tarefas = [\n  { id: 1, titulo: "Estudar rotas", feita: false },\n  { id: 2, titulo: "Escrever testes", feita: true },\n];\n// Crie a função criar(titulo)\n',
      solution:
        'const tarefas = [\n  { id: 1, titulo: "Estudar rotas", feita: false },\n  { id: 2, titulo: "Escrever testes", feita: true },\n];\n\nfunction criar(titulo) {\n  const nova = { id: tarefas.length + 1, titulo, feita: false };\n  tarefas.push(nova);\n  return nova;\n}\n\nconsole.log(JSON.stringify(criar("Publicar API")));',
      expectedOutput: '{"id":3,"titulo":"Publicar API","feita":false}',
      hints: [
        "O próximo id pode sair de tarefas.length + 1.",
        "push adiciona no array; return devolve o que foi criado.",
        "Uma API devolve o recurso criado, não só uma mensagem.",
      ],
      concepts: ["POST", "criação de recurso", "return"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Concluir (e o que fazer se não existir)",
      description:
        "Escreva `concluir(id)`: marca a tarefa como feita e a devolve; se o id não existir, devolve `null`. Mostre os dois casos.",
      starterCode:
        'const tarefas = [\n  { id: 1, titulo: "Estudar rotas", feita: false },\n];\n// Crie a função concluir(id)\n',
      solution:
        'const tarefas = [\n  { id: 1, titulo: "Estudar rotas", feita: false },\n];\n\nfunction concluir(id) {\n  const alvo = tarefas.find((tarefa) => tarefa.id === id);\n  if (!alvo) {\n    return null;\n  }\n  alvo.feita = true;\n  return alvo;\n}\n\nconsole.log(JSON.stringify(concluir(1)));\nconsole.log(JSON.stringify(concluir(99)));',
      expectedOutput: '{"id":1,"titulo":"Estudar rotas","feita":true}\nnull',
      hints: [
        "find devolve o primeiro item que satisfaz a condição.",
        "Se não achou, saia cedo com return null.",
        "Tratar o caso inexistente é o que vira o 404 lá na frente.",
      ],
      concepts: ["find", "atualização", "caso de erro"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — O roteador",
      description:
        "Crie `rota(metodo, caminho)` devolvendo `{ status, corpo }`: GET /tarefas → 200 com a lista; POST /tarefas → 201; qualquer outra coisa → 404 com { erro: 'nao encontrado' }. Mostre a rota desconhecida.",
      starterCode:
        'const tarefas = [{ id: 1, titulo: "Estudar rotas", feita: false }];\nfunction listar() {\n  return tarefas;\n}\n// Crie o roteador\n',
      solution:
        'const tarefas = [{ id: 1, titulo: "Estudar rotas", feita: false }];\nfunction listar() {\n  return tarefas;\n}\n\nfunction rota(metodo, caminho) {\n  if (metodo === "GET" && caminho === "/tarefas") {\n    return { status: 200, corpo: listar() };\n  }\n  if (metodo === "POST" && caminho === "/tarefas") {\n    return { status: 201, corpo: { criado: true } };\n  }\n  return { status: 404, corpo: { erro: "nao encontrado" } };\n}\n\nconsole.log(JSON.stringify(rota("DELETE", "/nada")));',
      expectedOutput: '{"status":404,"corpo":{"erro":"nao encontrado"}}',
      hints: [
        "Cada rota é uma comparação de método E caminho.",
        "O return final é o fallback: nada casou, então 404.",
        "201 é o status de 'criado', diferente do 200 de 'ok'.",
      ],
      concepts: ["roteamento", "status HTTP", "fallback"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — A API respondendo",
      description:
        "Junte tudo e simule três requisições: GET /tarefas, POST /tarefas e GET /clientes. Mostre o status e o corpo de cada resposta.",
      starterCode: "// Monte a API completa e simule as três requisições\n",
      solution:
        'const tarefas = [{ id: 1, titulo: "Estudar rotas", feita: false }];\n\nfunction listar() {\n  return tarefas;\n}\n\nfunction criar(titulo) {\n  const nova = { id: tarefas.length + 1, titulo, feita: false };\n  tarefas.push(nova);\n  return nova;\n}\n\nfunction rota(metodo, caminho) {\n  if (metodo === "GET" && caminho === "/tarefas") {\n    return { status: 200, corpo: listar() };\n  }\n  if (metodo === "POST" && caminho === "/tarefas") {\n    return { status: 201, corpo: criar("Nova tarefa") };\n  }\n  return { status: 404, corpo: { erro: "nao encontrado" } };\n}\n\nconst requisicoes = [\n  ["GET", "/tarefas"],\n  ["POST", "/tarefas"],\n  ["GET", "/clientes"],\n];\n\nrequisicoes.forEach(([metodo, caminho]) => {\n  const resposta = rota(metodo, caminho);\n  console.log(metodo + " " + caminho + " -> " + resposta.status + " " + JSON.stringify(resposta.corpo));\n});',
      expectedOutput:
        'GET /tarefas -> 200 [{"id":1,"titulo":"Estudar rotas","feita":false}]\nPOST /tarefas -> 201 {"id":2,"titulo":"Nova tarefa","feita":false}\nGET /clientes -> 404 {"erro":"nao encontrado"}',
      hints: [
        "Reaproveite listar, criar e rota das etapas anteriores.",
        "forEach com desestruturação lê o par [metodo, caminho].",
        "Repare que o POST muda o estado: o GET seguinte veria a nova tarefa.",
      ],
      concepts: ["API completa", "ciclo requisição/resposta", "estado"],
    },
  ],
};

const algorithmsSearch: Project = {
  id: "proj-algo-search-report",
  courseId: "8",
  title: "Busca e ordenação num catálogo",
  emoji: "🧩",
  language: "Python",
  goal: "Medir na prática por que a estratégia importa: contar as comparações da busca linear e da binária no mesmo catálogo.",
  description:
    "Projeto final de Algoritmos. Você implementa as duas buscas, conta as comparações de verdade e fecha com um relatório que mostra a diferença de custo.",
  xpReward: 130,
  summary: [
    "Busca linear percorrendo item a item",
    "Ordenação como pré-requisito da busca binária",
    "Busca binária cortando o espaço pela metade",
    "Contagem de comparações como medida de custo",
    "Relatório comparando as duas estratégias",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Busca linear contando comparações",
      description:
        "Com `precos = [45, 12, 78, 33, 90, 5, 61, 27]`, escreva `busca_linear(valores, alvo)` que devolve quantas comparações foram feitas até achar 61.",
      starterCode: "precos = [45, 12, 78, 33, 90, 5, 61, 27]\n# Implemente a busca linear contando comparações\n",
      solution:
        "precos = [45, 12, 78, 33, 90, 5, 61, 27]\n\ndef busca_linear(valores, alvo):\n    comparacoes = 0\n    for valor in valores:\n        comparacoes += 1\n        if valor == alvo:\n            return comparacoes\n    return comparacoes\n\nprint(busca_linear(precos, 61))",
      expectedOutput: "7",
      hints: [
        "Some 1 em comparacoes a cada volta do for.",
        "Quando encontrar o alvo, devolva a contagem com return.",
        "O 61 está na sétima posição da lista.",
      ],
      concepts: ["busca linear", "contagem", "O(n)"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Ordenar é o pedágio da busca binária",
      description: "Ordene a lista com `sorted()` e mostre o resultado.",
      starterCode: "precos = [45, 12, 78, 33, 90, 5, 61, 27]\n# Ordene a lista\n",
      solution: "precos = [45, 12, 78, 33, 90, 5, 61, 27]\nordenados = sorted(precos)\nprint(ordenados)",
      expectedOutput: "[5, 12, 27, 33, 45, 61, 78, 90]",
      hints: [
        "sorted() devolve uma lista nova ordenada.",
        "Guarde em outra variável para manter a original.",
        "Busca binária só funciona em lista ordenada — por isso esta etapa.",
      ],
      concepts: ["sorted", "pré-requisito", "custo de ordenar"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Busca binária",
      description:
        "Escreva `busca_binaria(valores, alvo)` que devolve quantas comparações foram feitas até achar 61 na lista ordenada.",
      starterCode:
        "ordenados = [5, 12, 27, 33, 45, 61, 78, 90]\n# Implemente a busca binária contando comparações\n",
      solution:
        "ordenados = [5, 12, 27, 33, 45, 61, 78, 90]\n\ndef busca_binaria(valores, alvo):\n    inicio = 0\n    fim = len(valores) - 1\n    comparacoes = 0\n    while inicio <= fim:\n        meio = (inicio + fim) // 2\n        comparacoes += 1\n        if valores[meio] == alvo:\n            return comparacoes\n        if valores[meio] < alvo:\n            inicio = meio + 1\n        else:\n            fim = meio - 1\n    return comparacoes\n\nprint(busca_binaria(ordenados, 61))",
      expectedOutput: "2",
      hints: [
        "O meio é (inicio + fim) // 2 — divisão inteira.",
        "Se o meio for menor que o alvo, o alvo está à direita.",
        "Cada volta descarta METADE do que sobrou.",
      ],
      concepts: ["busca binária", "divisão e conquista", "O(log n)"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — O caso que não existe",
      description:
        "Mostre quantas comparações a busca binária faz procurando 100, que não está na lista.",
      starterCode:
        "ordenados = [5, 12, 27, 33, 45, 61, 78, 90]\n\ndef busca_binaria(valores, alvo):\n    inicio = 0\n    fim = len(valores) - 1\n    comparacoes = 0\n    while inicio <= fim:\n        meio = (inicio + fim) // 2\n        comparacoes += 1\n        if valores[meio] == alvo:\n            return comparacoes\n        if valores[meio] < alvo:\n            inicio = meio + 1\n        else:\n            fim = meio - 1\n    return comparacoes\n\n# Procure um valor que não existe\n",
      solution:
        "ordenados = [5, 12, 27, 33, 45, 61, 78, 90]\n\ndef busca_binaria(valores, alvo):\n    inicio = 0\n    fim = len(valores) - 1\n    comparacoes = 0\n    while inicio <= fim:\n        meio = (inicio + fim) // 2\n        comparacoes += 1\n        if valores[meio] == alvo:\n            return comparacoes\n        if valores[meio] < alvo:\n            inicio = meio + 1\n        else:\n            fim = meio - 1\n    return comparacoes\n\nprint(busca_binaria(ordenados, 100))",
      expectedOutput: "4",
      hints: [
        "O while termina quando inicio passa de fim.",
        "Mesmo sem achar, a função devolve o total de comparações.",
        "Procurar algo que não existe é o PIOR caso: o intervalo é cortado até sobrar nada.",
      ],
      concepts: ["pior caso", "término do laço", "complexidade"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — O relatório de custo",
      description:
        "Junte tudo e imprima as comparações de cada estratégia para o mesmo alvo, mais a conclusão de qual saiu na frente.",
      starterCode: "precos = [45, 12, 78, 33, 90, 5, 61, 27]\n# Compare as duas estratégias\n",
      solution:
        'precos = [45, 12, 78, 33, 90, 5, 61, 27]\n\ndef busca_linear(valores, alvo):\n    comparacoes = 0\n    for valor in valores:\n        comparacoes += 1\n        if valor == alvo:\n            return comparacoes\n    return comparacoes\n\ndef busca_binaria(valores, alvo):\n    inicio = 0\n    fim = len(valores) - 1\n    comparacoes = 0\n    while inicio <= fim:\n        meio = (inicio + fim) // 2\n        comparacoes += 1\n        if valores[meio] == alvo:\n            return comparacoes\n        if valores[meio] < alvo:\n            inicio = meio + 1\n        else:\n            fim = meio - 1\n    return comparacoes\n\nalvo = 61\nlinear = busca_linear(precos, alvo)\nbinaria = busca_binaria(sorted(precos), alvo)\nprint("Alvo:", alvo)\nprint("Linear:", linear, "comparações")\nprint("Binária:", binaria, "comparações")\nprint("Vencedora: binária" if binaria < linear else "Vencedora: linear")',
      expectedOutput: "Alvo: 61\nLinear: 7 comparações\nBinária: 2 comparações\nVencedora: binária",
      hints: [
        "Reaproveite as duas funções que você já escreveu.",
        "A binária precisa receber a lista ordenada.",
        "print aceita vários valores separados por vírgula.",
      ],
      concepts: ["comparação de estratégias", "medição", "conclusão"],
    },
  ],
};

const dataSalesReport: Project = {
  id: "proj-data-sales-real",
  courseId: "12",
  title: "Resumo de vendas do CSV",
  emoji: "📊",
  language: "Python",
  goal: "Transformar linhas cruas de um CSV em decisão: total, média, filtro por região e o produto campeão.",
  description:
    "Projeto final de Dados e IA. Você trata os dados como eles chegam (texto separado por vírgula) e entrega um resumo que responde perguntas de negócio.",
  xpReward: 130,
  summary: [
    "Linhas de CSV viram listas de campos",
    "Conversão de texto para número",
    "Soma e média com sum/len",
    "Filtro por categoria com if",
    "Campeão de vendas com max e key",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Quebrar as linhas do CSV",
      description:
        "Com `linhas = ['teclado,sul,150', 'mouse,norte,90', 'monitor,sul,700']`, mostre só os nomes dos produtos.",
      starterCode:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n# Mostre o nome de cada produto\n',
      solution:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n\nfor linha in linhas:\n    campos = linha.split(",")\n    print(campos[0])',
      expectedOutput: "teclado\nmouse\nmonitor",
      hints: [
        'split(",") quebra o texto onde tem vírgula.',
        "O resultado é uma lista: campos[0] é o primeiro pedaço.",
        "É exatamente assim que um CSV é lido linha a linha.",
      ],
      concepts: ["split", "CSV", "for"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Texto vira número",
      description: "Some os valores das vendas. Lembre que eles vêm como texto e precisam virar número.",
      starterCode:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n# Some os valores\n',
      solution:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n\ntotal = 0\nfor linha in linhas:\n    campos = linha.split(",")\n    total += int(campos[2])\n\nprint(total)',
      expectedOutput: "940",
      hints: [
        'int("150") transforma o texto em número.',
        "Sem a conversão, o + junta textos em vez de somar.",
        "O valor é o terceiro campo: campos[2].",
      ],
      concepts: ["conversão de tipo", "acumulador", "int"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Média por venda",
      description: "Mostre a média das vendas com duas casas decimais, no formato `Média: 313.33`.",
      starterCode:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n# Calcule e mostre a média\n',
      solution:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n\nvalores = [int(linha.split(",")[2]) for linha in linhas]\nmedia = sum(valores) / len(valores)\nprint(f"Média: {media:.2f}")',
      expectedOutput: "Média: 313.33",
      hints: [
        "A list comprehension monta a lista de valores numa linha.",
        "média = soma / quantidade.",
        ":.2f arredonda para duas casas na f-string.",
      ],
      concepts: ["list comprehension", "média", "formatação"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Só a região sul",
      description: "Some apenas as vendas da região `sul` e mostre `Sul: 850`.",
      starterCode:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n# Some apenas a região sul\n',
      solution:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n\ntotal_sul = 0\nfor linha in linhas:\n    produto, regiao, valor = linha.split(",")\n    if regiao == "sul":\n        total_sul += int(valor)\n\nprint(f"Sul: {total_sul}")',
      expectedOutput: "Sul: 850",
      hints: [
        "split devolve três campos — dá para desempacotar direto em três variáveis.",
        "O if decide o que entra na soma.",
        "Compare textos com ==.",
      ],
      concepts: ["desempacotamento", "filtro", "if"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — O resumo que decide",
      description:
        "Feche o relatório: total, média, total do sul e o produto de maior valor.",
      starterCode:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n# Monte o resumo completo\n',
      solution:
        'linhas = ["teclado,sul,150", "mouse,norte,90", "monitor,sul,700"]\n\nvendas = []\nfor linha in linhas:\n    produto, regiao, valor = linha.split(",")\n    vendas.append({"produto": produto, "regiao": regiao, "valor": int(valor)})\n\ntotal = sum(venda["valor"] for venda in vendas)\nmedia = total / len(vendas)\ntotal_sul = sum(venda["valor"] for venda in vendas if venda["regiao"] == "sul")\ncampeao = max(vendas, key=lambda venda: venda["valor"])\n\nprint("Resumo de vendas")\nprint(f"Total: {total}")\nprint(f"Média: {media:.2f}")\nprint(f"Sul: {total_sul}")\nprint(f"Campeão: {campeao[\'produto\']}")',
      expectedOutput: "Resumo de vendas\nTotal: 940\nMédia: 313.33\nSul: 850\nCampeão: monitor",
      hints: [
        "Guardar cada venda como dicionário deixa o resto do código legível.",
        "sum(...) aceita uma expressão com for e até com if.",
        "max com key compara pelo campo que você escolher.",
      ],
      concepts: ["dicionários", "agregação", "max com key", "relatório"],
    },
  ],
};

const gameScoreboard: Project = {
  id: "proj-game-scoreboard",
  courseId: "13",
  title: "Placar com vidas e recorde",
  emoji: "🎮",
  language: "JavaScript",
  goal: "Programar as regras de um jogo: pontuação, vidas, fim de partida e recorde — o estado que todo jogo precisa administrar.",
  description:
    "Projeto final de Jogos. Cada etapa acrescenta uma regra ao MESMO jogo, até a partida rodar sozinha e imprimir o placar final.",
  xpReward: 120,
  summary: [
    "Estado do jogo num objeto",
    "Funções que alteram o estado",
    "Loop processando as rodadas",
    "Condição de fim de jogo",
    "Recorde comparando partidas",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — O estado inicial",
      description: "Crie o objeto `jogo` com `pontos: 0` e `vidas: 3` e mostre-o em JSON.",
      starterCode: "// Estado inicial do jogo\n",
      solution: "const jogo = { pontos: 0, vidas: 3 };\nconsole.log(JSON.stringify(jogo));",
      expectedOutput: '{"pontos":0,"vidas":3}',
      hints: [
        "Um objeto agrupa os dados que mudam juntos.",
        "Pontos começam em zero e vidas em três.",
        "JSON.stringify mostra o objeto inteiro de uma vez.",
      ],
      concepts: ["estado", "objeto"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Acertou e errou",
      description:
        "Crie `acertou()` somando 10 pontos e `errou()` tirando uma vida. Aplique um acerto e um erro e mostre o estado.",
      starterCode: "const jogo = { pontos: 0, vidas: 3 };\n// Crie as funções acertou e errou\n",
      solution:
        "const jogo = { pontos: 0, vidas: 3 };\n\nfunction acertou() {\n  jogo.pontos += 10;\n}\n\nfunction errou() {\n  jogo.vidas -= 1;\n}\n\nacertou();\nerrou();\nconsole.log(JSON.stringify(jogo));",
      expectedOutput: '{"pontos":10,"vidas":2}',
      hints: [
        "As funções mudam o objeto jogo diretamente.",
        "+= soma no valor atual; -= subtrai.",
        "Chame as funções antes de mostrar o estado.",
      ],
      concepts: ["funções", "mutação de estado"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — A partida roda sozinha",
      description:
        "Com `rodadas = [true, false, true, true]` (true = acerto), percorra as rodadas aplicando as regras e mostre o estado final.",
      starterCode:
        "const jogo = { pontos: 0, vidas: 3 };\nconst rodadas = [true, false, true, true];\n// Processe as rodadas\n",
      solution:
        "const jogo = { pontos: 0, vidas: 3 };\nconst rodadas = [true, false, true, true];\n\nrodadas.forEach((acerto) => {\n  if (acerto) {\n    jogo.pontos += 10;\n  } else {\n    jogo.vidas -= 1;\n  }\n});\n\nconsole.log(JSON.stringify(jogo));",
      expectedOutput: '{"pontos":30,"vidas":2}',
      hints: [
        "forEach entrega uma rodada por vez.",
        "O if decide qual regra aplicar.",
        "Três acertos valem 30 pontos; um erro custa uma vida.",
      ],
      concepts: ["loop", "condição", "regras do jogo"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Fim de jogo",
      description:
        "Com `rodadas = [true, false, false, false, true]`, pare de processar quando as vidas chegarem a zero e mostre o estado.",
      starterCode:
        "const jogo = { pontos: 0, vidas: 3 };\nconst rodadas = [true, false, false, false, true];\n// Pare quando acabarem as vidas\n",
      solution:
        "const jogo = { pontos: 0, vidas: 3 };\nconst rodadas = [true, false, false, false, true];\n\nfor (const acerto of rodadas) {\n  if (jogo.vidas === 0) {\n    break;\n  }\n  if (acerto) {\n    jogo.pontos += 10;\n  } else {\n    jogo.vidas -= 1;\n  }\n}\n\nconsole.log(JSON.stringify(jogo));",
      expectedOutput: '{"pontos":10,"vidas":0}',
      hints: [
        "forEach não tem como parar no meio — use for...of com break.",
        "Cheque as vidas ANTES de processar a rodada.",
        "A última rodada não deve contar: o jogo já acabou.",
      ],
      concepts: ["break", "condição de término", "for...of"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — Placar final e recorde",
      description:
        "Feche o jogo: rode a partida, compare com o recorde anterior de 25 pontos e mostre as três linhas do placar.",
      starterCode:
        "const recordeAnterior = 25;\nconst rodadas = [true, true, false, true];\n// Monte o placar final\n",
      solution:
        'const recordeAnterior = 25;\nconst rodadas = [true, true, false, true];\nconst jogo = { pontos: 0, vidas: 3 };\n\nfor (const acerto of rodadas) {\n  if (jogo.vidas === 0) {\n    break;\n  }\n  if (acerto) {\n    jogo.pontos += 10;\n  } else {\n    jogo.vidas -= 1;\n  }\n}\n\nconst recorde = Math.max(recordeAnterior, jogo.pontos);\nconsole.log("Pontos: " + jogo.pontos);\nconsole.log("Vidas restantes: " + jogo.vidas);\nconsole.log("Recorde: " + recorde);',
      expectedOutput: "Pontos: 30\nVidas restantes: 2\nRecorde: 30",
      hints: [
        "Reaproveite o laço com break da etapa anterior.",
        "Math.max devolve o maior entre dois números.",
        "Junte texto e número com o sinal de +.",
      ],
      concepts: ["jogo completo", "Math.max", "recorde"],
    },
  ],
};

// React, React Native e Git não têm runtime no navegador: o gabarito é um
// marcador que precisa aparecer no código, como já acontece nas lições desses
// cursos. O código das etapas é real e completo mesmo assim.
const reactTaskPanel: Project = {
  id: "proj-react-task-panel",
  courseId: "3",
  title: "Painel de tarefas em React",
  emoji: "⚛️",
  language: "React",
  goal: "Construir um painel de tarefas de verdade: componente, props, estado, lista renderizada e um contador derivado.",
  description:
    "Projeto final de React. Cada etapa acrescenta uma peça ao MESMO painel — de um componente estático até a lista interativa com estado.",
  xpReward: 130,
  summary: [
    "Componente e JSX",
    "Props para receber dados de fora",
    "useState guardando a lista",
    "Renderizar lista com map e key",
    "Valor derivado do estado",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — O componente do item",
      description: "Crie o componente `Tarefa` que recebe `titulo` por props e renderiza um `<li>`.",
      starterCode: "// Componente de um item da lista\n",
      solution: "function Tarefa({ titulo }) {\n  return <li>{titulo}</li>;\n}\n\nexport default Tarefa;",
      expectedOutput: "function Tarefa({ titulo })",
      hints: [
        "Props chegam como um objeto — dá para desestruturar direto na assinatura.",
        "Chaves { } dentro do JSX mostram o valor de uma variável.",
        "Um componente devolve JSX com return.",
      ],
      concepts: ["componente", "props", "JSX"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Estado com a lista",
      description: "No `Painel`, guarde a lista de tarefas com `useState` e mostre quantas existem.",
      starterCode: "import { useState } from 'react';\n\n// Crie o Painel com estado\n",
      solution:
        "import { useState } from 'react';\n\nfunction Painel() {\n  const [tarefas, setTarefas] = useState([\"Estudar props\", \"Praticar estado\"]);\n\n  return <p>{tarefas.length} tarefas</p>;\n}\n\nexport default Painel;",
      expectedOutput: "useState(",
      hints: [
        "useState devolve o valor atual e a função que atualiza.",
        "O valor inicial vai dentro dos parênteses.",
        "tarefas.length conta os itens da lista.",
      ],
      concepts: ["useState", "estado inicial"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Renderizar a lista",
      description: "Use `map` para transformar cada tarefa num `<Tarefa />`, com `key`.",
      starterCode:
        "import { useState } from 'react';\n\nfunction Painel() {\n  const [tarefas] = useState([\"Estudar props\", \"Praticar estado\"]);\n  // Renderize a lista\n}\n",
      solution:
        "import { useState } from 'react';\n\nfunction Tarefa({ titulo }) {\n  return <li>{titulo}</li>;\n}\n\nfunction Painel() {\n  const [tarefas] = useState([\"Estudar props\", \"Praticar estado\"]);\n\n  return (\n    <ul>\n      {tarefas.map((titulo) => (\n        <Tarefa key={titulo} titulo={titulo} />\n      ))}\n    </ul>\n  );\n}\n\nexport default Painel;",
      expectedOutput: "tarefas.map(",
      hints: [
        "map devolve um novo array — aqui, de elementos JSX.",
        "key ajuda o React a saber qual item mudou.",
        "Passe o texto para o filho por props: titulo={titulo}.",
      ],
      concepts: ["map", "key", "composição"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Adicionar uma tarefa",
      description: "Adicione um botão que insere uma tarefa nova no estado, sem mutar o array antigo.",
      starterCode:
        "import { useState } from 'react';\n\nfunction Painel() {\n  const [tarefas, setTarefas] = useState([\"Estudar props\"]);\n  // Adicione o botão que insere uma tarefa\n}\n",
      solution:
        "import { useState } from 'react';\n\nfunction Painel() {\n  const [tarefas, setTarefas] = useState([\"Estudar props\"]);\n\n  function adicionar() {\n    setTarefas([...tarefas, \"Nova tarefa\"]);\n  }\n\n  return (\n    <div>\n      <button onClick={adicionar}>Adicionar</button>\n      <ul>\n        {tarefas.map((titulo) => (\n          <li key={titulo}>{titulo}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default Painel;",
      expectedOutput: "setTarefas([...tarefas",
      hints: [
        "O spread ... copia a lista atual antes de acrescentar.",
        "Nunca use push no estado: o React precisa de um array novo para re-renderizar.",
        "onClick recebe a função, sem parênteses.",
      ],
      concepts: ["atualização de estado", "imutabilidade", "onClick"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — O painel completo",
      description:
        "Junte tudo: componente filho, estado, botão, lista e um contador de tarefas derivado do estado.",
      starterCode: "// Monte o painel completo\n",
      solution:
        "import { useState } from 'react';\n\nfunction Tarefa({ titulo }) {\n  return <li>{titulo}</li>;\n}\n\nfunction Painel() {\n  const [tarefas, setTarefas] = useState([\"Estudar props\", \"Praticar estado\"]);\n\n  function adicionar() {\n    setTarefas([...tarefas, \"Nova tarefa\"]);\n  }\n\n  return (\n    <section>\n      <h2>Minhas tarefas ({tarefas.length})</h2>\n      <button onClick={adicionar}>Adicionar</button>\n      <ul>\n        {tarefas.map((titulo) => (\n          <Tarefa key={titulo} titulo={titulo} />\n        ))}\n      </ul>\n    </section>\n  );\n}\n\nexport default Painel;",
      expectedOutput: "{tarefas.length}",
      hints: [
        "O contador não precisa de estado próprio: ele é derivado da lista.",
        "Reaproveite o componente Tarefa da primeira etapa.",
        "Tudo que depende do estado se atualiza sozinho quando ele muda.",
      ],
      concepts: ["painel completo", "estado derivado", "composição"],
    },
  ],
};

const reactNativeScreen: Project = {
  id: "proj-rn-task-screen",
  courseId: "11",
  title: "Tela de tarefas no celular",
  emoji: "📱",
  language: "React Native",
  goal: "Montar uma tela mobile completa: layout com View, texto, lista com FlatList, toque e estilo em StyleSheet.",
  description:
    "Projeto final de React Native. Cada etapa acrescenta uma camada à MESMA tela, do esqueleto até a lista tocável estilizada.",
  xpReward: 120,
  summary: [
    "View e Text estruturando a tela",
    "StyleSheet separando o estilo",
    "FlatList para listas longas",
    "TouchableOpacity respondendo ao toque",
    "Estado refletindo o que o usuário fez",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Esqueleto da tela",
      description: "Crie a tela `Tarefas` com uma `View` e um `Text` de título.",
      starterCode: "// Esqueleto da tela\n",
      solution:
        "import { View, Text } from 'react-native';\n\nexport default function Tarefas() {\n  return (\n    <View>\n      <Text>Minhas tarefas</Text>\n    </View>\n  );\n}",
      expectedOutput: "<View>",
      hints: [
        "No React Native não existe div: o container é a View.",
        "Todo texto precisa estar dentro de um Text.",
        "Os componentes vêm do pacote react-native.",
      ],
      concepts: ["View", "Text", "componentes nativos"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Estilo em StyleSheet",
      description: "Crie um `StyleSheet` com `container` (padding 16) e aplique na View.",
      starterCode:
        "import { View, Text } from 'react-native';\n\nexport default function Tarefas() {\n  return (\n    <View>\n      <Text>Minhas tarefas</Text>\n    </View>\n  );\n}\n// Adicione o StyleSheet\n",
      solution:
        "import { View, Text, StyleSheet } from 'react-native';\n\nexport default function Tarefas() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.titulo}>Minhas tarefas</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { padding: 16 },\n  titulo: { fontSize: 20, fontWeight: 'bold' },\n});",
      expectedOutput: "StyleSheet.create(",
      hints: [
        "StyleSheet.create recebe um objeto de estilos.",
        "O estilo é aplicado com style={styles.nome}.",
        "Os valores são números, sem 'px'.",
      ],
      concepts: ["StyleSheet", "estilo em objeto"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Lista com FlatList",
      description: "Renderize as tarefas com `FlatList`, usando `data`, `keyExtractor` e `renderItem`.",
      starterCode: "// Renderize a lista com FlatList\n",
      solution:
        "import { View, Text, FlatList } from 'react-native';\n\nconst tarefas = [\n  { id: '1', titulo: 'Estudar componentes' },\n  { id: '2', titulo: 'Praticar estilos' },\n];\n\nexport default function Tarefas() {\n  return (\n    <View>\n      <FlatList\n        data={tarefas}\n        keyExtractor={(item) => item.id}\n        renderItem={({ item }) => <Text>{item.titulo}</Text>}\n      />\n    </View>\n  );\n}",
      expectedOutput: "<FlatList",
      hints: [
        "FlatList só renderiza o que aparece na tela — por isso é melhor que map em listas longas.",
        "keyExtractor devolve o id de cada item como string.",
        "renderItem recebe { item } e devolve o componente da linha.",
      ],
      concepts: ["FlatList", "keyExtractor", "renderItem"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Responder ao toque",
      description: "Envolva cada linha num `TouchableOpacity` com `onPress`.",
      starterCode: "// Torne cada item tocável\n",
      solution:
        "import { View, Text, FlatList, TouchableOpacity } from 'react-native';\n\nconst tarefas = [{ id: '1', titulo: 'Estudar componentes' }];\n\nexport default function Tarefas() {\n  return (\n    <View>\n      <FlatList\n        data={tarefas}\n        keyExtractor={(item) => item.id}\n        renderItem={({ item }) => (\n          <TouchableOpacity onPress={() => console.log(item.titulo)}>\n            <Text>{item.titulo}</Text>\n          </TouchableOpacity>\n        )}\n      />\n    </View>\n  );\n}",
      expectedOutput: "<TouchableOpacity",
      hints: [
        "No celular o evento é onPress, não onClick.",
        "TouchableOpacity dá o retorno visual de toque.",
        "A função do onPress recebe o item por closure.",
      ],
      concepts: ["TouchableOpacity", "onPress", "feedback de toque"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — A tela completa com estado",
      description:
        "Junte tudo: estado das tarefas, toque marcando como concluída e estilo aplicado na lista.",
      starterCode: "// Monte a tela completa\n",
      solution:
        "import { useState } from 'react';\nimport { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';\n\nexport default function Tarefas() {\n  const [tarefas, setTarefas] = useState([\n    { id: '1', titulo: 'Estudar componentes', feita: false },\n    { id: '2', titulo: 'Praticar estilos', feita: false },\n  ]);\n\n  function concluir(id) {\n    setTarefas(tarefas.map((tarefa) => (tarefa.id === id ? { ...tarefa, feita: true } : tarefa)));\n  }\n\n  return (\n    <View style={styles.container}>\n      <Text style={styles.titulo}>Minhas tarefas</Text>\n      <FlatList\n        data={tarefas}\n        keyExtractor={(item) => item.id}\n        renderItem={({ item }) => (\n          <TouchableOpacity style={styles.linha} onPress={() => concluir(item.id)}>\n            <Text>{item.feita ? 'OK ' : ''}{item.titulo}</Text>\n          </TouchableOpacity>\n        )}\n      />\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { padding: 16 },\n  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },\n  linha: { paddingVertical: 12 },\n});",
      expectedOutput: "onPress={() => concluir(item.id)}",
      hints: [
        "map com spread cria a lista nova sem mutar a antiga.",
        "O operador ternário escolhe o que mostrar conforme o estado.",
        "Reaproveite o StyleSheet e a FlatList das etapas anteriores.",
      ],
      concepts: ["tela completa", "estado", "imutabilidade", "estilo"],
    },
  ],
};

const gitFeatureFlow: Project = {
  id: "proj-git-feature-flow-real",
  courseId: "7",
  title: "Fluxo de uma feature no Git",
  emoji: "🌿",
  language: "Git",
  goal: "Percorrer o ciclo real de uma entrega: branch, commits pequenos, sincronizar com o remoto e integrar na principal.",
  description:
    "Projeto final de Git. Cada etapa é um comando do fluxo que times usam de verdade, na ordem em que ele acontece no dia a dia.",
  xpReward: 110,
  summary: [
    "Branch isolando a feature",
    "Stage e commit com mensagem clara",
    "Publicar a branch no remoto",
    "Trazer o que mudou na principal",
    "Integrar e limpar a branch",
  ],
  steps: [
    {
      id: "step-1",
      title: "Etapa 1 — Criar a branch da feature",
      description: "Crie e já entre numa branch chamada `feature/login`.",
      starterCode: "# Crie a branch da feature\n",
      solution: "git checkout -b feature/login",
      expectedOutput: "git checkout -b feature/login",
      hints: [
        "checkout -b cria e troca de branch no mesmo comando.",
        "O nome com barra (feature/) é uma convenção de time.",
        "Trabalhar numa branch mantém a main sempre entregável.",
      ],
      concepts: ["branch", "isolamento"],
    },
    {
      id: "step-2",
      title: "Etapa 2 — Primeiro commit",
      description: "Adicione o arquivo `login.js` ao stage e faça um commit com uma mensagem que explique a mudança.",
      starterCode: "# Prepare e registre a mudança\n",
      solution: 'git add login.js\ngit commit -m "Adiciona tela de login"',
      expectedOutput: "git commit -m",
      hints: [
        "add coloca o arquivo no stage; commit registra o que está no stage.",
        "A mensagem descreve o QUE mudou, não o arquivo.",
        "Commits pequenos são mais fáceis de revisar e reverter.",
      ],
      concepts: ["stage", "commit", "mensagem"],
    },
    {
      id: "step-3",
      title: "Etapa 3 — Publicar a branch",
      description: "Envie a branch para o remoto configurando o rastreamento.",
      starterCode: "# Publique a branch no remoto\n",
      solution: "git push -u origin feature/login",
      expectedOutput: "git push -u origin feature/login",
      hints: [
        "-u liga a branch local à remota (só precisa na primeira vez).",
        "origin é o apelido padrão do repositório remoto.",
        "Depois disso, um git push simples já sabe para onde ir.",
      ],
      concepts: ["push", "remoto", "upstream"],
    },
    {
      id: "step-4",
      title: "Etapa 4 — Atualizar com a principal",
      description: "Traga para a sua branch o que já entrou na `main`, resolvendo divergências cedo.",
      starterCode: "# Traga as novidades da main\n",
      solution: "git fetch origin\ngit merge origin/main",
      expectedOutput: "git merge origin/main",
      hints: [
        "fetch baixa o que existe no remoto sem mexer no seu código.",
        "merge junta o que veio na sua branch.",
        "Resolver conflito agora é mais barato que na hora de integrar.",
      ],
      concepts: ["fetch", "merge", "conflito"],
    },
    {
      id: "step-5",
      title: "Etapa 5 — Integrar e limpar",
      description: "Volte para a `main`, integre a feature e apague a branch que já cumpriu seu papel.",
      starterCode: "# Integre a feature e limpe\n",
      solution: "git checkout main\ngit merge feature/login\ngit branch -d feature/login",
      expectedOutput: "git branch -d feature/login",
      hints: [
        "Você precisa estar na branch de destino antes do merge.",
        "-d só apaga a branch se ela já tiver sido integrada.",
        "Repositório limpo = histórico legível para quem chega depois.",
      ],
      concepts: ["merge", "limpeza", "fluxo completo"],
    },
  ],
};

export const capstoneProjects: Project[] = [
  foundationSavings,
  pythonExpenseReport,
  jsShoppingCart,
  sqlStoreReport,
  htmlPortfolio,
  cssProfileCard,
  nodeTaskApi,
  algorithmsSearch,
  dataSalesReport,
  gameScoreboard,
  reactTaskPanel,
  reactNativeScreen,
  gitFeatureFlow,
];
