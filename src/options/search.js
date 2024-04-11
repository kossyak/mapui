export default {
  wells(item) {
    const { name, typo, gvk, intake, field } = item.properties
    return [name, typo.name, gvk, intake?.name || 'н/д', field?.properties.name || 'н/д'].join(', ')
  },
  intakes(item) {
    const { name } = item.properties
    return [name].join(', ')
  },
  fields(item) {
    const { name } = item.properties
    return [name].join(', ')
  },
  license(item) {
    const { name, gw_purpose, department } = item.properties
    return [name, gw_purpose, department?.name ].join(', ')
  }
}