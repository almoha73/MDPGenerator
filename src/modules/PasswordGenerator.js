export class PasswordGenerator {
  constructor() {
    this.charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }
  }

  generate(options) {
    const { length, uppercase, lowercase, numbers, symbols } = options
    let characterPool = ''
    let password = []

    // Créer le pool de caractères et garantir au moins un de chaque type coché
    if (uppercase) {
      characterPool += this.charSets.uppercase
      password.push(this.getRandomChar(this.charSets.uppercase))
    }
    if (lowercase) {
      characterPool += this.charSets.lowercase
      password.push(this.getRandomChar(this.charSets.lowercase))
    }
    if (numbers) {
      characterPool += this.charSets.numbers
      password.push(this.getRandomChar(this.charSets.numbers))
    }
    if (symbols) {
      characterPool += this.charSets.symbols
      password.push(this.getRandomChar(this.charSets.symbols))
    }

    if (characterPool === '') {
      return null
    }

    // Compléter le mot de passe avec des caractères aléatoires
    const remainingLength = Math.max(0, length - password.length)
    for (let i = 0; i < remainingLength; i++) {
      password.push(this.getRandomChar(characterPool))
    }
    
    // Mélanger le mot de passe
    return password.sort(() => Math.random() - 0.5).slice(0, length).join('')
  }

  getRandomChar(charset) {
    return charset[Math.floor(Math.random() * charset.length)]
  }

  calculateStrength(options) {
    const { length, uppercase, lowercase, numbers, symbols } = options
    let score = 0
    const optionsCount = (uppercase ? 1 : 0) + (lowercase ? 1 : 0) + (numbers ? 1 : 0) + (symbols ? 1 : 0)

    // Calcul du score basé sur la longueur et les options
    if (length >= 12) score++
    if (length >= 16) score++
    if (optionsCount >= 3) score++
    if (optionsCount === 4 && length >= 8) score++

    // Assurer un score minimum de 1 si au moins une option est cochée
    if (optionsCount > 0 && score === 0) score = 1

    return Math.min(score, 4)
  }
}