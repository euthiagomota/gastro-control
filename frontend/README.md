# 🍽️ GastroControl - Landing Page

Uma implementação **pixel-perfect** da landing page do GastroControl seguindo o design do Figma, construída com **React 19 + Vite + TailwindCSS**.

## ✨ Características

✅ **Pixel-Perfect Design** - Replicação fiel do Figma
✅ **Responsive** - Mobile, Tablet, Desktop
✅ **Performance** - Vite build tool otimizado
✅ **Componentes Reutilizáveis** - Clean code architecture
✅ **TailwindCSS** - Styling moderno e eficiente
✅ **React Router** - Navegação estruturada
✅ **Axios** - Client HTTP para APIs
✅ **Lucide Icons** - Ícones SVG de alta qualidade

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

### 3. Build para Produção

```bash
npm run build
```

## 📁 Arquitetura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Button.jsx       # Botão com variantes
│   ├── Card.jsx         # Container genérico
│   ├── Input.jsx        # Input com validação
│   ├── Navbar.jsx       # Barra de navegação
│   ├── Sidebar.jsx      # Menu lateral responsivo
│   ├── Table.jsx        # Tabela renderizável
│   ├── FeatureCard.jsx  # Card de feature
│   ├── AlertItem.jsx    # Item de alerta
│   ├── ReviewBadge.jsx  # Badge de avaliação
│   ├── MetricCard.jsx   # Card de métrica
│   └── ProcessFlow.jsx  # Fluxo visual
├── pages/
│   └── WelcomePage.jsx  # Landing page (Figma)
├── layouts/
│   └── RootLayout.jsx   # Layout raiz
├── routes/
│   └── routes.jsx       # Configuração de rotas
├── services/
│   └── api.js           # Client Axios
├── utils/
│   └── helpers.js       # Funções auxiliares
├── constants/
│   └── theme.js         # Design system
└── App.jsx              # Root component
```

## 🎨 Design System

### Paleta de Cores

```
Primary (Verde):     #0F766E
Secondary (Verde):   #10B981
Text Dark:          #000000
Text Light:         #6B7280
Error:              #EF4444
Warning:            #FBBF24
Info:               #3B82F6
Background:         #FFFFFF
```

### Tipografia

- **Títulos**: Font-weight 700-800, tamanhos 24px-56px
- **Subtítulos**: Font-weight 600, tamanhos 16px-20px
- **Body**: Font-weight 400-500, tamanho 16px
- **Caption**: Font-weight 400, tamanho 12px-14px

## 📱 Responsividade

O design é completamente responsivo com breakpoints:

- **Mobile**: < 480px
- **Tablet**: 480px - 1024px
- **Desktop**: > 1024px

## 🔧 Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| React | 19.2.6 | UI Library |
| Vite | 8.0.12 | Build tool |
| React Router | 7.0.0 | Roteamento |
| TailwindCSS | 3.4.0 | Styling |
| Axios | 1.7.0 | HTTP Client |
| Lucide React | 0.408.0 | Ícones |

## 📖 Documentação

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Visão geral do projeto
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia de setup
- [COMPONENTS.md](./COMPONENTS.md) - Documentação de componentes
- [SETUP.md](./SETUP.md) - Estrutura inicial

## 🎯 Recursos Implementados

### Landing Page
- ✅ Header com navegação
- ✅ Hero section com texto e imagem
- ✅ 4 Features destacadas
- ✅ Botões de call-to-action
- ✅ Card de métrica (Desperdício evitado)
- ✅ Card de alertas
- ✅ Card de processo (Lógica GastroControl)
- ✅ Badge de avaliação

### Componentes
- ✅ Button reutilizável
- ✅ Card genérico
- ✅ Input com validação
- ✅ Navbar
- ✅ Sidebar responsiva
- ✅ Table renderizável
- ✅ FeatureCard
- ✅ AlertItem
- ✅ ReviewBadge
- ✅ MetricCard
- ✅ ProcessFlow

## 🔄 Próximos Passos

- [ ] Adicionar página de Login
- [ ] Implementar Dashboard
- [ ] Integração com API backend
- [ ] Autenticação e JWT
- [ ] Testes unitários (Jest)
- [ ] E2E tests (Cypress)
- [ ] CI/CD pipeline
- [ ] Deploy (Vercel/Netlify)

## 📝 Scripts Disponíveis

```bash
npm run dev      # Iniciar dev server
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar lint
```

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -am 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Crie um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

## 📄 Licença

MIT License © 2026 GastroControl

---

**Desenvolvido com ❤️ para restaurantes mais eficientes**
