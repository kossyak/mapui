import 'ol/ol.css'
import './style.css'
import '../src/spinner/index.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultInteractions } from 'ol/interaction'
import { boundingExtent, containsCoordinate } from 'ol/extent'
import { defaults } from 'ol/control/defaults'
import { transform } from 'ol/proj'
import translateModule from './interactions/translate'
// import dragBoxModule from './interactions/dragBox'
import Select from 'ol/interaction/Select'
import tooltipOverlay from './overlay'
import Control from 'ol/control/Control'

import polygons from './interactions/polygons'
import controls from './controls'
import measureModule from './controls/measure'

import pointSources from './pointSource'
import pointLayers from './pointLayers'
import pointClusters from './pointLayers/clusters'
import groupsModule from './groups'

import menuModule from './controls/munu'
import switcherModule from './controls/switcher'

import wells from './options/wells'
import switcher from './options/switcher'
import filterList from './options/filterList'
import searchFields from './options/search'

import throttling from './utils/throttling'

import UI from './ui'
import DragBox from 'ol/interaction/DragBox'
import { platformModifierKeyOnly } from 'ol/events/condition'

import pointActive from './pointLayers/active'
import loader from "./loader"

export default {
  animate(map) {
    map.render()
    window.requestAnimationFrame(() => this.animate(map))
  },
  searchResults: [],
  async init(target, api, config, coordinate) {
    const result = await loader.init(target, api)
    const bus = {}
    const ui = UI.create(target) // { navigate, info }

    const zoom = 12
    const zoomLabel = 13
    const { wellsJson, fieldsJson, intakesJson } = result
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
    const { pointSource, pointFeatures } = pointSources.getPointSource(wells, wellsJson)
    const layers = pointLayers.create(pointSource, wells, pointFeatures)
    const layersClusters = pointClusters.create(wells, wellsJson)
    const allLayers = { fields: fieldsPolygon.layer, intakes: intakesPolygon.layer, ...layers }
    const groups = groupsModule.create(allLayers)
    const { mousePositionControl, scaleLineControl, selectControlModule } = controls
    
    // search
    ui.search.on('change', async (e) => {
      const value = e.detail?.value
      if (!value ||value.length < 3) return
      const data = await loader.search(api, value)
      const list = data.results.map(el => {
        const item = result[el.model + 'Json']?.find(o => o.id === el.object_id)
        if (item) {
          const label = searchFields[el.model]?.(item) || el.model
          return { id: el.id, label, model: el.model }
        } else return { id: el.id, label: `н/д для ${el.id}(${el.model})`, model: el.model }
      })
      ui.search.dropdown(list)
    })
    ui.search.on('select', async (e) => {
      const id = e.detail?.id
      const model = e.detail?.model
      const item = pointFeatures.find(o => o.id_ === id)
      if (item) {
        const features = select.getFeatures()
        console.log(features.getArray())
        if (features.getArray().findIndex(o => o.id_ === id) === -1) features.push(item);
        // map.getView().setZoom(zoomLabel + 1)
        // map.getView().setCenter(item.getGeometry().getCoordinates())
        map.getView().animate({ zoom: zoomLabel + 1, center: item.getGeometry().getCoordinates(), duration: 800 });
      }
    })
    
    
    let isCluster = true
    const switchCluster = (v) => {
      if (v) {
        layersClusters.setVisible(false)
        wells.forEach(item => {
          groups[item.key].setVisible(v)
        })
        switcherDisabled(false)
      } else {
        wells.forEach(item => {
          groups[item.key].setVisible(v)
        })
        layersClusters.setVisible(true)
        switcherDisabled(true)
      }
    }
    
    
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
      search: {
        content: '🔍',
        title: 'Полнотекстовый поиск',
        toggle: true,
        onclick: (active) => {
          // active ? measure.init() : measure.destroy()
        }
      },
      cluster: {
        content: '👓',
        title: 'Кластеризация',
        toggle: true,
        onclick: (v) => {
          isCluster = !isCluster
          switchCluster(v)
        }
      },
      ruler: {
        content: '📏',
        toggle: true,
        onclick: (active) => {
          active ? measure.init() : measure.destroy()
        }
      },
      editBtn: {
        content: '✏️', // svg,
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
      },
      refresh: {
        content: '↺',
        onclick: () => localStorage.removeItem('data')
      }
    })
    pointActive.create(bus)
    const selectControl = selectControlModule.create(ui, config, pointActive)
    const select = new Select({
      layers: Object.values(allLayers)
    })
    const selectedFeatures = select.getFeatures()
    const dragBox = new DragBox({ condition: platformModifierKeyOnly })
    select.on('select', (e) => {
      pointActive.remove()
      selectControl.update(selectedFeatures.getArray())
    })
    select.getFeatures().on('add', (e) => {
      selectControl.update(selectedFeatures.getArray())
    })
    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent()
      const boxFeatures = []
      for (const key in pointSource) {
        pointSource[key].forEachFeatureIntersectingExtent(extent, (feature) => {
          const target = switcher.at(0).children.find((el) => el.typo === feature.getProperties().typo.id)
          target?.visible && !feature._hidden && boxFeatures.push(feature)
        })
      }
      selectedFeatures.extend(boxFeatures)
      selectControl.update(selectedFeatures.getArray())
    })
    dragBox.on('boxstart', () => {
      selectedFeatures.clear()
      pointActive.remove()
    })
    // selectedFeatures.on(['add', 'remove'], function() {})
    ui.navigate.on('close', () => {
      selectedFeatures.clear()
      pointActive.remove()
    })
    
    const translate = translateModule.create(select)
    
    const menuControl = new Control({ element: menuElement })
    const infoControl = new Control({ element: selectControl.infoPanel })
    select.setActive(true)
    
    const map = new Map({
      interactions: defaultInteractions().extend([intakesPolygon.interaction, fieldsPolygon.interaction, select, translate]),
      controls: defaults().extend([mousePositionControl, scaleLineControl, menuControl, infoControl]),
      layers: [...Object.values(groups), layersClusters],
      view: new View({ center: transform(coordinate || [36.1874, 51.7373], 'EPSG:4326', 'EPSG:3857'), zoom }),
      target: ui.map
    })
    const measure = measureModule.create(map)
    bus.map = map
    // map.on('click', function(e) {
    //   if (e.originalEvent.ctrlKey && select.getFeatures().array_.length > 0) {
    //     console.log(222)
    //   }
    // })
    
    // zoom
    let visible = false
    const hidden_aquifers = switcher.find(el => el.hidden_aquifers).hidden_aquifers
    const hidden_filters = switcher.find(el => el.hidden_filters).hidden_filters
    const filterByAquifer = () => {
      const extent = map.getView().calculateExtent(map.getSize())
      const unique = [{
        id: 0,
        name: 'нд',
        index: 'нд',
        color: "#ffffff"
      }]
      pointFeatures.forEach((feature) => {
        if (containsCoordinate(extent, feature.getGeometry().getCoordinates())) {
          const aquifer_usage = feature.getProperties().aquifer_usage
          aquifer_usage?.forEach(e => {
            if (!unique.some((el) => el.index === e.index)) unique.push(e)
          })
        }
      })
      switcherElement.aquifers.content()
      unique.sort((a, b) => (b.index > a.index) ? 1 : ((a.index > b.index) ? -1 : 0))
      unique.forEach((el) => {
        switcherModule.createSwitch({
          target: switcherElement.aquifers,
          title: `${el.index} / ${el.name}`,
          visible: !hidden_aquifers.has(el.index),
          color: el.color,
          handler: (v) => {
            v ? hidden_aquifers.delete(el.index) : hidden_aquifers.add(el.index)
            pointLayers.visibleAquiferPoints(el.index, v,hidden_filters)
          }
        })
      })
    }
    filterList.forEach((el) => {
      switcherModule.createSwitch({
        target: switcherElement.filters,
        title: el.title,
        visible: el.visible,
        handler: (v) => {
          v ? hidden_filters.add(el.key) : hidden_filters.delete(el.key)
          pointLayers.visibleFiltersPoints(el.key, v, hidden_filters, hidden_aquifers)
        }
      })
    })
    const switcherDisabled = (v) => {
      switcherElement.wells.children[1].children[0].disabled = v
      switcherElement.aquifers.children[1].children[0].disabled = v
      switcherElement.filters.children[1].children[0].disabled = v
    }
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
        if (isCluster) switchCluster(v)
      }
      visibleLabels(currentZoom > zoomLabel)
      filterByAquifer()
    }, 200))
    map.on('click', (e) => {
      layersClusters.getFeatures(e.pixel).then((clickedFeatures) => {
        if (clickedFeatures.length) {
          // Get clustered Coordinates
          const features = clickedFeatures[0].get('features')
          const extent = boundingExtent(
            features.map((r) => r.getGeometry().getCoordinates())
          )
          map.getView().fit(extent, { maxZoom: zoomLabel + 1, duration: 500, zoom: 13, padding: [50, 50, 50, 50]})
        }
      })
    })
    
    map.getView().dispatchEvent('change:resolution')
    map.on("moveend", () => filterByAquifer())
  
    const tooltip = tooltipOverlay.create(map)
    map.addInteraction(dragBox)
    map.addOverlay(tooltip)
    // this.animate(map)
    // map.getInteractions().extend([selectInteraction]);
  }
}


