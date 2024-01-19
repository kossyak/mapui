export default class MS {
  constructor({ target, url, entry, onload, onmessage, width = '100%', height = '100%'}) {
    this.iframe = null
    this.url = url
    const iframe = document.createElement('iframe')
    this.iframe = iframe
    this.url = url
    iframe.src = url
    iframe.width = width
    iframe.height = height
    iframe.setAttribute('frameborder', '0')
    if (target) target.appendChild(iframe)
    iframe.onload = async () => {
      await iframe.contentWindow.create?.(entry)
      onload?.()
    }
    window.addEventListener('message', (event) => {
      if (event.source === iframe.contentWindow) onmessage?.(event.data)
    })
  }
  send(data) {
    this.iframe.contentWindow.postMessage(data, this.url)
  }
}

// window.parent.postMessage(message, '*') // Отправка сообщения из iframe в родительское окно
// (символ '*' означает, что сообщение может быть принято любым окном)
