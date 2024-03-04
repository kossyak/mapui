import mapUI from './src/main.js'
import api from './api'
import config from './config.js'

const target = document.querySelector('#root')
mapUI.init(target, api, config)