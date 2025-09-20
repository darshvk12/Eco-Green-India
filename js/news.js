// Eco-News Feed System
class EcoNewsManager {
  constructor() {
    this.news = []
    this.categories = ["all", "climate", "renewable-energy", "conservation", "sustainability", "wildlife"]
    this.currentCategory = "all"
    this.isLoading = false
    this.init()
  }

  init() {
    this.loadMockNews()
    this.renderNewsSection()
  }

  // Mock news data (in a real app, this would fetch from an API)
  loadMockNews() {
    this.news = [
      {
        id: "news_1",
        title: "Global Renewable Energy Capacity Reaches Record High in 2024",
        summary:
          "International Renewable Energy Agency reports that global renewable energy capacity increased by 15% this year, with solar and wind leading the growth.",
        content:
          "The latest report from the International Renewable Energy Agency (IRENA) shows unprecedented growth in renewable energy installations worldwide. Solar photovoltaic capacity alone increased by 20%, while wind energy grew by 12%. This growth represents a significant step toward global climate goals.",
        category: "renewable-energy",
        source: "Environmental News Network",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        imageUrl: null,
        readTime: "3 min read",
        tags: ["renewable energy", "solar", "wind", "climate goals"],
        likes: 156,
        shares: 43,
      },
      {
        id: "news_2",
        title: "New Study Reveals Ocean Cleanup Technology Removes 50% More Plastic",
        summary:
          "Revolutionary ocean cleanup systems have shown remarkable improvement in efficiency, removing significantly more plastic waste from our oceans.",
        content:
          "Scientists have developed an enhanced ocean cleanup technology that has proven 50% more effective than previous methods. The system uses advanced AI to identify and collect plastic debris while avoiding marine life. Early trials in the Pacific Ocean have yielded promising results.",
        category: "conservation",
        source: "Marine Conservation Today",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        imageUrl: null,
        readTime: "4 min read",
        tags: ["ocean cleanup", "plastic pollution", "marine conservation", "technology"],
        likes: 203,
        shares: 67,
      },
      {
        id: "news_3",
        title: "Urban Forests: Cities Plant 1 Million Trees in Global Initiative",
        summary:
          "Major cities worldwide have collectively planted over 1 million trees as part of a coordinated effort to combat urban heat islands and improve air quality.",
        content:
          "A global urban forestry initiative has reached a major milestone with over 1 million trees planted across 50 major cities. The program focuses on native species selection and community involvement. Early results show measurable improvements in air quality and urban temperature reduction.",
        category: "sustainability",
        source: "Urban Green Report",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        imageUrl: null,
        readTime: "2 min read",
        tags: ["urban forestry", "air quality", "city planning", "community"],
        likes: 89,
        shares: 34,
      },
      {
        id: "news_4",
        title: "Breakthrough in Carbon Capture Technology Promises Cleaner Future",
        summary:
          "Scientists develop new carbon capture method that is 40% more efficient and significantly cheaper than existing technologies.",
        content:
          "Researchers at leading universities have unveiled a groundbreaking carbon capture technology that could revolutionize climate change mitigation efforts. The new method uses innovative materials to capture CO2 directly from the atmosphere at a fraction of the current cost.",
        category: "climate",
        source: "Climate Science Weekly",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        imageUrl: null,
        readTime: "5 min read",
        tags: ["carbon capture", "climate technology", "CO2 reduction", "innovation"],
        likes: 312,
        shares: 98,
      },
      {
        id: "news_5",
        title: "Endangered Species Population Shows Signs of Recovery",
        summary:
          "Conservation efforts for several endangered species are showing positive results, with population numbers increasing for the first time in decades.",
        content:
          "Wildlife conservation programs worldwide are reporting encouraging news as several endangered species show population growth. The success is attributed to habitat protection, anti-poaching efforts, and community-based conservation programs.",
        category: "wildlife",
        source: "Wildlife Conservation Network",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        imageUrl: null,
        readTime: "3 min read",
        tags: ["endangered species", "conservation", "wildlife protection", "biodiversity"],
        likes: 178,
        shares: 52,
      },
      {
        id: "news_6",
        title: "Green Building Standards Adopted by 200+ Cities Worldwide",
        summary:
          "A new wave of sustainable architecture is transforming urban landscapes as cities mandate green building practices for new construction.",
        content:
          "Over 200 cities have now adopted comprehensive green building standards, requiring new constructions to meet strict environmental criteria. These standards include energy efficiency, water conservation, and sustainable materials usage.",
        category: "sustainability",
        source: "Sustainable Architecture Today",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        imageUrl: null,
        readTime: "4 min read",
        tags: ["green building", "sustainable architecture", "urban planning", "energy efficiency"],
        likes: 134,
        shares: 41,
      },
      {
        id: "news_7",
        title: "Electric Vehicle Sales Surpass 10 Million Units Globally",
        summary:
          "The electric vehicle revolution continues as global sales reach a historic milestone, signaling a major shift in transportation.",
        content:
          "Electric vehicle sales have reached an unprecedented 10 million units worldwide this year, representing a 35% increase from last year. This growth is driven by improved battery technology, expanded charging infrastructure, and supportive government policies.",
        category: "sustainability",
        source: "Clean Transport News",
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
        imageUrl: null,
        readTime: "3 min read",
        tags: ["electric vehicles", "clean transport", "battery technology", "sustainable mobility"],
        likes: 267,
        shares: 78,
      },
      {
        id: "news_8",
        title: "Community Solar Programs Bring Clean Energy to Rural Areas",
        summary:
          "Innovative community solar initiatives are making renewable energy accessible to rural communities previously unable to install solar panels.",
        content:
          "Community solar programs are expanding access to clean energy in rural areas through shared solar installations. These programs allow residents to benefit from solar energy without installing panels on their property, making renewable energy more accessible and affordable.",
        category: "renewable-energy",
        source: "Rural Energy Solutions",
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        imageUrl: null,
        readTime: "4 min read",
        tags: ["community solar", "rural energy", "renewable access", "energy equity"],
        likes: 95,
        shares: 29,
      },
    ]
  }

  filterNewsByCategory(category) {
    this.currentCategory = category
    this.renderNewsSection()

    // Update active filter button
    document.querySelectorAll(".news-filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-category="${category}"]`).classList.add("active")
  }

  getFilteredNews() {
    if (this.currentCategory === "all") {
      return this.news
    }
    return this.news.filter((article) => article.category === this.currentCategory)
  }

  getTimeAgo(timestamp) {
    const now = new Date()
    const articleTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - articleTime) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return articleTime.toLocaleDateString()
  }

  getCategoryIcon(category) {
    const icons = {
      climate: "🌡️",
      "renewable-energy": "⚡",
      conservation: "🌊",
      sustainability: "♻️",
      wildlife: "🦎",
      all: "🌍",
    }
    return icons[category] || "📰"
  }

  getCategoryColor(category) {
    const colors = {
      climate: "var(--error)",
      "renewable-energy": "var(--accent-yellow)",
      conservation: "var(--secondary)",
      sustainability: "var(--primary)",
      wildlife: "var(--accent-pink)",
      all: "var(--gray-600)",
    }
    return colors[category] || "var(--gray-600)"
  }

  likeArticle(articleId) {
    const article = this.news.find((a) => a.id === articleId)
    if (!article) return

    article.likes++

    // Award points for engagement
    if (window.currentUser) {
      window.currentUser.points += 1
      window.updateUserStats()
    }

    this.renderNewsSection()
    window.showToast("Thanks for engaging with environmental news! +1 eco-point", "success")
  }

  shareArticle(articleId) {
    const article = this.news.find((a) => a.id === articleId)
    if (!article) return

    article.shares++

    // Award points for sharing
    if (window.currentUser) {
      window.currentUser.points += 3
      window.updateUserStats()
    }

    // Simulate sharing (in a real app, this would open share dialog)
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${article.title}\n${article.summary}\n${window.location.href}`)
      window.showToast("Article link copied to clipboard! +3 eco-points", "success")
    }

    this.renderNewsSection()
  }

  readArticle(articleId) {
    const article = this.news.find((a) => a.id === articleId)
    if (!article) return

    // Award points for reading
    if (window.currentUser) {
      window.currentUser.points += 5
      window.updateUserStats()
    }

    // Show full article in modal
    this.showArticleModal(article)
    window.showToast("Thanks for staying informed! +5 eco-points", "success")
  }

  showArticleModal(article) {
    const modal = document.createElement("div")
    modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 1000; backdrop-filter: blur(4px); padding: var(--space-4);
        `

    modal.innerHTML = `
            <div style="background: var(--white); padding: var(--space-8); border-radius: var(--radius-xl); max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: var(--shadow-xl);">
                <div style="margin-bottom: var(--space-6);">
                    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                        <span style="font-size: 1.5rem;">${this.getCategoryIcon(article.category)}</span>
                        <span style="background: ${this.getCategoryColor(article.category)}20; color: ${this.getCategoryColor(article.category)}; padding: var(--space-1) var(--space-3); border-radius: var(--radius); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                            ${article.category.replace("-", " ")}
                        </span>
                    </div>
                    <h2 style="color: var(--gray-900); margin-bottom: var(--space-4); line-height: 1.3;">${article.title}</h2>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); color: var(--gray-600); font-size: 0.875rem;">
                        <div>
                            <span>${article.source}</span> • 
                            <span>${this.getTimeAgo(article.publishedAt)}</span> • 
                            <span>${article.readTime}</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: var(--space-6); line-height: 1.7; color: var(--gray-700);">
                    ${article.content}
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-6);">
                    ${article.tags
                      .map(
                        (tag) => `
                        <span style="background: var(--gray-100); color: var(--gray-700); padding: var(--space-1) var(--space-3); border-radius: var(--radius); font-size: 0.75rem;">
                            #${tag}
                        </span>
                    `,
                      )
                      .join("")}
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--gray-200);">
                    <div style="display: flex; gap: var(--space-4); align-items: center;">
                        <button onclick="window.ecoNewsManager.likeArticle('${article.id}'); document.body.removeChild(this.closest('div').parentElement);" style="background: none; border: none; color: var(--gray-600); cursor: pointer; display: flex; align-items: center; gap: var(--space-2);">
                            ❤️ ${article.likes}
                        </button>
                        <button onclick="window.ecoNewsManager.shareArticle('${article.id}'); document.body.removeChild(this.closest('div').parentElement);" style="background: none; border: none; color: var(--gray-600); cursor: pointer; display: flex; align-items: center; gap: var(--space-2);">
                            📤 ${article.shares}
                        </button>
                    </div>
                    <button class="btn btn-secondary" onclick="document.body.removeChild(this.closest('div').parentElement);">
                        Close
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

  renderNewsSection() {
    const container = document.getElementById("newsContent")
    if (!container) return

    const filteredNews = this.getFilteredNews()
    const totalArticles = this.news.length
    const totalLikes = this.news.reduce((sum, article) => sum + article.likes, 0)
    const totalShares = this.news.reduce((sum, article) => sum + article.shares, 0)

    container.innerHTML = `
            <div class="card">
                <h2>Eco News Feed</h2>
                <p style="text-align: center; color: var(--gray-600); margin-bottom: var(--space-8);">
                    Stay updated with the latest environmental news and earn eco-points for staying informed!
                </p>

                <!-- News Stats -->
                <div class="news-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
                    <div class="stat-card">
                        <div class="stat-number">${totalArticles}</div>
                        <div class="stat-label">Articles Available</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${filteredNews.length}</div>
                        <div class="stat-label">Currently Showing</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalLikes}</div>
                        <div class="stat-label">Community Likes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalShares}</div>
                        <div class="stat-label">Articles Shared</div>
                    </div>
                </div>

                <!-- Category Filters -->
                <div class="news-filters" style="display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; margin-bottom: var(--space-8);">
                    ${this.categories
                      .map(
                        (category) => `
                        <button 
                            class="news-filter-btn ${this.currentCategory === category ? "active" : ""}" 
                            data-category="${category}"
                            onclick="window.ecoNewsManager.filterNewsByCategory('${category}')"
                            style="padding: var(--space-2) var(--space-4); border: 2px solid ${this.currentCategory === category ? this.getCategoryColor(category) : "var(--gray-300)"}; background: ${this.currentCategory === category ? this.getCategoryColor(category) + "20" : "var(--white)"}; color: ${this.currentCategory === category ? this.getCategoryColor(category) : "var(--gray-700)"}; border-radius: var(--radius-lg); cursor: pointer; font-weight: 600; font-size: 0.875rem; transition: all 0.3s ease; display: flex; align-items: center; gap: var(--space-2);"
                        >
                            <span>${this.getCategoryIcon(category)}</span>
                            <span>${category === "all" ? "All News" : category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                        </button>
                    `,
                      )
                      .join("")}
                </div>

                <!-- Points Info -->
                <div style="text-align: center; margin-bottom: var(--space-8); padding: var(--space-4); background: var(--gray-50); border-radius: var(--radius-lg);">
                    <h3 style="color: var(--gray-800); margin-bottom: var(--space-2);">📰 Earn Points by Staying Informed</h3>
                    <div style="display: flex; justify-content: center; gap: var(--space-6); flex-wrap: wrap; font-size: 0.875rem; color: var(--gray-600);">
                        <span>👍 Like Article: +1 point</span>
                        <span>📤 Share Article: +3 points</span>
                        <span>📖 Read Full Article: +5 points</span>
                    </div>
                </div>

                <!-- News Articles -->
                <div class="news-grid">
                    ${
                      filteredNews.length === 0
                        ? `
                        <div style="text-align: center; padding: var(--space-12); color: var(--gray-500);">
                            <div style="font-size: 3rem; margin-bottom: var(--space-4);">📰</div>
                            <h3 style="margin-bottom: var(--space-2);">No articles found</h3>
                            <p>Try selecting a different category to see more articles.</p>
                        </div>
                    `
                        : filteredNews.map((article) => this.renderNewsCard(article)).join("")
                    }
                </div>

                <!-- Load More Button (placeholder for future pagination) -->
                ${
                  filteredNews.length > 0
                    ? `
                    <div style="text-align: center; margin-top: var(--space-8);">
                        <button class="btn btn-secondary" onclick="window.showToast('More articles coming soon!', 'info')">
                            Load More Articles
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  renderNewsCard(article) {
    return `
            <div class="news-card">
                <div class="news-image">
                    ${this.getCategoryIcon(article.category)}
                </div>
                
                <div class="news-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
                        <span style="background: ${this.getCategoryColor(article.category)}20; color: ${this.getCategoryColor(article.category)}; padding: var(--space-1) var(--space-2); border-radius: var(--radius); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                            ${article.category.replace("-", " ")}
                        </span>
                        <span style="color: var(--gray-500); font-size: 0.75rem;">${article.readTime}</span>
                    </div>
                    
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-summary">${article.summary}</p>
                    
                    <div class="news-meta">
                        <div>
                            <span style="font-weight: 600;">${article.source}</span>
                            <span style="color: var(--gray-400);"> • </span>
                            <span>${this.getTimeAgo(article.publishedAt)}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--gray-200);">
                        <div style="display: flex; gap: var(--space-4);">
                            <button onclick="window.ecoNewsManager.likeArticle('${article.id}')" style="background: none; border: none; color: var(--gray-600); cursor: pointer; display: flex; align-items: center; gap: var(--space-1); font-size: 0.875rem;">
                                ❤️ ${article.likes}
                            </button>
                            <button onclick="window.ecoNewsManager.shareArticle('${article.id}')" style="background: none; border: none; color: var(--gray-600); cursor: pointer; display: flex; align-items: center; gap: var(--space-1); font-size: 0.875rem;">
                                📤 ${article.shares}
                            </button>
                        </div>
                        <button class="btn btn-primary" onclick="window.ecoNewsManager.readArticle('${article.id}')" style="font-size: 0.875rem; padding: var(--space-2) var(--space-4);">
                            Read Full Article
                        </button>
                    </div>
                </div>
            </div>
        `
  }

  // Method to simulate fetching fresh news (for future API integration)
  async refreshNews() {
    this.isLoading = true
    window.showToast("Refreshing news feed...", "info")

    // Simulate API call delay
    setTimeout(() => {
      this.isLoading = false
      window.showToast("News feed updated!", "success")
      this.renderNewsSection()
    }, 1500)
  }
}

// Initialize eco news manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.ecoNewsManager = new EcoNewsManager()
    }, 100)
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = EcoNewsManager
}
