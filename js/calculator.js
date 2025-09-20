// Carbon Footprint Calculator System
class CarbonCalculator {
  constructor() {
    this.calculationData = {
      transport: {},
      energy: {},
      food: {},
      waste: {},
      lifestyle: {},
    }
    this.results = null
    this.init()
  }

  init() {
    this.renderCalculator()
  }

  calculateCarbonFootprint() {
    const transport = this.calculateTransportEmissions()
    const energy = this.calculateEnergyEmissions()
    const food = this.calculateFoodEmissions()
    const waste = this.calculateWasteEmissions()
    const lifestyle = this.calculateLifestyleEmissions()

    const total = transport + energy + food + waste + lifestyle

    this.results = {
      total: Math.round(total * 100) / 100,
      breakdown: {
        transport: Math.round(transport * 100) / 100,
        energy: Math.round(energy * 100) / 100,
        food: Math.round(food * 100) / 100,
        waste: Math.round(waste * 100) / 100,
        lifestyle: Math.round(lifestyle * 100) / 100,
      },
      comparison: this.getComparison(total),
      recommendations: this.generateRecommendations(total, { transport, energy, food, waste, lifestyle }),
    }

    // Award points for using calculator
    if (window.currentUser) {
      window.currentUser.points += 20
      window.updateUserStats()
    }

    this.renderResults()
    window.showToast("Carbon footprint calculated! +20 eco-points earned!", "success")
  }

  calculateTransportEmissions() {
    const data = this.calculationData.transport
    let emissions = 0

    // Car emissions (kg CO2 per mile)
    if (data.carMiles) {
      const carType = data.carType || "average"
      const emissionFactors = {
        small: 0.3,
        average: 0.4,
        large: 0.5,
        suv: 0.6,
        electric: 0.1,
        hybrid: 0.2,
      }
      emissions += data.carMiles * 52 * emissionFactors[carType] // Weekly to yearly
    }

    // Flight emissions (kg CO2 per mile)
    if (data.flightMiles) {
      emissions += data.flightMiles * 0.5 // Rough estimate for flights
    }

    // Public transport (generally lower emissions)
    if (data.publicTransportHours) {
      emissions += data.publicTransportHours * 52 * 2 // Weekly to yearly, low emission factor
    }

    return emissions
  }

  calculateEnergyEmissions() {
    const data = this.calculationData.energy
    let emissions = 0

    // Electricity (kg CO2 per kWh varies by region)
    if (data.electricityBill) {
      const avgKwhPerDollar = 0.12 // Rough estimate
      const kwhPerYear = (data.electricityBill * 12) / avgKwhPerDollar
      const emissionFactor = data.renewableEnergy === "yes" ? 0.2 : 0.5 // kg CO2 per kWh
      emissions += kwhPerYear * emissionFactor
    }

    // Natural gas
    if (data.gasBill) {
      const thermsPerYear = (data.gasBill * 12) / 1.2 // Rough estimate
      emissions += thermsPerYear * 5.3 // kg CO2 per therm
    }

    // Home size factor
    if (data.homeSize) {
      const sizeFactors = {
        small: 0.8,
        medium: 1.0,
        large: 1.3,
        "very-large": 1.6,
      }
      emissions *= sizeFactors[data.homeSize] || 1.0
    }

    return emissions
  }

  calculateFoodEmissions() {
    const data = this.calculationData.food
    let emissions = 0

    // Diet type emissions (kg CO2 per year)
    const dietEmissions = {
      "high-meat": 2000,
      "medium-meat": 1500,
      "low-meat": 1000,
      vegetarian: 800,
      vegan: 600,
    }

    emissions += dietEmissions[data.dietType] || 1500

    // Local food bonus
    if (data.localFood === "often") {
      emissions *= 0.9
    } else if (data.localFood === "sometimes") {
      emissions *= 0.95
    }

    // Food waste penalty
    if (data.foodWaste === "high") {
      emissions *= 1.2
    } else if (data.foodWaste === "low") {
      emissions *= 0.9
    }

    return emissions
  }

  calculateWasteEmissions() {
    const data = this.calculationData.waste
    let emissions = 200 // Base waste emissions

    // Recycling reduces emissions
    if (data.recycling === "always") {
      emissions *= 0.7
    } else if (data.recycling === "sometimes") {
      emissions *= 0.85
    }

    // Composting reduces emissions
    if (data.composting === "yes") {
      emissions *= 0.8
    }

    return emissions
  }

  calculateLifestyleEmissions() {
    const data = this.calculationData.lifestyle
    let emissions = 0

    // Shopping habits
    const shoppingEmissions = {
      minimal: 200,
      moderate: 500,
      frequent: 800,
      excessive: 1200,
    }

    emissions += shoppingEmissions[data.shopping] || 500

    // Second-hand shopping bonus
    if (data.secondHand === "often") {
      emissions *= 0.8
    } else if (data.secondHand === "sometimes") {
      emissions *= 0.9
    }

    return emissions
  }

  getComparison(total) {
    const globalAverage = 4800 // kg CO2 per year (rough global average)
    const usAverage = 16000 // kg CO2 per year (US average)

    let comparison = ""
    if (total < globalAverage * 0.5) {
      comparison = "Excellent! Your footprint is significantly below the global average."
    } else if (total < globalAverage) {
      comparison = "Good! Your footprint is below the global average."
    } else if (total < usAverage) {
      comparison = "Your footprint is above global average but below the US average."
    } else {
      comparison = "Your footprint is above average. There's room for improvement!"
    }

    return {
      text: comparison,
      globalAverage,
      usAverage,
      percentage: Math.round((total / globalAverage) * 100),
    }
  }

  generateRecommendations(total, breakdown) {
    const recommendations = []

    // Transport recommendations
    if (breakdown.transport > 2000) {
      recommendations.push({
        category: "Transport",
        icon: "🚗",
        title: "Reduce Vehicle Emissions",
        description: "Consider carpooling, public transport, or switching to an electric/hybrid vehicle.",
        impact: "High",
        savings: "500-2000 kg CO₂/year",
      })
    }

    // Energy recommendations
    if (breakdown.energy > 3000) {
      recommendations.push({
        category: "Energy",
        icon: "⚡",
        title: "Improve Home Energy Efficiency",
        description: "Switch to LED bulbs, improve insulation, and consider renewable energy sources.",
        impact: "High",
        savings: "300-1500 kg CO₂/year",
      })
    }

    // Food recommendations
    if (breakdown.food > 1500) {
      recommendations.push({
        category: "Food",
        icon: "🥗",
        title: "Adopt a More Plant-Based Diet",
        description: "Reduce meat consumption and choose locally sourced, seasonal foods.",
        impact: "Medium",
        savings: "200-800 kg CO₂/year",
      })
    }

    // Waste recommendations
    if (breakdown.waste > 250) {
      recommendations.push({
        category: "Waste",
        icon: "♻️",
        title: "Improve Waste Management",
        description: "Increase recycling, start composting, and reduce single-use items.",
        impact: "Medium",
        savings: "50-200 kg CO₂/year",
      })
    }

    // Lifestyle recommendations
    if (breakdown.lifestyle > 600) {
      recommendations.push({
        category: "Lifestyle",
        icon: "🛍️",
        title: "Conscious Consumption",
        description: "Buy less, choose quality over quantity, and shop second-hand when possible.",
        impact: "Medium",
        savings: "100-400 kg CO₂/year",
      })
    }

    // Always include some general recommendations
    recommendations.push({
      category: "General",
      icon: "🌱",
      title: "Plant Trees or Support Reforestation",
      description: "Trees absorb CO₂ from the atmosphere. Plant trees or support reforestation projects.",
      impact: "Long-term",
      savings: "20-50 kg CO₂/tree/year",
    })

    return recommendations.slice(0, 6) // Limit to 6 recommendations
  }

  updateCalculationData(category, field, value) {
    if (!this.calculationData[category]) {
      this.calculationData[category] = {}
    }
    this.calculationData[category][field] = value
  }

  renderCalculator() {
    const container = document.getElementById("calculatorContent")
    if (!container) return

    container.innerHTML = `
            <div class="card">
                <h2>Carbon Footprint Calculator</h2>
                <p style="text-align: center; color: var(--gray-600); margin-bottom: var(--space-8);">
                    Calculate your environmental impact and discover ways to reduce your carbon footprint!
                </p>

                <div id="calculator-form">
                    ${this.renderTransportSection()}
                    ${this.renderEnergySection()}
                    ${this.renderFoodSection()}
                    ${this.renderWasteSection()}
                    ${this.renderLifestyleSection()}
                    
                    <div style="text-align: center; margin-top: var(--space-8);">
                        <button class="btn btn-primary" onclick="window.carbonCalculator.calculateCarbonFootprint()" style="font-size: 1.125rem; padding: var(--space-4) var(--space-8);">
                            Calculate My Carbon Footprint (+20 points)
                        </button>
                    </div>
                </div>

                <div id="calculator-results" style="display: none;">
                    <!-- Results will be rendered here -->
                </div>
            </div>
        `
  }

  renderTransportSection() {
    return `
            <div class="calculator-section">
                <h3>🚗 Transportation</h3>
                <div class="input-group">
                    <div class="input-field">
                        <label>Miles driven per week</label>
                        <input type="number" placeholder="e.g., 100" onchange="window.carbonCalculator.updateCalculationData('transport', 'carMiles', this.value)">
                    </div>
                    <div class="input-field">
                        <label>Vehicle type</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('transport', 'carType', this.value)">
                            <option value="">Select vehicle type</option>
                            <option value="small">Small car</option>
                            <option value="average">Average car</option>
                            <option value="large">Large car</option>
                            <option value="suv">SUV/Truck</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="electric">Electric</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Flight miles per year</label>
                        <input type="number" placeholder="e.g., 2000" onchange="window.carbonCalculator.updateCalculationData('transport', 'flightMiles', this.value)">
                    </div>
                    <div class="input-field">
                        <label>Public transport hours per week</label>
                        <input type="number" placeholder="e.g., 5" onchange="window.carbonCalculator.updateCalculationData('transport', 'publicTransportHours', this.value)">
                    </div>
                </div>
            </div>
        `
  }

  renderEnergySection() {
    return `
            <div class="calculator-section">
                <h3>⚡ Home Energy</h3>
                <div class="input-group">
                    <div class="input-field">
                        <label>Monthly electricity bill ($)</label>
                        <input type="number" placeholder="e.g., 120" onchange="window.carbonCalculator.updateCalculationData('energy', 'electricityBill', this.value)">
                    </div>
                    <div class="input-field">
                        <label>Monthly gas bill ($)</label>
                        <input type="number" placeholder="e.g., 80" onchange="window.carbonCalculator.updateCalculationData('energy', 'gasBill', this.value)">
                    </div>
                    <div class="input-field">
                        <label>Home size</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('energy', 'homeSize', this.value)">
                            <option value="">Select home size</option>
                            <option value="small">Small (< 1000 sq ft)</option>
                            <option value="medium">Medium (1000-2000 sq ft)</option>
                            <option value="large">Large (2000-3000 sq ft)</option>
                            <option value="very-large">Very Large (> 3000 sq ft)</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Use renewable energy?</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('energy', 'renewableEnergy', this.value)">
                            <option value="">Select option</option>
                            <option value="yes">Yes, mostly renewable</option>
                            <option value="some">Some renewable</option>
                            <option value="no">No renewable energy</option>
                        </select>
                    </div>
                </div>
            </div>
        `
  }

  renderFoodSection() {
    return `
            <div class="calculator-section">
                <h3>🍽️ Food & Diet</h3>
                <div class="input-group">
                    <div class="input-field">
                        <label>Diet type</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('food', 'dietType', this.value)">
                            <option value="">Select diet type</option>
                            <option value="high-meat">High meat consumption</option>
                            <option value="medium-meat">Medium meat consumption</option>
                            <option value="low-meat">Low meat consumption</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Local/seasonal food</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('food', 'localFood', this.value)">
                            <option value="">Select frequency</option>
                            <option value="often">Often</option>
                            <option value="sometimes">Sometimes</option>
                            <option value="rarely">Rarely</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Food waste level</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('food', 'foodWaste', this.value)">
                            <option value="">Select level</option>
                            <option value="low">Low (minimal waste)</option>
                            <option value="medium">Medium (some waste)</option>
                            <option value="high">High (significant waste)</option>
                        </select>
                    </div>
                </div>
            </div>
        `
  }

  renderWasteSection() {
    return `
            <div class="calculator-section">
                <h3>♻️ Waste Management</h3>
                <div class="input-group">
                    <div class="input-field">
                        <label>Recycling frequency</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('waste', 'recycling', this.value)">
                            <option value="">Select frequency</option>
                            <option value="always">Always recycle</option>
                            <option value="sometimes">Sometimes recycle</option>
                            <option value="rarely">Rarely recycle</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Composting</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('waste', 'composting', this.value)">
                            <option value="">Select option</option>
                            <option value="yes">Yes, I compost</option>
                            <option value="no">No composting</option>
                        </select>
                    </div>
                </div>
            </div>
        `
  }

  renderLifestyleSection() {
    return `
            <div class="calculator-section">
                <h3>🛍️ Lifestyle & Consumption</h3>
                <div class="input-group">
                    <div class="input-field">
                        <label>Shopping habits</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('lifestyle', 'shopping', this.value)">
                            <option value="">Select habits</option>
                            <option value="minimal">Minimal shopping</option>
                            <option value="moderate">Moderate shopping</option>
                            <option value="frequent">Frequent shopping</option>
                            <option value="excessive">Excessive shopping</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Second-hand purchases</label>
                        <select onchange="window.carbonCalculator.updateCalculationData('lifestyle', 'secondHand', this.value)">
                            <option value="">Select frequency</option>
                            <option value="often">Often buy second-hand</option>
                            <option value="sometimes">Sometimes buy second-hand</option>
                            <option value="rarely">Rarely buy second-hand</option>
                        </select>
                    </div>
                </div>
            </div>
        `
  }

  renderResults() {
    const resultsContainer = document.getElementById("calculator-results")
    const formContainer = document.getElementById("calculator-form")

    if (!resultsContainer || !this.results) return

    formContainer.style.display = "none"
    resultsContainer.style.display = "block"

    resultsContainer.innerHTML = `
            <div class="results-display">
                <div class="carbon-total">${this.results.total}</div>
                <div class="carbon-label">kg CO₂ per year</div>
                <p style="margin-bottom: var(--space-6); opacity: 0.9;">${this.results.comparison.text}</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700;">${this.results.comparison.globalAverage}</div>
                        <div style="font-size: 0.875rem; opacity: 0.8;">Global Average</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700;">${this.results.comparison.usAverage}</div>
                        <div style="font-size: 0.875rem; opacity: 0.8;">US Average</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700;">${this.results.comparison.percentage}%</div>
                        <div style="font-size: 0.875rem; opacity: 0.8;">of Global Average</div>
                    </div>
                </div>
            </div>

            <!-- Breakdown Chart -->
            <div style="background: var(--white); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
                <h3 style="text-align: center; margin-bottom: var(--space-6);">Emissions Breakdown</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4);">
                    ${Object.entries(this.results.breakdown)
                      .map(([category, value]) => {
                        const percentage = Math.round((value / this.results.total) * 100)
                        const colors = {
                          transport: "var(--error)",
                          energy: "var(--accent-yellow)",
                          food: "var(--primary)",
                          waste: "var(--accent-orange)",
                          lifestyle: "var(--secondary)",
                        }
                        return `
                            <div style="text-align: center; padding: var(--space-4); border-radius: var(--radius); border: 2px solid ${colors[category]}20; background: ${colors[category]}10;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: ${colors[category]}; margin-bottom: var(--space-2);">${value}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-700); margin-bottom: var(--space-1); text-transform: capitalize;">${category}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">${percentage}% of total</div>
                            </div>
                        `
                      })
                      .join("")}
                </div>
            </div>

            <!-- Recommendations -->
            <div class="recommendations">
                <h4>🌱 Personalized Recommendations</h4>
                <p style="margin-bottom: var(--space-6); color: var(--gray-700);">Based on your carbon footprint, here are specific actions you can take to reduce your environmental impact:</p>
                
                <div style="display: grid; gap: var(--space-4);">
                    ${this.results.recommendations
                      .map(
                        (rec) => `
                        <div style="display: flex; gap: var(--space-4); padding: var(--space-4); background: var(--gray-50); border-radius: var(--radius-lg); border-left: 4px solid var(--primary);">
                            <div style="font-size: 2rem;">${rec.icon}</div>
                            <div style="flex: 1;">
                                <h5 style="color: var(--gray-900); margin-bottom: var(--space-2);">${rec.title}</h5>
                                <p style="color: var(--gray-700); margin-bottom: var(--space-2); line-height: 1.5;">${rec.description}</p>
                                <div style="display: flex; gap: var(--space-4); font-size: 0.875rem;">
                                    <span style="color: var(--primary); font-weight: 600;">Impact: ${rec.impact}</span>
                                    <span style="color: var(--gray-600);">Potential savings: ${rec.savings}</span>
                                </div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <div style="text-align: center; margin-top: var(--space-8);">
                <button class="btn btn-secondary" onclick="window.carbonCalculator.renderCalculator()">
                    Calculate Again
                </button>
                <button class="btn btn-primary" onclick="window.showToast('Results saved to your profile!', 'success')" style="margin-left: var(--space-3);">
                    Save Results
                </button>
            </div>
        `
  }
}

// Initialize carbon calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.carbonCalculator = new CarbonCalculator()
    }, 100)
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CarbonCalculator
}
