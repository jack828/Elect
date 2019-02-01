/* global db */
db
  .getCollection('administrator')
  .ensureIndex({
    firstName: 'text',
    lastName: 'text',
    emailAddress: 'text'
  })
