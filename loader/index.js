import secret from '../secret'
import progress from '../src/progressbar'

export  default {
  total: 0,
  loaded: 0,
  progress: null,
  update(label) {
    this.loaded++
    this.progress.value = Math.floor((this.loaded / this.total) * 100)
    this.progress.dataset.label = `Loading ${label}...`
  },
  async init(api) {
    let results = {}
    this.progress = document.querySelector('progress')
    this.total = progress.length
    const promises = []
    progress.forEach(el => {
      promises.push(
        new Promise((resolve, reject) => {
          fetch(api[el.key].get, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': secret.Authorization
            }
          }).then(async (response) => {
            if (response.ok) {
              const data = await response.json()
              results[el.key] = data.results?.features || []
              this.update(el.label)
              resolve()
            } else {
              results[el.key] = null
              this.update(el.label)
              reject()
            }
          })
        }
      ))
    })
    console.time("for loop");
    await Promise.all(promises)
    console.timeEnd("for loop");
    await new Promise(r => setTimeout(r, 500000))
    return results
  }
}