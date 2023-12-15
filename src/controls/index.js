import MousePosition from 'ol/control/MousePosition'
import { toStringHDMS } from 'ol/coordinate'
import ScaleLine from "ol/control/ScaleLine"
import selectControlModule from './select'

export default {
  // layerSwitcher: new control.LayerSwitcher({
  //   collapsed: true,
  //   groupSelectStyle: 'group',
  //   tipLabel: 'Legend',
  //
  // }),
  selectControlModule,
  mousePositionControl: new MousePosition({
    coordinateFormat: function (coordinate) {
      return toStringHDMS(coordinate, 4)
    },
    projection: 'EPSG:4326',
  }),
  scaleLineControl: new ScaleLine({
    units: 'metric',
    steps: 1,
    minWidth: 100,
    maxWidth: 150,
  })
}