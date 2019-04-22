const schemata = require('schemata')
const required = require('validity-required')

module.exports = () => schemata({
  name: 'Party',
  description: 'Party schema',
  properties: {
    _id: {
      type: String
    },
    name: {
      type: String,
      validators: { all: [ required ] }
    },
    colour: {
      type: String,
      validators: { all: [ required ] }
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
