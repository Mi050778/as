# 🎰 Sorte Online - Site de Loteria

Uma réplica moderna e responsiva do site sorteonline.com.br, desenvolvida com HTML5, CSS3 e JavaScript puro.

## ✨ Características

- **Design Moderno**: Interface limpa e profissional com gradientes e animações
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Interativo**: Sistema completo de seleção de números para diferentes loterias
- **Animações Suaves**: Efeitos visuais e transições fluidas
- **Navegação Intuitiva**: Menu responsivo com scroll suave
- **Sistema de Notificações**: Feedback visual para ações do usuário
- **Modal Interativo**: Confirmação de apostas com visualização dos números

## 🎯 Loterias Disponíveis

- **Mega-Sena**: 6 números de 01 a 60
- **Lotofácil**: 15 números de 01 a 25
- **Quina**: 5 números de 01 a 80
- **Lotomania**: 20 números de 00 a 99

## 🚀 Como Usar

### 1. Abrir o Site
```bash
# Abra o arquivo index.html em qualquer navegador moderno
# Ou use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000
```

### 2. Navegar pelo Site
- **Home**: Seção principal com chamada para ação
- **Loterias**: Escolha entre as diferentes loterias disponíveis
- **Resultados**: Visualize os últimos resultados das loterias
- **Sobre**: Informações sobre a plataforma
- **Contato**: Formulário de contato funcional

### 3. Fazer uma Aposta
1. Clique em uma das loterias disponíveis
2. Selecione os números desejados (ou use "Surpresinha")
3. Clique em "Jogar" para confirmar a aposta
4. Visualize a confirmação no modal

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: 
  - Flexbox e Grid para layout
  - Gradientes e sombras
  - Animações e transições
  - Media queries para responsividade
- **JavaScript ES6+**:
  - Manipulação do DOM
  - Event listeners
  - LocalStorage para persistência
  - Intersection Observer API
  - Animações customizadas

## 📁 Estrutura do Projeto

```
sorte-online/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidades JavaScript
├── README.md           # Documentação
└── apiful2.js          # Arquivo existente (não relacionado)
```

## 🎨 Recursos Visuais

### Cores Principais
- **Azul Primário**: #2563eb
- **Gradiente Hero**: #667eea → #764ba2
- **Verde Sucesso**: #10b981
- **Vermelho Erro**: #ef4444
- **Amarelo Aviso**: #f59e0b

### Animações
- Fade in/out para elementos
- Bounce para bolas de loteria
- Slide para notificações
- Parallax suave no hero
- Confete ao selecionar números

## 📱 Responsividade

O site é totalmente responsivo com breakpoints em:
- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

## 🔧 Personalização

### Alterar Cores
Edite as variáveis CSS no arquivo `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #667eea;
    --success-color: #10b981;
    --error-color: #ef4444;
}
```

### Adicionar Novas Loterias
Edite o objeto `lotteryConfigs` no arquivo `script.js`:
```javascript
const lotteryConfigs = {
    'nova-loteria': {
        name: 'Nova Loteria',
        description: 'Descrição da nova loteria',
        maxNumbers: 50,
        selectCount: 7,
        icon: 'fas fa-star'
    }
};
```

## 🌟 Funcionalidades Avançadas

### Sistema de Notificações
- Notificações toast para feedback
- Diferentes tipos: success, error, warning, info
- Auto-remoção após 5 segundos
- Animações suaves

### Persistência Local
- Apostas salvas no localStorage
- Histórico de apostas
- Dados mantidos entre sessões

### Animações de Scroll
- Elementos animam ao entrar na viewport
- Contadores animados na seção "Sobre"
- Efeito parallax no hero

## 🚀 Deploy

### GitHub Pages
1. Faça push do código para um repositório GitHub
2. Vá em Settings > Pages
3. Selecione a branch main
4. Acesse o link gerado

### Netlify
1. Conecte seu repositório GitHub ao Netlify
2. Configure o build command (não necessário para sites estáticos)
3. Deploy automático a cada push

### Vercel
1. Conecte seu repositório ao Vercel
2. Deploy automático configurado
3. Domínio personalizado disponível

## 📄 Licença

Este projeto é apenas para fins educacionais e de demonstração. Não é um site real de apostas.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através do formulário no site ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ para fins educacionais**