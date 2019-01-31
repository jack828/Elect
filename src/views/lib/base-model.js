import Model from 'merstone'

class BaseModel extends Model {
  idAttribute = '_id'

  // Requires extending classes to provide this.createSchema
  constructor(serviceLocator, attributes) {
    super(serviceLocator, attributes)

    this.schema = this.createSchema()
    this.attributes = this.schema.cast(attributes || {})

    this.hook('preSet', (attrs, cb) => {
      cb(null, this.schema.cast(attrs))
    })
  }

  validate(cb) {
    this.schema.validate(this.attributes, cb)
  }

  reset(attrs) {
    attrs = this.schema.cast(attrs || {})
    super.reset(attrs)
  }
}

export default BaseModel
