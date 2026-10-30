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