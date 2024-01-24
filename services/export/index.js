import main from './main'
// import data from './data.json'
// import models from '../../src/options/models'
// import config from '../../config'

window.create = ({ data, models, config }) => {
  const root = document.querySelector('#root')
  const app = lesta.createApp({ data: data, models, config })
  app.mount(main, root, { params: {} })
}