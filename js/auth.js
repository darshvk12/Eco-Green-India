// Authentication System
class AuthManager {
  constructor() {
    this.currentUser = {
      name: "",
      email: "",
      points: 1250,
      level: 5,
      badges: 8,
      completedLessons: 12,
      quizzesTaken: 15,
      challengesCompleted: 3,
      daysActive: 45,
    }

    this.isLoggedIn = false
    this.isSignUp = false

    this.init()
  }

  init() {
    this.bindEvents()
    this.checkExistingUser()
  }

  bindEvents() {
    const authForm = document.getElementById("authForm")
    const authSwitchBtn = document.getElementById("authSwitchBtn")

    if (authForm) {
      authForm.addEventListener("submit", (e) => this.handleAuth(e))
    }

    if (authSwitchBtn) {
      authSwitchBtn.addEventListener("click", () => this.toggleAuthMode())
    }
  }

  toggleAuthMode() {
    this.isSignUp = !this.isSignUp

    const authTitle = document.getElementById("authTitle")
    const authSubtitle = document.getElementById("authSubtitle")
    const authSubmit = document.getElementById("authSubmit")
    const authSwitchText = document.getElementById("authSwitchText")
    const nameGroup = document.getElementById("nameGroup")

    if (this.isSignUp) {
      authTitle.textContent = "Create Account"
      authSubtitle.textContent = "Join EcoLearn and start your environmental journey"
      authSubmit.textContent = "Sign Up"
      authSwitchText.innerHTML = 'Already have an account? <button type="button" id="authSwitchBtn">Sign in</button>'
      nameGroup.style.display = "block"
    } else {
      authTitle.textContent = "Welcome Back"
      authSubtitle.textContent = "Sign in to continue your environmental journey"
      authSubmit.textContent = "Sign In"
      authSwitchText.innerHTML = 'Don\'t have an account? <button type="button" id="authSwitchBtn">Sign up</button>'
      nameGroup.style.display = "none"
    }

    // Re-attach event listener
    document.getElementById("authSwitchBtn").addEventListener("click", () => this.toggleAuthMode())
  }

  handleAuth(e) {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const name = document.getElementById("name").value

    if (this.isSignUp && !name.trim()) {
      window.showToast("Please enter your full name", "error")
      return
    }

    if (!email.trim() || !password.trim()) {
      window.showToast("Please fill in all fields", "error")
      return
    }

    // Simulate authentication
    this.currentUser.name = name || email.split("@")[0]
    this.currentUser.email = email

    // Store user data
    localStorage.setItem("ecolearn_user", JSON.stringify(this.currentUser))

    // Show success and login
    window.showToast(this.isSignUp ? "Account created successfully!" : "Welcome back!", "success")

    setTimeout(() => {
      this.login()
    }, 1000)
  }

  login() {
    this.isLoggedIn = true
    const authModal = document.getElementById("authModal")
    const mainApp = document.getElementById("mainApp")

    if (authModal) authModal.style.display = "none"
    if (mainApp) mainApp.style.display = "block"

    // Update UI with user data
    this.updateUserInterface()

    // Show welcome message
    setTimeout(() => {
      window.showToast(`Welcome ${this.currentUser.name}! Ready to make an environmental impact?`, "success")
    }, 500)

    // Make current user globally available
    window.currentUser = this.currentUser
  }

  logout() {
    this.isLoggedIn = false
    localStorage.removeItem("ecolearn_user")

    const authModal = document.getElementById("authModal")
    const mainApp = document.getElementById("mainApp")

    if (authModal) authModal.style.display = "flex"
    if (mainApp) mainApp.style.display = "none"

    // Reset form
    const authForm = document.getElementById("authForm")
    if (authForm) authForm.reset()

    this.isSignUp = false
    this.toggleAuthMode()

    window.showToast("You have been signed out", "success")

    // Clear global user reference
    window.currentUser = null
  }

  updateUserInterface() {
    const elements = {
      welcomeUser: document.getElementById("welcomeUser"),
      profileName: document.getElementById("profileName"),
      currentUserName: document.getElementById("currentUserName"),
      userPoints: document.getElementById("userPoints"),
      leaderboardPoints: document.getElementById("leaderboardPoints"),
    }

    if (elements.welcomeUser) {
      elements.welcomeUser.textContent = `Welcome back, ${this.currentUser.name}!`
    }
    if (elements.profileName) {
      elements.profileName.textContent = this.currentUser.name
    }
    if (elements.currentUserName) {
      elements.currentUserName.textContent = this.currentUser.name
    }
    if (elements.userPoints) {
      elements.userPoints.textContent = this.currentUser.points.toLocaleString()
    }
    if (elements.leaderboardPoints) {
      elements.leaderboardPoints.textContent = this.currentUser.points.toLocaleString()
    }
  }

  checkExistingUser() {
    const savedUser = localStorage.getItem("ecolearn_user")
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser)
      this.login()
    }
  }

  getCurrentUser() {
    return this.currentUser
  }

  updateUserPoints(points) {
    this.currentUser.points += points
    this.saveUserData()
    this.updateUserInterface()
  }

  saveUserData() {
    if (this.isLoggedIn) {
      localStorage.setItem("ecolearn_user", JSON.stringify(this.currentUser))
    }
  }
}

// Global logout function
function logout() {
  if (window.authManager) {
    window.authManager.logout()
  }
}

// Global function to update user stats
function updateUserStats() {
  if (window.authManager) {
    window.authManager.updateUserInterface()
    window.authManager.saveUserData()

    // Update level based on points
    const newLevel = Math.floor(window.authManager.currentUser.points / 200) + 1
    if (newLevel !== window.authManager.currentUser.level) {
      window.authManager.currentUser.level = newLevel
      window.showToast(`🎉 Level Up! You're now Level ${newLevel}!`, "success")
      window.createConfetti()
    }
  }
}

// Initialize auth manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    window.authManager = new AuthManager()
  }
})

// Declare showToast and createConfetti functions globally
window.showToast = (message, type) => {
  console.log(`Toast: ${message} (${type})`)
}

window.createConfetti = () => {
  console.log("Confetti created!")
}
