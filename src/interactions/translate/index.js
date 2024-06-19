import Translate from 'ol/interaction/Translate'
import { transform } from "ol/proj"

export default {
  create(select) {
    const translate = new Translate({
      features: select.getFeatures(),
    })
    translate.on('translateend', this.translateend.bind(this))
    translate.setActive(false)
    return translate
  },
  translateend(event) {
    // обработка получения координат, в зависимости от источника
    const features = event.features.getArray()
    features.forEach((feature) => {
      let coordinates
      // для точки
      if (feature.getGeometry().getType() === 'Point') {
        coordinates = transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
      } else if (feature.getGeometry().getType() === 'Polygon') {
        // Для полигона
        coordinates = feature.getGeometry().getCoordinates().map(
          ring => ring.map(
            point => transform(point, 'EPSG:3857', 'EPSG:4326')
          )
        );
      } else if (feature.getGeometry().getType() === 'MultiPolygon') {
        // Для мультиполигона
        coordinates = feature.getGeometry().getCoordinates().map(
          polygon => polygon.map(
            ring => ring.map(
              point => transform(point, 'EPSG:3857', 'EPSG:4326')
            )
          )
        )
      }
      const featureId = feature.get('pk')
      const properties = feature.getProperties()
      // if (feature.getGeometry().getType() === 'Point') {
      //   type = 'wells'
      // } else if (feature.getGeometry().getType() === 'Polygon' || feature.getGeometry().getType() === 'MultiPolygon') {
      //   const properties = feature.getProperties()
      //   if (properties.field_name) {
      //     type = 'fields'
      //   } else if (properties.intake_name) {
      //     type = 'vzu'
      //   }
      // }
      // api.updateCoordinates(featureId, coordinates, properties?.model)
    })
  }
}



