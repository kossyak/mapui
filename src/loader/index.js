import secret from '../../secret'
import progress from '../progressbar'

export  default {
  total: 0,
  loaded: 0,
  progress: null,
  update(label) {
    this.loaded++
    this.progress.style.setProperty('--value', Math.floor((this.loaded / this.total) * 100) + '%');
    this.progress.dataset.label = `Loading ${label}...`
  },
  async search(api, value) {
    const response = await fetch(api.search + value + '&limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': secret.Authorization
      }
    })
    return await response.json()
  },
  async init(target, api) {
    let results = {}
    target.innerHTML = progress.template
    this.progress = document.querySelector('.progress')
    this.total = progress.data.length
    const promises = []
    progress.data.forEach(el => {
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
    const data = await localStorage.getItem('data')
    if (data) {
      return await JSON.parse(data)
    }
    console.time("for loop");
    await Promise.all(promises)
    console.timeEnd("for loop");
    
    localStorage.setItem('data', JSON.stringify(results))
    // await new Promise(r => setTimeout(r, 50))
    return results
  }
}