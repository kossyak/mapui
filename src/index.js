import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultInteractions } from 'ol/interaction'
import { defaults } from 'ol/control/defaults'
import { transform } from 'ol/proj'
import translateModule from './interactions/translate'
import dragBoxModule from './interactions/dragBox'
import Select from 'ol/interaction/Select'
import tooltipOverlay from './overlay'
import Control from 'ol/control/Control'
// Json source
import fieldsJson from './interactions/polygons/fields.json'
import VZUJson from './interactions/polygons/VZU.json'

import polygons from './interactions/polygons'
import controls from './controls'

import pointSourceModule from './pointSource'
import layersModule from './layers'
import groupsModule from './groups'

import menuModule from './controls/munu'
import switcherModule from './controls/switcher'

import UI from './ui'

export default {
  animate(map) {
    map.render()
    window.requestAnimationFrame(() => this.animate(map))
  },
  init(target, coordinate) {
    const ui = UI.create(target) // { navigate, info }
    const zoom = 12
    const zoomLabel = 13
    const wellsOption = {
      explo: {
        typo: 'эксплуатационный',
        color: [17, 30, 108, 0.7]
      },
      razv: {
        typo: 'разведочный',
        color: [14, 77, 146, 0.7]
      },
      reg: {
        typo: 'режимный',
        color: [0, 128, 255, 0.7]
      },
      razvexp: {
        typo: 'разведочно-эксплуатационный',
        color: [0, 49, 82, 0.7]
      },
      min: {
        typo: 'минеральный',
        color: [0, 128, 129, 0.7]
      }
    }
    const switcherOptions = [
      { title: 'Подразделение данных', children: wellsOption },
      { title: 'Геологические и гидрогеологические карты' },
      { title: 'Абсолютные отметки' },
      { title: 'Спутниковые карты' }]
    
    const fieldsPolygon = polygons.create({
      getUrl: 'app/map/fields',
      setUrl: '/base/api/fields/',
      data: fieldsJson
    })
    const VZUPolygon = polygons.create({
      getUrl: '/map/vzu',
      setUrl: '/base/api/fields/',
      data: VZUJson,
      style: {
        strokeColor: 'blue',
        fillColor: [0, 0, 128, 0.4]
      }
    })
    const pointSource = pointSourceModule.getPointSource(wellsOption)
    const layers = layersModule.create(pointSource, wellsOption)
    const allLayers = { fields: fieldsPolygon.layer, VZU: VZUPolygon.layer, ...layers }
    const groups = groupsModule.create(allLayers)
    const { OSM, terrain, snapshots, fields, VZU, explo, razv, reg, razvexp, min } = groups
    
    const { mousePositionControl, scaleLineControl, selectControlModule } = controls
    
    const switcherElement = switcherModule.create({snapshots, terrain, fields, VZU, explo, razv, reg, razvexp, min}, wellsOption)
    
    const menuElement = menuModule.create({
      editBtn: {
        content: '✎', // svg,
        title: 'Редактировать',
        onclick: (isActive) => {
          if (isActive) {
            translate.setActive(true)
            fieldsPolygon.interaction.setActive(true)
            VZUPolygon.interaction.setActive(true)
          } else {
            translate.setActive(false)
            fieldsPolygon.interaction.setActive(false)
            VZUPolygon.interaction.setActive(false)
            select.getFeatures().clear()
          }
        }
      },
      bar: {
        content: '☰',
        title: '',
      },
      switchBtn: {
        content: '…',
        onclick: (isActive) => switcherElement.hidden = !isActive
      }
    })
    
    
    const select = new Select()
    const translate = translateModule.create(select)
    const infoElement = selectControlModule.create(select, ui)
    const menuControl = new Control({ element: menuElement })
    const switcherControl = new Control({ element: switcherElement })
    const infoControl = new Control({ element: infoElement })
    select.setActive(true)
    
    const map = new Map({
      interactions: defaultInteractions().extend([VZUPolygon.interaction, fieldsPolygon.interaction, select, translate]),
      controls: defaults().extend([mousePositionControl, scaleLineControl, menuControl, switcherControl, infoControl]),
      layers: [OSM, terrain, snapshots, fields, VZU, explo, razv, reg, razvexp, min],
      view: new View({ center: transform(coordinate || [36.1874, 51.7373], 'EPSG:4326', 'EPSG:3857'), zoom }),
      target: ui.map
    })
    let visible = false
    map.getView().on('change:resolution', () => {
      const currentZoom = map.getView().getZoom()
      const visibleLabels = (v) => {
        if (visible !== v) {
          visible = v
          for (const key in wellsOption) {
            const layers = groups[key].getLayers()
            layers.array_[1].setVisible(v)
          }
        }
      }
      visibleLabels(currentZoom > zoomLabel)
    })
    map.getView().dispatchEvent('change:resolution')
    
    const dragBox = dragBoxModule.create(map, pointSource, select)
    const tooltip = tooltipOverlay.create(map)
    map.addInteraction(dragBox)
    map.addOverlay(tooltip)
    this.animate(map)
  }
}


