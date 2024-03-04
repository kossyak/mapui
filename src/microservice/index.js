export default class MS {
  constructor({ target, url, entry, onload, onmessage, width = '100%', height = '100%'}) {
    this.iframe = null
    this.url = url
    const iframe = document.createElement('iframe')
    this.iframe = iframe
    this.url = url
    iframe.sandbox = 'allow-same-origin allow-scripts'
    iframe.src = url
    iframe.width = width
    iframe.height = height
    iframe.setAttribute('frameborder', '0')
    if (target) target.appendChild(iframe)
    const error = () => {
      iframe.srcdoc = `<?xml version="1.0" encoding="utf-8"?>
<!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve" fill="#ddd">
<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
<g><g><path d="M233.8,226H22.2c-7.6,0-12.2-6.2-12.2-12.3V42.3C10,34.6,16.2,30,22.2,30h211.6c7.6,0,12.2,6.2,12.2,12.3v171.4C246,221.4,239.8,226,233.8,226z M27.9,208h200.2V48H27.9V208z"/><path d="M86.5,105.3c-1.9,0-3.8-0.7-5.3-2.2L61.9,83.6C59,80.7,59,76,61.9,73c2.9-2.9,7.6-2.9,10.5,0l19.4,19.5c2.9,2.9,2.9,7.7,0,10.6C90.3,104.6,88.4,105.3,86.5,105.3z"/><path d="M67.2,105.3c-1.9,0-3.8-0.7-5.3-2.2c-2.9-2.9-2.9-7.7,0-10.6L81.3,73c2.9-2.9,7.6-2.9,10.5,0c2.9,2.9,2.9,7.7,0,10.6l-19.4,19.5C71,104.6,69.1,105.3,67.2,105.3z"/><path d="M188.9,105.4c-1.9,0-3.8-0.7-5.3-2.2l-19.4-19.5c-2.9-2.9-2.9-7.7,0-10.6c2.9-2.9,7.6-2.9,10.5,0l19.4,19.5c2.9,2.9,2.9,7.7,0,10.6C192.7,104.6,190.8,105.4,188.9,105.4z"/><path d="M169.5,105.3c-1.9,0-3.8-0.7-5.3-2.2c-2.9-2.9-2.9-7.7,0-10.6L183.6,73c2.9-2.9,7.6-2.9,10.5,0c2.9,2.9,2.9,7.7,0,10.6l-19.4,19.5C173.3,104.6,171.4,105.3,169.5,105.3z"/><path d="M193.6,178.8H62.4c-4.1,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5h131.2c4.1,0,7.5,3.3,7.5,7.5C201.1,175.5,197.7,178.8,193.6,178.8z"/><path d="M138.2,178.8V193c0,0,0,10.2,14.9,10.2h16c0,0,14.9,0,14.9-10.2v-14.1H138.2z"/></g></g>
</svg>`
    }
    let timepast = false
    setTimeout(() => {
      timepast = true
    }, 500)
    iframe.addEventListener('load',  async () => {
      if (!timepast && !iframe.srcdoc) error()
      try {
        await iframe.contentWindow.create?.(entry)
        onload?.()
      } catch (error) {
        console.log(error)
      }
    }, true)
    iframe.onerror = () => error()
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
