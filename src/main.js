import 'ol/ol.css'
import './style.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultInteractions } from 'ol/interaction'
import { containsCoordinate } from 'ol/extent'
import { defaults } from 'ol/control/defaults'
import { transform } from 'ol/proj'
import translateModule from './interactions/translate'
import dragBoxModule from './interactions/dragBox'
import Select from 'ol/interaction/Select'
import tooltipOverlay from './overlay'
import Control from 'ol/control/Control'

import polygons from './interactions/polygons'
import controls from './controls'
import measureModule from './controls/measure'

import pointSource from './pointSource'
import pointLayers from './pointLayers'
import groupsModule from './groups'

import menuModule from './controls/munu'
import switcherModule from './controls/switcher'

import wells from './options/wells'
import switcher from './options/switcher'

import throttling from './utils/throttling'

import UI from './ui'

export default {
  animate(map) {
    map.render()
    window.requestAnimationFrame(() => this.animate(map))
  },
  init(target, result, config, coordinate) {
    const ui = UI.create(target) // { navigate, info }
    const zoom = 12
    const zoomLabel = 13
    const wellsJson = result[0]
    const fieldsJson = result[1]
    const intakesJson = result[2]
    const fieldsPolygon = polygons.create({
      features: fieldsJson,
      type: 'fields',
      style: {
        strokeColor: '#01796f',
        fillColor: [0, 56, 123, 0.4]
      }
    })
    const intakesPolygon = polygons.create({
      features: intakesJson,
      type: 'intakes',
      style: {
        strokeColor: 'blue',
        fillColor: [0, 0, 128, 0.4]
      }
    })
    const pointSrc = pointSource.getPointSource(wells, wellsJson)
    const layers = pointLayers.create(pointSrc, wells)
    const allLayers = { fields: fieldsPolygon.layer, intakes: intakesPolygon.layer, ...layers }
    const groups = groupsModule.create(allLayers)
    const { mousePositionControl, scaleLineControl, selectControlModule } = controls
  
    // switcher
    wells.forEach((item) => {
      const target = switcher[0].children.find(el => el.key === item.key)
      if (target) {
        target.key = item.key
        target.color = item.color
      } else console.error('wells and switcher do not correspond')
    })
    const switcherElement = switcherModule.create(switcher, groups)
    
    // menu
    const menuElement = menuModule.create({
      ruler: {
        content: '📏',
        toggle: true,
        onclick: (active) => {
          active ? measure.init() : measure.destroy()
        }
      },
      editBtn: {
        content: '✎', // svg,
        title: 'Редактировать',
        toggle: true,
        onclick: (isActive) => {
          if (isActive) {
            translate.setActive(true)
            fieldsPolygon.interaction.setActive(true)
            intakesPolygon.interaction.setActive(true)
            map.removeOverlay(tooltip)
          } else {
            translate.setActive(false)
            fieldsPolygon.interaction.setActive(false)
            intakesPolygon.interaction.setActive(false)
            select.getFeatures().clear()
            map.addOverlay(tooltip)
          }
        }
      },
      switchBtn: {
        content: '☰',
        onclick: (active) => {
          ui.info.content(switcherElement)
          ui.info.visible(true)
        }
      }
    })
    
    const select = new Select({
      layers: Object.values(allLayers)
    })
    const translate = translateModule.create(select)
    const infoElement = selectControlModule.create(select, ui, config)
    const menuControl = new Control({ element: menuElement })
    const infoControl = new Control({ element: infoElement })
    select.setActive(true)
    
    const map = new Map({
      interactions: defaultInteractions().extend([intakesPolygon.interaction, fieldsPolygon.interaction, select, translate]),
      controls: defaults().extend([mousePositionControl, scaleLineControl, menuControl, infoControl]),
      layers: Object.values(groups),
      view: new View({ center: transform(coordinate || [36.1874, 51.7373], 'EPSG:4326', 'EPSG:3857'), zoom }),
      target: ui.map
    })
    const measure = measureModule.create(map)
    
    // map.on('click', function(e) {
    //   if (e.originalEvent.ctrlKey && select.getFeatures().array_.length > 0) {
    //     console.log(222)
    //   }
    // })
    
    // zoom
    let visible = false
    
    map.getView().on('change:resolution', throttling(() => {
      const currentZoom = map.getView().getZoom()
      const visibleLabels = (v) => {
        if (visible !== v) {
          visible = v
          wells.forEach(item => {
            const layers = groups[item.key].getLayers()
            layers.array_[1].setVisible(v)
          })
        }
      }
      visibleLabels(currentZoom > zoomLabel)
      // оо
      console.dir(switcherElement.children[2].content(33))
      const extent = map.getView().calculateExtent(map.getSize())
      const visiblePoints = []
      const unique = []
      pointSrc.explo.getFeatures().forEach((point) => {
        if (containsCoordinate(extent, point.getGeometry().getCoordinates())) {
          visiblePoints.push(point)
          const aquifer_usage = point.getProperties().aquifer_usage
          aquifer_usage.forEach(e => {
            if (!unique.some((el) => el.index === e.index)) unique.push(e)
          })
        }
      })
      console.log(unique)
    }, 800))
    map.getView().dispatchEvent('change:resolution')
    
    const dragBox = dragBoxModule.create(map, pointSrc, select)
    const tooltip = tooltipOverlay.create(map)
    map.addInteraction(dragBox)
    map.addOverlay(tooltip)
    // this.animate(map)
  }
}


