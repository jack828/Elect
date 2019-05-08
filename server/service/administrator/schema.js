const schemata = require('schemata')
const required = require('validity-required')
const isEmail = require('validity-email')
const crypto = require('crypto')

module.exports = (save) => {
  const generateSalt = () => {
    const saltInt = `${process.pid}${Math.random()}`
    const shaSum = crypto.createHash('sha1').update(saltInt)
    const saltHash = shaSum.digest('hex')
    return saltHash
  }

  const duplicateEmailValidator = (key, errorProperty, object, callback) => {
    save.findOne({ emailAddress: new RegExp([ '^', object.emailAddress, '$' ].join(''), 'i') },
      (error, found) => {
        if (error) return callback(error)
        callback(null, found && found._id.toString() !== object._id
          ? `${object.emailAddress} already in use` : undefined)
      })
  }

  return schemata({
    name: 'Administrator',
    description: 'Administrator schema',
    properties: {
      _id: {
        type: String,
        tag: [ 'update' ]
      },
      firstName: {
        type: String,
        validators: { all: [ required ] },
        tag: [ 'update' ]
      },
      lastName: {
        type: String,
        validators: { all: [ required ] },
        tag: [ 'update' ]
      },
      emailAddress: {
        type: String,
        validators: {
          all: [ required, isEmail, save ? duplicateEmailValidator : null ].filter(Boolean)
        },
        tag: [ 'update' ]
      },
      password: {
        type: String,
        validators: { all: [] }
      },
      passwordSalt: {
        type: String,
        defaultValue: generateSalt
      },
      key: {
        type: String
      },
      keyExpiry: {
        type: Date
      },
      role: {
        type: String,
        tag: [ 'update' ]
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
