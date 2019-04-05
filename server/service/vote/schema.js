const schemata = require('schemata')
const required = require('validity-required')

module.exports = () => schemata({
  name: 'Vote',
  description: 'Vote schema',
  properties: {
    _id: {
      type: String
    },
    user: {
      type: String,
      validators: { all: [ required ] }
    },
    party: {
      type: String,
      validators: { all: [ required ] }
    },
    createdDate: {
      type: Date,
      validators: { all: [] },
      defaultValue: () => new Date()
    }
  }
})
