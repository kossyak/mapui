import main from './main'

window.create = ({ data, models, config }) => {
  const root = document.querySelector('#root')
  const app = lesta.createApp({ data, models, config })
  app.mount(main, root, { params: {} })
}

// window.addEventListener('message', (event) => {
//   console.log(event.data)
// })