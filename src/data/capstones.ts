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

export const capstoneProjects: Project[] = [
  foundationSavings,
  pythonExpenseReport,
  jsShoppingCart,
  sqlStoreReport,
  htmlPortfolio,
  cssProfileCard,
];
