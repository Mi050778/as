// Configurações das loterias
const lotteryConfigs = {
    'mega-sena': {
        name: 'Mega-Sena',
        description: 'Escolha 6 números de 01 a 60',
        maxNumbers: 60,
        selectCount: 6,
        icon: 'fas fa-star'
    },
    'lotofacil': {
        name: 'Lotofácil',
        description: 'Escolha 15 números de 01 a 25',
        maxNumbers: 25,
        selectCount: 15,
        icon: 'fas fa-heart'
    },
    'quina': {
        name: 'Quina',
        description: 'Escolha 5 números de 01 a 80',
        maxNumbers: 80,
        selectCount: 5,
        icon: 'fas fa-diamond'
    },
    'lotomania': {
        name: 'Lotomania',
        description: 'Escolha 20 números de 00 a 99',
        maxNumbers: 100,
        selectCount: 20,
        icon: 'fas fa-crown'
    }
};

// Estado global do jogo
let currentLottery = null;
let selectedNumbers = [];

// Elementos DOM
const gameTitle = document.getElementById('game-title');
const gameDescription = document.getElementById('game-description');
const numberGrid = document.getElementById('number-grid');
const selectedList = document.getElementById('selected-list');
const playBtn = document.getElementById('play-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalNumbers = document.getElementById('modal-numbers');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeModal();
});

// Navegação responsiva
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animar as barras do menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
}

// Scroll suave para seções
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para scroll programático
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Selecionar loteria
function selectLottery(lotteryType) {
    currentLottery = lotteryType;
    const config = lotteryConfigs[lotteryType];
    
    // Atualizar interface
    gameTitle.textContent = config.name;
    gameDescription.textContent = config.description;
    
    // Limpar seleções anteriores
    selectedNumbers = [];
    updateSelectedList();
    updatePlayButton();
    
    // Gerar grade de números
    generateNumberGrid(config.maxNumbers);
    
    // Scroll para a seção do jogo
    scrollToSection('game');
    
    // Adicionar efeito visual
    const gameSection = document.getElementById('game');
    gameSection.style.animation = 'fadeInUp 0.5s ease';
    setTimeout(() => {
        gameSection.style.animation = '';
    }, 500);
}

// Gerar grade de números
function generateNumberGrid(maxNumbers) {
    numberGrid.innerHTML = '';
    
    for (let i = 1; i <= maxNumbers; i++) {
        const numberBtn = document.createElement('button');
        numberBtn.className = 'number-btn';
        numberBtn.textContent = i.toString().padStart(2, '0');
        numberBtn.dataset.number = i;
        
        numberBtn.addEventListener('click', () => toggleNumber(i));
        
        numberGrid.appendChild(numberBtn);
    }
    
    // Ajustar grid baseado no número máximo
    if (maxNumbers <= 25) {
        numberGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    } else if (maxNumbers <= 60) {
        numberGrid.style.gridTemplateColumns = 'repeat(10, 1fr)';
    } else {
        numberGrid.style.gridTemplateColumns = 'repeat(10, 1fr)';
    }
}

// Alternar seleção de número
function toggleNumber(number) {
    const config = lotteryConfigs[currentLottery];
    const numberBtn = document.querySelector(`[data-number="${number}"]`);
    
    if (selectedNumbers.includes(number)) {
        // Remover número
        selectedNumbers = selectedNumbers.filter(n => n !== number);
        numberBtn.classList.remove('selected');
    } else {
        // Adicionar número (se não exceder o limite)
        if (selectedNumbers.length < config.selectCount) {
            selectedNumbers.push(number);
            numberBtn.classList.add('selected');
            
            // Efeito de confete para o número selecionado
            createConfetti(numberBtn);
        } else {
            // Mostrar aviso de limite atingido
            showNotification(`Você já selecionou ${config.selectCount} números!`, 'warning');
        }
    }
    
    updateSelectedList();
    updatePlayButton();
}

// Atualizar lista de números selecionados
function updateSelectedList() {
    selectedList.innerHTML = '';
    
    selectedNumbers.sort((a, b) => a - b).forEach(number => {
        const selectedNumber = document.createElement('div');
        selectedNumber.className = 'selected-number';
        selectedNumber.innerHTML = `
            ${number.toString().padStart(2, '0')}
            <span class="remove" onclick="removeNumber(${number})">&times;</span>
        `;
        selectedList.appendChild(selectedNumber);
    });
}

// Remover número da seleção
function removeNumber(number) {
    selectedNumbers = selectedNumbers.filter(n => n !== number);
    const numberBtn = document.querySelector(`[data-number="${number}"]`);
    if (numberBtn) {
        numberBtn.classList.remove('selected');
    }
    updateSelectedList();
    updatePlayButton();
}

// Atualizar estado do botão jogar
function updatePlayButton() {
    const config = lotteryConfigs[currentLottery];
    if (selectedNumbers.length === config.selectCount) {
        playBtn.disabled = false;
        playBtn.style.opacity = '1';
    } else {
        playBtn.disabled = true;
        playBtn.style.opacity = '0.5';
    }
}

// Limpar seleção
function clearSelection() {
    selectedNumbers = [];
    document.querySelectorAll('.number-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    updateSelectedList();
    updatePlayButton();
}

// Gerar números aleatórios
function generateRandom() {
    const config = lotteryConfigs[currentLottery];
    
    // Limpar seleção atual
    clearSelection();
    
    // Gerar números aleatórios
    const numbers = [];
    while (numbers.length < config.selectCount) {
        const randomNum = Math.floor(Math.random() * config.maxNumbers) + 1;
        if (!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }
    
    // Selecionar números na interface
    numbers.forEach(number => {
        selectedNumbers.push(number);
        const numberBtn = document.querySelector(`[data-number="${number}"]`);
        if (numberBtn) {
            numberBtn.classList.add('selected');
            createConfetti(numberBtn);
        }
    });
    
    updateSelectedList();
    updatePlayButton();
    
    // Efeito de animação
    showNotification('Números gerados automaticamente!', 'success');
}

// Jogar
function playGame() {
    if (!currentLottery || selectedNumbers.length === 0) {
        showNotification('Selecione uma loteria e números primeiro!', 'error');
        return;
    }
    
    const config = lotteryConfigs[currentLottery];
    if (selectedNumbers.length !== config.selectCount) {
        showNotification(`Você precisa selecionar ${config.selectCount} números!`, 'warning');
        return;
    }
    
    // Simular processamento
    showNotification('Processando sua aposta...', 'info');
    
    setTimeout(() => {
        showModal(config.name, selectedNumbers);
        showNotification('Aposta realizada com sucesso!', 'success');
    }, 1500);
}

// Mostrar modal
function showModal(lotteryName, numbers) {
    modalTitle.textContent = `${lotteryName} - Aposta Realizada!`;
    
    modalNumbers.innerHTML = '';
    numbers.sort((a, b) => a - b).forEach(number => {
        const modalNumber = document.createElement('div');
        modalNumber.className = 'modal-number';
        modalNumber.textContent = number.toString().padStart(2, '0');
        modalNumbers.appendChild(modalNumber);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Inicializar modal
function initializeModal() {
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Formulário de contato
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso!', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Funções auxiliares para notificações
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Efeito de confete
function createConfetti(element) {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        
        document.body.appendChild(confetti);
        
        // Animar confete
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016 + 0.5; // Gravidade
            opacity -= 0.02;
            
            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Animações CSS adicionais
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Adicionar estilos ao head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Intersection Observer para animações de scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.lottery-card, .result-card, .feature, .stat');
    animateElements.forEach(el => observer.observe(el));
});

// Contador de estatísticas animado
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Iniciar animação dos contadores quando a seção about estiver visível
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
});

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Preloader (opcional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Função para salvar aposta no localStorage (simulação)
function saveBet(lotteryType, numbers) {
    const bets = JSON.parse(localStorage.getItem('bets') || '[]');
    const bet = {
        id: Date.now(),
        lottery: lotteryType,
        numbers: numbers,
        date: new Date().toISOString(),
        status: 'pending'
    };
    bets.push(bet);
    localStorage.setItem('bets', JSON.stringify(bets));
    return bet;
}

// Função para carregar apostas salvas
function loadBets() {
    return JSON.parse(localStorage.getItem('bets') || '[]');
}

// Atualizar função playGame para salvar aposta
function playGame() {
    if (!currentLottery || selectedNumbers.length === 0) {
        showNotification('Selecione uma loteria e números primeiro!', 'error');
        return;
    }
    
    const config = lotteryConfigs[currentLottery];
    if (selectedNumbers.length !== config.selectCount) {
        showNotification(`Você precisa selecionar ${config.selectCount} números!`, 'warning');
        return;
    }
    
    // Simular processamento
    showNotification('Processando sua aposta...', 'info');
    
    setTimeout(() => {
        // Salvar aposta
        const bet = saveBet(currentLottery, [...selectedNumbers]);
        
        showModal(config.name, selectedNumbers);
        showNotification('Aposta realizada com sucesso!', 'success');
        
        // Limpar seleção após aposta
        clearSelection();
    }, 1500);
}