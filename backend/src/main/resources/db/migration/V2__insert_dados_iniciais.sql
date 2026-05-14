-- ====================================================
-- V2__insert_dados_iniciais.sql
-- GastroControl - Dados Iniciais
-- Seed data para ambiente de desenvolvimento
-- ====================================================

-- Usuário Admin padrão (senha: Admin@123)
INSERT INTO usuarios (nome, email, senha, role, ativo)
VALUES (
    'Administrador',
    'admin@gastrocontrol.com',
    '$2a$12$LqX3r5VYy5JqNtQWPFTnqODGDq1PW4DuX5hMGzj7p9lM3LqZQ6CGW',
    'ADMIN',
    true
);

-- Usuário Operador padrão (senha: Operador@123)
INSERT INTO usuarios (nome, email, senha, role, ativo)
VALUES (
    'Operador Padrão',
    'operador@gastrocontrol.com',
    '$2a$12$9Kk8k7SJ2Jl0YWLPr7RxhOBi7vq9bE9gRQ2TiKH3GqX5J6mhY2Ya.',
    'OPERADOR',
    true
);

-- Ingredientes base para demonstração
INSERT INTO ingredientes (nome, descricao, unidade_medida, custo_unitario, fornecedor, categoria_risco)
VALUES
    ('Frango Inteiro', 'Frango inteiro resfriado', 'KG', 12.90, 'Frigorífico Belo', 'MEDIO'),
    ('Arroz Branco', 'Arroz branco tipo 1', 'KG', 3.50, 'Grãos Premium', 'BAIXO'),
    ('Feijão Carioca', 'Feijão carioca tipo 1', 'KG', 7.20, 'Grãos Premium', 'BAIXO'),
    ('Alho', 'Alho descascado', 'KG', 18.00, 'Hortifruti Central', 'BAIXO'),
    ('Cebola', 'Cebola branca', 'KG', 4.50, 'Hortifruti Central', 'BAIXO'),
    ('Tomate', 'Tomate italiano', 'KG', 6.00, 'Hortifruti Central', 'MEDIO'),
    ('Óleo de Soja', 'Óleo de soja refinado', 'L', 8.90, 'Distribuidor Sul', 'BAIXO'),
    ('Sal Refinado', 'Sal refinado iodado', 'KG', 2.50, 'Distribuidor Sul', 'BAIXO'),
    ('Pimenta do Reino', 'Pimenta do reino em pó', 'KG', 45.00, 'Especiarias Brasil', 'BAIXO'),
    ('Limão', 'Limão tahiti', 'KG', 5.50, 'Hortifruti Central', 'BAIXO');

-- Pratos base para demonstração
INSERT INTO pratos (nome, descricao, categoria, porcoes, preco_venda, tempo_preparo)
VALUES
    ('Frango Grelhado', 'Frango grelhado com temperos especiais servido com arroz e feijão', 'PRATO_PRINCIPAL', 1, 35.90, 30),
    ('Arroz com Feijão', 'Arroz branco soltinho com feijão carioca temperado', 'PRATO_PRINCIPAL', 1, 18.90, 20);

-- Fichas técnicas - Frango Grelhado
INSERT INTO fichas_tecnicas (prato_id, ingrediente_id, qtd_por_porcao, unidade, fator_correcao, observacoes)
VALUES
    (1, 1, 0.350, 'KG', 1.15, 'Com osso, fator de perda 15%'),
    (1, 4, 0.010, 'KG', 1.00, 'Alho amassado'),
    (1, 7, 0.020, 'L', 1.00, 'Para grelhar'),
    (1, 8, 0.005, 'KG', 1.00, 'A gosto'),
    (1, 9, 0.002, 'KG', 1.00, 'A gosto'),
    (1, 10, 0.030, 'KG', 1.00, 'Suco para marinar');

-- Fichas técnicas - Arroz com Feijão
INSERT INTO fichas_tecnicas (prato_id, ingrediente_id, qtd_por_porcao, unidade, fator_correcao, observacoes)
VALUES
    (2, 2, 0.150, 'KG', 1.00, 'Arroz cru'),
    (2, 3, 0.100, 'KG', 1.00, 'Feijão cru'),
    (2, 4, 0.005, 'KG', 1.00, 'Alho'),
    (2, 5, 0.030, 'KG', 1.00, 'Cebola'),
    (2, 7, 0.015, 'L', 1.00, 'Óleo para refogar'),
    (2, 8, 0.003, 'KG', 1.00, 'Sal');

-- Estoque inicial
INSERT INTO estoque (ingrediente_id, qtd_disponivel, qtd_minima, lote, localizacao)
VALUES
    (1, 25.000, 10.000, 'LOTE-001', 'Câmara Fria'),
    (2, 50.000, 20.000, 'LOTE-002', 'Despensa Seca'),
    (3, 30.000, 15.000, 'LOTE-003', 'Despensa Seca'),
    (4, 5.000, 2.000, 'LOTE-004', 'Despensa Seca'),
    (5, 15.000, 5.000, 'LOTE-005', 'Despensa Fria'),
    (6, 8.000, 3.000, 'LOTE-006', 'Despensa Fria'),
    (7, 12.000, 5.000, 'LOTE-007', 'Despensa Seca'),
    (8, 20.000, 5.000, 'LOTE-008', 'Despensa Seca'),
    (9, 2.000, 0.500, 'LOTE-009', 'Despensa Seca'),
    (10, 10.000, 3.000, 'LOTE-010', 'Despensa Fria');
