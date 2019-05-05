const save = require('save')
const saveCouchbase = require('./save-couchbase')

module.exports = (serviceLocator) => {
  const instances = {}

  const get = (collectionName) => {
    if (!instances[collectionName]) {
      throw new Error(`Persistence not registered '${collectionName}'`)
    }
    return instances[collectionName]
  }
  const register = (collectionName) => {
    const collection = serviceLocator.serviceDatabase.openBucket(collectionName)

    collection.on('error', e => console.log('BUCKET ERR', { collectionName }, e))

    if (instances[collectionName]) {
      throw new Error(`${collectionName} already registered`)
    }

    instances[collectionName] = save(
      collectionName,
      {
        logger: serviceLocator.logger,
        engine: saveCouchbase(collection, collectionName),
        debug: serviceLocator.env === 'development'
      }
    )
    return get
  }

  get.register = register
  return get
}
