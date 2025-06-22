// Sélection des éléments du DOM
const passwordDisplay = document.getElementById('password-display');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateButton = document.getElementById('generate-button');
const copyButton = document.getElementById('copy-button');
const copyFeedback = document.getElementById('copy-feedback');
const strengthBarsContainer = document.getElementById('strength-bars');
const strengthBars = strengthBarsContainer ? strengthBarsContainer.children : [];
const strengthText = document.getElementById('strength-text');

// Caractères disponibles
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Configuration des couleurs et textes pour la force
const strengthConfig = {
    1: { 
        text: 'Faible', 
        color: 'bg-red-500', 
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/20'
    },
    2: { 
        text: 'Moyenne', 
        color: 'bg-yellow-500', 
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20'
    },
    3: { 
        text: 'Forte', 
        color: 'bg-green-500', 
        textColor: 'text-green-400',
        bgColor: 'bg-green-500/20'
    },
    4: { 
        text: 'Très forte', 
        color: 'bg-emerald-500', 
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20'
    }
};

// Fonction pour mettre à jour la valeur de la longueur affichée
const updateLengthValue = () => {
    if (lengthValue && lengthSlider) {
        lengthValue.textContent = lengthSlider.value;
        
        // Mise à jour visuelle du slider
        const value = ((lengthSlider.value - lengthSlider.min) / (lengthSlider.max - lengthSlider.min)) * 100;
        lengthSlider.style.background = `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${value}%, #334155 ${value}%, #334155 100%)`;
    }
};

// Fonction pour évaluer la force du mot de passe
const updateStrengthIndicator = () => {
    if (!lengthSlider || !strengthBars.length || !strengthText) return;

    let score = 0;
    const length = parseInt(lengthSlider.value);
    const optionsCount = (uppercaseEl.checked ? 1 : 0) +
                         (lowercaseEl.checked ? 1 : 0) +
                         (numbersEl.checked ? 1 : 0) +
                         (symbolsEl.checked ? 1 : 0);

    // Calcul du score basé sur la longueur et les options
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (optionsCount >= 3) score++;
    if (optionsCount === 4 && length >= 8) score++;

    // Assurer un score minimum de 1 si au moins une option est cochée
    if (optionsCount > 0 && score === 0) score = 1;

    const config = strengthConfig[score] || strengthConfig[1];

    // Mise à jour visuelle des barres avec animation
    Array.from(strengthBars).forEach((bar, i) => {
        setTimeout(() => {
            if (i < score) {
                bar.className = `flex-1 h-2 rounded-full ${config.color} transition-all duration-300`;
            } else {
                bar.className = 'flex-1 h-2 rounded-full bg-slate-600 transition-all duration-300';
            }
        }, i * 50);
    });

    // Mise à jour du texte de force avec animation
    strengthText.style.opacity = '0';
    setTimeout(() => {
        strengthText.textContent = config.text;
        strengthText.className = `text-sm font-bold uppercase px-2 py-1 rounded-md ${config.bgColor} ${config.textColor} transition-all duration-300`;
        strengthText.style.opacity = '1';
    }, 150);
};

// Fonction pour générer le mot de passe
const generatePassword = () => {
    if (!lengthSlider || !passwordDisplay) return;

    const length = parseInt(lengthSlider.value);
    let characterPool = '';
    let password = [];

    // Créer le pool de caractères et garantir au moins un de chaque type coché
    if (uppercaseEl.checked) {
        characterPool += charSets.uppercase;
        password.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
    }
    if (lowercaseEl.checked) {
        characterPool += charSets.lowercase;
        password.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
    }
    if (numbersEl.checked) {
        characterPool += charSets.numbers;
        password.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
    }
    if (symbolsEl.checked) {
        characterPool += charSets.symbols;
        password.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);
    }

    if (characterPool === '') {
        passwordDisplay.textContent = 'Sélectionnez au moins une option';
        passwordDisplay.style.opacity = '0.6';
        return;
    }

    const remainingLength = Math.max(0, length - password.length);
    for (let i = 0; i < remainingLength; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password.push(characterPool[randomIndex]);
    }
    
    // Mélanger le mot de passe avec animation
    const shuffledPassword = password.sort(() => Math.random() - 0.5).slice(0, length).join('');
    
    // Animation de changement de mot de passe
    passwordDisplay.style.opacity = '0';
    passwordDisplay.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        passwordDisplay.textContent = shuffledPassword;
        passwordDisplay.style.opacity = '1';
        passwordDisplay.style.transform = 'translateY(0)';
    }, 150);
};

// Fonction pour afficher le feedback de copie
const showCopyFeedback = () => {
    if (!copyFeedback) return;
    
    copyFeedback.style.opacity = '1';
    copyFeedback.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        copyFeedback.style.opacity = '0';
        copyFeedback.style.transform = 'translateY(0.5rem)';
    }, 2500);
};

// Fonction pour copier dans le presse-papiers
const copyToClipboard = async () => {
    const password = passwordDisplay.textContent;
    if (!password || password === 'Sélectionnez au moins une option') return;

    try {
        await navigator.clipboard.writeText(password);
        showCopyFeedback();
        
        // Animation du bouton de copie
        copyButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            copyButton.style.transform = 'scale(1)';
        }, 150);
        
    } catch (err) {
        console.error('Erreur lors de la copie avec Clipboard API:', err);
        
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (copyErr) {
            console.error('Erreur lors de la copie (méthode de repli):', copyErr);
        }
        
        document.body.removeChild(textArea);
    }
};

// Animation du bouton de génération
const animateGenerateButton = () => {
    const icon = generateButton.querySelector('svg');
    if (icon) {
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 300);
    }
};

// Ajout des écouteurs d'événements
if (lengthSlider) {
    lengthSlider.addEventListener('input', () => {
        updateLengthValue();
        updateStrengthIndicator();
    });
}

if (generateButton) {
    generateButton.addEventListener('click', () => {
        animateGenerateButton();
        generatePassword();
        updateStrengthIndicator();
    });
}

if (copyButton) {
    copyButton.addEventListener('click', copyToClipboard);
}

// Écouteurs pour les checkboxes avec animation
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
    if (el) {
        el.addEventListener('change', (e) => {
            // Animation de la checkbox
            if (e.target.checked) {
                e.target.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 150);
            }
            
            generatePassword();
            updateStrengthIndicator();
        });
    }
});

// Raccourci clavier pour générer un nouveau mot de passe
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        animateGenerateButton();
        generatePassword();
        updateStrengthIndicator();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        copyToClipboard();
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Animation d'entrée
    setTimeout(() => {
        updateLengthValue();
        generatePassword();
        updateStrengthIndicator();
    }, 300);
    
    // Ajout de styles de transition pour les éléments animés
    if (passwordDisplay) {
        passwordDisplay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    if (copyButton) {
        copyButton.style.transition = 'transform 0.15s ease';
    }
    
    const icon = generateButton?.querySelector('svg');
    if (icon) {
        icon.style.transition = 'transform 0.3s ease';
    }
});