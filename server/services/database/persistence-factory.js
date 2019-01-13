const save = require('save')
const saveMongodb = require('save-mongodb')

module.exports = (serviceLocator) => {
  const instances = {}

  const get = (collectionName) => {
    if (!instances[collectionName]) {
      throw new Error(`Persistence not registered '${collectionName}'`)
    }
    return instances[collectionName]
  }
  const register = (collectionName) => {
    const collection = serviceLocator.serviceDatabase.collection(collectionName)
    if (instances[collectionName]) {
      throw new Error(`${collectionName} already registered`)
    }

    instances[collectionName] = save(
      collectionName,
      {
        logger: serviceLocator.logger,
        engine: saveMongodb(collection),
        debug: serviceLocator.env === 'development'
      }
    )
    return get
  }

  get.register = register
  return get
}
