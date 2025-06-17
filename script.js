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

// Fonction pour mettre à jour la valeur de la longueur affichée
const updateLengthValue = () => {
    if (lengthValue && lengthSlider) {
        lengthValue.textContent = lengthSlider.value;
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

    if (length >= 12) score++;
    if (length >= 16) score++;
    if (optionsCount >= 3) score++;
    if (optionsCount === 4 && length >=8) score++; // Bonus for all options and decent length

    // Mise à jour visuelle des barres
    Array.from(strengthBars).forEach((bar, i) => {
        if (i < score) {
            if (score === 1) bar.className = 'w-4 h-6 rounded-sm bg-red-500';
            else if (score === 2) bar.className = 'w-4 h-6 rounded-sm bg-yellow-500';
            else if (score === 3) bar.className = 'w-4 h-6 rounded-sm bg-green-500';
            else bar.className = 'w-4 h-6 rounded-sm bg-emerald-500'; // Très forte
        } else {
            bar.className = 'w-4 h-6 rounded-sm bg-slate-600';
        }
    });

    // Mise à jour du texte de force
    if (score <= 1) strengthText.textContent = 'Faible';
    else if (score === 2) strengthText.textContent = 'Moyenne';
    else if (score === 3) strengthText.textContent = 'Forte';
    else strengthText.textContent = 'Très forte';
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
        passwordDisplay.textContent = 'Sélectionnez une option';
        return;
    }

    const remainingLength = Math.max(0, length - password.length); // Ensure remainingLength is not negative
    for (let i = 0; i < remainingLength; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password.push(characterPool[randomIndex]);
    }
    
    // Mélanger le mot de passe pour que les caractères garantis ne soient pas toujours au début
    // et s'assurer que la longueur finale est correcte
    const shuffledPassword = password.sort(() => Math.random() - 0.5).slice(0, length).join('');
    passwordDisplay.textContent = shuffledPassword;
};

const showCopyFeedback = () => {
    if (!copyFeedback) return;
    copyFeedback.style.opacity = '1';
    copyFeedback.style.transform = 'translateY(0)';
    setTimeout(() => {
        copyFeedback.style.opacity = '0';
        copyFeedback.style.transform = 'translateY(0.5rem)';
    }, 2000);
};

const copyToClipboard = async () => {
    const password = passwordDisplay.textContent;
    if (!password || password === 'Sélectionnez une option') return;

    try {
        await navigator.clipboard.writeText(password);
        showCopyFeedback();
    } catch (err) {
        console.error('Erreur lors de la copie avec Clipboard API:', err);
        // Fallback pour les navigateurs plus anciens ou contextes non sécurisés (HTTP)
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
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

// Ajout des écouteurs d'événements
if (lengthSlider) {
    lengthSlider.addEventListener('input', () => {
        updateLengthValue();
        updateStrengthIndicator();
    });
}

if (generateButton) {
    generateButton.addEventListener('click', () => {
        generatePassword();
        updateStrengthIndicator(); // Mettre à jour la force après la génération
    });
}

if (copyButton) {
    copyButton.addEventListener('click', copyToClipboard);
}

[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
    if (el) {
        el.addEventListener('change', () => {
             // Regénérer et mettre à jour la force si une option change
            generatePassword();
            updateStrengthIndicator();
        });
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateLengthValue();
    generatePassword();
    updateStrengthIndicator();
});