import './index.css'
import Draw from 'ol/interaction/Draw.js'
import Overlay from 'ol/Overlay.js'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'
import { LineString, Polygon } from 'ol/geom.js'
import { getArea, getLength } from 'ol/sphere.js'
import { unByKey } from 'ol/Observable.js'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'

export default {
  draw: null,
  sketch: null,
  helpTooltipElement: null,
  helpTooltip: null,
  measureTooltipElement: null,
  measureTooltip: [],
  continuePolygonMsg: 'Двойной клик для окончания рисования',
  continueLineMsg: 'Двойной клик для окончания рисования',
  create(map) {
    const source = new VectorSource()
    const measureVector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
    })
    const pointerMoveHandler = this.pointerMoveHandler.bind(this)
    const mouseoutHandler = () => this.helpTooltipElement.classList.add('hidden')
    return {
      destroy: () => {
        map.un('pointermove', pointerMoveHandler)
        map.getViewport().removeEventListener('mouseout', mouseoutHandler)
        map.removeOverlay(this.helpTooltip)
        map.removeInteraction(this.draw)
        map.removeLayer(measureVector)
        source.clear()
        this.measureTooltip.forEach(o => {
          map.removeOverlay(o)
        })
      },
      init: () => {
        map.addLayer(measureVector)
        map.on('pointermove', pointerMoveHandler)
        map.getViewport().addEventListener('mouseout', mouseoutHandler)
        this.init(map, source)
      }
    }
  },
  pointerMoveHandler(evt) {
    if (evt.dragging) return
    let helpMsg = 'Кликните для начала рисования'
    
    if (this.sketch) {
      const geom = this.sketch.getGeometry()
      if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg
      } else if (geom instanceof LineString) {
        helpMsg = this.continueLineMsg
      }
    }
    this.helpTooltipElement.innerHTML = helpMsg
    this.helpTooltip.setPosition(evt.coordinate)
  
    this.helpTooltipElement.classList.remove('hidden')
  },
  formatLength(line) {
    const length = getLength(line)
    let output
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm'
    }
    return output
  },
  formatArea(polygon) {
    const area = getArea(polygon)
    let output
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
    }
    return output
  },
  init(map, source) {
    const style = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    })
    
    const type = 'LineString' // 'Polygon'
    this.draw = new Draw({
      source: source,
      type: type,
      style: function (feature) {
        feature.__id = 'measure'
        const geometryType = feature.getGeometry().getType()
        if (geometryType === type || geometryType === 'Point') {
          return style
        }
      },
    })
    map.addInteraction(this.draw)

    this.createMeasureTooltip(map)
    this.createHelpTooltip(map)
    
    let listener
    this.draw.on('drawstart', (evt) => {
      // set sketch
      this.sketch = evt.feature

      let tooltipCoord = evt.coordinate

      listener = this.sketch.getGeometry().on('change', (evt) => {
        const geom = evt.target
        let output
        if (geom instanceof Polygon) {
          output = this.formatArea(geom)
          tooltipCoord = geom.getInteriorPoint().getCoordinates()
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom)
          tooltipCoord = geom.getLastCoordinate()
        }
        this.measureTooltipElement.innerHTML = output
        this.measureTooltip.at(-1).setPosition(tooltipCoord)
      })
    })
    
    this.draw.on('drawend', () => {
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      this.measureTooltip.at(-1).setOffset([0, -7])
      // unset sketch
      this.sketch = null
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null
      this.createMeasureTooltip(map)
      unByKey(listener)
    })
  },
  createHelpTooltip(map) {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
    }
    this.helpTooltipElement = document.createElement('div')
    
    this.helpTooltipElement.className = 'ol-tooltip hidden'
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    })
    map.addOverlay(this.helpTooltip)
  },
  createMeasureTooltip(map) {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement)
    }
    this.measureTooltipElement = document.createElement('div')
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    const measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
    })
    this.measureTooltip.push(measureTooltip)
    map.addOverlay(measureTooltip)
  }
}