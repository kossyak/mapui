import secret from '../../secret'
import './index.css'

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
    try {
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
    } catch (error) {
      return { detail: error }
    }
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
  async init(target, config) {
    let results = {}
    target.innerHTML = `<svg version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 28.7 29.3"
                 style="enable-background:new 0 0 28.7 29.3;" xml:space="preserve">
<path fill="#4B47BE" d="M6.2,0.1h6.6c3.2,0,5.9,0.6,8.3,1.8s4.2,2.9,5.6,5.1s2,4.7,2,7.7c0,2.9-0.7,5.5-2,7.7c-1.3,2.2-3.2,3.9-5.6,5.1c-2.4,1.2-5.2,1.8-8.3,1.8H0V0.1h4.8v6.1v9.1c0,5.2,4.3,9.5,9.5,9.5c5.2,0,9.5-4.2,9.5-9.5c0-8.7-8.3-8-14.1-9.2C7.7,5.8,6.2,3.9,6.2,1.8C6.2,0.9,6.2,0.1,6.2,0.1z"/>
</svg>
<div class="progress" data-label="Loading..."></div>`
    this.progress = document.querySelector('.progress')
    this.total = Object.keys(config.store).length
    const promises = []
    for (const key in config.store) {
      const el = config.store[key]
      promises.push(
        new Promise((resolve, reject) => {
          console.time("for loop " + el.label)
          fetch(el.get, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': secret.Authorization
            }
          }).then(async (response) => {
            if (response.ok) {
              const data = await response.json()
              results[key] = data.results?.features || data.results
              this.update(el.label)
              console.timeEnd("for loop " + el.label)
              resolve()
            } else {
              results[key] = null
              this.update(el.label)
              reject()
            }
          })
        }
      ))
    }
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