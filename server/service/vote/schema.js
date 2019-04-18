const schemata = require('schemata')
const required = require('validity-required')

module.exports = () => schemata({
  name: 'Vote',
  description: 'Vote schema',
  properties: {
    _id: {
      type: String
    },
    election: {
      type: String,
      validators: [ required ]
    },
    user: {
      type: String,
      validators: [ required ]
    },
    party: {
      type: String,
      validators: [ required ]
    },
    constituencySlug: {
      type: String,
      validators: [ required ]
    },
    createdDate: {
      type: Date,
      defaultValue: () => new Date()
    }
  }
})
