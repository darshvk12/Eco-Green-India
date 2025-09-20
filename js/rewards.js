// Eco-Shop Rewards Store System
class RewardsStore {
  constructor() {
    this.rewards = this.initializeRewards()
    this.userRewards = this.loadUserRewards()
    this.currentUser = null
    this.init()
  }

  init() {
    this.currentUser = window.currentUser || { points: 0 }
    this.renderRewardsStore()
  }

  initializeRewards() {
    return [
      // Digital Badges
      {
        id: "badge_eco_warrior",
        name: "Eco Warrior Badge",
        description: "Show off your environmental dedication with this exclusive digital badge",
        cost: 100,
        type: "badge",
        icon: "🌍",
        rarity: "common",
        category: "badges",
      },
      {
        id: "badge_water_guardian",
        name: "Water Guardian Badge",
        description: "Exclusive badge for water conservation champions",
        cost: 150,
        type: "badge",
        icon: "💧",
        rarity: "uncommon",
        category: "badges",
      },
      {
        id: "badge_carbon_neutral",
        name: "Carbon Neutral Badge",
        description: "Rare badge for those committed to carbon neutrality",
        cost: 300,
        type: "badge",
        icon: "🌿",
        rarity: "rare",
        category: "badges",
      },
      {
        id: "badge_planet_protector",
        name: "Planet Protector Badge",
        description: "Ultra-rare badge for true environmental heroes",
        cost: 500,
        type: "badge",
        icon: "🛡️",
        rarity: "legendary",
        category: "badges",
      },

      // Profile Themes
      {
        id: "theme_forest",
        name: "Forest Theme",
        description: "Transform your profile with a beautiful forest background",
        cost: 200,
        type: "theme",
        icon: "🌲",
        rarity: "common",
        category: "themes",
        preview: "linear-gradient(135deg, #2d5016 0%, #3e7b27 100%)",
      },
      {
        id: "theme_ocean",
        name: "Ocean Theme",
        description: "Dive into an oceanic profile experience",
        cost: 250,
        type: "theme",
        icon: "🌊",
        rarity: "uncommon",
        category: "themes",
        preview: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      },
      {
        id: "theme_sunset",
        name: "Sunset Theme",
        description: "Warm sunset colors for your profile",
        cost: 300,
        type: "theme",
        icon: "🌅",
        rarity: "rare",
        category: "themes",
        preview: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
      },
      {
        id: "theme_aurora",
        name: "Aurora Theme",
        description: "Mystical aurora borealis theme",
        cost: 400,
        type: "theme",
        icon: "🌌",
        rarity: "legendary",
        category: "themes",
        preview: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
      },

      // Avatar Accessories
      {
        id: "accessory_eco_hat",
        name: "Eco-Friendly Hat",
        description: "Stylish hat made from recycled materials",
        cost: 75,
        type: "accessory",
        icon: "🧢",
        rarity: "common",
        category: "accessories",
      },
      {
        id: "accessory_solar_glasses",
        name: "Solar-Powered Glasses",
        description: "Futuristic glasses powered by solar energy",
        cost: 125,
        type: "accessory",
        icon: "🕶️",
        rarity: "uncommon",
        category: "accessories",
      },
      {
        id: "accessory_leaf_crown",
        name: "Leaf Crown",
        description: "Majestic crown made of golden leaves",
        cost: 250,
        type: "accessory",
        icon: "👑",
        rarity: "rare",
        category: "accessories",
      },
      {
        id: "accessory_rainbow_aura",
        name: "Rainbow Aura",
        description: "Magical rainbow aura surrounding your avatar",
        cost: 400,
        type: "accessory",
        icon: "🌈",
        rarity: "legendary",
        category: "accessories",
      },

      // Special Items
      {
        id: "special_double_points",
        name: "2x Points Booster",
        description: "Double your eco-points for the next 24 hours",
        cost: 300,
        type: "booster",
        icon: "⚡",
        rarity: "rare",
        category: "boosters",
        duration: "24 hours",
      },
      {
        id: "special_streak_shield",
        name: "Streak Shield",
        description: "Protects your streak for one missed day",
        cost: 200,
        type: "protection",
        icon: "🛡️",
        rarity: "uncommon",
        category: "boosters",
      },
      {
        id: "special_mission_refresh",
        name: "Mission Refresh",
        description: "Get new daily missions if you don't like the current ones",
        cost: 100,
        type: "utility",
        icon: "🔄",
        rarity: "common",
        category: "boosters",
      },

      // Certificates
      {
        id: "cert_eco_champion",
        name: "Eco Champion Certificate",
        description: "Official certificate recognizing your environmental efforts",
        cost: 500,
        type: "certificate",
        icon: "📜",
        rarity: "legendary",
        category: "certificates",
      },
      {
        id: "cert_carbon_reducer",
        name: "Carbon Footprint Reducer Certificate",
        description: "Certificate for significant carbon footprint reduction",
        cost: 350,
        type: "certificate",
        icon: "📋",
        rarity: "rare",
        category: "certificates",
      },
    ]
  }

  loadUserRewards() {
    const saved = localStorage.getItem("ecolearn_user_rewards")
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      owned: [],
      equipped: {
        badge: null,
        theme: null,
        accessory: null,
      },
      activeBoosts: [],
    }
  }

  saveUserRewards() {
    localStorage.setItem("ecolearn_user_rewards", JSON.stringify(this.userRewards))
  }

  purchaseReward(rewardId) {
    const reward = this.rewards.find((r) => r.id === rewardId)
    if (!reward) {
      window.showToast("Reward not found!", "error")
      return
    }

    if (this.userRewards.owned.includes(rewardId)) {
      window.showToast("You already own this reward!", "warning")
      return
    }

    if (!this.currentUser || this.currentUser.points < reward.cost) {
      window.showToast("Not enough eco-points!", "error")
      return
    }

    // Deduct points
    this.currentUser.points -= reward.cost

    // Add to owned rewards
    this.userRewards.owned.push(rewardId)

    // Auto-equip if it's the first of its type
    if (reward.type === "badge" && !this.userRewards.equipped.badge) {
      this.userRewards.equipped.badge = rewardId
    } else if (reward.type === "theme" && !this.userRewards.equipped.theme) {
      this.userRewards.equipped.theme = rewardId
    } else if (reward.type === "accessory" && !this.userRewards.equipped.accessory) {
      this.userRewards.equipped.accessory = rewardId
    }

    // Handle special items
    if (reward.type === "booster" || reward.type === "protection" || reward.type === "utility") {
      this.activateSpecialItem(reward)
    }

    this.saveUserRewards()
    window.updateUserStats()
    this.renderRewardsStore()

    window.showToast(`${reward.name} purchased successfully!`, "success")
    window.createConfetti()
  }

  equipReward(rewardId) {
    const reward = this.rewards.find((r) => r.id === rewardId)
    if (!reward || !this.userRewards.owned.includes(rewardId)) {
      return
    }

    if (reward.type === "badge") {
      this.userRewards.equipped.badge = rewardId
    } else if (reward.type === "theme") {
      this.userRewards.equipped.theme = rewardId
    } else if (reward.type === "accessory") {
      this.userRewards.equipped.accessory = rewardId
    }

    this.saveUserRewards()
    this.renderRewardsStore()
    window.showToast(`${reward.name} equipped!`, "success")
  }

  unequipReward(type) {
    this.userRewards.equipped[type] = null
    this.saveUserRewards()
    this.renderRewardsStore()
    window.showToast("Item unequipped!", "success")
  }

  activateSpecialItem(reward) {
    const now = new Date()

    if (reward.id === "special_double_points") {
      this.userRewards.activeBoosts.push({
        type: "double_points",
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      })
      window.showToast("2x Points Booster activated for 24 hours!", "success")
    } else if (reward.id === "special_streak_shield") {
      this.userRewards.activeBoosts.push({
        type: "streak_shield",
        uses: 1,
      })
      window.showToast("Streak Shield activated!", "success")
    } else if (reward.id === "special_mission_refresh") {
      if (window.missionsManager) {
        window.missionsManager.dailyMissions = window.missionsManager.generateDailyMissions()
        window.missionsManager.saveDailyMissions()
        window.missionsManager.renderMissions()
      }
      window.showToast("Daily missions refreshed!", "success")
    }
  }

  getRarityColor(rarity) {
    const colors = {
      common: "var(--gray-500)",
      uncommon: "var(--primary)",
      rare: "var(--secondary)",
      legendary: "var(--accent-pink)",
    }
    return colors[rarity] || "var(--gray-500)"
  }

  getRarityBorder(rarity) {
    const colors = {
      common: "2px solid var(--gray-300)",
      uncommon: "2px solid var(--primary)",
      rare: "2px solid var(--secondary)",
      legendary: "3px solid var(--accent-pink)",
    }
    return colors[rarity] || "2px solid var(--gray-300)"
  }

  renderRewardsStore() {
    const container = document.getElementById("rewardsContent")
    if (!container) return

    const userPoints = this.currentUser ? this.currentUser.points : 0
    const ownedCount = this.userRewards.owned.length
    const totalRewards = this.rewards.length

    // Group rewards by category
    const categories = {
      badges: this.rewards.filter((r) => r.category === "badges"),
      themes: this.rewards.filter((r) => r.category === "themes"),
      accessories: this.rewards.filter((r) => r.category === "accessories"),
      boosters: this.rewards.filter((r) => r.category === "boosters"),
      certificates: this.rewards.filter((r) => r.category === "certificates"),
    }

    container.innerHTML = `
            <div class="card">
                <h2>Eco Rewards Store</h2>
                <p style="text-align: center; color: var(--gray-600); margin-bottom: var(--space-8);">
                    Spend your eco-points on exclusive digital rewards and customizations!
                </p>

                <!-- User Stats -->
                <div class="rewards-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
                    <div class="stat-card">
                        <div class="stat-number">${userPoints.toLocaleString()}</div>
                        <div class="stat-label">Available Points</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${ownedCount}/${totalRewards}</div>
                        <div class="stat-label">Rewards Owned</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.userRewards.activeBoosts.length}</div>
                        <div class="stat-label">Active Boosts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.round((ownedCount / totalRewards) * 100)}%</div>
                        <div class="stat-label">Collection Complete</div>
                    </div>
                </div>

                <!-- Currently Equipped -->
                ${this.renderEquippedItems()}

                <!-- Rewards Categories -->
                <div class="rewards-categories">
                    ${Object.entries(categories)
                      .map(([category, items]) => this.renderCategory(category, items))
                      .join("")}
                </div>
            </div>
        `
  }

  renderEquippedItems() {
    const equippedBadge = this.userRewards.equipped.badge
      ? this.rewards.find((r) => r.id === this.userRewards.equipped.badge)
      : null
    const equippedTheme = this.userRewards.equipped.theme
      ? this.rewards.find((r) => r.id === this.userRewards.equipped.theme)
      : null
    const equippedAccessory = this.userRewards.equipped.accessory
      ? this.rewards.find((r) => r.id === this.userRewards.equipped.accessory)
      : null

    return `
            <div class="equipped-section" style="background: var(--gray-50); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-8);">
                <h3 style="color: var(--gray-800); margin-bottom: var(--space-4); text-align: center;">Currently Equipped</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                    <div class="equipped-slot">
                        <h4 style="color: var(--gray-700); margin-bottom: var(--space-2);">Badge</h4>
                        ${
                          equippedBadge
                            ? `
                            <div class="equipped-item" style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: var(--white); border-radius: var(--radius); border: ${this.getRarityBorder(equippedBadge.rarity)};">
                                <span style="font-size: 1.5rem;">${equippedBadge.icon}</span>
                                <div>
                                    <div style="font-weight: 600; color: ${this.getRarityColor(equippedBadge.rarity)};">${equippedBadge.name}</div>
                                    <button onclick="window.rewardsStore.unequipReward('badge')" style="font-size: 0.75rem; color: var(--gray-500); background: none; border: none; cursor: pointer;">Unequip</button>
                                </div>
                            </div>
                        `
                            : '<div style="color: var(--gray-500); font-style: italic;">No badge equipped</div>'
                        }
                    </div>
                    
                    <div class="equipped-slot">
                        <h4 style="color: var(--gray-700); margin-bottom: var(--space-2);">Theme</h4>
                        ${
                          equippedTheme
                            ? `
                            <div class="equipped-item" style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: var(--white); border-radius: var(--radius); border: ${this.getRarityBorder(equippedTheme.rarity)};">
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: ${equippedTheme.preview};"></div>
                                <div>
                                    <div style="font-weight: 600; color: ${this.getRarityColor(equippedTheme.rarity)};">${equippedTheme.name}</div>
                                    <button onclick="window.rewardsStore.unequipReward('theme')" style="font-size: 0.75rem; color: var(--gray-500); background: none; border: none; cursor: pointer;">Unequip</button>
                                </div>
                            </div>
                        `
                            : '<div style="color: var(--gray-500); font-style: italic;">No theme equipped</div>'
                        }
                    </div>
                    
                    <div class="equipped-slot">
                        <h4 style="color: var(--gray-700); margin-bottom: var(--space-2);">Accessory</h4>
                        ${
                          equippedAccessory
                            ? `
                            <div class="equipped-item" style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: var(--white); border-radius: var(--radius); border: ${this.getRarityBorder(equippedAccessory.rarity)};">
                                <span style="font-size: 1.5rem;">${equippedAccessory.icon}</span>
                                <div>
                                    <div style="font-weight: 600; color: ${this.getRarityColor(equippedAccessory.rarity)};">${equippedAccessory.name}</div>
                                    <button onclick="window.rewardsStore.unequipReward('accessory')" style="font-size: 0.75rem; color: var(--gray-500); background: none; border: none; cursor: pointer;">Unequip</button>
                                </div>
                            </div>
                        `
                            : '<div style="color: var(--gray-500); font-style: italic;">No accessory equipped</div>'
                        }
                    </div>
                </div>
            </div>
        `
  }

  renderCategory(categoryName, items) {
    const categoryTitles = {
      badges: "Digital Badges",
      themes: "Profile Themes",
      accessories: "Avatar Accessories",
      boosters: "Power-ups & Boosters",
      certificates: "Certificates",
    }

    return `
            <div class="reward-category" style="margin-bottom: var(--space-8);">
                <h3 style="color: var(--gray-800); margin-bottom: var(--space-6); font-family: 'Poppins', sans-serif; text-align: center;">
                    ${categoryTitles[categoryName]}
                </h3>
                <div class="rewards-grid">
                    ${items.map((reward) => this.renderRewardItem(reward)).join("")}
                </div>
            </div>
        `
  }

  renderRewardItem(reward) {
    const isOwned = this.userRewards.owned.includes(reward.id)
    const isEquipped = Object.values(this.userRewards.equipped).includes(reward.id)
    const canAfford = this.currentUser && this.currentUser.points >= reward.cost

    let buttonText = "Purchase"
    let buttonClass = "btn-primary"
    let buttonAction = `window.rewardsStore.purchaseReward('${reward.id}')`
    let buttonDisabled = ""

    if (isOwned) {
      if (
        reward.type === "booster" ||
        reward.type === "protection" ||
        reward.type === "utility" ||
        reward.type === "certificate"
      ) {
        buttonText = "Owned ✓"
        buttonClass = "btn-secondary"
        buttonDisabled = "disabled"
      } else if (isEquipped) {
        buttonText = "Equipped ✓"
        buttonClass = "btn-secondary"
        buttonDisabled = "disabled"
      } else {
        buttonText = "Equip"
        buttonClass = "btn-primary"
        buttonAction = `window.rewardsStore.equipReward('${reward.id}')`
      }
    } else if (!canAfford) {
      buttonText = "Not Enough Points"
      buttonClass = "btn-secondary"
      buttonDisabled = "disabled"
    }

    return `
            <div class="reward-item ${isOwned ? "owned" : ""}" style="border: ${this.getRarityBorder(reward.rarity)};">
                <div class="reward-icon" style="font-size: 3rem; margin-bottom: var(--space-4);">
                    ${
                      reward.type === "theme"
                        ? `<div style="width: 60px; height: 60px; border-radius: 50%; background: ${reward.preview}; margin: 0 auto;"></div>`
                        : reward.icon
                    }
                </div>
                
                <div class="reward-name" style="color: ${this.getRarityColor(reward.rarity)};">
                    ${reward.name}
                </div>
                
                <div class="reward-rarity" style="font-size: 0.75rem; color: ${this.getRarityColor(reward.rarity)}; text-transform: uppercase; font-weight: 600; margin-bottom: var(--space-2);">
                    ${reward.rarity}
                </div>
                
                <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: var(--space-4); line-height: 1.4;">
                    ${reward.description}
                </p>
                
                <div class="reward-cost" style="font-size: 1.125rem; font-weight: 600; color: var(--primary); margin-bottom: var(--space-4);">
                    ${reward.cost} points
                </div>
                
                <button 
                    class="btn ${buttonClass}" 
                    onclick="${buttonAction}"
                    ${buttonDisabled}
                    style="width: 100%; ${buttonDisabled ? "cursor: not-allowed; opacity: 0.6;" : ""}"
                >
                    ${buttonText}
                </button>
                
                ${
                  reward.duration
                    ? `
                    <div style="margin-top: var(--space-2); font-size: 0.75rem; color: var(--gray-500);">
                        Duration: ${reward.duration}
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  getOwnedRewards() {
    return this.userRewards.owned.map((id) => this.rewards.find((r) => r.id === id)).filter(Boolean)
  }

  getEquippedRewards() {
    return {
      badge: this.userRewards.equipped.badge
        ? this.rewards.find((r) => r.id === this.userRewards.equipped.badge)
        : null,
      theme: this.userRewards.equipped.theme
        ? this.rewards.find((r) => r.id === this.userRewards.equipped.theme)
        : null,
      accessory: this.userRewards.equipped.accessory
        ? this.rewards.find((r) => r.id === this.userRewards.equipped.accessory)
        : null,
    }
  }
}

// Initialize rewards store when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.rewardsStore = new RewardsStore()
    }, 100)
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = RewardsStore
}
