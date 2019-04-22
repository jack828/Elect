const schemata = require('schemata')
const required = require('validity-required')
const { createValidator, booleanToCallback } = require('validity')

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
      validators: [
        createValidator(booleanToCallback(value => typeof value !== 'undefined'))(
          '#{name} is required'
        )
      ]
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
