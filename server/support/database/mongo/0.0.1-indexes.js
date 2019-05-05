/* global db */
db
  .getCollection('administrator')
  .ensureIndex({
    firstName: 'text',
    lastName: 'text',
    emailAddress: 'text'
  })

db
  .getCollection('vote')
  .ensureIndex({
    election: 1,
    user: 1
  })
