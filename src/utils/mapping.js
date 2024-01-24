import combine from './combine'

export default function mapping(target) {
  const properties = target.getProperties()
  const { aquifer_usage, geometry } = properties
  properties.coordinates = combine(geometry.flatCoordinates)
  properties.id = target.id_
  if (properties.model === 'wells') {
    properties.typo_string = properties.typo?.name || '-'
    properties.intake_string = properties.intake?.name || '-'
    properties.field_string = properties.field?.name || '-'
  }
  if (aquifer_usage?.length) {
    properties.aquifer_usage_string = aquifer_usage.map((el) => (el.name || '-') + '/' + (el.index || '-'))
    console.log(properties.aquifer_usage_string)
  }
  return properties
}