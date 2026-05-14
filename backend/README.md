# 🍽️ GastroControl Backend

> Sistema SaaS de gestão gastronômica para pequenos e médios restaurantes.
> Desenvolvido com **Java 21 + Spring Boot 3 + PostgreSQL**.

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## 📋 Índice

- [Sobre o Sistema](#sobre)
- [Fluxo Principal](#fluxo)
- [Stack Tecnológica](#stack)
- [Arquitetura](#arquitetura)
- [Como Executar](#execucao)
- [Endpoints da API](#endpoints)
- [Variáveis de Ambiente](#variaveis)
- [Testes](#testes)
- [Deploy com Docker](#docker)

---

## 🎯 Sobre o Sistema {#sobre}

O **GastroControl** resolve as principais dores de restaurantes:

| Problema | Solução |
|----------|---------|
| Desperdício de alimentos | Cálculo preciso de ingredientes por demanda |
| Falta de ingredientes | Verificação automática de estoque |
| Cálculo manual trabalhoso | Automação completa via ficha técnica |
| Falta de previsibilidade | Planejamento semanal/mensal |
| Controle de estoque ruim | FEFO + alertas automáticos |
| Custo real desconhecido | Cálculo automático de custo por prato |

---

## 🔄 Fluxo Principal {#fluxo}

```
DEMANDA (previsão de produção)
    ↓
FICHA TÉCNICA × QUANTIDADE
    ↓
CONSOLIDAÇÃO DE INGREDIENTES
    ↓
VERIFICAÇÃO DE ESTOQUE (FEFO)
    ↓
CÁLCULO DE DÉFICIT
    ↓
LISTA DE COMPRAS AUTOMÁTICA
    ↓
FINALIZAÇÃO + BAIXA NO ESTOQUE
```

---

## 🛠️ Stack Tecnológica {#stack}

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Java | 21 | Linguagem principal |
| Spring Boot | 3.3 | Framework base |
| Spring Security | 6.x | Autenticação/Autorização |
| Spring Data JPA | 3.x | Persistência |
| PostgreSQL | 16 | Banco de dados |
| Flyway | 10.x | Migrations |
| JWT (jjwt) | 0.12 | Tokens de auth |
| Lombok | 1.18 | Boilerplate reduction |
| Swagger/OpenAPI | 2.6 | Documentação |
| Testcontainers | 1.20 | Testes de integração |
| Docker | - | Containerização |

---

## 🏗️ Arquitetura {#arquitetura}

```
src/main/java/com/gastrocontrol/
├── GastroControlApplication.java       # Entry point
│
├── config/                             # Configurações Spring
│   ├── SecurityConfig.java             # Spring Security + JWT
│   ├── SwaggerConfig.java              # OpenAPI/Swagger
│   └── AuditorAwareImpl.java           # Auditoria JPA
│
├── security/                           # JWT Infrastructure
│   ├── JwtTokenProvider.java           # Geração/validação JWT
│   ├── JwtAuthenticationFilter.java    # Filtro de autenticação
│   └── UserDetailsServiceImpl.java     # Integração Spring Security
│
├── domain/
│   ├── entity/                         # Entidades JPA
│   │   ├── BaseEntity.java             # Auditoria base
│   │   ├── Usuario.java
│   │   ├── RefreshToken.java
│   │   ├── Ingrediente.java
│   │   ├── HistoricoPrecoIngrediente.java
│   │   ├── Prato.java
│   │   ├── FichaTecnica.java           # Relação prato-ingrediente
│   │   ├── Demanda.java                # ⭐ Núcleo do sistema
│   │   ├── DemandaPrato.java
│   │   ├── Estoque.java
│   │   ├── MovimentacaoEstoque.java
│   │   ├── ListaCompras.java
│   │   ├── ItemCompra.java
│   │   └── Relatorio.java
│   │
│   └── enums/                          # Enumerações de domínio
│
├── repository/                         # Spring Data JPA Repositories
│
├── service/                            # Regras de negócio
│   ├── AuthService.java                # Auth + JWT
│   ├── IngredienteService.java
│   ├── PratoService.java               # + Fichas Técnicas
│   ├── DemandaService.java             # ⭐ REGRA PRINCIPAL
│   ├── EstoqueService.java             # FEFO + alertas
│   ├── DashboardService.java           # KPIs agregados
│   └── [data classes]                  # DTOs internos
│
├── controller/                         # REST Controllers
│   ├── AuthController.java
│   ├── IngredienteController.java
│   ├── PratoController.java
│   ├── DemandaController.java
│   ├── EstoqueController.java
│   └── DashboardController.java
│
├── dto/                                # Data Transfer Objects
│   ├── auth/
│   ├── common/ApiResponse.java         # Resposta padronizada
│   ├── ingrediente/
│   ├── prato/
│   ├── ficha/
│   ├── demanda/
│   ├── estoque/
│   └── dashboard/
│
└── exception/                          # Exception handling
    ├── GlobalExceptionHandler.java
    ├── RecursoNaoEncontradoException.java
    ├── RegraDeNegocioException.java
    ├── ConflitoException.java
    └── NaoAutorizadoException.java

src/main/resources/
├── application.yml                     # Configuração principal
└── db/migration/
    ├── V1__create_schema_inicial.sql   # Schema completo
    └── V2__insert_dados_iniciais.sql   # Dados de seed
```

---

## 🚀 Como Executar {#execucao}

### Pré-requisitos

- Java 21+
- Maven 3.8+
- Docker e Docker Compose
- PostgreSQL 16 (ou via Docker)

### 1. Executar com Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gastrocontrol-backend.git
cd gastrocontrol-backend

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Editar o .env com suas configurações
# (opcional: alterar senhas e JWT_SECRET para produção)

# Subir tudo (postgres + backend)
docker-compose up -d

# Acompanhar logs
docker-compose logs -f backend
```

### 2. Executar Localmente (Desenvolvimento)

```bash
# Subir apenas o PostgreSQL
docker-compose up -d postgres

# Configurar variáveis de ambiente
export DB_URL=jdbc:postgresql://localhost:5432/gastrocontrol
export DB_USERNAME=gastrocontrol
export DB_PASSWORD=gastrocontrol123

# Executar a aplicação
./mvnw spring-boot:run

# Ou com Maven
mvn spring-boot:run
```

### 3. Acessar a Aplicação

| Recurso | URL |
|---------|-----|
| API Base | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/api/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/api/v3/api-docs |
| Health Check | http://localhost:8080/api/actuator/health |
| PgAdmin | http://localhost:5050 |

---

## 📡 Endpoints da API {#endpoints}

### 🔐 Autenticação

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | /auth/login | Login com email/senha | Público |
| POST | /auth/cadastro | Cadastro de novo usuário | Público |
| POST | /auth/refresh | Renovar access token | Público |
| POST | /auth/logout | Logout (revoga tokens) | Autenticado |

**Exemplo de Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gastrocontrol.com",
    "senha": "Admin@123"
  }'
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "uuid-do-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "nome": "Administrador",
    "email": "admin@gastrocontrol.com",
    "role": "ADMIN"
  }
}
```

### 🥗 Pratos

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | /pratos | Listar pratos | ADMIN, OPERADOR |
| GET | /pratos/{id} | Buscar por ID | ADMIN, OPERADOR |
| GET | /pratos/buscar?nome= | Busca por nome | ADMIN, OPERADOR |
| POST | /pratos | Criar prato | ADMIN |
| PUT | /pratos/{id} | Atualizar prato | ADMIN |
| DELETE | /pratos/{id} | Remover prato | ADMIN |
| PATCH | /pratos/{id}/ativar | Ativar prato | ADMIN |
| GET | /pratos/{id}/ficha-tecnica | Listar ficha técnica | ADMIN, OPERADOR |
| POST | /pratos/{id}/ficha-tecnica | Adicionar ingrediente | ADMIN |
| PUT | /pratos/{id}/ficha-tecnica/{fichaId} | Atualizar item | ADMIN |
| DELETE | /pratos/{id}/ficha-tecnica/{fichaId} | Remover item | ADMIN |

### 📦 Ingredientes

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | /ingredientes | Listar ingredientes | ADMIN, OPERADOR |
| GET | /ingredientes/{id} | Buscar por ID | ADMIN, OPERADOR |
| POST | /ingredientes | Criar ingrediente | ADMIN |
| PUT | /ingredientes/{id} | Atualizar | ADMIN |
| DELETE | /ingredientes/{id} | Remover (soft delete) | ADMIN |

### 📋 Demandas ⭐ Fluxo Principal

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | /demandas | Listar demandas | ADMIN, OPERADOR |
| POST | /demandas | Criar demanda | ADMIN, OPERADOR |
| POST | /demandas/{id}/processar | **PROCESSAR** (calcula ingredientes, verifica estoque, gera lista de compras) | ADMIN, OPERADOR |
| POST | /demandas/{id}/finalizar | Finalizar + baixa estoque (FEFO) | ADMIN |
| POST | /demandas/{id}/cancelar | Cancelar demanda | ADMIN |

**Exemplo de Criação de Demanda:**
```bash
curl -X POST http://localhost:8080/api/demandas \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Produção - Segunda-feira",
    "dataInicio": "2024-05-20",
    "tipo": "DIARIA",
    "pratos": [
      {"pratoId": 1, "quantidade": 50},
      {"pratoId": 2, "quantidade": 30}
    ]
  }'
```

**Resposta do Processamento:**
```json
{
  "sucesso": true,
  "mensagem": "Demanda processada! 2 itens com déficit. Lista de compras gerada automaticamente.",
  "dados": {
    "demandaId": 1,
    "totalIngredientes": 8,
    "totalItensComDeficit": 2,
    "listaComprasGerada": true,
    "listaComprasId": 5,
    "itensComDeficit": [
      {
        "ingredienteNome": "Frango Inteiro",
        "qtdNecessaria": 17.5,
        "qtdDisponivel": 10.0,
        "deficit": 7.5,
        "unidade": "KG"
      }
    ]
  }
}
```

### 🏪 Estoque

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /estoque | Listar estoque |
| POST | /estoque | Adicionar lote ao estoque |
| POST | /estoque/{id}/movimentacao | Registrar movimentação |
| GET | /estoque/alertas/estoque-baixo | Alertas de estoque baixo |
| GET | /estoque/alertas/vencimento | Alertas de vencimento |

### 📊 Dashboard

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /dashboard | KPIs gerais do restaurante |

---

## 🔑 Variáveis de Ambiente {#variaveis}

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/gastrocontrol` | URL do banco |
| `DB_USERNAME` | `gastrocontrol` | Usuário do banco |
| `DB_PASSWORD` | `gastrocontrol123` | Senha do banco |
| `JWT_SECRET` | *(ver .env.example)* | Secret do JWT (altere em prod!) |
| `JWT_EXPIRATION` | `86400000` | Expiração access token (ms) |
| `JWT_REFRESH_EXPIRATION` | `604800000` | Expiração refresh token (ms) |
| `SERVER_PORT` | `8080` | Porta do servidor |
| `FRONTEND_URL` | `http://localhost:3000` | URL do frontend (CORS) |

---

## 🧪 Testes {#testes}

```bash
# Executar todos os testes
mvn test

# Executar apenas testes unitários
mvn test -Dtest=*Test

# Executar apenas testes de integração (requer Docker)
mvn test -Dtest=*IntegrationTest

# Com relatório de cobertura
mvn verify
```

### Credenciais de Teste

| Usuário | Email | Senha | Role |
|---------|-------|-------|------|
| Admin | admin@gastrocontrol.com | Admin@123 | ADMIN |
| Operador | operador@gastrocontrol.com | Operador@123 | OPERADOR |

---

## 🐳 Deploy com Docker {#docker}

### Build da Imagem

```bash
docker build -t gastrocontrol-backend:1.0.0 .
```

### Produção

```bash
# Configure as variáveis de ambiente no .env
# Especialmente: JWT_SECRET, DB_PASSWORD

docker-compose up -d --build

# Verificar status
docker-compose ps

# Logs em tempo real
docker-compose logs -f
```

---

## 🔒 Segurança

- ✅ JWT com HMAC-SHA256
- ✅ BCrypt com fator 12 para senhas
- ✅ Refresh tokens com revogação
- ✅ Controle de acesso por roles (ADMIN/OPERADOR)
- ✅ CORS configurado
- ✅ Container rodando como non-root user
- ✅ Headers de segurança

---

## 📈 Escalabilidade

- Pool de conexões HikariCP configurado
- Cache de segundo nível preparado
- Paginação em todos os endpoints de listagem
- Índices otimizados no banco de dados
- Arquitetura stateless (JWT)
- Docker-ready para orquestração

---

## 📞 Suporte

- **Swagger**: http://localhost:8080/api/swagger-ui.html
- **Health**: http://localhost:8080/api/actuator/health
- **Email**: contato@gastrocontrol.com
