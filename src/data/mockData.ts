export interface Lesson {
  id: string;
  title: string;
  description: string;
  theory: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  xpReward: number;
}

export interface Course {
  id: string;
  title: string;
  language: string;
  emoji: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  students: number;
  progress: number;
  color: string;
  lessons: Lesson[];
  tags: string[];
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  rarity: "Comum" | "Raro" | "Épico" | "Lendário";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Python do Zero ao Herói",
    language: "Python",
    emoji: "🐍",
    level: "Iniciante",
    duration: "20h",
    students: 12400,
    progress: 65,
    color: "quest-yellow",
    tags: ["Popular", "Novo"],
    description: "Aprenda Python do zero! Variáveis, funções, loops, listas e muito mais.",
    lessons: [
      {
        id: "1-1",
        title: "Olá, Mundo!",
        description: "Seu primeiro programa! Use a função `print()` para exibir a mensagem **\"Olá, Mundo!\"** no console.",
        theory: `Em Python, a função print() é usada para exibir informações na tela (console). Ela é a primeira coisa que todo programador aprende!

Como funciona:
• print() recebe um valor entre parênteses e o exibe no terminal.
• Textos (strings) devem estar entre aspas — simples ('texto') ou duplas ("texto").
• Você pode exibir números sem aspas: print(42)

Exemplos:
  print("Olá!")        → exibe: Olá!
  print('Python')      → exibe: Python
  print(2 + 3)         → exibe: 5

Dica: print() sempre pula uma linha após exibir. Para exibir várias coisas na mesma linha, separe com vírgula: print("A", "B") → A B`,
        starterCode: '# Escreva seu código aqui\n',
        solution: 'print("Olá, Mundo!")',
        expectedOutput: "Olá, Mundo!",
        hints: ["Use a função print() para exibir texto", "O texto deve estar entre aspas", 'A resposta é: print("Olá, Mundo!")'],
        xpReward: 10,
      },
      {
        id: "1-2",
        title: "Variáveis e Tipos",
        description: "Crie uma variável chamada `nome` com seu nome e outra chamada `idade` com sua idade. Depois use `print()` para exibir: **\"Meu nome é [nome] e tenho [idade] anos\"**.",
        theory: `Variáveis são "caixas" que guardam valores na memória do computador. Em Python, você cria uma variável simplesmente atribuindo um valor com o sinal de igual (=).

Tipos principais:
• str (texto): nome = "Lucas" — sempre entre aspas
• int (número inteiro): idade = 20
• float (decimal): altura = 1.75
• bool (verdadeiro/falso): ativo = True

Para juntar texto com variáveis, use f-strings (strings formatadas):
  nome = "Ana"
  idade = 25
  print(f"Eu sou {nome} e tenho {idade} anos")
  → exibe: Eu sou Ana e tenho 25 anos

O f antes das aspas ativa a interpolação. Dentro de {}, coloque qualquer variável ou expressão Python.`,
        starterCode: '# Crie as variáveis e exiba a mensagem\nnome = ""\nidade = 0\n',
        solution: 'nome = "Lucas"\nidade = 20\nprint(f"Meu nome é {nome} e tenho {idade} anos")',
        expectedOutput: "Meu nome é",
        hints: ["Atribua valores às variáveis nome e idade", "Use f-string: f\"texto {variavel}\"", 'print(f"Meu nome é {nome} e tenho {idade} anos")'],
        xpReward: 15,
      },
      {
        id: "1-3",
        title: "Operações Matemáticas",
        description: "Calcule a **soma**, **subtração**, **multiplicação** e **divisão** de dois números (10 e 3) e exiba cada resultado com `print()`.",
        theory: `Python funciona como uma calculadora poderosa! Os operadores matemáticos básicos são:

Operadores:
• + → soma: 10 + 3 = 13
• - → subtração: 10 - 3 = 7
• * → multiplicação: 10 * 3 = 30
• / → divisão (resultado decimal): 10 / 3 = 3.333...
• // → divisão inteira (sem decimais): 10 // 3 = 3
• % → módulo (resto da divisão): 10 % 3 = 1
• ** → potência: 2 ** 3 = 8

Você pode guardar resultados em variáveis:
  resultado = 10 + 3
  print(resultado)  → 13

Ou calcular direto no print():
  print(10 * 3)  → 30

A ordem das operações segue a matemática: parênteses > potência > multiplicação/divisão > soma/subtração.`,
        starterCode: 'a = 10\nb = 3\n# Calcule e exiba os resultados\n',
        solution: 'a = 10\nb = 3\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)',
        expectedOutput: "13",
        hints: ["Use os operadores +, -, *, /", "Faça um print() para cada operação", "print(a + b) para soma"],
        xpReward: 15,
      },
      {
        id: "1-4",
        title: "Condicionais (if/else)",
        description: "Crie uma variável `nota` com valor 7. Se a nota for >= 7, exiba **\"Aprovado!\"**, senão exiba **\"Reprovado!\"**.",
        theory: `Condicionais permitem que seu programa tome decisões! Com if/else, o código executa blocos diferentes dependendo de uma condição.

Estrutura:
  if condição:
      # código se verdadeiro
  else:
      # código se falso

Operadores de comparação:
• == igual a          • != diferente de
• > maior que        • < menor que
• >= maior ou igual  • <= menor ou igual

Exemplo:
  temperatura = 30
  if temperatura > 25:
      print("Está quente!")
  else:
      print("Está fresco.")

Para múltiplas condições, use elif:
  if nota >= 9:
      print("Excelente!")
  elif nota >= 7:
      print("Bom!")
  else:
      print("Precisa melhorar")

IMPORTANTE: Em Python, a indentação (4 espaços) define o bloco de código. Não esqueça dos dois pontos (:) após a condição!`,
        starterCode: 'nota = 7\n# Use if/else para verificar\n',
        solution: 'nota = 7\nif nota >= 7:\n    print("Aprovado!")\nelse:\n    print("Reprovado!")',
        expectedOutput: "Aprovado!",
        hints: ["Use if nota >= 7:", "Não esqueça dos dois pontos (:) e da indentação", 'if nota >= 7:\n    print("Aprovado!")'],
        xpReward: 20,
      },
      {
        id: "1-5",
        title: "Loops com for",
        description: "Use um loop `for` para exibir os números de **1 a 5**, cada um em uma linha.",
        theory: `O loop for repete um bloco de código para cada item em uma sequência. É ideal quando você sabe quantas vezes quer repetir.

Sintaxe básica:
  for variavel in sequência:
      # código a repetir

A função range() gera uma sequência de números:
• range(5) → 0, 1, 2, 3, 4 (começa em 0!)
• range(1, 6) → 1, 2, 3, 4, 5 (de 1 até 5)
• range(0, 10, 2) → 0, 2, 4, 6, 8 (de 2 em 2)

Exemplos:
  for i in range(3):
      print(i)
  # Exibe: 0, 1, 2

  for letra in "Python":
      print(letra)
  # Exibe cada letra em uma linha

Você pode usar for com listas, strings, range() e muitos outros objetos iteráveis.`,
        starterCode: '# Use for para contar de 1 a 5\n',
        solution: 'for i in range(1, 6):\n    print(i)',
        expectedOutput: "1",
        hints: ["Use range(1, 6) para gerar números de 1 a 5", "for i in range(1, 6):", "print(i) dentro do loop"],
        xpReward: 20,
      },
      {
        id: "1-6",
        title: "Listas",
        description: "Crie uma lista chamada `frutas` com 3 frutas e use um loop `for` para exibir cada uma.",
        theory: `Listas são coleções ordenadas de itens. Em Python, criamos listas usando colchetes [] e separando os itens por vírgula.

Criando listas:
  frutas = ["maçã", "banana", "uva"]
  numeros = [1, 2, 3, 4, 5]
  mista = ["texto", 42, True, 3.14]

Acessando itens (o índice começa em 0!):
  frutas[0]  → "maçã"
  frutas[1]  → "banana"
  frutas[-1] → "uva" (último item)

Métodos úteis:
  frutas.append("manga")   → adiciona ao final
  frutas.remove("banana")  → remove o item
  len(frutas)              → quantidade de itens
  frutas.sort()            → ordena a lista

Percorrendo com for:
  for fruta in frutas:
      print(fruta)
  # Exibe cada fruta em uma linha`,
        starterCode: '# Crie a lista e exiba cada fruta\n',
        solution: 'frutas = ["maçã", "banana", "uva"]\nfor fruta in frutas:\n    print(fruta)',
        expectedOutput: "maçã",
        hints: ["Crie a lista: frutas = [\"maçã\", \"banana\", \"uva\"]", "Use for fruta in frutas:", "print(fruta) dentro do loop"],
        xpReward: 20,
      },
      {
        id: "1-7",
        title: "Funções",
        description: "Crie uma função chamada `saudacao` que recebe um `nome` e retorna **\"Olá, [nome]!\"**. Depois chame a função e exiba o resultado.",
        theory: `Funções são blocos de código reutilizáveis. Você define uma vez e chama quantas vezes precisar!

Definindo uma função:
  def nome_da_funcao(parametro1, parametro2):
      # código da função
      return resultado

• def → palavra-chave para definir funções
• Parâmetros são valores que a função recebe
• return devolve um resultado (opcional)

Exemplos:
  def somar(a, b):
      return a + b

  resultado = somar(3, 5)
  print(resultado)  → 8

  def cumprimentar(nome):
      return f"Olá, {nome}!"

  print(cumprimentar("Ana"))  → Olá, Ana!

Funções sem return:
  def exibir_menu():
      print("1 - Jogar")
      print("2 - Sair")

Dica: Nomeie funções com verbos que descrevam o que elas fazem!`,
        starterCode: '# Defina a função e chame-a\n',
        solution: 'def saudacao(nome):\n    return f"Olá, {nome}!"\n\nprint(saudacao("Python"))',
        expectedOutput: "Olá,",
        hints: ["def saudacao(nome):", "Use return para retornar o valor", "print(saudacao(\"Python\"))"],
        xpReward: 25,
      },
      {
        id: "1-8",
        title: "Dicionários",
        description: "Crie um dicionário `aluno` com as chaves `nome`, `idade` e `curso`. Exiba o nome do aluno.",
        theory: `Dicionários guardam pares de chave:valor. São como uma agenda onde cada nome (chave) tem um telefone (valor).

Criando dicionários:
  aluno = {
      "nome": "Lucas",
      "idade": 20,
      "curso": "Python"
  }

Acessando valores:
  aluno["nome"]     → "Lucas"
  aluno.get("idade") → 20 (mais seguro, retorna None se não existir)

Modificando:
  aluno["idade"] = 21          → altera o valor
  aluno["email"] = "l@mail.com" → adiciona nova chave

Métodos úteis:
  aluno.keys()    → todas as chaves
  aluno.values()  → todos os valores
  aluno.items()   → pares (chave, valor)

Percorrendo:
  for chave, valor in aluno.items():
      print(f"{chave}: {valor}")

Dicionários são essenciais para representar dados estruturados como perfis de usuário, configurações, etc.`,
        starterCode: '# Crie o dicionário e exiba o nome\n',
        solution: 'aluno = {"nome": "Lucas", "idade": 20, "curso": "Python"}\nprint(aluno["nome"])',
        expectedOutput: "Lucas",
        hints: ["Use chaves {} para criar dicionários", 'aluno = {"nome": "Lucas", "idade": 20, "curso": "Python"}', 'print(aluno["nome"])'],
        xpReward: 25,
      },
    ],
  },
  {
    id: "2",
    title: "JavaScript Moderno",
    language: "JavaScript",
    emoji: "⚡",
    level: "Intermediário",
    duration: "25h",
    students: 9800,
    progress: 30,
    color: "quest-yellow",
    tags: ["Popular"],
    description: "Domine o JavaScript moderno com ES6+, arrow functions, promises e mais.",
    lessons: [
      {
        id: "2-1",
        title: "Console.log",
        description: "Use `console.log()` para exibir **\"Olá, JavaScript!\"** no console.",
        theory: `console.log() é a função mais usada para depuração em JavaScript. Ela exibe valores no console do navegador ou terminal.

Como usar:
  console.log("texto")     → exibe texto
  console.log(42)           → exibe número
  console.log(true)         → exibe booleano
  console.log(variavel)     → exibe o valor da variável

Você pode exibir vários valores de uma vez:
  console.log("Nome:", nome, "Idade:", idade)

Existem outros métodos do console:
  console.warn("aviso")   → exibe um alerta amarelo
  console.error("erro")   → exibe um erro vermelho
  console.table([1,2,3])  → exibe em formato de tabela

Em JavaScript, toda linha termina com ponto e vírgula (;) — não é obrigatório, mas é uma boa prática.

Strings podem usar aspas simples, duplas ou crases (template literals):
  console.log('simples')
  console.log("duplas")
  console.log(\`crases\`)`,
        starterCode: '// Exiba a mensagem\n',
        solution: 'console.log("Olá, JavaScript!");',
        expectedOutput: "Olá, JavaScript!",
        hints: ["Use console.log()", "O texto deve estar entre aspas", 'console.log("Olá, JavaScript!")'],
        xpReward: 10,
      },
      {
        id: "2-2",
        title: "let, const e var",
        description: "Declare uma constante `PI` com valor 3.14 e uma variável `raio` com valor 5. Calcule a **área do círculo** (PI * raio²) e exiba o resultado.",
        theory: `Em JavaScript moderno (ES6+), usamos let e const para declarar variáveis. var é o jeito antigo e deve ser evitado.

const — para valores que NUNCA mudam:
  const PI = 3.14;
  const NOME = "CodeQuest";
  // PI = 4; ← ERRO! Não pode reatribuir

let — para valores que PODEM mudar:
  let pontuacao = 0;
  pontuacao = 10;  // OK!
  let nivel = 1;
  nivel++;         // OK! nivel agora é 2

var — EVITE! Tem comportamento confuso com escopo:
  var x = 10; // funciona, mas prefira let/const

Regra de ouro: Use const por padrão. Só mude para let quando precisar reatribuir.

Tipos de dados:
  const texto = "string";     // String
  const numero = 42;          // Number
  const decimal = 3.14;       // Number
  const booleano = true;      // Boolean
  const nulo = null;          // Null
  const indefinido = undefined; // Undefined`,
        starterCode: '// Declare as variáveis e calcule\n',
        solution: 'const PI = 3.14;\nlet raio = 5;\nconsole.log(PI * raio * raio);',
        expectedOutput: "78.5",
        hints: ["Use const para valores fixos e let para variáveis", "Área = PI * raio * raio", "console.log(PI * raio * raio)"],
        xpReward: 15,
      },
      {
        id: "2-3",
        title: "Arrow Functions",
        description: "Crie uma arrow function chamada `dobro` que recebe um número e retorna o **dobro** dele. Exiba o resultado de `dobro(7)`.",
        theory: `Arrow functions são uma forma moderna e concisa de escrever funções em JavaScript (ES6+).

Função tradicional:
  function somar(a, b) {
    return a + b;
  }

Arrow function equivalente:
  const somar = (a, b) => {
    return a + b;
  };

Versão curta (uma linha, return implícito):
  const somar = (a, b) => a + b;

Com um só parâmetro (parênteses opcionais):
  const dobro = n => n * 2;
  const quadrado = n => n ** 2;

Sem parâmetros:
  const saudar = () => "Olá!";

Quando usar:
• Callbacks: [1,2,3].map(n => n * 2)
• Funções curtas e simples
• Quando não precisa de this próprio

Arrow functions NÃO têm seu próprio this — herdam do contexto onde foram criadas. Isso é útil em React e callbacks!`,
        starterCode: '// Crie a arrow function\n',
        solution: 'const dobro = (n) => n * 2;\nconsole.log(dobro(7));',
        expectedOutput: "14",
        hints: ["Sintaxe: const func = (param) => expressão", "const dobro = (n) => n * 2", "console.log(dobro(7))"],
        xpReward: 20,
      },
      {
        id: "2-4",
        title: "Template Literals",
        description: "Crie variáveis `nome` e `lang` e use template literals para exibir: **\"Olá, [nome]! Bem-vindo ao [lang].\"**",
        theory: `Template literals (ou template strings) usam crases (\`) em vez de aspas e permitem interpolação de variáveis e expressões.

Sintaxe:
  const nome = "Ana";
  const msg = \`Olá, \${nome}!\`;  // → "Olá, Ana!"

Interpolação com \${}:
  const a = 10, b = 20;
  console.log(\`Soma: \${a + b}\`);  // → "Soma: 30"
  console.log(\`Dobro: \${a * 2}\`); // → "Dobro: 20"

Strings multilinha (sem precisar de \\n):
  const html = \`
    <div>
      <h1>\${titulo}</h1>
      <p>\${descricao}</p>
    </div>
  \`;

Comparação com concatenação antiga:
  // Antigo (confuso):
  "Olá, " + nome + "! Você tem " + idade + " anos."
  
  // Moderno (limpo):
  \`Olá, \${nome}! Você tem \${idade} anos.\`

Template literals são MUITO mais legíveis e são o padrão em código moderno!`,
        starterCode: '// Use template literals\n',
        solution: 'const nome = "Dev";\nconst lang = "JavaScript";\nconsole.log(`Olá, ${nome}! Bem-vindo ao ${lang}.`);',
        expectedOutput: "Olá,",
        hints: ["Use crases (`) em vez de aspas", "Interpolação: ${variavel}", "console.log(`Olá, ${nome}!`)"],
        xpReward: 15,
      },
      {
        id: "2-5",
        title: "Desestruturação",
        description: "Dado o objeto `{nome: \"Ana\", idade: 25, cidade: \"SP\"}`, use desestruturação para extrair `nome` e `cidade`, e exiba ambas.",
        theory: `Desestruturação (destructuring) permite extrair valores de objetos e arrays de forma direta e elegante.

Desestruturação de objetos:
  const pessoa = { nome: "Ana", idade: 25, cidade: "SP" };
  
  // Sem desestruturação:
  const nome = pessoa.nome;
  const cidade = pessoa.cidade;
  
  // Com desestruturação:
  const { nome, cidade } = pessoa;
  // nome = "Ana", cidade = "SP"

Renomeando variáveis:
  const { nome: firstName } = pessoa;
  // firstName = "Ana"

Valores padrão:
  const { email = "não informado" } = pessoa;

Desestruturação de arrays:
  const cores = ["vermelho", "verde", "azul"];
  const [primeira, segunda] = cores;
  // primeira = "vermelho", segunda = "verde"

  // Pulando elementos:
  const [, , terceira] = cores;  // terceira = "azul"

Muito usado em React:
  const [count, setCount] = useState(0);
  const { nome, email } = props;`,
        starterCode: 'const pessoa = { nome: "Ana", idade: 25, cidade: "SP" };\n// Desestruture e exiba\n',
        solution: 'const pessoa = { nome: "Ana", idade: 25, cidade: "SP" };\nconst { nome, cidade } = pessoa;\nconsole.log(nome, cidade);',
        expectedOutput: "Ana",
        hints: ["const { nome, cidade } = pessoa", "Use console.log(nome, cidade)", "Desestruturação extrai valores do objeto"],
        xpReward: 20,
      },
      {
        id: "2-6",
        title: "Array Methods (map)",
        description: "Dado o array `[1, 2, 3, 4, 5]`, use `.map()` para criar um novo array com o **dobro** de cada número. Exiba o resultado.",
        theory: `O método .map() cria um NOVO array transformando cada item do array original. É um dos métodos mais usados em JavaScript!

Sintaxe:
  const novoArray = array.map((item, index) => transformação);

Exemplo:
  const nums = [1, 2, 3, 4, 5];
  const dobros = nums.map(n => n * 2);
  // dobros = [2, 4, 6, 8, 10]

Outros métodos importantes de array:
  .filter() — filtra itens por condição:
    [1,2,3,4,5].filter(n => n > 3)  → [4, 5]

  .reduce() — acumula um resultado:
    [1,2,3].reduce((soma, n) => soma + n, 0)  → 6

  .find() — encontra o primeiro item:
    [1,2,3].find(n => n > 2)  → 3

  .forEach() — executa algo para cada item (sem retorno):
    [1,2,3].forEach(n => console.log(n))

IMPORTANTE: .map() NÃO altera o array original! Ele retorna um novo array. Isso é "imutabilidade" — muito valorizado em programação moderna e React.`,
        starterCode: 'const nums = [1, 2, 3, 4, 5];\n// Use map para dobrar\n',
        solution: 'const nums = [1, 2, 3, 4, 5];\nconst dobros = nums.map(n => n * 2);\nconsole.log(dobros);',
        expectedOutput: "2,4,6,8,10",
        hints: ["nums.map(n => n * 2)", "map() retorna um novo array", "console.log(dobros)"],
        xpReward: 20,
      },
      {
        id: "2-7",
        title: "Promises",
        description: "Crie uma Promise que resolve com **\"Dados carregados!\"** após 1 segundo. Use `.then()` para exibir a mensagem.",
        theory: `Promises representam o resultado futuro de uma operação assíncrona — algo que vai acontecer, mas não agora.

Uma Promise tem 3 estados:
• Pending (pendente) — ainda executando
• Fulfilled (resolvida) — completou com sucesso
• Rejected (rejeitada) — falhou

Criando uma Promise:
  const promessa = new Promise((resolve, reject) => {
    // operação assíncrona
    const sucesso = true;
    if (sucesso) {
      resolve("Deu certo!");    // sucesso
    } else {
      reject("Deu errado!");    // erro
    }
  });

Consumindo com .then() e .catch():
  promessa
    .then(resultado => console.log(resultado))  // sucesso
    .catch(erro => console.log(erro));           // erro

Simulando espera com setTimeout:
  const carregar = new Promise((resolve) => {
    setTimeout(() => resolve("Pronto!"), 2000);
  });
  carregar.then(msg => console.log(msg));
  // Após 2 segundos: "Pronto!"

Promises são a base para chamadas de API, leitura de arquivos, e qualquer operação que leva tempo.`,
        starterCode: '// Crie uma Promise\n',
        solution: 'const promessa = new Promise((resolve) => {\n  setTimeout(() => resolve("Dados carregados!"), 1000);\n});\npromessa.then(msg => console.log(msg));',
        expectedOutput: "Dados carregados!",
        hints: ["new Promise((resolve) => { ... })", "Use setTimeout dentro da Promise", ".then(msg => console.log(msg))"],
        xpReward: 25,
      },
      {
        id: "2-8",
        title: "Async/Await",
        description: "Converta a Promise anterior para usar **async/await**. Crie uma função `async` que aguarda o resultado e exibe **\"Pronto!\"**.",
        theory: `async/await é uma forma mais limpa de trabalhar com Promises. Faz código assíncrono parecer síncrono!

Sintaxe:
  async function buscarDados() {
    const resultado = await algumaPromise();
    console.log(resultado);
  }

• async antes da função → permite usar await dentro
• await antes de uma Promise → espera ela resolver

Comparação:
  // Com .then():
  fetch("/api/dados")
    .then(res => res.json())
    .then(data => console.log(data));

  // Com async/await (mais legível):
  async function buscar() {
    const res = await fetch("/api/dados");
    const data = await res.json();
    console.log(data);
  }

Tratando erros com try/catch:
  async function buscar() {
    try {
      const res = await fetch("/api");
      const data = await res.json();
      return data;
    } catch (erro) {
      console.error("Falhou:", erro);
    }
  }

async/await é o padrão moderno para código assíncrono em JavaScript e React!`,
        starterCode: '// Use async/await\n',
        solution: 'async function carregar() {\n  const msg = await new Promise(resolve => setTimeout(() => resolve("Pronto!"), 1000));\n  console.log(msg);\n}\ncarregar();',
        expectedOutput: "Pronto!",
        hints: ["async function nomeDaFuncao() { ... }", "const resultado = await promise", "Não esqueça de chamar a função"],
        xpReward: 25,
      },
    ],
  },
  {
    id: "3",
    title: "React & TypeScript",
    language: "React",
    emoji: "⚛️",
    level: "Intermediário",
    duration: "30h",
    students: 7200,
    progress: 0,
    color: "quest-blue",
    tags: ["Em alta"],
    description: "Construa aplicações modernas com React e TypeScript — componentes, hooks e estado.",
    lessons: [
      {
        id: "3-1",
        title: "Primeiro Componente",
        description: "Crie um componente funcional `Saudacao` que exibe **\"Olá, React!\"** em um `<h1>`. Exporte-o como default.",
        theory: `Em React, a interface é construída com componentes — blocos reutilizáveis de UI. Cada componente é uma função que retorna JSX (HTML dentro do JavaScript).

Componente funcional básico:
  function MeuComponente() {
    return <h1>Olá!</h1>;
  }

Regras importantes:
• O nome do componente DEVE começar com letra maiúscula
• Deve retornar JSX (parece HTML, mas é JavaScript)
• Só pode retornar UM elemento raiz (use <div> ou <> para agrupar)

JSX vs HTML — diferenças:
  class → className
  for → htmlFor
  onclick → onClick
  style="..." → style={{...}}

Exportando o componente:
  export default MeuComponente;
  // Em outro arquivo: import MeuComponente from "./MeuComponente"

Expressões JavaScript dentro do JSX usam chaves {}:
  function Saudacao() {
    const nome = "React";
    return <h1>Olá, {nome}!</h1>;
  }`,
        starterCode: '// Crie o componente Saudacao\n',
        solution: 'function Saudacao() {\n  return <h1>Olá, React!</h1>;\n}\nexport default Saudacao;',
        expectedOutput: "Olá, React!",
        hints: ["function NomeComponente() { return ... }", "Use JSX: <h1>texto</h1>", "export default Saudacao"],
        xpReward: 10,
      },
      {
        id: "3-2",
        title: "Props",
        description: "Crie um componente `Cartao` que recebe uma prop `nome` (string) e exibe **\"Bem-vindo, [nome]!\"**.",
        theory: `Props (propriedades) são a forma de passar dados de um componente pai para um componente filho. São como parâmetros de uma função!

Passando props:
  <Cartao nome="Ana" idade={25} />

Recebendo props:
  function Cartao(props) {
    return <p>Olá, {props.nome}!</p>;
  }

Com desestruturação (mais limpo):
  function Cartao({ nome, idade }) {
    return <p>{nome} tem {idade} anos</p>;
  }

Com TypeScript — tipagem segura:
  interface CartaoProps {
    nome: string;
    idade: number;
    ativo?: boolean;  // ? = opcional
  }

  function Cartao({ nome, idade }: CartaoProps) {
    return <p>{nome} tem {idade} anos</p>;
  }

  // Ou inline:
  function Cartao({ nome }: { nome: string }) {
    return <p>Olá, {nome}!</p>;
  }

IMPORTANTE: Props são somente leitura! O componente filho NUNCA deve modificar as props que recebe.`,
        starterCode: '// Componente com props\n',
        solution: 'function Cartao({ nome }: { nome: string }) {\n  return <p>Bem-vindo, {nome}!</p>;\n}',
        expectedOutput: "Bem-vindo,",
        hints: ["Desestruture as props: { nome }", "TypeScript: { nome: string }", "Use {nome} dentro do JSX"],
        xpReward: 15,
      },
      {
        id: "3-3",
        title: "useState",
        description: "Crie um **contador** com `useState`. O componente deve ter um botão que incrementa o valor e exibe o número atual.",
        theory: `useState é o hook mais básico do React. Ele permite que componentes tenham estado — dados que podem mudar e re-renderizar a tela.

Sintaxe:
  const [valor, setValor] = useState(valorInicial);

• valor → o estado atual
• setValor → função para atualizar o estado
• valorInicial → valor quando o componente é criado

Exemplo — Contador:
  import { useState } from "react";

  function Contador() {
    const [count, setCount] = useState(0);

    return (
      <div>
        <p>Contagem: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Incrementar
        </button>
      </div>
    );
  }

Quando setCount é chamado:
1. O estado muda
2. O React re-renderiza o componente
3. A tela atualiza com o novo valor

NUNCA modifique o estado diretamente:
  count = 5;           // ❌ ERRADO
  setCount(5);         // ✅ CORRETO

Para estado baseado no anterior:
  setCount(prev => prev + 1);  // mais seguro`,
        starterCode: 'import { useState } from "react";\n// Crie o contador\n',
        solution: 'import { useState } from "react";\nfunction Contador() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}',
        expectedOutput: "useState",
        hints: ["const [valor, setValor] = useState(0)", "onClick={() => setCount(count + 1)}", "Exiba {count} no botão"],
        xpReward: 20,
      },
      {
        id: "3-4",
        title: "useEffect",
        description: "Use `useEffect` para exibir **\"Componente montado!\"** no console quando o componente for renderizado pela primeira vez.",
        theory: `useEffect permite executar "efeitos colaterais" — código que roda fora do fluxo normal de renderização (API calls, timers, DOM, etc).

Sintaxe:
  useEffect(() => {
    // código do efeito
  }, [dependências]);

O array de dependências controla QUANDO o efeito roda:

1. [] vazio → roda só UMA vez (na montagem):
  useEffect(() => {
    console.log("Montou!");
  }, []);

2. [variavel] → roda quando a variável muda:
  useEffect(() => {
    console.log("Nome mudou:", nome);
  }, [nome]);

3. Sem array → roda TODA renderização (evite!):
  useEffect(() => {
    console.log("Renderizou");
  });

Cleanup (limpeza) — roda quando o componente desmonta:
  useEffect(() => {
    const timer = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(timer);  // cleanup!
  }, []);

Usos comuns: buscar dados de API, ouvir eventos, atualizar título da página.`,
        starterCode: 'import { useEffect } from "react";\n// Use useEffect\n',
        solution: 'import { useEffect } from "react";\nfunction App() {\n  useEffect(() => {\n    console.log("Componente montado!");\n  }, []);\n  return <div>App</div>;\n}',
        expectedOutput: "Componente montado!",
        hints: ["useEffect(() => { ... }, [])", "Array vazio [] = executa só na montagem", "console.log dentro do useEffect"],
        xpReward: 20,
      },
      {
        id: "3-5",
        title: "Interfaces TypeScript",
        description: "Defina uma interface `Usuario` com `nome` (string), `idade` (number) e `ativo` (boolean). Crie um objeto e exiba o nome.",
        theory: `TypeScript adiciona tipagem estática ao JavaScript. Interfaces definem a "forma" dos dados — quais campos existem e seus tipos.

Definindo uma interface:
  interface Usuario {
    nome: string;
    idade: number;
    ativo: boolean;
    email?: string;     // ? = campo opcional
  }

Usando a interface:
  const user: Usuario = {
    nome: "Ana",
    idade: 25,
    ativo: true
  };

Se você errar um campo, o TypeScript avisa ANTES de rodar:
  const user: Usuario = {
    nome: "Ana",
    idade: "25"  // ❌ Erro: string não é number
  };

Tipos básicos do TypeScript:
  string     → textos
  number     → números (int e float)
  boolean    → true/false
  string[]   → array de strings
  number[]   → array de números
  any        → qualquer tipo (evite!)

Type vs Interface:
  type Ponto = { x: number; y: number };
  interface Ponto { x: number; y: number }
  // Ambos funcionam! Interface é mais usada para objetos.`,
        starterCode: '// Defina a interface e crie o objeto\n',
        solution: 'interface Usuario {\n  nome: string;\n  idade: number;\n  ativo: boolean;\n}\nconst user: Usuario = { nome: "Ana", idade: 25, ativo: true };\nconsole.log(user.nome);',
        expectedOutput: "Ana",
        hints: ["interface NomeInterface { campo: tipo }", "const obj: Interface = { ... }", "Tipos: string, number, boolean"],
        xpReward: 20,
      },
      {
        id: "3-6",
        title: "Renderização de Listas",
        description: "Dado um array de nomes, renderize uma lista `<ul>` com um `<li>` para cada nome usando `.map()`.",
        theory: `Em React, usamos .map() para renderizar listas de elementos. É o padrão para transformar arrays de dados em elementos JSX.

Renderizando uma lista:
  const nomes = ["Ana", "Bruno", "Carlos"];

  function Lista() {
    return (
      <ul>
        {nomes.map(nome => (
          <li key={nome}>{nome}</li>
        ))}
      </ul>
    );
  }

A prop key é OBRIGATÓRIA em listas! Ela ajuda o React a identificar qual item mudou:
  // ✅ Bom — ID único:
  {users.map(user => <li key={user.id}>{user.nome}</li>)}

  // ⚠️ Ok — se não tiver ID:
  {items.map((item, index) => <li key={index}>{item}</li>)}

  // ❌ Errado — sem key:
  {items.map(item => <li>{item}</li>)}

Renderização condicional dentro de listas:
  {users.map(user => (
    <li key={user.id}>
      {user.nome} {user.ativo && "✅"}
    </li>
  ))}

Dica: Filtre antes de mapear para mostrar apenas itens relevantes:
  {users.filter(u => u.ativo).map(u => <li key={u.id}>{u.nome}</li>)}`,
        starterCode: 'const nomes = ["Ana", "Bruno", "Carlos"];\n// Renderize a lista\n',
        solution: 'const nomes = ["Ana", "Bruno", "Carlos"];\nfunction Lista() {\n  return <ul>{nomes.map(n => <li key={n}>{n}</li>)}</ul>;\n}',
        expectedOutput: "Ana",
        hints: ["Use .map() dentro do JSX", "Cada item precisa de uma key única", "<li key={nome}>{nome}</li>"],
        xpReward: 20,
      },
    ],
  },
  {
    id: "4",
    title: "CSS Mágico",
    language: "CSS",
    emoji: "🎨",
    level: "Iniciante",
    duration: "15h",
    students: 5600,
    progress: 100,
    color: "quest-pink",
    tags: [],
    description: "Domine CSS moderno: Flexbox, Grid, animações, variáveis e design responsivo.",
    lessons: [
      {
        id: "4-1",
        title: "Seletores Básicos",
        description: "Escreva CSS para deixar todos os `<h1>` com cor **azul** e todos os `<p>` com tamanho de fonte **18px**.",
        theory: `CSS (Cascading Style Sheets) controla a aparência visual do HTML. Cada regra CSS tem um seletor e declarações.

Estrutura:
  seletor {
    propriedade: valor;
  }

Tipos de seletores:
• Tag: h1 { } → todos os <h1>
• Classe: .destaque { } → elementos com class="destaque"
• ID: #titulo { } → elemento com id="titulo"
• Universal: * { } → todos os elementos

Propriedades comuns:
  color: blue;           → cor do texto
  font-size: 18px;       → tamanho da fonte
  background-color: red; → cor de fundo
  margin: 10px;          → espaço externo
  padding: 20px;         → espaço interno
  border: 1px solid black; → borda

Combinando seletores:
  h1, h2 { }           → h1 E h2
  .card p { }           → <p> dentro de .card
  .card > p { }         → <p> filho direto de .card
  .card:hover { }       → .card quando mouse está sobre

Especificidade: ID > Classe > Tag. Quanto mais específico, maior a prioridade.`,
        starterCode: '/* Estilize h1 e p */\n',
        solution: 'h1 {\n  color: blue;\n}\np {\n  font-size: 18px;\n}',
        expectedOutput: "color: blue",
        hints: ["Use o seletor de tag: h1 { ... }", "font-size define o tamanho", "Não esqueça do ponto e vírgula"],
        xpReward: 10,
      },
      {
        id: "4-2",
        title: "Flexbox — Centralizando",
        description: "Use Flexbox para centralizar um elemento **horizontal e verticalmente** dentro do container.",
        theory: `Flexbox é um sistema de layout poderoso para alinhar e distribuir elementos em uma direção (linha ou coluna).

Ativando Flexbox:
  .container {
    display: flex;
  }

Eixos:
• Eixo principal (main axis) — horizontal por padrão
• Eixo cruzado (cross axis) — perpendicular ao principal

Propriedades do container:
  justify-content → alinha no eixo PRINCIPAL
    flex-start | center | flex-end | space-between | space-around

  align-items → alinha no eixo CRUZADO
    flex-start | center | flex-end | stretch | baseline

  flex-direction → muda a direção
    row (padrão) | column | row-reverse | column-reverse

  gap → espaço entre itens
    gap: 16px;

Centralizando perfeitamente:
  .container {
    display: flex;
    justify-content: center;  /* horizontal */
    align-items: center;      /* vertical */
    height: 100vh;            /* precisa de altura! */
  }

Dica: Para centralizar vertical, o container PRECISA ter uma altura definida!`,
        starterCode: '.container {\n  /* Centralize com Flexbox */\n  height: 100vh;\n}\n',
        solution: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}',
        expectedOutput: "justify-content: center",
        hints: ["display: flex ativa o Flexbox", "justify-content: center (horizontal)", "align-items: center (vertical)"],
        xpReward: 15,
      },
      {
        id: "4-3",
        title: "CSS Grid",
        description: "Crie um layout de **3 colunas iguais** usando CSS Grid com um gap de 16px.",
        theory: `CSS Grid é um sistema de layout bidimensional — controla linhas E colunas ao mesmo tempo.

Ativando Grid:
  .grid {
    display: grid;
  }

Definindo colunas:
  grid-template-columns: 200px 200px 200px;    → 3 colunas de 200px
  grid-template-columns: 1fr 1fr 1fr;           → 3 colunas iguais
  grid-template-columns: repeat(3, 1fr);         → mesma coisa, mais limpo
  grid-template-columns: 1fr 2fr 1fr;           → do meio é o dobro

fr = fração do espaço disponível

Definindo linhas:
  grid-template-rows: 100px auto 50px;

Espaçamento:
  gap: 16px;            → espaço entre todas as células
  column-gap: 20px;     → só entre colunas
  row-gap: 10px;        → só entre linhas

Grid responsivo automático:
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* Cria quantas colunas couberem, mínimo 250px cada */

Quando usar Grid vs Flexbox:
• Grid → layouts 2D (linhas + colunas), grids de cards
• Flexbox → layouts 1D (uma direção), alinhamento`,
        starterCode: '.grid {\n  /* Crie o grid */\n}\n',
        solution: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}',
        expectedOutput: "grid-template-columns",
        hints: ["display: grid ativa o Grid", "grid-template-columns: repeat(3, 1fr)", "gap: 16px para espaçamento"],
        xpReward: 20,
      },
      {
        id: "4-4",
        title: "Variáveis CSS",
        description: "Defina variáveis CSS `--cor-primaria` (roxo) e `--espacamento` (16px) no `:root` e use-as em um `.card`.",
        theory: `Variáveis CSS (Custom Properties) permitem reutilizar valores em todo o CSS. Mudou em um lugar? Muda em todos!

Definindo variáveis no :root (globais):
  :root {
    --cor-primaria: #6c5ce7;
    --cor-texto: #333;
    --espacamento: 16px;
    --raio-borda: 8px;
  }

Usando variáveis:
  .card {
    color: var(--cor-texto);
    padding: var(--espacamento);
    border-radius: var(--raio-borda);
    background: var(--cor-primaria);
  }

Valor fallback (se a variável não existir):
  color: var(--cor-link, blue);

Variáveis locais (só dentro do elemento):
  .tema-escuro {
    --cor-fundo: #1a1a2e;
    --cor-texto: #eee;
  }

Alterar temas facilmente:
  :root { --bg: white; --text: black; }
  .dark { --bg: #1a1a2e; --text: white; }

  body {
    background: var(--bg);
    color: var(--text);
  }

Variáveis CSS são essenciais para design systems e temas dinâmicos!`,
        starterCode: ':root {\n  /* Defina variáveis */\n}\n.card {\n  /* Use as variáveis */\n}\n',
        solution: ':root {\n  --cor-primaria: purple;\n  --espacamento: 16px;\n}\n.card {\n  color: var(--cor-primaria);\n  padding: var(--espacamento);\n}',
        expectedOutput: "--cor-primaria",
        hints: ["--nome-variavel: valor no :root", "var(--nome-variavel) para usar", "Variáveis começam com --"],
        xpReward: 20,
      },
      {
        id: "4-5",
        title: "Animações",
        description: "Crie uma animação `@keyframes` chamada `fadeIn` que vai de `opacity: 0` para `opacity: 1`. Aplique-a a `.elemento`.",
        theory: `Animações CSS dão vida à sua página! Existem duas formas: transitions (simples) e @keyframes (complexas).

Transitions — mudanças suaves ao interagir:
  .botao {
    background: blue;
    transition: background 0.3s ease;
  }
  .botao:hover {
    background: darkblue;
  }

@keyframes — animações completas:
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

Aplicando a animação:
  .elemento {
    animation: fadeIn 1s ease-in;
  }

Propriedades de animation:
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: ease-in;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;  /* repete sempre */
  animation-fill-mode: forwards;        /* mantém o estado final */

Shorthand:
  animation: fadeIn 1s ease-in 0.5s infinite forwards;

Timing functions: ease, linear, ease-in, ease-out, ease-in-out, cubic-bezier()`,
        starterCode: '/* Crie a animação e aplique */\n',
        solution: '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.elemento {\n  animation: fadeIn 1s ease-in;\n}',
        expectedOutput: "@keyframes fadeIn",
        hints: ["@keyframes nome { from { } to { } }", "animation: nome duração timing", "Use from/to ou 0%/100%"],
        xpReward: 25,
      },
      {
        id: "4-6",
        title: "Media Queries",
        description: "Escreva uma media query que muda a cor de fundo do `body` para **escuro** quando a tela for menor que **768px**.",
        theory: `Media queries permitem aplicar CSS diferente dependendo do tamanho da tela, orientação ou tipo de dispositivo.

Sintaxe:
  @media (condição) {
    /* CSS para essa condição */
  }

Breakpoints comuns:
  @media (max-width: 768px) { }   → tablets e menores
  @media (max-width: 480px) { }   → celulares
  @media (min-width: 1024px) { }  → desktops

Abordagem Mobile-First (recomendada):
  /* CSS base = mobile */
  .container { padding: 16px; }

  /* Desktop */
  @media (min-width: 768px) {
    .container { padding: 32px; }
  }

Exemplos práticos:
  /* Menu hamburger no mobile */
  .menu { display: flex; }
  @media (max-width: 768px) {
    .menu { display: none; }
    .hamburger { display: block; }
  }

  /* Grid responsivo */
  .grid { grid-template-columns: 1fr; }
  @media (min-width: 768px) {
    .grid { grid-template-columns: repeat(3, 1fr); }
  }

Dica: Sempre teste seu site em diferentes tamanhos! Use DevTools > Toggle Device Toolbar.`,
        starterCode: '/* Responsividade */\n',
        solution: '@media (max-width: 768px) {\n  body {\n    background-color: #1a1a2e;\n  }\n}',
        expectedOutput: "@media",
        hints: ["@media (max-width: 768px) { ... }", "Coloque as regras CSS dentro da media query", "max-width para telas menores que"],
        xpReward: 20,
      },
    ],
  },
  {
    id: "5",
    title: "Node.js Backend",
    language: "Node.js",
    emoji: "🚀",
    level: "Avançado",
    duration: "35h",
    students: 4300,
    progress: 10,
    color: "accent",
    tags: ["Novo"],
    description: "Construa APIs REST com Node.js, Express, middlewares, autenticação e deploy.",
    lessons: [
      {
        id: "5-1",
        title: "Hello Server",
        description: "Crie um servidor HTTP básico com Node.js que responde **\"Servidor rodando!\"** na porta 3000.",
        theory: `Node.js permite rodar JavaScript fora do navegador — no servidor! Com ele você cria APIs, servidores web e ferramentas de linha de comando.

O módulo http (nativo do Node):
  const http = require("http");

  const server = http.createServer((req, res) => {
    // req = dados da requisição (URL, método, headers)
    // res = objeto de resposta (o que enviar de volta)
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Olá do servidor!");
  });

  server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });

Conceitos importantes:
• require() → importa módulos
• createServer() → cria o servidor HTTP
• O callback (req, res) roda a cada requisição
• res.end() → envia a resposta e encerra
• server.listen(porta) → inicia o servidor

Para testar: abra http://localhost:3000 no navegador!

Na prática, usamos frameworks como Express que simplificam muito esse processo.`,
        starterCode: 'const http = require("http");\n// Crie o servidor\n',
        solution: 'const http = require("http");\nconst server = http.createServer((req, res) => {\n  res.end("Servidor rodando!");\n});\nserver.listen(3000);',
        expectedOutput: "Servidor rodando!",
        hints: ["http.createServer((req, res) => { ... })", "res.end() envia a resposta", "server.listen(3000) inicia na porta"],
        xpReward: 10,
      },
      {
        id: "5-2",
        title: "Express Básico",
        description: "Crie um app Express com uma rota GET `/` que retorna o JSON `{\"mensagem\": \"API funcionando!\"}`.",
        theory: `Express é o framework web mais popular do Node.js. Ele simplifica a criação de servidores e APIs REST.

Instalando: npm install express

Criando um app Express:
  const express = require("express");
  const app = express();

  app.get("/", (req, res) => {
    res.json({ mensagem: "Olá!" });
  });

  app.listen(3000, () => {
    console.log("API rodando na porta 3000");
  });

Métodos HTTP (verbos):
  app.get()    → buscar dados (leitura)
  app.post()   → criar dados
  app.put()    → atualizar dados (completo)
  app.patch()  → atualizar dados (parcial)
  app.delete() → deletar dados

Métodos de resposta:
  res.send("texto")           → envia texto
  res.json({ chave: "valor" }) → envia JSON
  res.status(404).json({...})  → define status + JSON
  res.redirect("/outra-rota")  → redireciona

O Express é a base para criar qualquer API REST profissional em Node.js!`,
        starterCode: 'const express = require("express");\nconst app = express();\n// Crie a rota\n',
        solution: 'const express = require("express");\nconst app = express();\napp.get("/", (req, res) => {\n  res.json({ mensagem: "API funcionando!" });\n});\napp.listen(3000);',
        expectedOutput: "API funcionando!",
        hints: ["app.get(\"/\", (req, res) => { ... })", "res.json() envia JSON", "Não esqueça do app.listen()"],
        xpReward: 15,
      },
      {
        id: "5-3",
        title: "Rotas e Parâmetros",
        description: "Crie uma rota GET `/users/:id` que retorna o id do usuário como JSON.",
        theory: `Rotas com parâmetros permitem criar URLs dinâmicas. O Express usa :nomeDoParametro na definição da rota.

Parâmetros de rota (req.params):
  app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    res.json({ id: userId });
  });
  // GET /users/42 → { id: "42" }

Múltiplos parâmetros:
  app.get("/cursos/:cursoId/aulas/:aulaId", (req, res) => {
    const { cursoId, aulaId } = req.params;
    res.json({ cursoId, aulaId });
  });
  // GET /cursos/3/aulas/7 → { cursoId: "3", aulaId: "7" }

Query strings (req.query):
  // GET /users?nome=Ana&idade=25
  app.get("/users", (req, res) => {
    const { nome, idade } = req.query;
    res.json({ nome, idade });
  });

Diferença:
• Parâmetros de rota → dados obrigatórios (parte da URL)
• Query strings → dados opcionais (após o ?)

Dica: Parâmetros são SEMPRE strings! Converta com Number() ou parseInt() se precisar de números.`,
        starterCode: '// Rota com parâmetro\n',
        solution: 'app.get("/users/:id", (req, res) => {\n  res.json({ id: req.params.id });\n});',
        expectedOutput: "req.params",
        hints: ["Use :id na rota para parâmetros", "req.params.id acessa o valor", "res.json() para retornar JSON"],
        xpReward: 15,
      },
      {
        id: "5-4",
        title: "Middleware",
        description: "Crie um middleware que loga **\"Requisição recebida: [método] [url]\"** antes de cada request.",
        theory: `Middlewares são funções que processam a requisição ANTES de chegar na rota final. São como "camadas" que a requisição atravessa.

Estrutura de um middleware:
  function meuMiddleware(req, res, next) {
    // faz algo com req/res
    next();  // passa para o próximo middleware/rota
  }

Aplicando globalmente (todas as rotas):
  app.use(meuMiddleware);

Aplicando em rota específica:
  app.get("/admin", verificarAuth, (req, res) => {
    res.json({ acesso: "permitido" });
  });

Middlewares comuns:
  // Logger
  app.use((req, res, next) => {
    console.log(\`\${req.method} \${req.url}\`);
    next();
  });

  // CORS
  app.use(cors());

  // Parse JSON do body
  app.use(express.json());

  // Servir arquivos estáticos
  app.use(express.static("public"));

Ordem importa! Middlewares rodam na ordem em que são declarados. Se next() não for chamado, a requisição "trava".`,
        starterCode: '// Crie o middleware\n',
        solution: 'app.use((req, res, next) => {\n  console.log(`Requisição recebida: ${req.method} ${req.url}`);\n  next();\n});',
        expectedOutput: "Requisição recebida",
        hints: ["app.use((req, res, next) => { ... })", "Chame next() para continuar o fluxo", "req.method e req.url dão info da requisição"],
        xpReward: 20,
      },
      {
        id: "5-5",
        title: "POST e Body Parser",
        description: "Crie uma rota POST `/users` que recebe `nome` e `email` no body e retorna o usuário criado.",
        theory: `Requisições POST enviam dados no corpo (body) da requisição — usado para criar recursos.

Habilitando parse de JSON:
  app.use(express.json());
  // Sem isso, req.body será undefined!

Criando rota POST:
  app.post("/users", (req, res) => {
    const { nome, email } = req.body;
    // Aqui salvaria no banco de dados
    const novoUser = { id: Date.now(), nome, email };
    res.status(201).json(novoUser);
  });

Status codes importantes:
  200 → OK (sucesso geral)
  201 → Created (recurso criado)
  400 → Bad Request (dados inválidos)
  401 → Unauthorized (não autenticado)
  404 → Not Found (não encontrado)
  500 → Internal Server Error

Validando dados:
  app.post("/users", (req, res) => {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({
        erro: "Nome e email são obrigatórios"
      });
    }

    res.status(201).json({ nome, email });
  });

Para testar POST, use ferramentas como Postman, Insomnia ou curl.`,
        starterCode: 'app.use(express.json());\n// Crie a rota POST\n',
        solution: 'app.use(express.json());\napp.post("/users", (req, res) => {\n  const { nome, email } = req.body;\n  res.status(201).json({ nome, email });\n});',
        expectedOutput: "req.body",
        hints: ["express.json() faz parse do body", "req.body acessa os dados enviados", "res.status(201).json() para criação"],
        xpReward: 20,
      },
      {
        id: "5-6",
        title: "Tratamento de Erros",
        description: "Crie um middleware de erro que captura exceções e retorna status **500** com uma mensagem de erro.",
        theory: `Tratamento de erros é essencial para APIs robustas. O Express tem um padrão para middlewares de erro.

Middleware de erro (4 parâmetros!):
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      erro: "Algo deu errado no servidor!"
    });
  });

IMPORTANTE: O middleware de erro DEVE ter 4 parâmetros (err, req, res, next). É assim que o Express reconhece como handler de erro.

Lançando erros nas rotas:
  app.get("/users/:id", (req, res, next) => {
    try {
      const user = buscarUser(req.params.id);
      if (!user) {
        const erro = new Error("Usuário não encontrado");
        erro.status = 404;
        throw erro;
      }
      res.json(user);
    } catch (err) {
      next(err);  // passa o erro para o middleware de erro
    }
  });

Middleware de erro personalizado:
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      erro: err.message || "Erro interno",
      status
    });
  });

Dica: Sempre coloque o middleware de erro DEPOIS de todas as rotas!`,
        starterCode: '// Middleware de erro\n',
        solution: 'app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ erro: "Algo deu errado!" });\n});',
        expectedOutput: "status(500)",
        hints: ["Middleware de erro tem 4 parâmetros: err, req, res, next", "Use res.status(500)", "console.error para logar o erro"],
        xpReward: 25,
      },
    ],
  },
  {
    id: "6",
    title: "SQL & Bancos de Dados",
    language: "SQL",
    emoji: "🗄️",
    level: "Iniciante",
    duration: "18h",
    students: 6100,
    progress: 0,
    color: "quest-orange",
    tags: ["Popular"],
    description: "Aprenda SQL do básico ao avançado: SELECT, JOIN, GROUP BY, subqueries e otimização.",
    lessons: [
      {
        id: "6-1",
        title: "SELECT Básico",
        description: "Escreva um SELECT para buscar **todos os campos** da tabela `usuarios`.",
        theory: `SQL (Structured Query Language) é a linguagem para interagir com bancos de dados relacionais. O SELECT é o comando mais usado — ele busca dados.

Sintaxe básica:
  SELECT colunas FROM tabela;

Exemplos:
  SELECT * FROM usuarios;
  -- * significa TODOS os campos

  SELECT nome, email FROM usuarios;
  -- Só os campos nome e email

  SELECT nome AS "Nome Completo" FROM usuarios;
  -- Renomeia a coluna no resultado (alias)

Conceitos de banco relacional:
• Tabela → como uma planilha (linhas e colunas)
• Linha (registro/row) → um dado completo
• Coluna (campo) → uma propriedade do dado
• Chave primária (PK) → identificador único (geralmente id)

Exemplo de tabela "usuarios":
  | id | nome    | email          | idade |
  |----|---------|----------------|-------|
  | 1  | Ana     | ana@mail.com   | 25    |
  | 2  | Bruno   | bruno@mail.com | 30    |

O ponto e vírgula (;) no final é obrigatório em SQL!`,
        starterCode: '-- Busque todos os dados\n',
        solution: 'SELECT * FROM usuarios;',
        expectedOutput: "SELECT * FROM",
        hints: ["SELECT seleciona dados", "* significa todos os campos", "FROM indica a tabela"],
        xpReward: 10,
      },
      {
        id: "6-2",
        title: "WHERE — Filtrando",
        description: "Busque apenas os usuários com **idade maior que 18** da tabela `usuarios`.",
        theory: `WHERE filtra os resultados do SELECT com base em condições. Só retorna linhas que atendem ao critério.

Sintaxe:
  SELECT * FROM tabela WHERE condição;

Operadores de comparação:
  = igual           <> ou != diferente
  > maior que       >= maior ou igual
  < menor que       <= menor ou igual

Exemplos:
  SELECT * FROM usuarios WHERE idade > 18;
  SELECT * FROM usuarios WHERE nome = 'Ana';
  SELECT * FROM produtos WHERE preco <= 50;

Operadores lógicos:
  AND → ambas as condições:
    WHERE idade > 18 AND cidade = 'SP'

  OR → pelo menos uma condição:
    WHERE idade < 18 OR idade > 60

  NOT → nega a condição:
    WHERE NOT cidade = 'RJ'

Operadores especiais:
  BETWEEN → intervalo:
    WHERE idade BETWEEN 18 AND 30

  IN → lista de valores:
    WHERE cidade IN ('SP', 'RJ', 'MG')

  LIKE → busca por padrão:
    WHERE nome LIKE 'A%'   → começa com A
    WHERE nome LIKE '%ana' → termina com ana
    WHERE nome LIKE '%ar%' → contém "ar"

  IS NULL → campo vazio:
    WHERE email IS NULL`,
        starterCode: '-- Filtre por idade\n',
        solution: 'SELECT * FROM usuarios WHERE idade > 18;',
        expectedOutput: "WHERE idade",
        hints: ["Use WHERE para filtrar", "Operadores: >, <, =, >=, <=", "WHERE idade > 18"],
        xpReward: 15,
      },
      {
        id: "6-3",
        title: "INSERT INTO",
        description: "Insira um novo usuário na tabela `usuarios` com nome **\"Maria\"** e idade **25**.",
        theory: `INSERT INTO adiciona novas linhas (registros) em uma tabela.

Sintaxe:
  INSERT INTO tabela (coluna1, coluna2) VALUES (valor1, valor2);

Exemplos:
  INSERT INTO usuarios (nome, idade) VALUES ('Maria', 25);
  INSERT INTO produtos (nome, preco) VALUES ('Notebook', 2999.90);

Regras:
• Textos entre aspas simples: 'Maria'
• Números sem aspas: 25, 3.14
• A ordem dos valores deve bater com a ordem das colunas
• Colunas com DEFAULT ou auto-increment podem ser omitidas

Inserindo múltiplos registros:
  INSERT INTO usuarios (nome, idade) VALUES
    ('Ana', 22),
    ('Bruno', 28),
    ('Carlos', 35);

INSERT com SELECT (copiar dados):
  INSERT INTO usuarios_backup (nome, idade)
  SELECT nome, idade FROM usuarios WHERE ativo = true;

Se a coluna id for auto-increment (serial), não inclua:
  -- O banco gera o id automaticamente
  INSERT INTO usuarios (nome, idade) VALUES ('Maria', 25);
  -- id será 1, 2, 3... automaticamente`,
        starterCode: '-- Insira o registro\n',
        solution: "INSERT INTO usuarios (nome, idade) VALUES ('Maria', 25);",
        expectedOutput: "INSERT INTO",
        hints: ["INSERT INTO tabela (colunas) VALUES (valores)", "Texto entre aspas simples", "Números sem aspas"],
        xpReward: 15,
      },
      {
        id: "6-4",
        title: "UPDATE",
        description: "Atualize a idade do usuário **\"Maria\"** para **26** na tabela `usuarios`.",
        theory: `UPDATE modifica dados existentes em uma tabela. SEMPRE use WHERE para especificar quais registros atualizar!

Sintaxe:
  UPDATE tabela SET coluna = valor WHERE condição;

Exemplos:
  UPDATE usuarios SET idade = 26 WHERE nome = 'Maria';
  UPDATE produtos SET preco = 49.90 WHERE id = 5;

Atualizando múltiplas colunas:
  UPDATE usuarios SET idade = 26, cidade = 'RJ' WHERE id = 3;

⚠️ CUIDADO! Sem WHERE, atualiza TODOS os registros:
  UPDATE usuarios SET ativo = false;
  -- Desativa TODOS os usuários! Provavelmente não é o que você quer.

Boas práticas:
1. SEMPRE use WHERE com UPDATE e DELETE
2. Teste o WHERE com SELECT antes:
   SELECT * FROM usuarios WHERE nome = 'Maria';
   -- Confirme que retorna o registro certo
   UPDATE usuarios SET idade = 26 WHERE nome = 'Maria';

3. Use id (chave primária) quando possível:
   UPDATE usuarios SET idade = 26 WHERE id = 3;
   -- Mais seguro, pois id é único

UPDATE com cálculos:
  UPDATE produtos SET preco = preco * 1.10;
  -- Aumenta 10% em todos os preços`,
        starterCode: '-- Atualize o registro\n',
        solution: "UPDATE usuarios SET idade = 26 WHERE nome = 'Maria';",
        expectedOutput: "UPDATE",
        hints: ["UPDATE tabela SET campo = valor", "Use WHERE para filtrar qual registro", "Sem WHERE atualiza TODOS os registros!"],
        xpReward: 15,
      },
      {
        id: "6-5",
        title: "JOIN",
        description: "Faça um **INNER JOIN** entre `usuarios` e `pedidos` usando a coluna `usuario_id` para buscar nome e valor do pedido.",
        theory: `JOIN combina dados de duas ou mais tabelas baseado em uma relação entre elas. É uma das operações mais poderosas do SQL!

Tipos de JOIN:
  INNER JOIN → só retorna registros que existem em AMBAS as tabelas
  LEFT JOIN  → todos da esquerda + matches da direita (NULL se não tiver)
  RIGHT JOIN → todos da direita + matches da esquerda
  FULL JOIN  → todos de ambas as tabelas

Exemplo com INNER JOIN:
  Tabela usuarios: | id | nome  |
                   | 1  | Ana   |
                   | 2  | Bruno |

  Tabela pedidos:  | id | usuario_id | valor  |
                   | 1  | 1          | 99.90  |
                   | 2  | 1          | 49.90  |

  SELECT u.nome, p.valor
  FROM usuarios u
  INNER JOIN pedidos p ON u.id = p.usuario_id;

  Resultado: | nome | valor |
             | Ana  | 99.90 |
             | Ana  | 49.90 |
  (Bruno não aparece pois não tem pedidos)

Aliases (apelidos) são essenciais com JOINs:
  FROM usuarios u    → "u" é o alias de usuarios
  ON u.id = p.usuario_id → referencia usando o alias

LEFT JOIN incluiria Bruno com valor NULL.`,
        starterCode: '-- Faça o JOIN\n',
        solution: 'SELECT u.nome, p.valor\nFROM usuarios u\nINNER JOIN pedidos p ON u.id = p.usuario_id;',
        expectedOutput: "INNER JOIN",
        hints: ["INNER JOIN tabela ON condição", "Use aliases: usuarios u", "ON u.id = p.usuario_id"],
        xpReward: 25,
      },
      {
        id: "6-6",
        title: "GROUP BY e COUNT",
        description: "Conte quantos pedidos cada usuário fez, agrupando por `nome`.",
        theory: `GROUP BY agrupa registros que têm valores iguais e permite usar funções de agregação.

Funções de agregação:
  COUNT() → conta registros
  SUM()   → soma valores
  AVG()   → média dos valores
  MAX()   → maior valor
  MIN()   → menor valor

Sintaxe:
  SELECT coluna, FUNCAO(coluna)
  FROM tabela
  GROUP BY coluna;

Exemplos:
  -- Quantos pedidos por usuário
  SELECT u.nome, COUNT(p.id) as total_pedidos
  FROM usuarios u
  LEFT JOIN pedidos p ON u.id = p.usuario_id
  GROUP BY u.nome;

  -- Total gasto por cliente
  SELECT nome, SUM(valor) as total
  FROM pedidos
  GROUP BY nome;

HAVING — filtrar após o agrupamento:
  SELECT nome, COUNT(*) as total
  FROM pedidos
  GROUP BY nome
  HAVING COUNT(*) > 5;
  -- Só clientes com mais de 5 pedidos

WHERE vs HAVING:
• WHERE filtra ANTES do agrupamento
• HAVING filtra DEPOIS do agrupamento

Ordem das cláusulas:
  SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`,
        starterCode: '-- Agrupe e conte\n',
        solution: 'SELECT u.nome, COUNT(p.id) as total_pedidos\nFROM usuarios u\nLEFT JOIN pedidos p ON u.id = p.usuario_id\nGROUP BY u.nome;',
        expectedOutput: "GROUP BY",
        hints: ["GROUP BY agrupa resultados", "COUNT() conta registros", "Use LEFT JOIN para incluir quem não tem pedidos"],
        xpReward: 25,
      },
    ],
  },
  {
    id: "7",
    title: "Git & GitHub Pro",
    language: "Git",
    emoji: "🔀",
    level: "Iniciante",
    duration: "10h",
    students: 8900,
    progress: 80,
    color: "quest-blue",
    tags: [],
    description: "Domine Git e GitHub: commits, branches, merge, pull requests e workflows.",
    lessons: [
      {
        id: "7-1",
        title: "git init e primeiro commit",
        description: "Inicialize um repositório e faça o primeiro commit com a mensagem **\"Início do projeto\"**.",
        theory: `Git é um sistema de controle de versão — ele rastreia todas as mudanças no seu código, permite voltar no tempo e colaborar com outras pessoas.

Conceitos fundamentais:
• Repositório (repo) → pasta do projeto rastreada pelo Git
• Commit → um "snapshot" do código em um momento
• Staging area → área de preparação (entre edição e commit)

Fluxo básico:
  1. Edita arquivos
  2. git add → move para staging area
  3. git commit → salva o snapshot

Comandos iniciais:
  git init                    → cria um repo na pasta atual
  git status                  → mostra o estado dos arquivos
  git add arquivo.txt         → adiciona arquivo ao staging
  git add .                   → adiciona TODOS os arquivos
  git commit -m "mensagem"    → cria o commit com mensagem

Boas práticas de mensagem de commit:
  ✅ "Adiciona formulário de login"
  ✅ "Corrige bug no cálculo de frete"
  ❌ "fix"
  ❌ "alterações"

Use o presente do indicativo: "Adiciona" em vez de "Adicionado".`,
        starterCode: '# Comandos Git\n',
        solution: 'git init\ngit add .\ngit commit -m "Início do projeto"',
        expectedOutput: "git init",
        hints: ["git init cria o repositório", "git add . adiciona todos os arquivos", 'git commit -m "mensagem"'],
        xpReward: 10,
      },
      {
        id: "7-2",
        title: "Branches",
        description: "Crie uma nova branch chamada **\"feature/login\"** e mude para ela.",
        theory: `Branches (ramificações) permitem trabalhar em funcionalidades isoladas sem afetar o código principal.

Imagine como uma árvore:
  main ────●────●────●──── (código estável)
                 \\
                  ●────●── feature/login (nova funcionalidade)

Comandos:
  git branch                    → lista branches
  git branch feature/login      → cria nova branch
  git checkout feature/login    → muda para a branch
  git checkout -b feature/login → cria E muda (atalho!)
  git switch feature/login      → muda (comando moderno)
  git switch -c feature/login   → cria E muda (moderno)

Convenções de nome:
  feature/login     → nova funcionalidade
  bugfix/header     → correção de bug
  hotfix/seguranca  → correção urgente
  release/v2.0      → preparação de release

Fluxo típico:
  1. Crie uma branch para a tarefa
  2. Faça commits na branch
  3. Quando pronto, faça merge para main
  4. Delete a branch

A branch main (ou master) é a versão estável do projeto. Nunca faça commits direto nela em projetos com equipe!`,
        starterCode: '# Crie e mude de branch\n',
        solution: 'git checkout -b feature/login',
        expectedOutput: "checkout -b",
        hints: ["git branch nome cria a branch", "git checkout nome muda para ela", "git checkout -b faz os dois de uma vez"],
        xpReward: 15,
      },
      {
        id: "7-3",
        title: "Merge",
        description: "Volte para a branch `main` e faça merge da branch `feature/login`.",
        theory: `Merge combina as mudanças de uma branch em outra. É como "juntar" o trabalho feito separadamente.

Fluxo de merge:
  1. Vá para a branch que vai RECEBER as mudanças:
     git checkout main

  2. Faça o merge da branch com as mudanças:
     git merge feature/login

  3. (Opcional) Delete a branch após o merge:
     git branch -d feature/login

Tipos de merge:
  Fast-forward → quando main não mudou desde a criação da branch
    main:    A → B
    feature: A → B → C → D
    Resultado: main vira A → B → C → D (sem commit extra)

  Merge commit → quando ambas as branches mudaram
    main:    A → B → E
    feature: A → B → C → D
    Resultado: cria um commit de merge juntando as duas

Visualizando o histórico:
  git log --oneline --graph
  * abc1234 (HEAD -> main) Merge branch 'feature/login'
  |\\
  | * def5678 Adiciona validação
  | * ghi9012 Cria formulário de login
  |/
  * jkl3456 Commit anterior

O merge é uma operação segura — preserva todo o histórico.`,
        starterCode: '# Faça o merge\n',
        solution: 'git checkout main\ngit merge feature/login',
        expectedOutput: "git merge",
        hints: ["Primeiro volte para main", "git checkout main", "git merge nome-da-branch"],
        xpReward: 15,
      },
      {
        id: "7-4",
        title: "Resolvendo Conflitos",
        description: "Quando há conflito, o Git marca o arquivo. Descreva os passos para **resolver um conflito de merge**.",
        theory: `Conflitos acontecem quando duas branches modificam a MESMA linha do MESMO arquivo. O Git não sabe qual manter e pede sua ajuda.

Quando ocorre um conflito, o Git marca o arquivo assim:
  <<<<<<< HEAD
  código da sua branch (main)
  =======
  código da outra branch (feature)
  >>>>>>> feature/login

Passos para resolver:
  1. Abra o arquivo com conflito
  2. Encontre as marcações <<<<, ====, >>>>
  3. Decida qual código manter (ou combine ambos)
  4. REMOVA as marcações do Git
  5. git add arquivo-resolvido
  6. git commit (sem -m, o Git cria a mensagem)

Exemplo — antes:
  <<<<<<< HEAD
  const cor = "azul";
  =======
  const cor = "vermelho";
  >>>>>>> feature/tema

Exemplo — depois (resolvido):
  const cor = "roxo";  // ou qualquer decisão

Dicas:
• VSCode tem ferramentas visuais para resolver conflitos
• git merge --abort → cancela o merge e volta ao estado anterior
• Comunique-se com a equipe para entender a intenção de cada mudança
• Conflitos são normais em equipes — não é um erro!`,
        starterCode: '# Passos para resolver conflitos\n',
        solution: '# 1. Abra o arquivo com conflito\n# 2. Escolha qual código manter (remova <<<<, ====, >>>>)\n# 3. git add arquivo-resolvido\n# 4. git commit',
        expectedOutput: "git add",
        hints: ["O Git marca conflitos com <<<< ==== >>>>", "Edite o arquivo manualmente", "Depois faça git add e git commit"],
        xpReward: 20,
      },
      {
        id: "7-5",
        title: "Pull Request",
        description: "Descreva os passos para criar um **Pull Request** no GitHub após enviar uma branch.",
        theory: `Pull Request (PR) é a forma de propor mudanças no GitHub. Permite revisão de código antes de fazer merge na branch principal.

Fluxo completo:
  1. Crie uma branch localmente:
     git checkout -b feature/login

  2. Faça commits:
     git add .
     git commit -m "Adiciona formulário de login"

  3. Envie a branch para o GitHub:
     git push origin feature/login

  4. No GitHub:
     - Clique em "Compare & pull request"
     - Escreva título e descrição
     - Escolha reviewers
     - Clique "Create pull request"

  5. Após aprovação: Merge e delete da branch

Boas práticas de PR:
  ✅ Título claro: "Adiciona autenticação com Google"
  ✅ Descrição com contexto: O que fez? Por quê? Como testar?
  ✅ PRs pequenos e focados
  ✅ Screenshots para mudanças visuais
  ❌ PRs gigantes com 50 arquivos
  ❌ Sem descrição

Code review — ao revisar:
  • Leia o código com atenção
  • Deixe comentários construtivos
  • Aprove ou peça mudanças
  • Teste localmente se necessário`,
        starterCode: '# Passos para criar um PR\n',
        solution: '# 1. git push origin feature/login\n# 2. Acesse o repositório no GitHub\n# 3. Clique em "Compare & pull request"\n# 4. Descreva as mudanças e crie o PR',
        expectedOutput: "git push",
        hints: ["Primeiro faça push da branch", "No GitHub, clique em Compare & pull request", "Descreva suas mudanças no PR"],
        xpReward: 20,
      },
    ],
  },
  {
    id: "8",
    title: "Algoritmos & Estruturas",
    language: "Lógica",
    emoji: "🧠",
    level: "Avançado",
    duration: "40h",
    students: 3200,
    progress: 0,
    color: "primary",
    tags: ["Em alta"],
    description: "Domine algoritmos, complexidade, ordenação, busca, árvores e grafos.",
    lessons: [
      {
        id: "8-1",
        title: "Big O Notation",
        description: "Qual a complexidade do algoritmo abaixo? Responda com a notação Big O.\n```\nfor i in range(n):\n    print(i)\n```",
        theory: `Big O Notation descreve a eficiência de um algoritmo — quanto tempo ou memória ele usa conforme o tamanho da entrada (n) cresce.

Complexidades comuns (do mais rápido ao mais lento):
  O(1)       → Constante: sempre o mesmo tempo
               Exemplo: acessar item por índice arr[5]

  O(log n)   → Logarítmica: divide o problema pela metade
               Exemplo: busca binária

  O(n)       → Linear: percorre todos os elementos uma vez
               Exemplo: for i in range(n): print(i)

  O(n log n) → Log-linear: divisão + percorrer
               Exemplo: merge sort, quicksort

  O(n²)      → Quadrática: loop dentro de loop
               Exemplo: bubble sort, dois for aninhados

  O(2ⁿ)      → Exponencial: dobra a cada elemento
               Exemplo: fibonacci recursivo sem cache

Como analisar:
  1. Conte os loops:
     - 1 loop = O(n)
     - 2 loops aninhados = O(n²)
     - Loop que divide por 2 = O(log n)

  2. Ignore constantes:
     - O(2n) → O(n)
     - O(n² + n) → O(n²)

  3. Considere o pior caso

Na prática: O(n log n) é bom. O(n²) é aceitável para n pequeno. O(2ⁿ) é quase sempre ruim.`,
        starterCode: '# Responda a complexidade\n# Exemplo: O(1), O(n), O(n^2), O(log n)\n',
        solution: 'O(n)',
        expectedOutput: "O(n)",
        hints: ["Um loop percorrendo n elementos", "Cada iteração faz trabalho constante", "Resposta: O(n)"],
        xpReward: 15,
      },
      {
        id: "8-2",
        title: "Bubble Sort",
        description: "Implemente o **Bubble Sort** em Python para ordenar a lista `[5, 3, 8, 1, 2]`.",
        theory: `Bubble Sort é o algoritmo de ordenação mais simples. Ele compara elementos adjacentes e troca se estiverem na ordem errada, repetindo até a lista estar ordenada.

Como funciona (exemplo: [5, 3, 8, 1, 2]):
  Passo 1: [3, 5, 1, 2, 8] → 8 "borbulha" para o final
  Passo 2: [3, 1, 2, 5, 8] → 5 vai para a posição
  Passo 3: [1, 2, 3, 5, 8] → ordenado!

Algoritmo:
  def bubble_sort(arr):
      n = len(arr)
      for i in range(n):           # repete n vezes
          for j in range(n - i - 1):  # compara adjacentes
              if arr[j] > arr[j+1]:   # se fora de ordem
                  arr[j], arr[j+1] = arr[j+1], arr[j]  # troca!
      return arr

Por que n - i - 1?
  A cada passada, o maior elemento "borbulha" para o final.
  Então não precisamos comparar os últimos i elementos (já estão ordenados).

Complexidade:
  Melhor caso: O(n) — já ordenado (com otimização)
  Pior caso: O(n²) — ordem invertida
  Espaço: O(1) — ordena "in-place"

Bubble Sort é didático mas LENTO para listas grandes. Na prática, use sort() do Python (usa Timsort, O(n log n)).`,
        starterCode: 'def bubble_sort(arr):\n    # Implemente aqui\n    pass\n\nprint(bubble_sort([5, 3, 8, 1, 2]))',
        solution: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([5, 3, 8, 1, 2]))',
        expectedOutput: "[1, 2, 3, 5, 8]",
        hints: ["Dois loops aninhados", "Compare elementos adjacentes", "Troque se estiverem na ordem errada"],
        xpReward: 25,
      },
      {
        id: "8-3",
        title: "Busca Binária",
        description: "Implemente a **busca binária** em Python. Busque o número **7** na lista `[1, 3, 5, 7, 9, 11]`.",
        theory: `Busca binária é um algoritmo eficiente para encontrar um elemento em uma lista ORDENADA. Divide o espaço de busca pela metade a cada passo.

Como funciona (buscar 7 em [1, 3, 5, 7, 9, 11]):
  Passo 1: meio = 5 → 7 > 5 → busca na metade direita [7, 9, 11]
  Passo 2: meio = 9 → 7 < 9 → busca na metade esquerda [7]
  Passo 3: meio = 7 → ENCONTROU! Índice 3

Algoritmo:
  def busca_binaria(arr, alvo):
      esq = 0
      dir = len(arr) - 1
      
      while esq <= dir:
          meio = (esq + dir) // 2
          
          if arr[meio] == alvo:
              return meio          # encontrou!
          elif arr[meio] < alvo:
              esq = meio + 1       # busca na direita
          else:
              dir = meio - 1       # busca na esquerda
      
      return -1  # não encontrou

Complexidade:
  Tempo: O(log n) — MUITO mais rápido que O(n)!
  Em 1 milhão de itens: busca linear = 1M comparações
                         busca binária = ~20 comparações!

PRÉ-REQUISITO: A lista DEVE estar ordenada! Se não estiver, ordene primeiro ou use busca linear.`,
        starterCode: 'def busca_binaria(arr, alvo):\n    # Implemente aqui\n    pass\n\nprint(busca_binaria([1, 3, 5, 7, 9, 11], 7))',
        solution: 'def busca_binaria(arr, alvo):\n    esq, dir = 0, len(arr) - 1\n    while esq <= dir:\n        meio = (esq + dir) // 2\n        if arr[meio] == alvo:\n            return meio\n        elif arr[meio] < alvo:\n            esq = meio + 1\n        else:\n            dir = meio - 1\n    return -1\n\nprint(busca_binaria([1, 3, 5, 7, 9, 11], 7))',
        expectedOutput: "3",
        hints: ["Divida o array ao meio a cada passo", "Compare o meio com o alvo", "Complexidade: O(log n)"],
        xpReward: 25,
      },
      {
        id: "8-4",
        title: "Pilha (Stack)",
        description: "Implemente uma **pilha** usando lista em Python com métodos `push`, `pop` e `peek`. Teste adicionando 1, 2, 3 e removendo um.",
        theory: `Uma Pilha (Stack) é uma estrutura de dados LIFO — Last In, First Out (último a entrar, primeiro a sair). Como uma pilha de pratos!

Operações:
  push(item) → adiciona no topo
  pop()      → remove e retorna o topo
  peek()     → vê o topo sem remover
  isEmpty()  → verifica se está vazia

Visualização:
  push(1): [1]
  push(2): [1, 2]
  push(3): [1, 2, 3]  ← topo
  pop():   [1, 2]     → retorna 3
  peek():  [1, 2]     → retorna 2 (sem remover)

Implementação em Python:
  class Pilha:
      def __init__(self):
          self.items = []
      
      def push(self, item):
          self.items.append(item)
      
      def pop(self):
          return self.items.pop()
      
      def peek(self):
          return self.items[-1]
      
      def is_empty(self):
          return len(self.items) == 0

Usos reais:
  • Ctrl+Z (desfazer) — cada ação vai para a pilha
  • Navegador — botão voltar usa uma pilha de URLs
  • Chamadas de função — a call stack é uma pilha!
  • Validação de parênteses: ({[]}) é válido?`,
        starterCode: 'class Pilha:\n    # Implemente aqui\n    pass\n',
        solution: 'class Pilha:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()\n    def peek(self):\n        return self.items[-1]\n\np = Pilha()\np.push(1)\np.push(2)\np.push(3)\nprint(p.pop())\nprint(p.peek())',
        expectedOutput: "3",
        hints: ["Use lista como estrutura interna", "append para push, pop() para pop", "[-1] para peek (ver o topo)"],
        xpReward: 25,
      },
      {
        id: "8-5",
        title: "Recursão — Fibonacci",
        description: "Implemente a sequência de **Fibonacci** de forma recursiva. Exiba os 8 primeiros números.",
        theory: `Recursão é quando uma função chama a si mesma. Toda função recursiva precisa de dois componentes:

1. Caso base — quando PARAR (evita loop infinito)
2. Caso recursivo — quando chamar a si mesma

Fibonacci: cada número é a soma dos dois anteriores.
  0, 1, 1, 2, 3, 5, 8, 13, 21, 34...

  fib(0) = 0           (caso base)
  fib(1) = 1           (caso base)
  fib(n) = fib(n-1) + fib(n-2)  (caso recursivo)

Implementação:
  def fibonacci(n):
      if n <= 1:        # caso base
          return n
      return fibonacci(n-1) + fibonacci(n-2)  # recursivo

Árvore de chamadas para fib(4):
          fib(4)
         /      \\
      fib(3)    fib(2)
      /    \\    /    \\
   fib(2) fib(1) fib(1) fib(0)
   /    \\
 fib(1) fib(0)

⚠️ Problema: muitas chamadas repetidas! fib(2) é calculado várias vezes.
  Complexidade: O(2ⁿ) — muito lento!

Solução: Memoização (cache):
  from functools import lru_cache

  @lru_cache
  def fibonacci(n):
      if n <= 1: return n
      return fibonacci(n-1) + fibonacci(n-2)
  # Agora é O(n)!`,
        starterCode: 'def fibonacci(n):\n    # Implemente aqui\n    pass\n\nfor i in range(8):\n    print(fibonacci(i))',
        solution: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(8):\n    print(fibonacci(i))',
        expectedOutput: "0",
        hints: ["Caso base: n <= 1 retorna n", "Caso recursivo: fib(n-1) + fib(n-2)", "Os primeiros são: 0, 1, 1, 2, 3, 5, 8, 13"],
        xpReward: 30,
      },
      {
        id: "8-6",
        title: "Fila (Queue)",
        description: "Implemente uma **fila** usando lista em Python com `enqueue` e `dequeue`. Teste com os valores A, B, C.",
        theory: `Uma Fila (Queue) é uma estrutura de dados FIFO — First In, First Out (primeiro a entrar, primeiro a sair). Como uma fila de banco!

Operações:
  enqueue(item) → adiciona no FINAL
  dequeue()     → remove do INÍCIO
  front()       → vê o primeiro sem remover
  isEmpty()     → verifica se está vazia

Visualização:
  enqueue("A"): [A]
  enqueue("B"): [A, B]
  enqueue("C"): [A, B, C]
  dequeue():    [B, C]    → retorna "A"
  dequeue():    [C]       → retorna "B"

Implementação básica:
  class Fila:
      def __init__(self):
          self.items = []
      
      def enqueue(self, item):
          self.items.append(item)    # adiciona no final
      
      def dequeue(self):
          return self.items.pop(0)   # remove do início

Pilha vs Fila:
  Pilha (LIFO): último a entrar sai primeiro (pilha de pratos)
  Fila (FIFO): primeiro a entrar sai primeiro (fila de banco)

Usos reais:
  • Fila de impressão
  • Processamento de tarefas (job queue)
  • BFS (busca em largura) em grafos
  • Buffer de streaming

Nota: pop(0) é O(n). Para performance, use collections.deque!`,
        starterCode: 'class Fila:\n    # Implemente aqui\n    pass\n',
        solution: 'class Fila:\n    def __init__(self):\n        self.items = []\n    def enqueue(self, item):\n        self.items.append(item)\n    def dequeue(self):\n        return self.items.pop(0)\n\nf = Fila()\nf.enqueue("A")\nf.enqueue("B")\nf.enqueue("C")\nprint(f.dequeue())',
        expectedOutput: "A",
        hints: ["Fila: primeiro a entrar, primeiro a sair (FIFO)", "append para enqueue", "pop(0) para dequeue (remove do início)"],
        xpReward: 25,
      },
    ],
  },
];

export const badges: Badge[] = [
  { id: "1", name: "Primeira Linha", emoji: "✍️", description: "Escreva sua primeira linha de código", unlocked: true, rarity: "Comum" },
  { id: "2", name: "Bug Hunter", emoji: "🐛", description: "Corrija 10 bugs em exercícios", unlocked: true, rarity: "Raro" },
  { id: "3", name: "Streak Master", emoji: "🔥", description: "Mantenha um streak de 7 dias", unlocked: true, rarity: "Raro" },
  { id: "4", name: "Pythonista", emoji: "🐍", description: "Complete o curso de Python", unlocked: false, rarity: "Épico" },
  { id: "5", name: "Full Stack", emoji: "🏗️", description: "Complete front-end e back-end", unlocked: false, rarity: "Lendário" },
  { id: "6", name: "Speed Coder", emoji: "⚡", description: "Complete 5 exercícios em menos de 10min", unlocked: true, rarity: "Épico" },
  { id: "7", name: "Maratonista", emoji: "🏃", description: "Estude por 4 horas seguidas", unlocked: false, rarity: "Raro" },
  { id: "8", name: "Mentor", emoji: "🌟", description: "Ajude 5 alunos no fórum", unlocked: false, rarity: "Lendário" },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Ana Silva", avatar: "👩‍💻", xp: 12450, level: 28 },
  { rank: 2, name: "Carlos Dev", avatar: "👨‍💻", xp: 11200, level: 25 },
  { rank: 3, name: "Maria Code", avatar: "👩‍🎓", xp: 10800, level: 24 },
  { rank: 4, name: "Pedro H.", avatar: "🧑‍💻", xp: 9500, level: 22 },
  { rank: 5, name: "Julia Santos", avatar: "👩‍🔬", xp: 8900, level: 20 },
];

export const userProfile = {
  name: "Lucas Mendes",
  avatar: "🧑‍💻",
  level: 15,
  xp: 7850,
  xpToNext: 10000,
  streak: 12,
  coursesCompleted: 3,
  exercisesDone: 156,
  rank: 8,
  joinedDate: "Mar 2024",
};

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getLessonById(courseId: string, lessonId: string): { course: Course; lesson: Lesson; lessonIndex: number } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) return undefined;
  return { course, lesson: course.lessons[lessonIndex], lessonIndex };
}
