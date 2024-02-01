import DragBox from 'ol/interaction/DragBox'
import { platformModifierKeyOnly } from 'ol/events/condition'
// import { getWidth } from 'ol/extent'

/*
export default {
  dragBox: null,
  map: null,
  pointSource: null,
  selectedFeatures: null,
  create(map, pointSource, select) {
    this.map = map
    this.pointSource = pointSource
    this.selectedFeatures = select.getFeatures()
    this.dragBox = new DragBox({
      condition: platformModifierKeyOnly,
    })
    this.dragBox.on('boxstart', () => {
      this.selectedFeatures.clear()
    })
    this.dragBox.on('boxend', this.boxend.bind(this))
    return this.dragBox
  },
  boxend() {
    const extent = this.dragBox.getGeometry().getExtent()
    console.log(this.selectedFeatures)
    const boxFeatures = []
    for (const key in this.pointSource) {
      this.pointSource[key].forEachFeatureIntersectingExtent(extent, function (feature) {
        boxFeatures.push(feature)
      })
    }
    this.selectedFeatures.extend(boxFeatures)
    
    // if the extent crosses the antimeridian process each world separately
    const worldExtent = this.map.getView().getProjection().getExtent()
    const worldWidth = getWidth(worldExtent)
    const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth)
    const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth)

    for (let world = startWorld; world <= endWorld; ++world) {
      const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0])
      const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2])
      const extent = [left, boxExtent[1], right, boxExtent[3]]

      const boxFeatures = []

      for (const key in this.pointSource) {
        // const elFeatures = this.pointSource[key].getFeaturesInExtent(extent)
        // .filter((feature) => !this.selectedFeatures.getArray().includes(feature) &&
        //   feature.getGeometry().intersectsExtent(extent))
        // if (elFeatures.length) boxFeatures.push(...elFeatures)

      }
      // features that intersect the box geometry are added to the
      // collection of selected features

      // if the view is not obliquely rotated the box geometry and
      // its extent are equalivalent so intersecting features can
      // be added directly to the collection
      const rotation = this.map.getView().getRotation()
      const oblique = rotation % (Math.PI / 2) !== 0
      // when the view is obliquely rotated the box extent will
      // exceed its geometry so both the box and the candidate
      // feature geometries are rotated around a common anchor
      // to confirm that, with the box geometry aligned with its
      // extent, the geometries intersect
      if (oblique) {
        const anchor = [0, 0]
        const geometry = this.dragBox.getGeometry().clone()
        geometry.translate(-world * worldWidth, 0)
        geometry.rotate(-rotation, anchor)
        const extent = geometry.getExtent()
        boxFeatures.forEach((feature) => {
          const geometry = feature.getGeometry().clone()
          geometry.rotate(-rotation, anchor)
          if (geometry.intersectsExtent(extent)) {
            this.selectedFeatures.push(feature)
          }
        })
      } else {
        this.selectedFeatures.extend(boxFeatures)
      }
    }
  }
}
*/