-- ====================================================
-- V1__create_schema_inicial.sql
-- GastroControl - Schema Inicial
-- Criação de todos os tipos ENUM e tabelas base
-- ====================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ====================================================
-- ENUMS
-- ====================================================

CREATE TYPE role_tipo AS ENUM ('ADMIN', 'OPERADOR');
CREATE TYPE demanda_status AS ENUM ('PENDENTE', 'PROCESSADA', 'FINALIZADA', 'CANCELADA');
CREATE TYPE demanda_tipo AS ENUM ('DIARIA', 'SEMANAL', 'MENSAL', 'ESPECIAL');
CREATE TYPE movimentacao_tipo AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE', 'PRODUCAO', 'DESCARTE');
CREATE TYPE lista_compras_status AS ENUM ('ABERTA', 'EM_COMPRA', 'FINALIZADA', 'CANCELADA');
CREATE TYPE relatorio_tipo AS ENUM (
    'DESPERDICIO', 'CONSUMO', 'CUSTO_POR_PRATO', 'MARGEM_ESTIMADA',
    'INGREDIENTES_MAIS_UTILIZADOS', 'PREVISAO_VS_REALIZADO',
    'ESTOQUE_CRITICO', 'VALIDADE_PROXIMA', 'LUCRO_ESTIMADO'
);
CREATE TYPE unidade_medida AS ENUM (
    'KG', 'G', 'MG',
    'L', 'ML',
    'UNIDADE', 'PORCAO', 'CAIXA', 'PACOTE', 'DUZIA'
);
CREATE TYPE categoria_risco AS ENUM ('BAIXO', 'MEDIO', 'ALTO', 'CRITICO');
CREATE TYPE categoria_prato AS ENUM (
    'ENTRADA', 'PRATO_PRINCIPAL', 'SOBREMESA', 'BEBIDA', 'APERITIVO', 'PORCAO', 'OUTRO'
);

-- ====================================================
-- TABELA: usuarios
-- ====================================================

CREATE TABLE usuarios (
    id                  BIGSERIAL PRIMARY KEY,
    nome                VARCHAR(150)        NOT NULL,
    email               VARCHAR(200)        NOT NULL UNIQUE,
    senha               VARCHAR(255)        NOT NULL,
    role                role_tipo           NOT NULL DEFAULT 'OPERADOR',
    ativo               BOOLEAN             NOT NULL DEFAULT true,
    telefone            VARCHAR(20),
    avatar_url          VARCHAR(500),
    ultimo_login        TIMESTAMP,
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP           NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(200),
    updated_by          VARCHAR(200)
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);

-- ====================================================
-- TABELA: refresh_tokens
-- ====================================================

CREATE TABLE refresh_tokens (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT          NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token           VARCHAR(500)    NOT NULL UNIQUE,
    expiry_date     TIMESTAMP       NOT NULL,
    revogado        BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_usuario ON refresh_tokens(usuario_id);

-- ====================================================
-- TABELA: password_reset_tokens
-- ====================================================

CREATE TABLE password_reset_tokens (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT          NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token           VARCHAR(255)    NOT NULL UNIQUE,
    expiry_date     TIMESTAMP       NOT NULL,
    utilizado       BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ====================================================
-- TABELA: ingredientes
-- ====================================================

CREATE TABLE ingredientes (
    id                  BIGSERIAL PRIMARY KEY,
    nome                VARCHAR(200)        NOT NULL,
    descricao           TEXT,
    unidade_medida      unidade_medida      NOT NULL DEFAULT 'KG',
    custo_unitario      NUMERIC(15, 4)      NOT NULL DEFAULT 0,
    fornecedor          VARCHAR(200),
    categoria_risco     categoria_risco     NOT NULL DEFAULT 'BAIXO',
    codigo_interno      VARCHAR(50),
    ativo               BOOLEAN             NOT NULL DEFAULT true,
    deleted             BOOLEAN             NOT NULL DEFAULT false,
    deleted_at          TIMESTAMP,
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP           NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(200),
    updated_by          VARCHAR(200)
);

CREATE INDEX idx_ingredientes_nome ON ingredientes USING gin(nome gin_trgm_ops);
CREATE INDEX idx_ingredientes_ativo ON ingredientes(ativo) WHERE deleted = false;
CREATE INDEX idx_ingredientes_categoria ON ingredientes(categoria_risco);
CREATE INDEX idx_ingredientes_fornecedor ON ingredientes(fornecedor);

-- ====================================================
-- TABELA: historico_preco_ingrediente
-- ====================================================

CREATE TABLE historico_preco_ingrediente (
    id              BIGSERIAL PRIMARY KEY,
    ingrediente_id  BIGINT          NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    custo_anterior  NUMERIC(15, 4)  NOT NULL,
    custo_novo      NUMERIC(15, 4)  NOT NULL,
    data_alteracao  TIMESTAMP       NOT NULL DEFAULT NOW(),
    alterado_por    VARCHAR(200)
);

CREATE INDEX idx_hist_preco_ingrediente ON historico_preco_ingrediente(ingrediente_id, data_alteracao DESC);

-- ====================================================
-- TABELA: pratos
-- ====================================================

CREATE TABLE pratos (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(200)        NOT NULL,
    descricao       TEXT,
    custo_total     NUMERIC(15, 4)      NOT NULL DEFAULT 0,
    preco_venda     NUMERIC(15, 4),
    margem_lucro    NUMERIC(5, 2),
    categoria       categoria_prato     NOT NULL DEFAULT 'PRATO_PRINCIPAL',
    imagem_url      VARCHAR(500),
    tempo_preparo   INTEGER,            -- em minutos
    porcoes         INTEGER             NOT NULL DEFAULT 1,
    ativo           BOOLEAN             NOT NULL DEFAULT true,
    deleted         BOOLEAN             NOT NULL DEFAULT false,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(200),
    updated_by      VARCHAR(200)
);

CREATE INDEX idx_pratos_nome ON pratos USING gin(nome gin_trgm_ops);
CREATE INDEX idx_pratos_ativo ON pratos(ativo) WHERE deleted = false;
CREATE INDEX idx_pratos_categoria ON pratos(categoria);

-- ====================================================
-- TABELA: fichas_tecnicas
-- ====================================================

CREATE TABLE fichas_tecnicas (
    id              BIGSERIAL PRIMARY KEY,
    prato_id        BIGINT          NOT NULL REFERENCES pratos(id) ON DELETE CASCADE,
    ingrediente_id  BIGINT          NOT NULL REFERENCES ingredientes(id),
    qtd_por_porcao  NUMERIC(15, 4)  NOT NULL,
    unidade         unidade_medida  NOT NULL,
    fator_correcao  NUMERIC(5, 4)   NOT NULL DEFAULT 1.0,  -- fator de perda/limpeza
    observacoes     TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(200),
    updated_by      VARCHAR(200),
    UNIQUE(prato_id, ingrediente_id)
);

CREATE INDEX idx_fichas_prato ON fichas_tecnicas(prato_id);
CREATE INDEX idx_fichas_ingrediente ON fichas_tecnicas(ingrediente_id);

-- ====================================================
-- TABELA: demandas
-- ====================================================

CREATE TABLE demandas (
    id              BIGSERIAL PRIMARY KEY,
    titulo          VARCHAR(300)        NOT NULL,
    descricao       TEXT,
    data_inicio     DATE                NOT NULL,
    data_fim        DATE,
    tipo            demanda_tipo        NOT NULL DEFAULT 'DIARIA',
    status          demanda_status      NOT NULL DEFAULT 'PENDENTE',
    observacoes     TEXT,
    processado_em   TIMESTAMP,
    processado_por  VARCHAR(200),
    deleted         BOOLEAN             NOT NULL DEFAULT false,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(200),
    updated_by      VARCHAR(200)
);

CREATE INDEX idx_demandas_data ON demandas(data_inicio DESC);
CREATE INDEX idx_demandas_status ON demandas(status) WHERE deleted = false;
CREATE INDEX idx_demandas_tipo ON demandas(tipo);

-- ====================================================
-- TABELA: demanda_pratos
-- ====================================================

CREATE TABLE demanda_pratos (
    id              BIGSERIAL PRIMARY KEY,
    demanda_id      BIGINT          NOT NULL REFERENCES demandas(id) ON DELETE CASCADE,
    prato_id        BIGINT          NOT NULL REFERENCES pratos(id),
    quantidade      INTEGER         NOT NULL CHECK (quantidade > 0),
    observacoes     TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE(demanda_id, prato_id)
);

CREATE INDEX idx_demanda_pratos_demanda ON demanda_pratos(demanda_id);
CREATE INDEX idx_demanda_pratos_prato ON demanda_pratos(prato_id);

-- ====================================================
-- TABELA: estoque
-- ====================================================

CREATE TABLE estoque (
    id                  BIGSERIAL PRIMARY KEY,
    ingrediente_id      BIGINT          NOT NULL REFERENCES ingredientes(id),
    qtd_disponivel      NUMERIC(15, 4)  NOT NULL DEFAULT 0,
    qtd_reservada       NUMERIC(15, 4)  NOT NULL DEFAULT 0,
    qtd_minima          NUMERIC(15, 4)  NOT NULL DEFAULT 0,
    qtd_maxima          NUMERIC(15, 4),
    data_validade       DATE,
    lote                VARCHAR(100),
    localizacao         VARCHAR(100),
    custo_lote          NUMERIC(15, 4),
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(200),
    updated_by          VARCHAR(200)
);

CREATE INDEX idx_estoque_ingrediente ON estoque(ingrediente_id);
CREATE INDEX idx_estoque_validade ON estoque(data_validade) WHERE data_validade IS NOT NULL;
CREATE INDEX idx_estoque_lote ON estoque(lote);

-- ====================================================
-- TABELA: movimentacoes_estoque
-- ====================================================

CREATE TABLE movimentacoes_estoque (
    id              BIGSERIAL PRIMARY KEY,
    estoque_id      BIGINT              NOT NULL REFERENCES estoque(id),
    tipo            movimentacao_tipo   NOT NULL,
    quantidade      NUMERIC(15, 4)      NOT NULL,
    qtd_anterior    NUMERIC(15, 4)      NOT NULL,
    qtd_posterior   NUMERIC(15, 4)      NOT NULL,
    motivo          TEXT,
    referencia_id   BIGINT,             -- ID da demanda/compra relacionada
    referencia_tipo VARCHAR(50),        -- tipo da referencia (DEMANDA, COMPRA)
    data_hora       TIMESTAMP           NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(200)
);

CREATE INDEX idx_movimentacoes_estoque ON movimentacoes_estoque(estoque_id);
CREATE INDEX idx_movimentacoes_data ON movimentacoes_estoque(data_hora DESC);
CREATE INDEX idx_movimentacoes_tipo ON movimentacoes_estoque(tipo);
CREATE INDEX idx_movimentacoes_referencia ON movimentacoes_estoque(referencia_id, referencia_tipo);

-- ====================================================
-- TABELA: listas_compras
-- ====================================================

CREATE TABLE listas_compras (
    id              BIGSERIAL PRIMARY KEY,
    titulo          VARCHAR(300)            NOT NULL,
    descricao       TEXT,
    data_criacao    DATE                    NOT NULL DEFAULT CURRENT_DATE,
    data_conclusao  DATE,
    status          lista_compras_status    NOT NULL DEFAULT 'ABERTA',
    valor_total     NUMERIC(15, 4)          NOT NULL DEFAULT 0,
    demanda_id      BIGINT                  REFERENCES demandas(id),
    observacoes     TEXT,
    deleted         BOOLEAN                 NOT NULL DEFAULT false,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP               NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP               NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(200),
    updated_by      VARCHAR(200)
);

CREATE INDEX idx_listas_compras_status ON listas_compras(status) WHERE deleted = false;
CREATE INDEX idx_listas_compras_data ON listas_compras(data_criacao DESC);
CREATE INDEX idx_listas_compras_demanda ON listas_compras(demanda_id);

-- ====================================================
-- TABELA: itens_compra
-- ====================================================

CREATE TABLE itens_compra (
    id                  BIGSERIAL PRIMARY KEY,
    lista_compras_id    BIGINT          NOT NULL REFERENCES listas_compras(id) ON DELETE CASCADE,
    ingrediente_id      BIGINT          NOT NULL REFERENCES ingredientes(id),
    quantidade          NUMERIC(15, 4)  NOT NULL,
    unidade             unidade_medida  NOT NULL,
    valor_unitario      NUMERIC(15, 4),
    valor_total         NUMERIC(15, 4),
    qtd_estoque_atual   NUMERIC(15, 4)  NOT NULL DEFAULT 0,
    qtd_necessaria      NUMERIC(15, 4)  NOT NULL,
    deficit             NUMERIC(15, 4)  NOT NULL DEFAULT 0,
    fornecedor_sugerido VARCHAR(200),
    comprado            BOOLEAN         NOT NULL DEFAULT false,
    observacoes         TEXT,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itens_compra_lista ON itens_compra(lista_compras_id);
CREATE INDEX idx_itens_compra_ingrediente ON itens_compra(ingrediente_id);

-- ====================================================
-- TABELA: relatorios
-- ====================================================

CREATE TABLE relatorios (
    id              BIGSERIAL PRIMARY KEY,
    titulo          VARCHAR(300)        NOT NULL,
    tipo            relatorio_tipo      NOT NULL,
    periodo_inicio  DATE                NOT NULL,
    periodo_fim     DATE                NOT NULL,
    dados           JSONB,
    gerado_em       TIMESTAMP           NOT NULL DEFAULT NOW(),
    gerado_por      VARCHAR(200),
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_relatorios_tipo ON relatorios(tipo);
CREATE INDEX idx_relatorios_periodo ON relatorios(periodo_inicio, periodo_fim);

-- ====================================================
-- FUNÇÃO: atualiza updated_at automaticamente
-- ====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredientes_updated_at BEFORE UPDATE ON ingredientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pratos_updated_at BEFORE UPDATE ON pratos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fichas_tecnicas_updated_at BEFORE UPDATE ON fichas_tecnicas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandas_updated_at BEFORE UPDATE ON demandas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON estoque
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listas_compras_updated_at BEFORE UPDATE ON listas_compras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
