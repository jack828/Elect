const schemata = require('schemata')
const required = require('validity-required')

module.exports = () => schemata({
  name: 'Party',
  description: 'Party schema',
  properties: {
    _id: {
      type: String,
      tag: [ 'update' ]
    },
    name: {
      type: String,
      validators: { all: [ required ] },
      tag: [ 'update' ]
    },
    enabled: {
      type: Boolean
    },
    createdDate: {
      type: Date,
      validators: { all: [] },
      defaultValue: () => new Date()
    }
  }
})
