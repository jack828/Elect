const schemata = require('schemata')
const required = require('validity-required')
const isEmail = require('validity-email')
const uniqueProperty = require('validity-unique-property')
const crypto = require('crypto')
const moment = require('moment')
const config = require('../../config')(process.env.NODE_ENV || 'development')

module.exports = (save) => {
  const generateSalt = () => {
    const saltInt = `${process.pid}${Math.random()}`
    const shaSum = crypto.createHash('sha1').update(saltInt)
    const saltHash = shaSum.digest('hex')
    return saltHash
  }

  return schemata({
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
        validators: { all: [] }
      },
      passwordSalt: {
        type: String,
        defaultValue: generateSalt
      },
      // TODO unnecessary
      passwordResetDate: {
        type: Date,
        defaultValue: () => {
          const numDaysBetweenPasswordResets = config.passwordResetPolicy.numDaysBetweenReset
          return moment().add(numDaysBetweenPasswordResets, 'days').toDate()
        }
      },
      previousPasswords: {
        type: Array,
        defaultValue: () => []
      },
      key: {
        type: String
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
        validators: { all: [] },
        defaultValue: () => new Date()
      }
    }
  })
}
