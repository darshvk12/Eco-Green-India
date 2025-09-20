// Daily Eco Missions & Streaks System
class MissionsManager {
  constructor() {
    this.missions = [
      {
        id: "lights_off",
        title: "Turn Off Unused Lights",
        description: "Turn off lights in rooms you're not using for at least 2 hours today.",
        points: 25,
        category: "energy",
        icon: "💡",
        difficulty: "easy",
      },
      {
        id: "water_save",
        title: "Take a Shorter Shower",
        description: "Reduce your shower time by 2 minutes today to save water.",
        points: 30,
        category: "water",
        icon: "🚿",
        difficulty: "easy",
      },
      {
        id: "recycle_item",
        title: "Recycle Something",
        description: "Find one item to recycle properly instead of throwing it in the trash.",
        points: 20,
        category: "waste",
        icon: "♻️",
        difficulty: "easy",
      },
      {
        id: "walk_bike",
        title: "Walk or Bike Instead",
        description: "Choose walking or biking over driving for one trip today.",
        points: 40,
        category: "transport",
        icon: "🚶",
        difficulty: "medium",
      },
      {
        id: "reusable_bag",
        title: "Use a Reusable Bag",
        description: "Bring your own reusable bag when shopping today.",
        points: 15,
        category: "waste",
        icon: "🛍️",
        difficulty: "easy",
      },
      {
        id: "plant_care",
        title: "Care for a Plant",
        description: "Water a plant or tend to your garden for 10 minutes.",
        points: 25,
        category: "nature",
        icon: "🌱",
        difficulty: "easy",
      },
      {
        id: "unplug_devices",
        title: "Unplug Unused Electronics",
        description: "Unplug chargers and electronics not in use to save energy.",
        points: 20,
        category: "energy",
        icon: "🔌",
        difficulty: "easy",
      },
      {
        id: "eco_research",
        title: "Learn Something New",
        description: "Read an article or watch a video about environmental conservation.",
        points: 35,
        category: "education",
        icon: "📚",
        difficulty: "medium",
      },
      {
        id: "food_waste",
        title: "Reduce Food Waste",
        description: "Plan your meals to avoid throwing away food today.",
        points: 30,
        category: "waste",
        icon: "🍽️",
        difficulty: "medium",
      },
      {
        id: "nature_time",
        title: "Spend Time in Nature",
        description: "Spend at least 15 minutes outdoors appreciating nature.",
        points: 25,
        category: "nature",
        icon: "🌳",
        difficulty: "easy",
      },
    ]

    this.streakData = this.loadStreakData()
    this.dailyMissions = this.loadDailyMissions()
    this.init()
  }

  init() {
    this.checkNewDay()
    this.renderMissions()
    this.updateStreakDisplay()
  }

  loadStreakData() {
    const saved = localStorage.getItem("ecolearn_streak")
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalDays: 0,
    }
  }

  saveStreakData() {
    localStorage.setItem("ecolearn_streak", JSON.stringify(this.streakData))
  }

  loadDailyMissions() {
    const saved = localStorage.getItem("ecolearn_daily_missions")
    const today = new Date().toDateString()

    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today) {
        return data.missions
      }
    }

    // Generate new daily missions
    return this.generateDailyMissions()
  }

  saveDailyMissions() {
    const today = new Date().toDateString()
    const data = {
      date: today,
      missions: this.dailyMissions,
    }
    localStorage.setItem("ecolearn_daily_missions", JSON.stringify(data))
  }

  generateDailyMissions() {
    // Select 3 random missions for the day
    const shuffled = [...this.missions].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)

    return selected.map((mission) => ({
      ...mission,
      completed: false,
      completedAt: null,
    }))
  }

  checkNewDay() {
    const today = new Date().toDateString()
    const lastActiveDate = this.streakData.lastActiveDate

    if (lastActiveDate !== today) {
      // Check if streak should continue or reset
      if (lastActiveDate) {
        const lastDate = new Date(lastActiveDate)
        const currentDate = new Date(today)
        const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24))

        if (daysDiff > 1) {
          // Streak broken
          this.streakData.currentStreak = 0
          window.showToast("Your streak was reset. Start a new one today!", "warning")
        }
      }

      // Generate new missions for the new day
      this.dailyMissions = this.generateDailyMissions()
      this.saveDailyMissions()
    }
  }

  completeMission(missionId) {
    const mission = this.dailyMissions.find((m) => m.id === missionId)
    if (!mission || mission.completed) return

    mission.completed = true
    mission.completedAt = new Date().toISOString()

    // Award points
    if (window.currentUser) {
      window.currentUser.points += mission.points
      window.updateUserStats()
    }

    // Check if all missions completed for streak
    const allCompleted = this.dailyMissions.every((m) => m.completed)
    if (allCompleted) {
      this.updateStreak()
    }

    this.saveDailyMissions()
    this.renderMissions()
    this.updateStreakDisplay()

    // Show success message
    window.showToast(`Mission completed! +${mission.points} eco-points earned!`, "success")
    window.createMiniConfetti()

    // Special message for completing all missions
    if (allCompleted) {
      setTimeout(() => {
        window.showToast("All daily missions completed! Streak updated!", "success")
        window.createConfetti()
      }, 1000)
    }
  }

  updateStreak() {
    const today = new Date().toDateString()
    const lastActiveDate = this.streakData.lastActiveDate

    if (lastActiveDate !== today) {
      this.streakData.currentStreak += 1
      this.streakData.totalDays += 1
      this.streakData.lastActiveDate = today

      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak
      }

      this.saveStreakData()

      // Update dashboard streak display
      const streakElement = document.getElementById("userStreak")
      if (streakElement) {
        streakElement.textContent = this.streakData.currentStreak
      }
    }
  }

  updateStreakDisplay() {
    const streakElement = document.getElementById("userStreak")
    if (streakElement) {
      streakElement.textContent = this.streakData.currentStreak
    }
  }

  renderMissions() {
    const container = document.getElementById("missionsContent")
    if (!container) return

    const completedCount = this.dailyMissions.filter((m) => m.completed).length
    const totalPoints = this.dailyMissions.reduce((sum, m) => sum + (m.completed ? m.points : 0), 0)

    container.innerHTML = `
            <div class="card">
                <h2>Daily Eco Missions</h2>
                
                <div class="streak-display">
                    <div class="streak-number">${this.streakData.currentStreak}</div>
                    <div class="streak-label">Day Streak</div>
                    <p style="margin-top: var(--space-2); opacity: 0.8; font-size: 0.875rem;">
                        Complete all daily missions to maintain your streak!
                    </p>
                </div>

                <div class="missions-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
                    <div class="stat-card">
                        <div class="stat-number">${completedCount}/3</div>
                        <div class="stat-label">Completed Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalPoints}</div>
                        <div class="stat-label">Points Earned</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.streakData.longestStreak}</div>
                        <div class="stat-label">Best Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.streakData.totalDays}</div>
                        <div class="stat-label">Total Active Days</div>
                    </div>
                </div>

                <div class="missions-list">
                    ${this.dailyMissions.map((mission) => this.renderMissionCard(mission)).join("")}
                </div>

                <div style="text-align: center; margin-top: var(--space-8); padding: var(--space-6); background: var(--gray-50); border-radius: var(--radius-lg);">
                    <h3 style="color: var(--gray-800); margin-bottom: var(--space-3);">💡 Mission Tips</h3>
                    <p style="color: var(--gray-600); line-height: 1.6;">
                        Complete all three missions each day to maintain your streak. Small daily actions create lasting environmental impact!
                    </p>
                </div>
            </div>
        `
  }

  renderMissionCard(mission) {
    const completedClass = mission.completed ? "completed" : ""
    const buttonText = mission.completed ? "Completed ✓" : "Mark Complete"
    const buttonDisabled = mission.completed ? "disabled" : ""

    return `
            <div class="mission-card ${completedClass}">
                <div class="mission-header">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <span style="font-size: 2rem;">${mission.icon}</span>
                        <div>
                            <h3 class="mission-title">${mission.title}</h3>
                            <span class="mission-points">+${mission.points} points</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--space-2);">
                        <span class="difficulty-badge difficulty-${mission.difficulty}">${mission.difficulty}</span>
                        ${mission.completed ? '<span style="color: var(--success); font-size: 1.5rem;">✓</span>' : ""}
                    </div>
                </div>
                
                <p class="mission-description">${mission.description}</p>
                
                <div style="margin-top: var(--space-4);">
                    <button 
                        class="btn ${mission.completed ? "btn-secondary" : "btn-primary"}" 
                        onclick="window.missionsManager.completeMission('${mission.id}')"
                        ${buttonDisabled}
                        style="${mission.completed ? "cursor: not-allowed; opacity: 0.7;" : ""}"
                    >
                        ${buttonText}
                    </button>
                </div>
                
                ${
                  mission.completed
                    ? `
                    <div style="margin-top: var(--space-3); font-size: 0.75rem; color: var(--gray-500);">
                        Completed at ${new Date(mission.completedAt).toLocaleTimeString()}
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  getMissionStats() {
    return {
      currentStreak: this.streakData.currentStreak,
      longestStreak: this.streakData.longestStreak,
      totalDays: this.streakData.totalDays,
      todayCompleted: this.dailyMissions.filter((m) => m.completed).length,
      todayTotal: this.dailyMissions.length,
    }
  }
}

// Add difficulty badge styles
const missionStyles = document.createElement("style")
missionStyles.textContent = `
    .difficulty-badge {
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .difficulty-easy {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .difficulty-medium {
        background: rgba(251, 191, 36, 0.1);
        color: var(--warning);
    }
    
    .difficulty-hard {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
    }
`
document.head.appendChild(missionStyles)

// Initialize missions manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    window.missionsManager = new MissionsManager()
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = MissionsManager
}

// Declare showToast, updateUserStats, createMiniConfetti, and createConfetti functions
window.showToast = (message, type) => {
  console.log(`Toast: ${message} (${type})`)
}

window.updateUserStats = () => {
  console.log("User stats updated")
}

window.createMiniConfetti = () => {
  console.log("Mini confetti created")
}

window.createConfetti = () => {
  console.log("Confetti created")
}
