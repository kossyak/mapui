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
import sections from './interactions/sections'

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
import searchDropdown from './search'

import throttling from './utils/throttling'

import UI from './ui'
import DragBox from 'ol/interaction/DragBox'
import { platformModifierKeyOnly } from 'ol/events/condition'

import pointActive from './pointLayers/active'
import loader from './loader'
import notice from './ui/components/notice'

export default {
  animate(map) {
    map.render()
    window.requestAnimationFrame(() => this.animate(map))
  },
  searchResults: [],
  async init(target, config, coordinate) {
    const api = config.api
    const user = await loader.queryBase(api.user)
    const result = await loader.init(target, config)
    config.user = user
    
    const bus = {}
    const ui = UI.create(target, user, api) // { navigate, info }
    notice.init({ target })
    config.notice = (v) => notice.add(v)
    const zoom = 12
    const zoomLabel = 13
    const { wellsJson, fieldsJson, intakesJson, licenseJson, sectionJson } = result
    const fieldsPolygon = polygons.create({
      featuresJSON: fieldsJson,
      type: 'fields',
      style: {
        strokeColor: '#01796f',
        fillColor: '#00387B66' // [0, 56, 123, 0.4]
      }
    })
    const intakesPolygon = polygons.create({
      featuresJSON: intakesJson,
      type: 'intakes',
      style: {
        strokeColor: 'blue',
        fillColor: '#00008066' // [0, 0, 128, 0.4]
      }
    })
    const licensePolygon = polygons.create({
      featuresJSON: licenseJson,
      type: 'license',
      style: {
        strokeColor: 'gray',
        fillColor: '#99999999'
      }
    })
    const sectionMultiLine = sections.create({
      featuresJSON: sectionJson,
      type: 'section',
      style: {
        strokeColor: '#00008066'
      }
    })
    const fieldsFeatures = fieldsPolygon.features
    const intakesFeatures = intakesPolygon.features
    const licenseFeatures = licensePolygon.features
    const sectionFeatures = sectionMultiLine.features
    
    const { wellsSource, wellsFeatures } = pointSources.getPointSource(wells, wellsJson)
    const layers = pointLayers.create(wellsSource, wells, wellsFeatures)
    const layersClusters = pointClusters.create(wells, wellsJson)
    const allLayers = { fields: fieldsPolygon.layer, intakes: intakesPolygon.layer, license: licensePolygon.layer, section: sectionMultiLine.layer, ...layers }
    const groups = groupsModule.create(allLayers)
    const { mousePositionControl, scaleLineControl, selectControlModule } = controls
    
    // search
  
    config.searchResults = async (value, content_types) => {
      const data = await loader.search(api, value, content_types)
      return searchDropdown.render(data, { wellsJson, fieldsJson, intakesJson, licenseJson, sectionJson })
    }
    config.getFeatureById = (id, model) => {
      const allFeatures = { fieldsFeatures, intakesFeatures, licenseFeatures, sectionFeatures, wellsFeatures }
      return allFeatures[model + 'Features'].find(o => o.id_ === id)
    }
    
    ui.search.on('action', async (e) => {
      if (e.type !== 'action') return
      const value = e.detail?.value
      const tab = e.detail?.tab
      // if (!value ||value.length < 2) return
      const html = await config.searchResults(value, tab.content_types)
      ui.search.dropdown(html)
    })
    ui.search.on('active', async (e) => {
      if (e.type !== 'active') return
      const id = e.detail?.id
      const model = e.detail?.model
      const item = config.getFeatureById(id, model)
      if (item) {
        const features = select.getFeatures()
        if (features.getArray().findIndex(o => o.id_ === id) === -1) features.push(item)
        // map.getView().setZoom(zoomLabel + 1)
        // map.getView().setCenter(item.getGeometry().getCoordinates())
        // console.log(item.geometry.bounds)
        const geom = item.getGeometry()
        if (!geom) return
        let coords
        switch (geom.getType()) {
          case 'Point':
            coords = geom.getCoordinates()
            break;
          case 'LineString':
            coords = geom.getCoordinateAt(0.5)
            break;
          case 'Polygon':
          case 'MultiPoint':
          case 'MultiLineString':
          case 'MultiPolygon':
            coords = geom.getExtent()
            break;
          default:
            console.error('Unsupported geometry type');
            break;
        }
        map.getView().animate({ zoom: zoomLabel + 1, center: coords, duration: 800 })
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
    ui.info.content(switcherElement)
    // menu
    
    const menuElement = menuModule.create({
      search: {
        content: '🔍',
        title: 'Полнотекстовый поиск',
        toggle: true,
        onclick: (active) => {
          ui.search.hidden = !active
          ui.search.focus()
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
        title: 'Линейка',
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
          console.log(isActive)
          if (isActive) {
            translate.setActive(true)
            fieldsPolygon.interaction.setActive(true)
            intakesPolygon.interaction.setActive(true)
            licensePolygon.interaction.setActive(true)
            sectionMultiLine.interaction.setActive(true)
            map.removeOverlay(tooltip)
          } else {
            translate.setActive(false)
            fieldsPolygon.interaction.setActive(false)
            intakesPolygon.interaction.setActive(false)
            licensePolygon.interaction.setActive(false)
            sectionMultiLine.interaction.setActive(false)
            select.getFeatures().clear()
            map.addOverlay(tooltip)
          }
        }
      },
      switchBtn: {
        content: '☰',
        toggle: true,
        onclick: (isActive) => {
          ui.info.visible(isActive)
        }
      },
      refresh: {
        content: '↺',
        onclick: () => {
          localStorage.removeItem('data')
          alert('Кэш очищен')
        }
      }
    })
    ui.info.on('close', () => menuElement.children[4].active(false))
    pointActive.create(bus)
    
    const select = new Select({
      layers: Object.values(allLayers)
    })
    const selectControl = selectControlModule.create(ui, config, pointActive, select, result)
    const selectedFeatures = select.getFeatures()
    const dragBox = new DragBox({ condition: platformModifierKeyOnly })
    select.on('select', (e) => {
      pointActive.remove()
      selectControl.update()
      console.log(8)
    })
    select.getFeatures().on('add', (e) => {
      selectControl.update()
      console.log(9)
    })
    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent()
      const boxFeatures = []
      for (const key in wellsSource) { // wellsFeatures
        wellsSource[key].forEachFeatureIntersectingExtent(extent, (feature) => {
          const target = switcher.at(0).children.find((el) => el.typo === feature.getProperties().typo.id)
          target?.visible && !feature._hidden && boxFeatures.push(feature)
        })
      }
      selectedFeatures.extend(boxFeatures)
      selectControl.update()
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
      interactions: defaultInteractions().extend([intakesPolygon.interaction, fieldsPolygon.interaction, licensePolygon.interaction, sectionMultiLine.interaction, select, translate]),
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
      // const unique = [{
      //   id: 0,
      //   name: 'нд',
      //   index: 'нд',
      //   color: "#ffffff"
      // }]
      const unique = []
      wellsFeatures.forEach((feature) => {
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
    config.onmessage = (data) => {
      if (data.name === 'wells') {
        const selectedFeatures = select.getFeatures()
        const boxFeatures = wellsFeatures.filter((feature) => data.value.includes(feature.id_) )
        selectedFeatures.extend(boxFeatures)
      }
    }
    // this.animate(map)
    // map.getInteractions().extend([selectInteraction]);
  }
}


