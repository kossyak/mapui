export  default {
  total: 0,
  loaded: 0,
  update() {
    this.loaded++
    const progressBar = document.getElementById('progress-bar')
    const percentage = Math.floor((this.loaded / this.total) * 100)
    if (progressBar) progressBar.style.width = `${percentage}%`
  },
  async init(urls) {
    let results = []
    this.total = urls.length
    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await fetch(urls[i])
        if (response.ok) {
          const data = await response.json()
          results[i] = data
          this.update()
        } else {
          results[i] = null
          this.update()
        }
      } catch (error) {
        results[i] = null
        this.update()
      }
    }
    return results
  }
}