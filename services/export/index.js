import main from './main'

window.create = ({ data, models }) => {
  const root = document.querySelector('#root')
  const app = lesta.createApp({ data, models })
  app.mount(main, root, { params: {} })
}

// window.addEventListener('message', (event) => {
//   console.log(event.data)
// })