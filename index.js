import mapUI from './src/main.js'
import loader from './src/loader'
import api from './src/api'

const target = document.querySelector('#root')
const urls = [api.wells.get, api.fields.get, api.vzu.get]
loader.init(urls).then(result => mapUI.init(target, result))