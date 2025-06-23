import './styles/main.css'
import { PasswordGenerator } from './modules/PasswordGenerator'
import { UIController } from './modules/UIController'
import { StrengthIndicator } from './modules/StrengthIndicator'

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  const passwordGenerator = new PasswordGenerator()
  const strengthIndicator = new StrengthIndicator()
  const uiController = new UIController(passwordGenerator, strengthIndicator)
  
  uiController.init()
})