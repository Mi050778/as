# 🎱 Loteria Online

Uma plataforma moderna e completa para apostas em loterias brasileiras, inspirada no sorteonline.com.br. Desenvolvida com Next.js, React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 🏠 Página Inicial
- Hero section com call-to-action
- Próximas premiações de todas as loterias
- Últimos resultados dos sorteios
- Bolões em destaque
- Seção "Como Funciona"
- Estatísticas e newsletter
- Depoimentos de usuários

### 🎯 Páginas de Loterias
- **Mega-Sena**: A maior loteria do Brasil
- **Lotofácil**: A mais fácil de ganhar
- **Quina**: Sorteios de segunda a sábado
- Páginas individuais com:
  - Formulário de apostas interativo
  - Sistema de seleção de números
  - Surpresinha automática
  - Estatísticas históricas
  - Dicas de apostas
  - Informações de premiação

### 🧮 Sistema de Apostas
- Seleção manual de números
- Geração automática (Surpresinha)
- Cálculo automático de valores
- Múltiplos jogos
- Adição ao carrinho

### 📊 Funcionalidades Adicionais
- Design responsivo
- Animações suaves com Framer Motion
- Interface moderna e intuitiva
- Componentes reutilizáveis
- Tipagem completa com TypeScript

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Headless UI** - Componentes acessíveis
- **Date-fns** - Manipulação de datas

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd loteria-online
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o projeto em desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Estrutura do Projeto

```
loteria-online/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── mega-sena/
│   │   │   └── page.tsx
│   │   └── lotofacil/
│   │       └── page.tsx
│   └── components/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── ProximasPremiacoes.tsx
│       ├── UltimosResultados.tsx
│       ├── BoloesDestaque.tsx
│       ├── ComoFunciona.tsx
│       ├── Estatisticas.tsx
│       ├── LoteriaPage.tsx
│       └── LoteriaForm.tsx
├── public/
├── package.json
└── README.md
```

## 🎨 Componentes Principais

### `Header`
- Navegação responsiva
- Dropdown de loterias
- Carrinho de compras
- Sistema de login/cadastro

### `ProximasPremiacoes`
- Grid de próximos sorteios
- Informações de data e horário
- Últimos números sorteados
- Status de acumulação

### `LoteriaPage`
- Página genérica para loterias
- Sistema de tabs
- Hero section personalizada
- Integração com formulário de apostas

### `LoteriaForm`
- Seleção interativa de números
- Modo surpresinha
- Cálculo automático de valores
- Validação de apostas

## 🎯 Próximos Passos

### 📋 Funcionalidades Planejadas
- [ ] Sistema completo de bolões
- [ ] Integração com pagamentos (PIX, cartões)
- [ ] Sistema de cadastro/login
- [ ] Página de resultados com histórico
- [ ] Carrinho de compras funcional
- [ ] Sistema de notificações
- [ ] Área do usuário
- [ ] Histórico de apostas
- [ ] Sistema de premiação

### 🛠️ Melhorias Técnicas
- [ ] Testes unitários
- [ ] Integração com API da Caixa
- [ ] PWA (Progressive Web App)
- [ ] SEO otimizado
- [ ] Performance optimizations
- [ ] Acessibilidade (A11y)

## 🎮 Como Usar

### Apostando em uma Loteria

1. **Navegue para uma loteria**
   - Clique em "Loterias" no menu
   - Selecione Mega-Sena ou Lotofácil

2. **Faça sua aposta**
   - Escolha "Fazer Aposta" na aba
   - Selecione seus números ou use "Surpresinha"
   - Defina a quantidade de jogos
   - Clique em "Adicionar ao Carrinho"

3. **Explore outras funcionalidades**
   - Veja estatísticas históricas
   - Leia dicas de apostas
   - Confira as premiações

### Navegando pelo Site

- **Página Inicial**: Visão geral de todas as loterias
- **Próximas Premiações**: Valores e datas dos próximos sorteios
- **Últimos Resultados**: Números sorteados recentemente
- **Bolões**: Grupos de apostas (em desenvolvimento)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm run start

# Linting
npm run lint
```

## 🎨 Customização

### Cores das Loterias
As cores são definidas nos dados de cada loteria:
- **Mega-Sena**: Verde (`from-green-500 to-green-600`)
- **Lotofácil**: Roxo (`from-purple-500 to-purple-600`)

### Adicionando Nova Loteria
1. Crie uma nova página em `src/app/[nome-loteria]/page.tsx`
2. Configure os dados da loteria
3. Use o componente `LoteriaPage`
4. Adicione no menu do `Header`

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1280px+)

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎉 Agradecimentos

- Inspirado no sorteonline.com.br
- Icons by Lucide React
- Animações por Framer Motion
- Estilização com Tailwind CSS

---

Desenvolvido com ❤️ para a comunidade de apostadores brasileiros.
