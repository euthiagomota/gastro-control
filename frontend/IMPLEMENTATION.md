# GastroControl - Landing Page

Implementação pixel-perfect da landing page do GastroControl seguindo o design do Figma.

## 🎯 O Projeto

GastroControl é uma solução SaaS para restaurantes que oferece:
- **Dashboards em tempo real**
- **Controle de estoque inteligente**
- **Redução de desperdício**
- **Fichas técnicas automatizadas**

## 📋 Requisitos

- Node.js 18+
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173`

### 3. Build para Produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Button.jsx              # Botão reutilizável
│   ├── Card.jsx                # Card genérico
│   ├── Input.jsx               # Input com validação
│   ├── Navbar.jsx              # Navbar
│   ├── Sidebar.jsx             # Sidebar responsiva
│   ├── Table.jsx               # Tabela genérica
│   ├── FeatureCard.jsx         # Card de feature
│   ├── AlertItem.jsx           # Item de alerta
│   ├── ReviewBadge.jsx         # Badge de reviews
│   ├── MetricCard.jsx          # Card de métrica
│   └── ProcessFlow.jsx         # Fluxo de processo
├── pages/
│   └── WelcomePage.jsx         # Landing page (Figma)
├── layouts/
│   └── RootLayout.jsx          # Layout raiz
├── routes/
│   └── routes.jsx              # Configuração de rotas
├── services/
│   └── api.js                  # Cliente Axios
├── utils/
│   └── helpers.js              # Funções auxiliares
├── constants/
│   └── theme.js                # Cores e temas
└── App.jsx                     # App root
```

## 🎨 Design System

### Cores Principais

```
Verde Escuro (Primary):  #0F766E
Verde Claro (Secondary): #10B981
Preto (Text):            #000000
Cinza (Body):            #6B7280
Vermelho (Error):        #EF4444
Amarelo (Warning):       #FBBF24
Azul (Info):             #3B82F6
Branco (Background):     #FFFFFF
```

### Componentes

Todos os componentes seguem a estrutura do Figma com:
- Suporte responsivo (mobile, tablet, desktop)
- Acessibilidade
- Estados de hover e interação
- Tipografia consistente

## 🛠️ Tecnologias Utilizadas

- **React 19** - UI Library
- **Vite** - Build tool moderno
- **TailwindCSS** - Styling utility-first
- **React Router v7** - Roteamento
- **Axios** - Client HTTP
- **Lucide React** - Ícones SVG

## 📱 Responsividade

O design é totalmente responsivo:

- **Mobile** (< 480px): Layout em coluna única
- **Tablet** (480px - 1024px): Layout adaptado
- **Desktop** (> 1024px): Layout original com 2 colunas

## 🔄 Git Workflow

```bash
# Clone o repositório
git clone <repo>

# Instale as dependências
npm install

# Crie uma branch para suas alterações
git checkout -b feature/minha-feature

# Envie seu trabalho
git push origin feature/minha-feature
```

## 📝 Próximos Passos

- [ ] Integração com API backend
- [ ] Páginas adicionais (Login, Dashboard, etc)
- [ ] Autenticação
- [ ] Testes unitários
- [ ] E2E tests
- [ ] Documentação de componentes

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para restaurantes eficientes**
