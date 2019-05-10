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
      validators: [ required ]
    },
    colour: {
      type: String,
      validators: [ required ]
    },
    enabled: {
      type: Boolean
    },
    createdDate: {
      type: Date,
      defaultValue: () => new Date()
    }
  }
})
