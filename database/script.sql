-- =====================================================
-- BookStore Manager CLI - Banco de dados PostgreSQL
-- Seções: 1) DDL  2) DML  3) Relatórios
-- =====================================================

-- =====================================================
-- 1) DDL - CRIAÇÃO DA ESTRUTURA
-- =====================================================

-- Permite executar o script várias vezes sem erro
DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

CREATE TABLE autores (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL UNIQUE,
    nacionalidade   VARCHAR(50)  NOT NULL,
    data_nascimento DATE
);

CREATE TABLE livros (
    id                    SERIAL PRIMARY KEY,
    titulo                VARCHAR(150) NOT NULL,
    isbn                  VARCHAR(20)  NOT NULL UNIQUE,
    ano_publicacao        INTEGER      NOT NULL CHECK (ano_publicacao > 0),
    quantidade_total      INTEGER      NOT NULL CHECK (quantidade_total >= 0),
    quantidade_disponivel INTEGER      NOT NULL CHECK (quantidade_disponivel >= 0),
    autor_id              INTEGER      NOT NULL,
    CONSTRAINT fk_livros_autor FOREIGN KEY (autor_id)
        REFERENCES autores (id) ON DELETE RESTRICT,
    CONSTRAINT ck_disponivel_menor_total
        CHECK (quantidade_disponivel <= quantidade_total)
);

CREATE TABLE clientes (
    id       SERIAL PRIMARY KEY,
    nome     VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    cpf      CHAR(11)     NOT NULL UNIQUE,
    telefone VARCHAR(20)
);

CREATE TABLE emprestimos (
    id                      SERIAL PRIMARY KEY,
    livro_id                INTEGER     NOT NULL,
    cliente_id              INTEGER     NOT NULL,
    data_emprestimo         DATE        NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao_prevista DATE        NOT NULL,
    data_devolucao          DATE,
    status                  VARCHAR(10) NOT NULL DEFAULT 'ATIVO'
        CHECK (status IN ('ATIVO', 'DEVOLVIDO')),
    CONSTRAINT fk_emprestimos_livro FOREIGN KEY (livro_id)
        REFERENCES livros (id) ON DELETE RESTRICT,
    CONSTRAINT fk_emprestimos_cliente FOREIGN KEY (cliente_id)
        REFERENCES clientes (id) ON DELETE RESTRICT,
    CONSTRAINT ck_prazo_valido
        CHECK (data_devolucao_prevista >= data_emprestimo),
    CONSTRAINT ck_status_devolucao CHECK (
        (status = 'ATIVO' AND data_devolucao IS NULL) OR
        (status = 'DEVOLVIDO' AND data_devolucao IS NOT NULL)
    )
);


-- =====================================================
-- 2) DML - MANIPULAÇÃO DE DADOS
-- (mesmos dados que serão usados no seed da aplicação)
-- =====================================================

-- INSERT: autores (ids 1 a 4)
INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
('Machado de Assis',  'Brasileira', '1839-06-21'),
('Clarice Lispector', 'Brasileira', '1920-12-10'),
('George Orwell',     'Britânica',  '1903-06-25'),
('J.K. Rowling',      'Britânica',  '1965-07-31');

-- INSERT: livros (ids 1 a 8)
INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
('Dom Casmurro',                       '978-85-0001-001-1', 1899, 3, 2, 1),
('Memórias Póstumas de Brás Cubas',    '978-85-0001-002-2', 1881, 2, 2, 1),
('A Hora da Estrela',                  '978-85-0001-003-3', 1977, 2, 1, 2),
('Laços de Família',                   '978-85-0001-004-4', 1960, 1, 0, 2),
('1984',                               '978-85-0001-005-5', 1949, 3, 2, 3),
('A Revolução dos Bichos',             '978-85-0001-006-6', 1945, 2, 2, 3),
('Harry Potter e a Pedra Filosofal',   '978-85-0001-007-7', 1997, 4, 3, 4),
('Harry Potter e a Câmara Secreta',    '978-85-0001-008-8', 1998, 2, 2, 4);

-- INSERT: clientes (ids 1 a 6)
INSERT INTO clientes (nome, email, cpf, telefone) VALUES
('Ana Souza',    'ana.souza@email.com',    '12345678901', '(11) 91111-1111'),
('Bruno Lima',   'bruno.lima@email.com',   '23456789012', '(11) 92222-2222'),
('Carla Mendes', 'carla.mendes@email.com', '34567890123', '(21) 93333-3333'),
('Diego Alves',  'diego.alves@email.com',  '45678901234', '(31) 94444-4444'),
('Elisa Rocha',  'elisa.rocha@email.com',  '56789012345', '(41) 95555-5555'),
('Fábio Torres', 'fabio.torres@email.com', '67890123456', '(51) 96666-6666');

-- INSERT: empréstimos (ids 1 a 8)
INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_devolucao_prevista, data_devolucao, status) VALUES
(1, 1, '2026-10-01', '2026-10-15', '2026-10-10', 'DEVOLVIDO'),
(1, 2, '2026-10-05', '2026-10-19', NULL,         'ATIVO'),
(3, 3, '2026-10-06', '2026-10-20', NULL,         'ATIVO'),
(4, 2, '2026-10-08', '2026-10-22', NULL,         'ATIVO'),
(5, 4, '2026-09-20', '2026-10-04', '2026-10-02', 'DEVOLVIDO'),
(5, 1, '2026-10-12', '2026-10-26', NULL,         'ATIVO'),
(7, 5, '2026-10-14', '2026-10-28', NULL,         'ATIVO'),
(7, 3, '2026-09-25', '2026-10-09', '2026-10-08', 'DEVOLVIDO');

-- UPDATE: atualizar telefone de um cliente
UPDATE clientes
SET telefone = '(11) 98888-8888'
WHERE id = 1;

-- UPDATE: reposição de estoque de um livro
UPDATE livros
SET quantidade_total = quantidade_total + 1,
    quantidade_disponivel = quantidade_disponivel + 1
WHERE id = 4;

-- UPDATE: registrar a devolução do empréstimo 6 e liberar o exemplar
UPDATE emprestimos
SET data_devolucao = '2026-10-20',
    status = 'DEVOLVIDO'
WHERE id = 6;

UPDATE livros
SET quantidade_disponivel = quantidade_disponivel + 1
WHERE id = 5;

-- DELETE: remover um empréstimo antigo já devolvido
DELETE FROM emprestimos
WHERE id = 8;

-- DELETE: remover cliente sem empréstimos (não viola as FKs)
DELETE FROM clientes
WHERE id = 6;

-- SELECT simples para conferir os dados
SELECT * FROM autores;
SELECT * FROM livros;
SELECT * FROM clientes;
SELECT * FROM emprestimos;