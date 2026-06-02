-- ====================================================
-- V1__create_schema_inicial.sql
-- GastroControl - Schema Inicial
-- Compatível com Spring Boot + Hibernate
-- ====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ====================================================
-- TABELA: usuarios
-- ====================================================

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'OPERADOR',
    ativo BOOLEAN NOT NULL DEFAULT true,
    telefone VARCHAR(20),
    avatar_url VARCHAR(500),
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);

-- ====================================================
-- refresh_tokens
-- ====================================================

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    revogado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_usuario ON refresh_tokens(usuario_id);

-- ====================================================
-- password_reset_tokens
-- ====================================================

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ====================================================
-- ingredientes
-- ====================================================

CREATE TABLE ingredientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    unidade_medida VARCHAR(20) NOT NULL DEFAULT 'KG',
    custo_unitario NUMERIC(15,4) NOT NULL DEFAULT 0,
    fornecedor VARCHAR(200),
    categoria_risco VARCHAR(20) NOT NULL DEFAULT 'BAIXO',
    codigo_interno VARCHAR(50),
    ativo BOOLEAN NOT NULL DEFAULT true,
    deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

CREATE INDEX idx_ingredientes_nome
ON ingredientes USING gin(nome gin_trgm_ops);

CREATE INDEX idx_ingredientes_ativo
ON ingredientes(ativo) WHERE deleted = false;

-- ====================================================
-- historico_preco_ingrediente
-- ====================================================

CREATE TABLE historico_preco_ingrediente (
    id BIGSERIAL PRIMARY KEY,
    ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    custo_anterior NUMERIC(15,4) NOT NULL,
    custo_novo NUMERIC(15,4) NOT NULL,
    data_alteracao TIMESTAMP NOT NULL DEFAULT NOW(),
    alterado_por VARCHAR(200)
);

-- ====================================================
-- pratos
-- ====================================================

CREATE TABLE pratos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    custo_total NUMERIC(15,4) NOT NULL DEFAULT 0,
    preco_venda NUMERIC(15,4),
    margem_lucro NUMERIC(5,2),
    categoria VARCHAR(30) NOT NULL DEFAULT 'PRATO_PRINCIPAL',
    imagem_url VARCHAR(500),
    tempo_preparo INTEGER,
    porcoes INTEGER NOT NULL DEFAULT 1,
    ativo BOOLEAN NOT NULL DEFAULT true,
    deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

CREATE INDEX idx_pratos_nome
ON pratos USING gin(nome gin_trgm_ops);

-- ====================================================
-- fichas_tecnicas
-- ====================================================

CREATE TABLE fichas_tecnicas (
    id BIGSERIAL PRIMARY KEY,
    prato_id BIGINT NOT NULL REFERENCES pratos(id) ON DELETE CASCADE,
    ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
    qtd_por_porcao NUMERIC(15,4) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    fator_correcao NUMERIC(5,4) NOT NULL DEFAULT 1.0,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200),
    UNIQUE(prato_id, ingrediente_id)
);

-- ====================================================
-- demandas
-- ====================================================

CREATE TABLE demandas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    tipo VARCHAR(30) NOT NULL DEFAULT 'DIARIA',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    observacoes TEXT,
    processado_em TIMESTAMP,
    processado_por VARCHAR(200),
    deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

CREATE INDEX idx_demandas_status
ON demandas(status);

-- ====================================================
-- demanda_pratos
-- ====================================================

CREATE TABLE demanda_pratos (
    id BIGSERIAL PRIMARY KEY,
    demanda_id BIGINT NOT NULL REFERENCES demandas(id) ON DELETE CASCADE,
    prato_id BIGINT NOT NULL REFERENCES pratos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(demanda_id, prato_id)
);

-- ====================================================
-- estoque
-- ====================================================

CREATE TABLE estoque (
    id BIGSERIAL PRIMARY KEY,
    ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
    qtd_disponivel NUMERIC(15,4) NOT NULL DEFAULT 0,
    qtd_reservada NUMERIC(15,4) NOT NULL DEFAULT 0,
    qtd_minima NUMERIC(15,4) NOT NULL DEFAULT 0,
    qtd_maxima NUMERIC(15,4),
    data_validade DATE,
    lote VARCHAR(100),
    localizacao VARCHAR(100),
    custo_lote NUMERIC(15,4),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

-- ====================================================
-- movimentacoes_estoque
-- ====================================================

CREATE TABLE movimentacoes_estoque (
    id BIGSERIAL PRIMARY KEY,
    estoque_id BIGINT NOT NULL REFERENCES estoque(id),
    tipo VARCHAR(30) NOT NULL,
    quantidade NUMERIC(15,4) NOT NULL,
    qtd_anterior NUMERIC(15,4) NOT NULL,
    qtd_posterior NUMERIC(15,4) NOT NULL,
    motivo TEXT,
    referencia_id BIGINT,
    referencia_tipo VARCHAR(50),
    data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200)
);

-- ====================================================
-- listas_compras
-- ====================================================

CREATE TABLE listas_compras (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    descricao TEXT,
    data_criacao DATE NOT NULL DEFAULT CURRENT_DATE,
    data_conclusao DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ABERTA',
    valor_total NUMERIC(15,4) NOT NULL DEFAULT 0,
    demanda_id BIGINT REFERENCES demandas(id),
    observacoes TEXT,
    deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

-- ====================================================
-- itens_compra
-- ====================================================

CREATE TABLE itens_compra (
    id BIGSERIAL PRIMARY KEY,
    lista_compras_id BIGINT NOT NULL REFERENCES listas_compras(id) ON DELETE CASCADE,
    ingrediente_id BIGINT NOT NULL REFERENCES ingredientes(id),
    quantidade NUMERIC(15,4) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    valor_unitario NUMERIC(15,4),
    valor_total NUMERIC(15,4),
    qtd_estoque_atual NUMERIC(15,4) NOT NULL DEFAULT 0,
    qtd_necessaria NUMERIC(15,4) NOT NULL,
    deficit NUMERIC(15,4) NOT NULL DEFAULT 0,
    fornecedor_sugerido VARCHAR(200),
    comprado BOOLEAN NOT NULL DEFAULT false,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ====================================================
-- relatorios
-- ====================================================

CREATE TABLE relatorios (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    dados JSONB,
    gerado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    gerado_por VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ====================================================
-- update_updated_at
-- ====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredientes_updated_at
BEFORE UPDATE ON ingredientes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pratos_updated_at
BEFORE UPDATE ON pratos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fichas_tecnicas_updated_at
BEFORE UPDATE ON fichas_tecnicas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandas_updated_at
BEFORE UPDATE ON demandas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estoque_updated_at
BEFORE UPDATE ON estoque
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listas_compras_updated_at
BEFORE UPDATE ON listas_compras
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();