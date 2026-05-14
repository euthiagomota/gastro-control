# Documentação de Componentes

## Componentes Básicos

### Button

Botão reutilizável com variantes de estilo.

```jsx
import { Button } from '@/components';

<Button variant="primary" size="lg">
  Clique aqui
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'danger' | 'outline'` (default: 'primary')
- `size`: `'sm' | 'md' | 'lg'` (default: 'md')
- `children`: ReactNode

### Card

Container estilizado para agrupar conteúdo.

```jsx
<Card className="p-6">
  Conteúdo do card
</Card>
```

**Props:**
- `children`: ReactNode
- `className`: string (Tailwind classes)

### Input

Input com suporte a ícones e validação.

```jsx
<Input 
  label="Email"
  icon={Mail}
  error={errors.email}
  placeholder="seu@email.com"
/>
```

**Props:**
- `label`: string
- `icon`: IconComponent
- `error`: string
- `...inputProps`: HTML input attributes

### Navbar

Barra de navegação com branding.

```jsx
<Navbar 
  title="GastroControl"
  rightContent={<NavLinks />}
/>
```

**Props:**
- `title`: string
- `rightContent`: ReactNode

### Sidebar

Menu lateral responsivo com suporte a mobile.

```jsx
<Sidebar 
  items={[
    { id: 1, label: 'Home', href: '/', icon: Home },
    { id: 2, label: 'Settings', href: '/settings', icon: Settings }
  ]}
/>
```

**Props:**
- `items`: Array<{ id, label, href, icon }>

### Table

Tabela renderizável com colunas customizáveis.

```jsx
<Table 
  columns={[
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' }
  ]}
  data={data}
/>
```

**Props:**
- `columns`: Array<{ key, label, render? }>
- `data`: Array<Record>

## Componentes Específicos da Landing Page

### FeatureCard

Card de feature com ícone e título.

```jsx
<FeatureCard 
  icon={TrendingUp}
  title="Dashboards em tempo real"
  description="Acompanhe tudo em tempo real"
/>
```

### AlertItem

Item de alerta com tipo (error, warning, info).

```jsx
<AlertItem
  type="error"
  message="Estoque baixo: frango"
/>
```

### ReviewBadge

Badge de avaliação com iniciais e stars.

```jsx
<ReviewBadge />
```

### MetricCard

Card de métrica com valor e tendência.

```jsx
<MetricCard
  label="Desperdício evitado"
  value="R$ 2.100"
  trend="up"
  trendText="12% este mês"
/>
```

### ProcessFlow

Componente de fluxo de processo.

```jsx
<ProcessFlow />
```

## Boas Práticas

1. **Sempre use componentes controlados** quando possível
2. **Mantenha componentes pequenos** e focados
3. **Reutilize componentes** ao máximo
4. **Use Tailwind** para styling
5. **Documente com comentários** quando complexo

---

Para mais exemplos, veja as páginas em `src/pages/`.
