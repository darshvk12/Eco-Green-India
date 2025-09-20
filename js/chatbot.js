// AI-Powered Eco Chatbot System
class EcoChatbot {
  constructor() {
    this.isOpen = false
    this.messages = []
    this.knowledgeBase = this.initializeKnowledgeBase()
    this.init()
  }

  init() {
    this.bindEvents()
    this.addWelcomeMessage()
  }

  bindEvents() {
    const toggleBtn = document.getElementById("chatbot-toggle")
    const closeBtn = document.getElementById("chatbot-close")
    const sendBtn = document.getElementById("chatbot-send")
    const input = document.getElementById("chatbot-input")

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggleChatbot())
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeChatbot())
    }

    if (sendBtn) {
      sendBtn.addEventListener("click", () => this.sendMessage())
    }

    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage()
        }
      })
    }
  }

  initializeKnowledgeBase() {
    return {
      greetings: [
        "Hello! I'm EcoBot, your environmental assistant. How can I help you make a positive impact today?",
        "Hi there! I'm here to help you with all your environmental questions. What would you like to know?",
        "Welcome! I'm EcoBot, ready to share eco-friendly tips and answer your environmental questions!",
      ],

      climateChange: [
        "Climate change is caused primarily by greenhouse gas emissions from human activities. You can help by reducing energy consumption, using renewable energy, and supporting sustainable practices.",
        "To combat climate change, try: using public transport, eating less meat, reducing energy consumption, and supporting renewable energy initiatives.",
        "Climate change affects weather patterns, sea levels, and ecosystems. Small daily actions like conserving energy and reducing waste can make a big difference!",
      ],

      waterConservation: [
        "Save water by taking shorter showers, fixing leaks promptly, using water-efficient appliances, and collecting rainwater for plants.",
        "Water conservation tips: Turn off taps while brushing teeth, use full loads in dishwashers/washing machines, and install low-flow fixtures.",
        "Every drop counts! Simple actions like using a broom instead of a hose to clean driveways can save hundreds of gallons of water.",
      ],

      wasteReduction: [
        "Follow the 5 R's: Refuse unnecessary items, Reduce consumption, Reuse items creatively, Recycle properly, and Rot (compost) organic waste.",
        "Reduce waste by buying only what you need, choosing products with minimal packaging, and repurposing items before throwing them away.",
        "Start composting organic waste, use reusable bags and containers, and donate items instead of throwing them away.",
      ],

      energy: [
        "Save energy by switching to LED bulbs, unplugging devices when not in use, using programmable thermostats, and choosing energy-efficient appliances.",
        "Renewable energy options include solar panels, wind power, and hydroelectric energy. Even small changes like air-drying clothes can help!",
        "Energy-saving tips: Use natural light when possible, seal air leaks in your home, and consider upgrading to ENERGY STAR appliances.",
      ],

      transportation: [
        "Eco-friendly transport options: walking, biking, public transit, carpooling, and electric vehicles. Even combining trips can reduce emissions!",
        "Transportation accounts for a large portion of emissions. Try walking or biking for short trips, and use public transport when possible.",
        "Consider electric or hybrid vehicles for your next car purchase, and maintain your current vehicle properly for better fuel efficiency.",
      ],

      gardening: [
        "Start with easy plants like herbs or vegetables. Use compost as fertilizer, collect rainwater for watering, and choose native plants.",
        "Gardening tips: Plant native species, avoid pesticides, create a compost bin, and attract beneficial insects with diverse plants.",
        "Even small spaces can have gardens! Try container gardening, vertical gardens, or join a community garden in your area.",
      ],

      general: [
        "Every small action counts! Start with one eco-friendly habit and gradually add more. Consistency is more important than perfection.",
        "The best way to help the environment is to start where you are, with what you have. Small daily choices create big impacts over time.",
        "Remember: Reduce, Reuse, Recycle, and Refuse unnecessary consumption. Share your knowledge with others to multiply your impact!",
      ],

      tips: [
        "💡 Tip: Unplug electronics when not in use - they can draw power even when turned off!",
        "🌱 Tip: Start a small herb garden on your windowsill - it's easy and reduces packaging waste!",
        "💧 Tip: A 5-minute shower uses about 25 gallons less water than a bath!",
        "♻️ Tip: Before throwing something away, ask yourself: Can this be repurposed or donated?",
        "🚲 Tip: Biking just 10 miles a week can save 500 pounds of CO2 emissions per year!",
        "🌍 Tip: Eating one less meat meal per week can save 1,900 pounds of CO2 annually!",
      ],
    }
  }

  addWelcomeMessage() {
    const welcomeMessage = this.getRandomResponse("greetings")
    this.messages.push({
      type: "bot",
      content: welcomeMessage,
      timestamp: new Date(),
    })
  }

  toggleChatbot() {
    const popup = document.getElementById("chatbot-popup")
    if (!popup) return

    this.isOpen = !this.isOpen

    if (this.isOpen) {
      popup.style.display = "flex"
      setTimeout(() => {
        popup.classList.add("show")
        this.renderMessages()
        this.scrollToBottom()
      }, 10)
    } else {
      this.closeChatbot()
    }
  }

  closeChatbot() {
    const popup = document.getElementById("chatbot-popup")
    if (!popup) return

    popup.classList.remove("show")
    setTimeout(() => {
      popup.style.display = "none"
      this.isOpen = false
    }, 300)
  }

  sendMessage() {
    const input = document.getElementById("chatbot-input")
    if (!input) return

    const message = input.value.trim()
    if (!message) return

    // Add user message
    this.messages.push({
      type: "user",
      content: message,
      timestamp: new Date(),
    })

    // Clear input
    input.value = ""

    // Generate bot response
    setTimeout(() => {
      const response = this.generateResponse(message)
      this.messages.push({
        type: "bot",
        content: response,
        timestamp: new Date(),
      })

      this.renderMessages()
      this.scrollToBottom()
    }, 500)

    this.renderMessages()
    this.scrollToBottom()
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase()

    // Check for specific topics
    if (message.includes("climate") || message.includes("global warming") || message.includes("greenhouse")) {
      return this.getRandomResponse("climateChange")
    }

    if (message.includes("water") || message.includes("shower") || message.includes("conservation")) {
      return this.getRandomResponse("waterConservation")
    }

    if (
      message.includes("waste") ||
      message.includes("recycle") ||
      message.includes("trash") ||
      message.includes("garbage")
    ) {
      return this.getRandomResponse("wasteReduction")
    }

    if (
      message.includes("energy") ||
      message.includes("electricity") ||
      message.includes("power") ||
      message.includes("solar")
    ) {
      return this.getRandomResponse("energy")
    }

    if (
      message.includes("transport") ||
      message.includes("car") ||
      message.includes("bike") ||
      message.includes("bus")
    ) {
      return this.getRandomResponse("transportation")
    }

    if (
      message.includes("garden") ||
      message.includes("plant") ||
      message.includes("grow") ||
      message.includes("compost")
    ) {
      return this.getRandomResponse("gardening")
    }

    if (message.includes("tip") || message.includes("advice") || message.includes("help")) {
      return this.getRandomResponse("tips")
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return this.getRandomResponse("greetings")
    }

    // Default response with a tip
    const generalResponse = this.getRandomResponse("general")
    const tip = this.getRandomResponse("tips")
    return `${generalResponse}\n\n${tip}`
  }

  getRandomResponse(category) {
    const responses = this.knowledgeBase[category]
    if (!responses || responses.length === 0) {
      return "I'm here to help with environmental questions! Ask me about climate change, water conservation, waste reduction, energy saving, or gardening."
    }
    return responses[Math.floor(Math.random() * responses.length)]
  }

  renderMessages() {
    const container = document.getElementById("chatbot-messages")
    if (!container) return

    container.innerHTML = this.messages
      .map(
        (message) => `
            <div class="chatbot-message ${message.type}">
                ${message.content}
            </div>
        `,
      )
      .join("")
  }

  scrollToBottom() {
    const container = document.getElementById("chatbot-messages")
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  addQuickReplies() {
    // Future enhancement: add quick reply buttons
    const quickReplies = ["Water saving tips", "Energy conservation", "Waste reduction", "Climate change help"]
    return quickReplies
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    window.ecoChatbot = new EcoChatbot()
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = EcoChatbot
}
