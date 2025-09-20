\
  showToast(message,
type = "info\") {
const toast = document.getElementById("toast")
toast.textContent = message
toast.className = `toast show ${type}`

setTimeout(() => {
  toast.classList.remove("show")
}, 2500)
\
  }

// Global logout function
function logout() {
  if (confirm("Are you sure you want to sign out?")) {
    // Clear user session data (keep learning progress)
    localStorage.removeItem("userSession")

    const toast = document.getElementById("toast")
    if (toast) {
      toast.textContent = "You have been signed out successfully!"
      toast.className = "toast show success"

      setTimeout(() => {
        toast.classList.remove("show")
        // Reload after toast is shown
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }, 2500)
    } else {
      // Fallback to alert if toast not available
      alert("You have been signed out successfully!")
      window.location.reload()
    }
  }
}
