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

export const capstoneProjects: Project[] = [foundationSavings, pythonExpenseReport, jsShoppingCart];
