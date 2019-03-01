export default (schema) => {
  const properties = schema.getProperties()

  // Key starts with $ e.g. $or, $and
  const isMongoOperator = key => key.match(/^\$/)

  const getType = (key, parentKey) => {
    if (parentKey) {
      return properties[parentKey].type
    }
    if (isMongoOperator(key)) {
      return {}
    }
    return properties[key].type
  }

  const parseObject = (object, parentKey) => {
    const newObj = {}
    Object.keys(object).forEach((key) => {
      let value = object[key]
      const ignoredTypes = [ Object, Array ]
      const type = getType(key, parentKey)

      // Skip ignored types and Schemata Arrays
      if (ignoredTypes.indexOf(type) === -1 && !type.arraySchema) {
        if (isMongoOperator(key) && Array.isArray(value)) {
          value = value.map((item) => {
            // Recursively cast objects like `{ $in: [ 1, 2, 3 ] }`
            if (typeof item === 'object' && item !== null) return parseObject(item)

            // Do a simple cast if they arent objects
            return schema.castProperty(type, item)
          })
        } else if (Array.isArray(value)) {
          value = value.map(item => schema.castProperty(type, item))
        } else if (typeof value === 'object' && value !== null) {
          value = parseObject(value, key)
        }
        // This needs to remain an int
        if (key === '$size') {
          value = Number(value)
        } else {
          value = schema.castProperty(type, value)
        }
      }
      newObj[key] = value
    })
    return newObj
  }

  return parseObject
}
