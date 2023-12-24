export default {
  iframe: null,
  url: '',
  create({target, url, onload, width = '100%', height = '100%'}) {
    const iframe = document.createElement('iframe')
    this.iframe = iframe
    this.url = url
    iframe.src = url
    iframe.width = width
    iframe.height = height
    iframe.setAttribute('frameborder', '0')
    if (target) target.appendChild(iframe)
    iframe.onload = onload
    window.addEventListener('message', (event) => {
      if (event.source === iframe.contentWindow) {
        const message = event.data
        // Действия с полученным сообщением от микросервиса
      }
    })
    return iframe
  },
  send(message) {
    this.iframe.contentWindow.postMessage(message, this.url)
  }
}

// window.parent.postMessage(message, '*') // Отправка сообщения из iframe в родительское окно
// (символ '*' означает, что сообщение может быть принято любым окном)
