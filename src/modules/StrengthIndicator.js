export class StrengthIndicator {
  constructor() {
    this.strengthConfig = {
      1: { 
        text: 'Faible', 
        color: 'var(--color-1)', 
        textColor: 'var(--color-1)',
        bgColor: 'rgba(var(--color-1-rgb), 0.2)'
      },
      2: { 
        text: 'Moyenne', 
        color: 'var(--color-3)', 
        textColor: 'var(--color-3)',
        bgColor: 'rgba(var(--color-3-rgb), 0.2)'
      },
      3: { 
        text: 'Forte', 
        color: 'var(--color-2)', 
        textColor: 'var(--color-2)',
        bgColor: 'rgba(var(--color-2-rgb), 0.2)'
      },
      4: { 
        text: 'Très forte', 
        color: 'var(--color-4)', 
        textColor: 'var(--color-4)',
        bgColor: 'rgba(var(--color-4-rgb), 0.2)'
      }
    }
  }

  update(score, strengthBars, strengthText) {
    if (!strengthBars.length || !strengthText) return

    const config = this.strengthConfig[score] || this.strengthConfig[1]

    // Mise à jour visuelle des barres avec animation
    Array.from(strengthBars).forEach((bar, i) => {
      setTimeout(() => {
        if (i < score) {
          bar.style.background = config.color
          bar.className = 'flex-1 h-2 rounded-full transition-all duration-300'
        } else {
          bar.style.background = 'rgba(var(--color-1-rgb), 0.3)'
          bar.className = 'flex-1 h-2 rounded-full transition-all duration-300'
        }
      }, i * 50)
    })

    // Mise à jour du texte de force avec animation
    strengthText.style.opacity = '0'
    setTimeout(() => {
      strengthText.textContent = config.text
      strengthText.style.background = config.bgColor
      strengthText.style.color = config.textColor
      strengthText.style.opacity = '1'
    }, 150)
  }
}