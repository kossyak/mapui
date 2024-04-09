export default {
  wells(item) {
    const { name, typo, gvk, intake, field } = item.properties
    return [name, typo.name,gvk, intake.name, field.properties.name].join(', ')
  }
}