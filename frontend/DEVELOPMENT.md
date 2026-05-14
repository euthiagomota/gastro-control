# GastroControl - Setup

Este documento descreve como configurar o ambiente de desenvolvimento.

## Pré-requisitos

- **Node.js**: v18.0.0 ou superior
- **npm**: v9.0.0 ou superior (incluído com Node.js)

## Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

   Isso instalará:
   - react@19.2.6
   - react-dom@19.2.6
   - react-router-dom@7.0.0
   - axios@1.7.0
   - lucide-react@0.408.0
   - tailwindcss@3.4.0
   - postcss@8.4.0
   - autoprefixer@10.4.0

3. **Configure variáveis de ambiente** (opcional)
   ```bash
   cp .env.example .env.local
   ```

## Desenvolvimento

### Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173 no seu navegador.

O Vite fornecerá Hot Module Replacement (HMR) para desenvolvimento rápido.

### Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`.

### Preview do Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Estrutura de Arquivos

```
frontend/
├── public/                    # Assets públicos
├── src/
│   ├── components/           # Componentes reutilizáveis
│   ├── pages/               # Páginas/telas
│   ├── layouts/             # Layouts compartilhados
│   ├── routes/              # Configuração de rotas
│   ├── services/            # Serviços (API, etc)
│   ├── hooks/               # Hooks customizados
│   ├── utils/               # Funções auxiliares
│   ├── constants/           # Constantes
│   ├── assets/              # Imagens, fonts
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── index.html               # HTML base
├── vite.config.js          # Configuração Vite
├── tailwind.config.js      # Configuração Tailwind
├── postcss.config.js       # Configuração PostCSS
├── eslint.config.js        # Configuração ESLint
└── package.json            # Dependências e scripts
```

## Configuração do VS Code

Extensões recomendadas:

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Tailwind CSS IntelliSense**
- **React Developer Tools**
- **ESLint**

Arquivo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=GastroControl
```

## Troubleshooting

### Porta 5173 já está em uso

```bash
npm run dev -- --port 3001
```

### Cache do node_modules

```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpar Vite cache

```bash
rm -rf .vite
npm run dev
```

## Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
2. Commit suas mudanças: `git commit -am 'Add nova feature'`
3. Push para a branch: `git push origin feature/nova-feature`
4. Crie um Pull Request

---

Para mais informações, veja:
- [Documentação Vite](https://vitejs.dev)
- [Documentação React](https://react.dev)
- [Documentação Tailwind CSS](https://tailwindcss.com)
- [Documentação React Router](https://reactrouter.com)
