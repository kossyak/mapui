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
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Проверка, начинается ли строка куки с имени, которое мы хотим найти
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },
  async queryBase(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },
  async query(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': secret.Authorization
      }
    })
    return await response.json()
  },
  async submit(url, data, method = 'POST') {
    const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': secret.Authorization,
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  },
  async search(api, value, content_types) {
    const url = `${api.search + value}&limit=5${content_types ? '&content_type__in=' + content_types + ',' : ''}`
    return this.query(url)
  },
  // async updateCoordinates(featureId, coordinates, type) {
  //   const url = `${this[type].set}${featureId}`
  //   const data = { coordinates }
  //   console.log(url)
  //   console.log('Отправляемый запрос:', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   })
  // }
  async init(target, api) {
    let results = {}
    target.innerHTML = progress.template
    this.progress = document.querySelector('.progress')
    this.total = progress.data.length
    const promises = []
    progress.data.forEach(el => {
      promises.push(
        new Promise((resolve, reject) => {
          console.time("for loop " + el.key)
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
              console.timeEnd("for loop " + el.key)
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
    
    await Promise.all(promises)
    
    localStorage.setItem('data', JSON.stringify(results))
    // await new Promise(r => setTimeout(r, 50))
    return results
  }
}