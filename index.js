import mapUI from './src/main.js'
import loader from './loader'
import api from './api'
import config from './config.js'

const target = document.querySelector('#root')
loader.init(api).then(result => {
  mapUI.init(target, result, config)
})