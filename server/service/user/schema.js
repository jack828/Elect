const schemata = require('schemata')
const required = require('validity-required')
const isEmail = require('validity-email')
const uniqueProperty = require('validity-unique-property')
const moment = require('moment')
const generateSalt = require('../administrator/lib/generate-salt')

module.exports = save => schemata({
  name: 'User',
  description: 'User schema',
  properties: {
    _id: {
      type: String
    },
    firstName: {
      type: String,
      validators: [ required ]
    },
    lastName: {
      type: String,
      validators: [ required ]
    },
    constituency: {
      type: String,
      validators: [ required ]
    },
    emailAddress: {
      type: String,
      validators: {
        all: [ required, isEmail, save ? uniqueProperty(save.findOne) : null ].filter(Boolean)
      }
    },
    password: {
      type: String,
      validators: [ required ]
    },
    passwordSalt: {
      type: String,
      defaultValue: generateSalt
    },
    key: {
      type: String,
      defaultValue: generateSalt
    },
    keyExpiry: {
      type: Date,
      defaultValue: () => moment().add(12, 'hours').toDate()
    },
    enabled: {
      type: Boolean
    },
    failedLoginAttempts: {
      type: Number,
      defaultValue: 0
    },
    nextAllowedLoginAttemptDate: {
      type: Date
    },
    createdDate: {
      type: Date,
      defaultValue: () => new Date()
    }
  }
})
