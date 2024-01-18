import data from 'bundle-text:./data.txt'
import main from './main'

const root = document.querySelector('#root')
const app = lesta.createApp({ data: JSON.parse(data) })

app.mount(main, root, { params: {} })