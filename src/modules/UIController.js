export class UIController {
  constructor(passwordGenerator, strengthIndicator) {
    this.passwordGenerator = passwordGenerator
    this.strengthIndicator = strengthIndicator
    this.elements = {}
  }

  init() {
    this.bindElements()
    this.attachEventListeners()
    this.setupInitialState()
  }

  bindElements() {
    this.elements = {
      passwordDisplay: document.getElementById('password-display'),
      lengthSlider: document.getElementById('length'),
      lengthValue: document.getElementById('length-value'),
      uppercaseEl: document.getElementById('uppercase'),
      lowercaseEl: document.getElementById('lowercase'),
      numbersEl: document.getElementById('numbers'),
      symbolsEl: document.getElementById('symbols'),
      generateButton: document.getElementById('generate-button'),
      copyButton: document.getElementById('copy-button'),
      copyFeedback: document.getElementById('copy-feedback'),
      strengthBarsContainer: document.getElementById('strength-bars'),
      strengthText: document.getElementById('strength-text')
    }

    this.elements.strengthBars = this.elements.strengthBarsContainer ? 
      this.elements.strengthBarsContainer.children : []
  }

  attachEventListeners() {
    // Slider de longueur
    if (this.elements.lengthSlider) {
      this.elements.lengthSlider.addEventListener('input', () => {
        this.updateLengthValue()
        this.updateStrengthIndicator()
      })
    }

    // Bouton de génération
    if (this.elements.generateButton) {
      this.elements.generateButton.addEventListener('click', () => {
        this.animateGenerateButton()
        this.generatePassword()
        this.updateStrengthIndicator()
      })
    }

    // Bouton de copie
    if (this.elements.copyButton) {
      this.elements.copyButton.addEventListener('click', () => this.copyToClipboard())
    }

    // Checkboxes
    const checkboxes = [
      this.elements.uppercaseEl,
      this.elements.lowercaseEl,
      this.elements.numbersEl,
      this.elements.symbolsEl
    ]

    checkboxes.forEach(el => {
      if (el) {
        el.addEventListener('change', (e) => {
          this.animateCheckbox(e.target)
          this.generatePassword()
          this.updateStrengthIndicator()
        })
      }
    })

    // Raccourcis clavier
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e))
  }

  setupInitialState() {
    setTimeout(() => {
      this.updateLengthValue()
      this.generatePassword()
      this.updateStrengthIndicator()
    }, 300)

    // Ajout de styles de transition
    if (this.elements.passwordDisplay) {
      this.elements.passwordDisplay.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    }
    
    if (this.elements.copyButton) {
      this.elements.copyButton.style.transition = 'transform 0.15s ease'
    }
    
    const icon = this.elements.generateButton?.querySelector('svg')
    if (icon) {
      icon.style.transition = 'transform 0.3s ease'
    }
  }

  updateLengthValue() {
    if (this.elements.lengthValue && this.elements.lengthSlider) {
      this.elements.lengthValue.textContent = this.elements.lengthSlider.value
      
      // Mise à jour visuelle du slider
      const value = ((this.elements.lengthSlider.value - this.elements.lengthSlider.min) / 
                    (this.elements.lengthSlider.max - this.elements.lengthSlider.min)) * 100
      this.elements.lengthSlider.style.background = 
        `linear-gradient(to right, var(--color-3) 0%, var(--color-3) ${value}%, rgba(var(--color-1-rgb), 0.3) ${value}%, rgba(var(--color-1-rgb), 0.3) 100%)`
    }
  }

  generatePassword() {
    if (!this.elements.lengthSlider || !this.elements.passwordDisplay) return

    const options = this.getPasswordOptions()
    const password = this.passwordGenerator.generate(options)

    if (!password) {
      this.elements.passwordDisplay.textContent = 'Sélectionnez au moins une option'
      this.elements.passwordDisplay.style.opacity = '0.6'
      return
    }

    // Animation de changement de mot de passe
    this.elements.passwordDisplay.style.opacity = '0'
    this.elements.passwordDisplay.style.transform = 'translateY(10px)'
    
    setTimeout(() => {
      this.elements.passwordDisplay.textContent = password
      this.elements.passwordDisplay.style.opacity = '1'
      this.elements.passwordDisplay.style.transform = 'translateY(0)'
    }, 150)
  }

  updateStrengthIndicator() {
    const options = this.getPasswordOptions()
    const score = this.passwordGenerator.calculateStrength(options)
    
    this.strengthIndicator.update(
      score, 
      this.elements.strengthBars, 
      this.elements.strengthText
    )
  }

  getPasswordOptions() {
    return {
      length: parseInt(this.elements.lengthSlider?.value || 16),
      uppercase: this.elements.uppercaseEl?.checked || false,
      lowercase: this.elements.lowercaseEl?.checked || false,
      numbers: this.elements.numbersEl?.checked || false,
      symbols: this.elements.symbolsEl?.checked || false
    }
  }

  async copyToClipboard() {
    const password = this.elements.passwordDisplay.textContent
    if (!password || password === 'Sélectionnez au moins une option') return

    try {
      await navigator.clipboard.writeText(password)
      this.showCopyFeedback()
      this.animateCopyButton()
    } catch (err) {
      console.error('Erreur lors de la copie avec Clipboard API:', err)
      this.fallbackCopyToClipboard(password)
    }
  }

  fallbackCopyToClipboard(password) {
    const textArea = document.createElement('textarea')
    textArea.value = password
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      this.showCopyFeedback()
    } catch (copyErr) {
      console.error('Erreur lors de la copie (méthode de repli):', copyErr)
    }
    
    document.body.removeChild(textArea)
  }

  showCopyFeedback() {
    if (!this.elements.copyFeedback) return
    
    this.elements.copyFeedback.style.opacity = '1'
    this.elements.copyFeedback.style.transform = 'translateY(0)'
    
    setTimeout(() => {
      this.elements.copyFeedback.style.opacity = '0'
      this.elements.copyFeedback.style.transform = 'translateY(0.5rem)'
    }, 2500)
  }

  animateCopyButton() {
    this.elements.copyButton.style.transform = 'scale(0.95)'
    setTimeout(() => {
      this.elements.copyButton.style.transform = 'scale(1)'
    }, 150)
  }

  animateGenerateButton() {
    const icon = this.elements.generateButton.querySelector('svg')
    if (icon) {
      icon.style.transform = 'rotate(360deg)'
      setTimeout(() => {
        icon.style.transform = 'rotate(0deg)'
      }, 300)
    }
  }

  animateCheckbox(checkbox) {
    if (checkbox.checked) {
      checkbox.style.transform = 'scale(1.1)'
      setTimeout(() => {
        checkbox.style.transform = 'scale(1)'
      }, 150)
    }
  }

  handleKeyboardShortcuts(e) {
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
      e.preventDefault()
      this.animateGenerateButton()
      this.generatePassword()
      this.updateStrengthIndicator()
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.tagName !== 'INPUT') {
      e.preventDefault()
      this.copyToClipboard()
    }
  }
}