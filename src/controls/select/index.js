import './index.css'

export default {
  create(select, ui) {
    const infoPanel = this.infoElement()
    const update = () => this.update(select, infoPanel, ui)
    select.getFeatures().on('add', update)
    select.getFeatures().on('remove', update)
    return infoPanel
  },
  infoElement() {
    const container = document.createElement('div')
    container.className = 'ol-control info-panel'
    container.hidden = true
    return container
  },
  update(select, infoPanel, ui) {
    const selectedFeatures = select.getFeatures().getArray()
    if (selectedFeatures.length > 0) {
      const infoHTML = `
      <h2>Информация:</h2>
      <hr>
      ${selectedFeatures.map((selectedFeature) => {
        const featureProperties = selectedFeature.getProperties()
        let nameGwk = featureProperties.extra && featureProperties.extra.name_gwk ? featureProperties.extra.name_gwk : 'Н/Д'

        let info = ''
        if (featureProperties.geometry.getType() === 'Point') {
          // Если точка
          info += `
            <strong>Номер ГВК:</strong> ${nameGwk}<br>
            <strong>Внутренний номер:</strong> ${featureProperties.name}<br>
            <strong>Тип:</strong> ${featureProperties.typo}<br>
            <strong>А.О. устья:</strong> ${featureProperties.head}<br>
            <strong>Водозабор:</strong> ${featureProperties.intake}<br>
            <strong>Месторождение:</strong> ${featureProperties.field}<br>
            <hr>`
        } else if (featureProperties.geometry.getType() === 'Polygon' || featureProperties.geometry.getType() === 'MultiPolygon') {
          // Если полигон
          if ('field_name' in featureProperties) {
            // Если есть свойство field_name, значит это полигон с информацией о месторождении
            info += `<strong>Месторождение:</strong> ${featureProperties.field_name}<br><hr>`
          } else if ('intake_name' in featureProperties) {
            // Если есть свойство intake_name, значит это полигон с информацией о ВЗУ
            info += `<strong>Владелец ВЗУ:</strong> ${featureProperties.intake_name}<br><hr>`
          }
        }
        return info}).join('')}`
      ui.info.innerHTML = infoHTML
      ui.info.visible = true
    } else {
      ui.info.visible = false
    }
  }
}

