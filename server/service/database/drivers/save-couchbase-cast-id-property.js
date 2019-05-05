const ObjectID = require('mongodb').ObjectID

module.exports = (property) => {
  return castIdProperty

  function castComplexId(query) {
    const newQuery = Object.assign({}, query)

    Object.keys(newQuery).map((key) => {
      const value = newQuery[key]
      if (Array.isArray(value)) {
        newQuery[key] = value.map((item) => {
          return ObjectID.isValid(item) ? new ObjectID(item) : item
        })
      } else {
        newQuery[key] = ObjectID.isValid(value) ? new ObjectID(value) : value
      }
    })

    return newQuery
  }

  function castIdProperty(query) {
    const newQuery = Object.assign({}, query)
    const idQuery = query[property]
    // only convert if id is present
    if (!idQuery) {
      return newQuery
    }

    if (Object(idQuery) === idQuery) {
      newQuery[property] = castComplexId(idQuery)
    } else {
      newQuery[property] = ObjectID.isValid(newQuery[property])
        ? new ObjectID(newQuery[property]) : newQuery[property]
    }

    return newQuery
  }
}
