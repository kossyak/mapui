import combine from './combine'

export default function mapping(target) {
  const properties = target.getProperties()
  const { aquifer_usage, geometry } = properties
  properties.coordinates = combine(geometry.flatCoordinates)
  properties.id = target.id_
  if (aquifer_usage?.length) {
    properties.aquifer_usage_string = aquifer_usage.map((el) => (el.name || '-') + '/' + (el.index || '-'))
    console.log(properties.aquifer_usage_string)
  }
  return properties
}