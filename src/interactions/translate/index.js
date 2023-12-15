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
      let coordinates_url
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
      if (feature.getGeometry().getType() === 'Point') {
        coordinates_url = '/base/api/wells/'
      } else if (feature.getGeometry().getType() === 'Polygon' || feature.getGeometry().getType() === 'MultiPolygon') {
        const properties = feature.getProperties()
        if ('field_name' in properties) {
          coordinates_url = '/base/api/fields/'
        } else if ('intake_name' in properties) {
          coordinates_url = '/base/api/vzus/'
        }
      }
      this.updateCoordinates(featureId, coordinates, coordinates_url)
    })
  },
  updateCoordinates(featureId, coordinates, coordinates_url) {
    console.log(featureId, coordinates, coordinates_url)
    // const url = `${coordinates_url}${featureId}`
    // const data = {
    //   coordinates: coordinates
    // };
    // console.log(url);
    // console.log('Отправляемый запрос:', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data)
    // })
  }
}



