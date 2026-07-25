// Banco-escola do curso de SQL.
//
// Antes, SQL era "corrigido" comparando o TEXTO da query com um fragmento
// (`expectedOutput: "SELECT nome"`): uma consulta semanticamente errada podia
// passar e uma correta escrita diferente podia falhar. Agora existe um SQLite
// de verdade (sql.js) rodando no navegador: o aluno executa a query contra
// este banco e a correção compara o RESULTADO. #revisao-lote4
//
// Regras ao mexer aqui:
// - as tabelas `cursos` e `usuarios` NÃO existem de propósito: as aulas 6-9 e
//   6-10 são justamente de CREATE TABLE e falhariam com "table already exists";
// - qualquer mudança nos dados muda o resultado esperado das aulas — rode
//   `npm run sql:sync` para regravar os `expectedOutput` a partir do banco.

export const SQL_SEED = `
CREATE TABLE alunos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  turma TEXT
);
INSERT INTO alunos (id, nome, turma) VALUES
  (1, 'Ana Souza', 'A'),
  (2, 'Bruno Lima', 'A'),
  (3, 'Carla Dias', 'B');

CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  estoque INTEGER NOT NULL,
  categoria TEXT NOT NULL
);
INSERT INTO produtos (id, nome, preco, estoque, categoria) VALUES
  (1, 'Teclado', 150.0, 8, 'periferico'),
  (2, 'Mouse', 90.0, 0, 'periferico'),
  (3, 'Monitor', 700.0, 3, 'tela'),
  (4, 'Mousepad', 40.0, 25, 'periferico'),
  (5, 'Cabo HDMI', 35.0, 12, 'cabo');

CREATE TABLE tarefas (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  status TEXT NOT NULL
);
INSERT INTO tarefas (id, titulo, status) VALUES
  (1, 'Revisar consultas', 'concluida'),
  (2, 'Modelar tabelas', 'pendente'),
  (3, 'Escrever relatorio', 'pendente'),
  (8, 'Tarefa duplicada', 'pendente');

CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);
INSERT INTO clientes (id, nome) VALUES
  (1, 'Ana Souza'),
  (2, 'Bruno Lima');

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  total REAL NOT NULL
);
INSERT INTO pedidos (id, cliente_id, total) VALUES
  (10, 1, 240.0),
  (11, 2, 90.0),
  (12, 1, 700.0);

CREATE TABLE emprestimos (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  livro TEXT NOT NULL
);
INSERT INTO emprestimos (id, usuario_id, livro) VALUES
  (1, 7, 'Dom Casmurro'),
  (2, 7, 'Memórias Póstumas'),
  (3, 5, 'Grande Sertão'),
  (4, 7, 'A Hora da Estrela'),
  (5, 5, 'Vidas Secas');
`;

/**
 * Aulas que MUDAM o banco (INSERT/UPDATE/DELETE/CREATE): rodar a query não
 * devolve linhas, então a correção executa esta consulta DEPOIS para conferir
 * o efeito — é o mesmo critério que um professor usaria.
 */
export const SQL_VERIFICATION_QUERIES: Record<string, string> = {
  "6-6": "SELECT titulo, status FROM tarefas ORDER BY id",
  "6-7": "SELECT id, status FROM tarefas ORDER BY id",
  "6-8": "SELECT id, titulo FROM tarefas ORDER BY id",
  "6-9": "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'cursos'",
  "6-10": "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'usuarios'",
};

/** Consultas cuja ordem das linhas faz parte do que está sendo ensinado. */
export const SQL_ORDER_MATTERS = new Set(["6-5", "6-14"]);

export function isSqlLesson(courseLanguage: string): boolean {
  return courseLanguage.trim().toLowerCase() === "sql";
}
