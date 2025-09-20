// Main Application Controller
class EcoLearnApp {
  constructor() {
    this.currentSection = "dashboard"
    this.isAnimating = false
    this.init()
  }

  init() {
    this.bindEvents()
    this.initializeToastSystem()
    this.initializeConfettiSystem()
    console.log("🌱 EcoLearn loaded successfully!")

    // Show initial welcome message after delay
    setTimeout(() => {
      if (!window.authManager || !window.authManager.isLoggedIn) {
        this.showToast("Welcome to EcoLearn! Sign in to start your environmental journey! 🌱", "success")
      }
    }, 2000)
  }

  bindEvents() {
    // Keyboard navigation support
    document.addEventListener("keydown", (e) => this.handleKeyboard(e))

    // Window resize handler
    window.addEventListener("resize", () => this.handleResize())

    // Error handling
    window.addEventListener("error", (e) => this.handleError(e))
  }

  handleKeyboard(e) {
    if (e.key === "Escape") {
      // Close any open modals or popups
      const lessonContent = document.getElementById("lesson-content")
      const quizArea = document.getElementById("quiz-area")

      if (lessonContent && lessonContent.style.display !== "none") {
        window.closeLessonContent()
      }
      if (quizArea && quizArea.style.display !== "none") {
        window.closeQuiz()
      }
    }

    if (e.key === "Enter" || e.key === " ") {
      const focusedElement = document.activeElement
      if (focusedElement.classList.contains("lesson-card") || focusedElement.classList.contains("quiz-option")) {
        focusedElement.click()
      }
    }
  }

  handleResize() {
    // Adjust confetti positions if needed
    const confettiElements = document.querySelectorAll(".confetti")
    confettiElements.forEach((confetti) => {
      if (Number.parseInt(confetti.style.left) > window.innerWidth) {
        confetti.style.left = Math.random() * window.innerWidth + "px"
      }
    })
  }

  handleError(e) {
    console.error("App error:", e.error)
    this.showToast("Something went wrong. Please try again.", "error")
  }

  initializeToastSystem() {
    // Toast system is initialized in the global scope
  }

  initializeConfettiSystem() {
    // Add confetti styles if not already present
    if (!document.querySelector("#confetti-styles")) {
      const style = document.createElement("style")
      style.id = "confetti-styles"
      style.textContent = `
                @keyframes miniConfetti {
                    0% { 
                        transform: translateY(0) scale(1); 
                        opacity: 1; 
                    }
                    50% { 
                        transform: translateY(-50px) scale(1.2); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translateY(100px) scale(0.5); 
                        opacity: 0; 
                    }
                }
            `
      document.head.appendChild(style)
    }
  }

  showToast(message, type = "info") {
    const toast = document.getElementById("toast")
    if (toast) {
      toast.textContent = message
      toast.className = `toast show ${type}`

      setTimeout(() => {
        toast.classList.remove("show")
      }, 2500)
    }
  }
}

// Navigation Functions
function showSection(sectionId) {
  if (window.ecoLearnApp && window.ecoLearnApp.isAnimating) return

  if (window.ecoLearnApp) {
    window.ecoLearnApp.isAnimating = true
  }

  const sections = document.querySelectorAll(".section")
  const activeSection = document.querySelector(".section.active")

  if (activeSection) {
    activeSection.style.opacity = "0"
    activeSection.style.transform = "translateY(20px)"
  }

  // Update nav buttons
  const navButtons = document.querySelectorAll(".nav-btn")
  navButtons.forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  setTimeout(() => {
    sections.forEach((section) => section.classList.remove("active"))

    const targetSection = document.getElementById(sectionId)
    targetSection.classList.add("active")
    targetSection.style.opacity = "0"
    targetSection.style.transform = "translateY(20px)"

    setTimeout(() => {
      targetSection.style.opacity = "1"
      targetSection.style.transform = "translateY(0)"
      if (window.ecoLearnApp) {
        window.ecoLearnApp.isAnimating = false
      }
    }, 50)
  }, 300)
}

// Toast Notification System
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  if (!toast) return

  toast.textContent = message
  toast.className = `toast ${type}`
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

// Confetti Animation System
function createConfetti() {
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = Math.random() * window.innerWidth + "px"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s"

      document.body.appendChild(confetti)

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti)
        }
      }, 4000)
    }, i * 20)
  }
}

function createMiniConfetti() {
  const colors = ["#10b981", "#f59e0b"]

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div")
      confetti.style.position = "fixed"
      confetti.style.left = Math.random() * 200 + (window.innerWidth / 2 - 100) + "px"
      confetti.style.top = "200px"
      confetti.style.width = "6px"
      confetti.style.height = "6px"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.borderRadius = "50%"
      confetti.style.pointerEvents = "none"
      confetti.style.zIndex = "10000"
      confetti.style.animation = "miniConfetti 1s ease-out forwards"

      document.body.appendChild(confetti)

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti)
        }
      }, 1000)
    }, i * 50)
  }
}

// Initialize the main application
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    window.ecoLearnApp = new EcoLearnApp()
    window.closeLessonContent = () => {
      const lessonContent = document.getElementById("lesson-content")
      if (lessonContent) {
        lessonContent.style.display = "none"
      }
    }
    window.closeQuiz = () => {
      const quizArea = document.getElementById("quiz-area")
      if (quizArea) {
        quizArea.style.display = "none"
      }
    }
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = EcoLearnApp
}
