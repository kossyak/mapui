import mapUI from './src/main.js'
import loader from './loader'
import api from './api'
import config from './config.js'

const target = document.querySelector('#root')
const urls = [api.wells.get, api.fields.get, api.intakes.get]
loader.init(urls).then(result => {
  debugger
  mapUI.init(target, result, config)
})