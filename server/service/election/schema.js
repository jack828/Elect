const schemata = require('schemata')
const required = require('validity-required')
const length = require('validity-length')

module.exports = () => {
  // TODO: should validate ranges and their overlap
  return schemata({
    name: 'Election',
    description: 'Election schema',
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
      parties: {
        type: Array,
        validators: { all: [ required, length(2) ] }
      },
      visibleFrom: {
        type: Date,
        validators: { all: [ required ] }
      },
      visibleTo: {
        type: Date,
        validators: { all: [ required ] }
      },
      voteOpenFrom: {
        type: Date,
        validators: { all: [ required ] }
      },
      voteOpenTo: {
        type: Date,
        validators: { all: [ required ] }
      },
      createdDate: {
        type: Date,
        validators: { all: [] },
        defaultValue: () => new Date()
      }
    }
  })
}
