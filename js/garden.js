// Virtual Garden / Tree Planting System
class VirtualGarden {
  constructor() {
    this.garden = this.loadGarden()
    this.treeTypes = this.initializeTreeTypes()
    this.currentUser = null
    this.init()
  }

  init() {
    this.currentUser = window.currentUser || { points: 0 }
    this.renderGarden()
  }

  initializeTreeTypes() {
    return [
      { id: "sapling", icon: "🌱", name: "Sapling", stage: 0, description: "A tiny sprout beginning its journey" },
      {
        id: "young_tree",
        icon: "🌿",
        name: "Young Tree",
        stage: 1,
        description: "Growing strong with fresh green leaves",
      },
      {
        id: "oak_tree",
        icon: "🌳",
        name: "Oak Tree",
        stage: 2,
        description: "A mighty oak providing shade and oxygen",
      },
      {
        id: "fruit_tree",
        icon: "🍎",
        name: "Fruit Tree",
        stage: 3,
        description: "Bearing delicious fruits for all to enjoy",
      },
      {
        id: "pine_tree",
        icon: "🌲",
        name: "Pine Tree",
        stage: 2,
        description: "An evergreen standing tall through seasons",
      },
      {
        id: "palm_tree",
        icon: "🌴",
        name: "Palm Tree",
        stage: 2,
        description: "A tropical beauty swaying in the breeze",
      },
      {
        id: "cherry_blossom",
        icon: "🌸",
        name: "Cherry Blossom",
        stage: 3,
        description: "Beautiful pink flowers bringing joy",
      },
      { id: "bamboo", icon: "🎋", name: "Bamboo", stage: 1, description: "Fast-growing and sustainable" },
      { id: "cactus", icon: "🌵", name: "Desert Cactus", stage: 1, description: "Thriving in harsh conditions" },
      { id: "sunflower", icon: "🌻", name: "Sunflower", stage: 2, description: "Always facing the sun with optimism" },
    ]
  }

  loadGarden() {
    const saved = localStorage.getItem("ecolearn_virtual_garden")
    if (saved) {
      return JSON.parse(saved)
    }

    return {
      trees: [],
      totalTreesPlanted: 0,
      gardenLevel: 1,
      co2Absorbed: 0,
      oxygenProduced: 0,
      biodiversityScore: 0,
      lastWatered: null,
      achievements: [],
    }
  }

  saveGarden() {
    localStorage.setItem("ecolearn_virtual_garden", JSON.stringify(this.garden))
  }

  plantTree(activityType = "lesson") {
    const activityRewards = {
      lesson: { points: 50, treeChance: 0.8 },
      quiz: { points: 30, treeChance: 0.6 },
      challenge: { points: 100, treeChance: 1.0 },
      mission: { points: 25, treeChance: 0.4 },
    }

    const reward = activityRewards[activityType] || activityRewards.lesson

    // Check if user should get a tree
    if (Math.random() > reward.treeChance) {
      return false // No tree this time
    }

    // Select random tree type based on garden level and diversity
    const availableTrees = this.getAvailableTreeTypes()
    const selectedTree = availableTrees[Math.floor(Math.random() * availableTrees.length)]

    const newTree = {
      id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: selectedTree.id,
      icon: selectedTree.icon,
      name: selectedTree.name,
      stage: selectedTree.stage,
      plantedAt: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      health: 100,
      growth: 0,
      position: this.getRandomPosition(),
    }

    this.garden.trees.push(newTree)
    this.garden.totalTreesPlanted++

    // Update garden stats
    this.updateGardenStats()

    // Check for achievements
    this.checkAchievements()

    this.saveGarden()
    this.renderGarden()

    // Show success message
    window.showToast(`🌱 New ${selectedTree.name} planted in your garden!`, "success")
    window.createConfetti()

    return true
  }

  getAvailableTreeTypes() {
    // Return different trees based on garden level and existing diversity
    const level = this.garden.gardenLevel
    let available = this.treeTypes.filter((tree) => tree.stage <= level)

    // Ensure at least basic trees are available
    if (available.length === 0) {
      available = this.treeTypes.filter((tree) => tree.stage <= 1)
    }

    return available
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * 8) + 1, // 1-8 grid positions
      y: Math.floor(Math.random() * 6) + 1, // 1-6 grid positions
    }
  }

  waterTree(treeId) {
    const tree = this.garden.trees.find((t) => t.id === treeId)
    if (!tree) return

    const now = new Date()
    const lastWatered = new Date(tree.lastWatered)
    const hoursSinceWatered = (now - lastWatered) / (1000 * 60 * 60)

    if (hoursSinceWatered < 6) {
      window.showToast("This tree was watered recently!", "warning")
      return
    }

    tree.lastWatered = now.toISOString()
    tree.health = Math.min(100, tree.health + 10)
    tree.growth = Math.min(100, tree.growth + 5)

    // Award points for caring
    if (this.currentUser) {
      this.currentUser.points += 5
      window.updateUserStats()
    }

    this.saveGarden()
    this.renderGarden()

    window.showToast(`${tree.name} watered! +5 eco-points`, "success")
    window.createMiniConfetti()
  }

  removeTree(treeId) {
    const treeIndex = this.garden.trees.findIndex((t) => t.id === treeId)
    if (treeIndex === -1) return

    const tree = this.garden.trees[treeIndex]

    // Confirm removal
    if (confirm(`Are you sure you want to remove this ${tree.name}?`)) {
      this.garden.trees.splice(treeIndex, 1)
      this.updateGardenStats()
      this.saveGarden()
      this.renderGarden()

      window.showToast(`${tree.name} removed from garden`, "success")
    }
  }

  updateGardenStats() {
    const treeCount = this.garden.trees.length

    // Calculate CO2 absorption (rough estimate: 48 lbs per tree per year)
    this.garden.co2Absorbed = Math.round(treeCount * 48 * 0.1) // Scaled down for demo

    // Calculate oxygen production (rough estimate: 260 lbs per tree per year)
    this.garden.oxygenProduced = Math.round(treeCount * 260 * 0.1) // Scaled down for demo

    // Calculate biodiversity score based on tree variety
    const uniqueTypes = new Set(this.garden.trees.map((t) => t.type))
    this.garden.biodiversityScore = Math.min(100, uniqueTypes.size * 10)

    // Update garden level based on total trees
    const newLevel = Math.floor(treeCount / 5) + 1
    if (newLevel > this.garden.gardenLevel) {
      this.garden.gardenLevel = newLevel
      window.showToast(`Garden level up! Now level ${newLevel}!`, "success")
      window.createConfetti()
    }
  }

  checkAchievements() {
    const achievements = [
      { id: "first_tree", name: "First Sprout", description: "Plant your first tree", requirement: 1 },
      { id: "small_forest", name: "Small Forest", description: "Plant 10 trees", requirement: 10 },
      { id: "tree_hugger", name: "Tree Hugger", description: "Plant 25 trees", requirement: 25 },
      { id: "forest_guardian", name: "Forest Guardian", description: "Plant 50 trees", requirement: 50 },
      { id: "nature_master", name: "Nature Master", description: "Plant 100 trees", requirement: 100 },
    ]

    achievements.forEach((achievement) => {
      if (
        this.garden.totalTreesPlanted >= achievement.requirement &&
        !this.garden.achievements.includes(achievement.id)
      ) {
        this.garden.achievements.push(achievement.id)

        // Award bonus points
        if (this.currentUser) {
          this.currentUser.points += achievement.requirement * 2
          window.updateUserStats()
        }

        window.showToast(`Achievement unlocked: ${achievement.name}!`, "success")
        window.createConfetti()
      }
    })
  }

  getTreeHealth(tree) {
    const now = new Date()
    const lastWatered = new Date(tree.lastWatered)
    const hoursSinceWatered = (now - lastWatered) / (1000 * 60 * 60)

    // Decrease health over time if not watered
    let health = tree.health
    if (hoursSinceWatered > 24) {
      health = Math.max(0, health - Math.floor(hoursSinceWatered / 24) * 5)
    }

    return health
  }

  getHealthColor(health) {
    if (health >= 80) return "var(--success)"
    if (health >= 50) return "var(--warning)"
    return "var(--error)"
  }

  renderGarden() {
    const container = document.getElementById("gardenContent")
    if (!container) return

    const treeCount = this.garden.trees.length
    const healthyTrees = this.garden.trees.filter((t) => this.getTreeHealth(t) >= 70).length
    const uniqueSpecies = new Set(this.garden.trees.map((t) => t.type)).size

    container.innerHTML = `
            <div class="card">
                <h2>Your Virtual Garden</h2>
                <p style="text-align: center; color: var(--gray-600); margin-bottom: var(--space-8);">
                    Every completed lesson, quiz, and challenge helps your garden grow! 🌱
                </p>

                <!-- Garden Stats -->
                <div class="garden-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
                    <div class="stat-card">
                        <div class="stat-number">${treeCount}</div>
                        <div class="stat-label">Trees Planted</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">Level ${this.garden.gardenLevel}</div>
                        <div class="stat-label">Garden Level</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.garden.co2Absorbed} lbs</div>
                        <div class="stat-label">CO₂ Absorbed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${uniqueSpecies}</div>
                        <div class="stat-label">Species Variety</div>
                    </div>
                </div>

                <!-- Environmental Impact -->
                <div class="impact-display" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: var(--white); padding: var(--space-8); border-radius: var(--radius-xl); margin-bottom: var(--space-8); text-align: center;">
                    <h3 style="margin-bottom: var(--space-4); font-family: 'Poppins', sans-serif;">🌍 Your Environmental Impact</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--space-4);">
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${this.garden.oxygenProduced} lbs</div>
                            <div style="font-size: 0.875rem; opacity: 0.9;">Oxygen Produced</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${healthyTrees}/${treeCount}</div>
                            <div style="font-size: 0.875rem; opacity: 0.9;">Healthy Trees</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${this.garden.biodiversityScore}%</div>
                            <div style="font-size: 0.875rem; opacity: 0.9;">Biodiversity</div>
                        </div>
                    </div>
                </div>

                <!-- Garden Visualization -->
                <div class="garden-container">
                    <h3 style="text-align: center; margin-bottom: var(--space-6); color: var(--gray-800);">Your Growing Forest</h3>
                    
                    ${
                      treeCount === 0
                        ? `
                        <div style="text-align: center; padding: var(--space-12); color: var(--gray-500);">
                            <div style="font-size: 4rem; margin-bottom: var(--space-4);">🌱</div>
                            <h3 style="margin-bottom: var(--space-2);">Your garden is waiting!</h3>
                            <p>Complete lessons, quizzes, and challenges to plant your first tree.</p>
                        </div>
                    `
                        : `
                        <div class="tree-grid">
                            ${this.garden.trees.map((tree) => this.renderTree(tree)).join("")}
                        </div>
                    `
                    }
                </div>

                <!-- Garden Actions -->
                <div style="text-align: center; margin-top: var(--space-8); padding: var(--space-6); background: var(--gray-50); border-radius: var(--radius-lg);">
                    <h3 style="color: var(--gray-800); margin-bottom: var(--space-4);">🌿 How to Grow Your Garden</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); text-align: left;">
                        <div style="padding: var(--space-4); background: var(--white); border-radius: var(--radius); border-left: 4px solid var(--primary);">
                            <h4 style="color: var(--primary); margin-bottom: var(--space-2);">📚 Complete Lessons</h4>
                            <p style="color: var(--gray-600); font-size: 0.875rem;">80% chance to plant a tree</p>
                        </div>
                        <div style="padding: var(--space-4); background: var(--white); border-radius: var(--radius); border-left: 4px solid var(--secondary);">
                            <h4 style="color: var(--secondary); margin-bottom: var(--space-2);">🧠 Take Quizzes</h4>
                            <p style="color: var(--gray-600); font-size: 0.875rem;">60% chance to plant a tree</p>
                        </div>
                        <div style="padding: var(--space-4); background: var(--white); border-radius: var(--radius); border-left: 4px solid var(--accent-orange);">
                            <h4 style="color: var(--accent-orange); margin-bottom: var(--space-2);">🎯 Complete Challenges</h4>
                            <p style="color: var(--gray-600); font-size: 0.875rem;">100% chance to plant a tree</p>
                        </div>
                        <div style="padding: var(--space-4); background: var(--white); border-radius: var(--radius); border-left: 4px solid var(--accent-yellow);">
                            <h4 style="color: var(--accent-yellow); margin-bottom: var(--space-2);">✅ Daily Missions</h4>
                            <p style="color: var(--gray-600); font-size: 0.875rem;">40% chance to plant a tree</p>
                        </div>
                    </div>
                </div>

                <!-- Achievements -->
                ${this.renderAchievements()}
            </div>
        `
  }

  renderTree(tree) {
    const health = this.getTreeHealth(tree)
    const healthColor = this.getHealthColor(health)
    const needsWater = health < 70

    return `
            <div class="tree ${needsWater ? "needs-water" : ""}" 
                 title="${tree.name} - Health: ${health}%" 
                 onclick="window.virtualGarden.showTreeDetails('${tree.id}')">
                <div class="tree-icon" style="font-size: 2.5rem; filter: ${health < 30 ? "grayscale(50%)" : "none"};">
                    ${tree.icon}
                </div>
                <div class="tree-health" style="width: 100%; height: 4px; background: var(--gray-200); border-radius: 2px; margin-top: var(--space-1);">
                    <div style="width: ${health}%; height: 100%; background: ${healthColor}; border-radius: 2px; transition: width 0.3s ease;"></div>
                </div>
                ${needsWater ? '<div style="font-size: 0.75rem; color: var(--warning); margin-top: var(--space-1);">💧 Needs water</div>' : ""}
            </div>
        `
  }

  showTreeDetails(treeId) {
    const tree = this.garden.trees.find((t) => t.id === treeId)
    if (!tree) return

    const health = this.getTreeHealth(tree)
    const plantedDate = new Date(tree.plantedAt).toLocaleDateString()
    const lastWateredDate = new Date(tree.lastWatered).toLocaleDateString()

    const modal = document.createElement("div")
    modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 1000; backdrop-filter: blur(4px);
        `

    modal.innerHTML = `
            <div style="background: var(--white); padding: var(--space-8); border-radius: var(--radius-xl); max-width: 400px; width: 90%; box-shadow: var(--shadow-xl);">
                <div style="text-align: center; margin-bottom: var(--space-6);">
                    <div style="font-size: 4rem; margin-bottom: var(--space-4);">${tree.icon}</div>
                    <h3 style="color: var(--gray-900); margin-bottom: var(--space-2);">${tree.name}</h3>
                    <div style="color: ${this.getHealthColor(health)}; font-weight: 600;">Health: ${health}%</div>
                </div>
                
                <div style="margin-bottom: var(--space-6);">
                    <div style="margin-bottom: var(--space-3);"><strong>Planted:</strong> ${plantedDate}</div>
                    <div style="margin-bottom: var(--space-3);"><strong>Last Watered:</strong> ${lastWateredDate}</div>
                    <div style="margin-bottom: var(--space-3);"><strong>Growth:</strong> ${tree.growth}%</div>
                </div>
                
                <div style="display: flex; gap: var(--space-3); justify-content: center;">
                    <button class="btn btn-primary" onclick="window.virtualGarden.waterTree('${tree.id}'); document.body.removeChild(this.closest('div').parentElement);">
                        💧 Water Tree (+5 points)
                    </button>
                    <button class="btn btn-secondary" onclick="document.body.removeChild(this.closest('div').parentElement);">
                        Close
                    </button>
                </div>
                
                <div style="text-align: center; margin-top: var(--space-4);">
                    <button style="color: var(--error); background: none; border: none; font-size: 0.875rem; cursor: pointer;" 
                            onclick="window.virtualGarden.removeTree('${tree.id}'); document.body.removeChild(this.closest('div').parentElement);">
                        Remove Tree
                    </button>
                </div>
            </div>
        `

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })

    document.body.appendChild(modal)
  }

  renderAchievements() {
    const achievements = [
      { id: "first_tree", name: "First Sprout", description: "Plant your first tree", requirement: 1, icon: "🌱" },
      { id: "small_forest", name: "Small Forest", description: "Plant 10 trees", requirement: 10, icon: "🌳" },
      { id: "tree_hugger", name: "Tree Hugger", description: "Plant 25 trees", requirement: 25, icon: "🤗" },
      { id: "forest_guardian", name: "Forest Guardian", description: "Plant 50 trees", requirement: 50, icon: "🛡️" },
      { id: "nature_master", name: "Nature Master", description: "Plant 100 trees", requirement: 100, icon: "👑" },
    ]

    return `
            <div style="margin-top: var(--space-8); padding: var(--space-6); background: var(--gray-50); border-radius: var(--radius-lg);">
                <h3 style="text-align: center; color: var(--gray-800); margin-bottom: var(--space-6);">🏆 Garden Achievements</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                    ${achievements
                      .map((achievement) => {
                        const isUnlocked = this.garden.achievements.includes(achievement.id)
                        const progress = Math.min(100, (this.garden.totalTreesPlanted / achievement.requirement) * 100)

                        return `
                            <div style="padding: var(--space-4); background: var(--white); border-radius: var(--radius); border: 2px solid ${isUnlocked ? "var(--success)" : "var(--gray-200)"}; opacity: ${isUnlocked ? "1" : "0.7"};">
                                <div style="text-align: center; margin-bottom: var(--space-3);">
                                    <div style="font-size: 2rem; margin-bottom: var(--space-2); ${isUnlocked ? "" : "filter: grayscale(100%);"}">${achievement.icon}</div>
                                    <h4 style="color: ${isUnlocked ? "var(--success)" : "var(--gray-700)"}; margin-bottom: var(--space-1);">${achievement.name}</h4>
                                    <p style="font-size: 0.875rem; color: var(--gray-600);">${achievement.description}</p>
                                </div>
                                <div style="margin-bottom: var(--space-2);">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--gray-600); margin-bottom: var(--space-1);">
                                        <span>${this.garden.totalTreesPlanted}/${achievement.requirement}</span>
                                        <span>${Math.round(progress)}%</span>
                                    </div>
                                    <div style="width: 100%; height: 4px; background: var(--gray-200); border-radius: 2px;">
                                        <div style="width: ${progress}%; height: 100%; background: ${isUnlocked ? "var(--success)" : "var(--primary)"}; border-radius: 2px; transition: width 0.3s ease;"></div>
                                    </div>
                                </div>
                                ${isUnlocked ? '<div style="text-align: center; color: var(--success); font-weight: 600; font-size: 0.875rem;">✓ Unlocked!</div>' : ""}
                            </div>
                        `
                      })
                      .join("")}
                </div>
            </div>
        `
  }

  // Method to be called from other modules when activities are completed
  onActivityCompleted(activityType) {
    return this.plantTree(activityType)
  }
}

// Initialize virtual garden when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.virtualGarden = new VirtualGarden()
    }, 100)
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = VirtualGarden
}
