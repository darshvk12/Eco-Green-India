// Community Forum System
class CommunityManager {
  constructor() {
    this.posts = this.loadPosts()
    this.currentUser = null
    this.init()
  }

  init() {
    this.currentUser = window.currentUser || { name: "Anonymous", email: "user@example.com" }
    this.renderCommunity()
  }

  loadPosts() {
    const saved = localStorage.getItem("ecolearn_community_posts")
    if (saved) {
      return JSON.parse(saved)
    }

    // Default sample posts
    return [
      {
        id: "post_1",
        author: "Sarah Green",
        avatar: "SG",
        content:
          "Just completed my first week of using reusable bags for all my shopping! It feels amazing to reduce plastic waste. Small changes really do make a difference! 🌱",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: 12,
        likedBy: [],
        category: "waste-reduction",
      },
      {
        id: "post_2",
        author: "Mike Eco",
        avatar: "ME",
        content:
          "Pro tip: Installing a low-flow showerhead can save up to 2,900 gallons of water per year! Just installed one and the water pressure is still great. Highly recommend! 💧",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        likes: 8,
        likedBy: [],
        category: "water-conservation",
      },
      {
        id: "post_3",
        author: "Emma Nature",
        avatar: "EN",
        content:
          "Started a small herb garden on my balcony using recycled containers. Not only am I growing my own food, but I'm also reducing packaging waste from store-bought herbs. Win-win! 🌿",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        likes: 15,
        likedBy: [],
        category: "gardening",
      },
      {
        id: "post_4",
        author: "David Solar",
        avatar: "DS",
        content:
          "Switched to LED bulbs throughout my house last month. My electricity bill dropped by 25%! The upfront cost pays for itself quickly. Great for the environment and wallet! ⚡",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        likes: 6,
        likedBy: [],
        category: "energy-saving",
      },
      {
        id: "post_5",
        author: "Lisa Recycle",
        avatar: "LR",
        content:
          "Found an amazing way to repurpose old t-shirts into cleaning rags! Instead of throwing them away, I cut them up and now have a lifetime supply of reusable cleaning cloths. ♻️",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        likes: 9,
        likedBy: [],
        category: "upcycling",
      },
    ]
  }

  savePosts() {
    localStorage.setItem("ecolearn_community_posts", JSON.stringify(this.posts))
  }

  createPost(content, category = "general") {
    if (!content.trim()) {
      window.showToast("Please enter some content for your post", "error")
      return
    }

    const newPost = {
      id: "post_" + Date.now(),
      author: this.currentUser.name || "Anonymous",
      avatar: this.getInitials(this.currentUser.name || "Anonymous"),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      category: category,
    }

    this.posts.unshift(newPost) // Add to beginning of array
    this.savePosts()
    this.renderCommunity()

    // Award points for posting
    if (window.currentUser) {
      window.currentUser.points += 10
      window.updateUserStats()
    }

    window.showToast("Post shared with the community! +10 eco-points earned!", "success")
    window.createMiniConfetti()

    // Clear the form
    const postInput = document.getElementById("newPostContent")
    if (postInput) postInput.value = ""
  }

  toggleLike(postId) {
    const post = this.posts.find((p) => p.id === postId)
    if (!post) return

    const userId = this.currentUser.email || "anonymous"
    const hasLiked = post.likedBy.includes(userId)

    if (hasLiked) {
      post.likes--
      post.likedBy = post.likedBy.filter((id) => id !== userId)
    } else {
      post.likes++
      post.likedBy.push(userId)

      // Award points for liking (small reward for engagement)
      if (window.currentUser) {
        window.currentUser.points += 2
        window.updateUserStats()
      }
    }

    this.savePosts()
    this.renderCommunity()

    if (!hasLiked) {
      window.showToast("Thanks for supporting the community! +2 eco-points", "success")
    }
  }

  getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  getTimeAgo(timestamp) {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return postTime.toLocaleDateString()
  }

  getCategoryIcon(category) {
    const icons = {
      "waste-reduction": "♻️",
      "water-conservation": "💧",
      "energy-saving": "⚡",
      gardening: "🌱",
      upcycling: "🔄",
      transport: "🚲",
      general: "🌍",
    }
    return icons[category] || "🌍"
  }

  getCategoryColor(category) {
    const colors = {
      "waste-reduction": "var(--accent-orange)",
      "water-conservation": "var(--secondary)",
      "energy-saving": "var(--accent-yellow)",
      gardening: "var(--primary)",
      upcycling: "var(--accent-pink)",
      transport: "var(--primary-light)",
      general: "var(--gray-600)",
    }
    return colors[category] || "var(--gray-600)"
  }

  renderCommunity() {
    const container = document.getElementById("communityContent")
    if (!container) return

    const totalPosts = this.posts.length
    const totalLikes = this.posts.reduce((sum, post) => sum + post.likes, 0)
    const userPosts = this.posts.filter((post) => post.author === (this.currentUser.name || "Anonymous")).length

    container.innerHTML = `
            <div class="card">
                <h2>Community Forum</h2>
                <p style="text-align: center; color: var(--gray-600); margin-bottom: var(--space-8);">
                    Share your eco-tips, experiences, and connect with fellow environmental enthusiasts!
                </p>

                <!-- Community Stats -->
                <div class="community-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
                    <div class="stat-card">
                        <div class="stat-number">${totalPosts}</div>
                        <div class="stat-label">Total Posts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalLikes}</div>
                        <div class="stat-label">Total Likes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${userPosts}</div>
                        <div class="stat-label">Your Posts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.posts.filter((p) => p.likedBy.includes(this.currentUser.email || "anonymous")).length}</div>
                        <div class="stat-label">Posts Liked</div>
                    </div>
                </div>

                <!-- Create New Post -->
                <div class="create-post-section" style="background: var(--gray-50); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-8);">
                    <h3 style="color: var(--gray-800); margin-bottom: var(--space-4); font-family: 'Poppins', sans-serif;">Share Your Eco-Tip</h3>
                    
                    <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
                        <div class="post-avatar" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);">
                            ${this.getInitials(this.currentUser.name || "Anonymous")}
                        </div>
                        <div style="flex: 1;">
                            <textarea 
                                id="newPostContent" 
                                placeholder="Share your environmental tip, experience, or question with the community..."
                                style="width: 100%; min-height: 100px; padding: var(--space-4); border: 2px solid var(--gray-300); border-radius: var(--radius-lg); resize: vertical; font-family: inherit; font-size: 0.875rem;"
                            ></textarea>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <select id="postCategory" style="padding: var(--space-2) var(--space-3); border: 2px solid var(--gray-300); border-radius: var(--radius); font-size: 0.875rem;">
                            <option value="general">General</option>
                            <option value="waste-reduction">Waste Reduction</option>
                            <option value="water-conservation">Water Conservation</option>
                            <option value="energy-saving">Energy Saving</option>
                            <option value="gardening">Gardening</option>
                            <option value="upcycling">Upcycling</option>
                            <option value="transport">Transport</option>
                        </select>
                        
                        <button 
                            class="btn btn-primary" 
                            onclick="window.communityManager.createPost(document.getElementById('newPostContent').value, document.getElementById('postCategory').value)"
                        >
                            Share Post (+10 points)
                        </button>
                    </div>
                </div>

                <!-- Posts Feed -->
                <div class="posts-feed">
                    <h3 style="color: var(--gray-800); margin-bottom: var(--space-6); font-family: 'Poppins', sans-serif;">Recent Posts</h3>
                    ${this.posts.map((post) => this.renderPost(post)).join("")}
                </div>

                ${
                  this.posts.length === 0
                    ? `
                    <div style="text-align: center; padding: var(--space-12); color: var(--gray-500);">
                        <div style="font-size: 3rem; margin-bottom: var(--space-4);">🌱</div>
                        <h3 style="margin-bottom: var(--space-2);">No posts yet!</h3>
                        <p>Be the first to share an eco-tip with the community.</p>
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  renderPost(post) {
    const userId = this.currentUser.email || "anonymous"
    const hasLiked = post.likedBy.includes(userId)
    const isOwnPost = post.author === (this.currentUser.name || "Anonymous")

    return `
            <div class="community-post">
                <div class="post-header">
                    <div class="post-avatar">${post.avatar}</div>
                    <div class="post-info">
                        <h4>${post.author} ${isOwnPost ? "(You)" : ""}</h4>
                        <div class="post-time">${this.getTimeAgo(post.timestamp)}</div>
                    </div>
                    <div class="post-category" style="display: flex; align-items: center; gap: var(--space-2); padding: var(--space-1) var(--space-3); background: ${this.getCategoryColor(post.category)}20; color: ${this.getCategoryColor(post.category)}; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">
                        <span>${this.getCategoryIcon(post.category)}</span>
                        <span>${post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                    </div>
                </div>
                
                <div class="post-content">${post.content}</div>
                
                <div class="post-actions">
                    <button 
                        class="like-btn ${hasLiked ? "liked" : ""}" 
                        onclick="window.communityManager.toggleLike('${post.id}')"
                    >
                        <span>${hasLiked ? "❤️" : "🤍"}</span>
                        <span>${post.likes} ${post.likes === 1 ? "like" : "likes"}</span>
                    </button>
                    
                    <div style="color: var(--gray-500); font-size: 0.75rem;">
                        ${post.likes > 0 ? `Liked by ${post.likes} ${post.likes === 1 ? "person" : "people"}` : "Be the first to like this post"}
                    </div>
                </div>
            </div>
        `
  }

  filterPostsByCategory(category) {
    // Future enhancement: filter posts by category
    console.log("Filtering by category:", category)
  }

  searchPosts(query) {
    // Future enhancement: search functionality
    console.log("Searching posts:", query)
  }
}

// Initialize community manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined") {
    // Wait for auth manager to initialize first
    setTimeout(() => {
      window.communityManager = new CommunityManager()
    }, 100)
  }
})

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CommunityManager
}
