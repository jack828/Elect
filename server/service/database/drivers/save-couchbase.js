const emptyFn = () => {}
const couchbase = require('couchbase')
const hat = require('hat')
const es = require('event-stream')
const createCastIdProperty = require('./save-couchbase-cast-id-property')

module.exports = (bucket, collectionName, { idProperty = '_id' } = {}) => {
  // eslint-disable-next-line
  const self = es.map(createOrUpdate)
  const castIdProperty = createCastIdProperty(idProperty)

  function objectToSql(query, isCount = false) {
    const baseSql = isCount
      ? `SELECT COUNT(*) FROM \`${collectionName}\``
      : `SELECT \`${collectionName}\`.* FROM \`${collectionName}\``
    const where = []
    const data = {}

    Object.keys(query).map((key) => {
      if (query[key].$in) {
        where.push(`(\`${key}\` IN $${key})`)
        data[key] = query[key].$in
      } else if (query[key].$lte || query[key].$gte) {
        if (query[key].$lte) {
          where.push(`\`${key}\`<=$${key}`)
          data[key] = query[key].$lte
        }
        if (query[key].$gte) {
          where.push(`\`${key}\`>=$${key}`)
          data[key] = query[key].$gte
        }
      } else {
        where.push(`\`${key}\`=$${key}`)
        data[key] = query[key]
      }
    })
    let sql = baseSql
    if (where.length) {
      sql += ` WHERE ${where.join(' AND ')}`
    }
    const sqlQuery = couchbase.N1qlQuery.fromString(sql, data)
    return [ sqlQuery, data ]
  }

  // TODO remove
  // might not be needed
  // Because your application using save shouldn't know about engine internals
  // ObjectID must be converted to strings before returning.
  function objectIdToString(entity) {
    if (!entity) return entity
    entity[idProperty] = entity[idProperty].toString()
    return entity
  }

  function create(object, callback) {
    callback = callback || emptyFn
    // if id is any falsy consider it empty
    if (!object[idProperty]) {
      object[idProperty] = hat()
    }
    const id = object[idProperty]
    self.emit('create', object)
    // TODO
    bucket.insert(id, { ...object }, (error) => {
      if (error) return callback(error)
      bucket.get(id, (err, result) => {
        if (err) return callback(err)
        const entity = objectIdToString(result.value)
        self.emit('afterCreate', entity)
        self.emit('received', entity)
        callback(null, entity)
      })
    })
  }

  function createOrUpdate(object, callback) {
    if (typeof object[idProperty] === 'undefined') {
      // Create a new object
      self.create(object, callback)
    } else {
      // Try and find the object first to update
      self.read(object[idProperty], (err, entity) => {
        if (err) return callback(err)
        if (entity) {
          // We found the object so update
          self.update(object, callback)
        } else {
          // We didn't find the object so create
          self.create(object, callback)
        }
      })
    }
  }

  function read(id, callback) {
    self.emit('read', id)

    callback = callback || emptyFn

    bucket.get(id, (error, result) => {
      let entity
      if (error) {
        // Non-existant document queries throw errors
        if (error.code === couchbase.errors.keyNotFound) {
          entity = null
        } else {
          return callback(error)
        }
      } else {
        entity = result.value
      }
      const data = entity === null ? undefined : objectIdToString(entity)
      self.emit('received', data)
      callback(error, data)
    })
  }

  function update(object, overwrite, callback) {
    if (typeof overwrite === 'function') {
      callback = overwrite
      overwrite = false
    }

    self.emit('update', object, overwrite)
    callback = callback || emptyFn
    const query = {}
    const id = object[idProperty]

    if (id === undefined || id === null) {
      return callback(new Error(`Object has no '${idProperty}' property`))
    }

    query[idProperty] = id

    bucket.get(id, (getError, getResult) => {
      if (getError) {
        if (getError.code === couchbase.errors.keyNotFound) {
          return callback(new Error(`No object found with '${idProperty}' = '${id}'`))
        }
        return callback(getError)
      }
      bucket.upsert(id, { ...getResult.value, ...object }, (error, res) => {
        if (error) return callback(error)

        const entity = objectIdToString(res.value)
        self.emit('afterUpdate', entity)
        self.emit('received', entity)
        callback(error, entity)
      })
    })
  }

  function updateMany(query, object, callback) {
    self.emit('updateMany', query, object)
    callback = callback || emptyFn

    // TODO unused
    bucket.update(
      query,
      { $set: object },
      { multi: true, safe: true, upsert: false },
      (error) => {
        if (error) return callback(error)
        self.emit('afterUpdateMany', query, object)
        self.emit('received', object)
        callback(error)
      }
    )
  }

  function deleteMany(query, callback) {
    self.emit('deleteMany', query)
    callback = callback || emptyFn

    const [ q, data ] = objectToSql(query)
    bucket.query(q, data, (err, results) => {
      if (err) return callback(err)
      const idsToDelete = results
        .map(({ _id }) => _id)

      bucket.remove(idsToDelete, (error) => {
        if (error) return callback(error)
        self.emit('afterDeleteMany', query)
        callback()
      })
    })
  }

  /**
   * Deletes one object. Returns an error if the object can not be found
   * or if the ID property is not present.
   *
   * @param {Object} object to delete
   * @param {Function} callback
   * @api public
   */
  function del(id, callback) {
    callback = callback || emptyFn

    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function or empty')
    }

    self.emit('delete', id)

    bucket.remove(id, (error) => {
      if (error) return callback(error)
      self.emit('afterDelete', id)
      callback()
    })
  }

  function find(query, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    if (options === undefined) {
      options = {}
    }

    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }
    // Callback implementation - Uses lots of memory
    self.emit('find', query, options)
    const [ q, data ] = objectToSql(query)
    bucket.query(q, data, (error, results) => {
      if (error) return callback(error)
      const mappedData = results.map(objectIdToString)
      self.emit('received', mappedData)
      callback(null, mappedData)
    })
  }

  function findOne(query, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    self.emit('findOne', query)
    const [ q, data ] = objectToSql(query)
    bucket.query(q, data, (error, results) => {
      if (error) return callback(error)
      if (!results.length) {
        self.emit('recieved', undefined)
        return callback(null, undefined)
      }
      const [ entity ] = results
      const mappedEntity = objectIdToString(entity)
      self.emit('received', mappedEntity)
      callback(null, mappedEntity)
    })
  }

  function count(query, callback) {
    self.emit('count', query)
    const [ q, data ] = objectToSql(query, true)
    bucket.query(q, data, (error, results) => {
      if (error) return callback(error)
      const d = []
      self.emit('received', d)
      callback(null, d)
    })
  }

  return Object.assign(self,
    { create,
      createOrUpdate,
      read,
      update,
      updateMany,
      deleteMany,
      delete: del,
      find,
      findOne,
      count,
      idProperty,
      idType: {}
    })
}
