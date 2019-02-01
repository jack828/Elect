import Collection from 'chale'
import { isEqual } from 'lodash'
import { stringify } from 'qs'

const sortDirectionTable = { asc: 1, desc: -1 }

class BaseCollection extends Collection {
  // Pagination
  pageSize = 50

  currentPage = 1

  totalItems = 0

  // Sort properties
  sortProperty = 'createdDate'

  sortDirection = 'desc'

  currentFilter = {}

  defaultFilter = {}

  currentParams = {}

  parse(response) {
    const { schemata } = this.model.prototype
    if (response.results) {
      this.totalItems = response.totalItems
      return response.results.map(item => schemata.cast(item))
    }
    return response.map(item => schemata.cast(item))
  }

  /*
   * Comparator function used by
   * Backbone.Collection.prototype.sort()
   * Returns:
   *    0 - If a and b are of 'equal' order
   *   -1 - If a should come before b
   *   +1 - If b sould come before a
   */
  comparator(a, b) {
    if (!this.sortProperty || !this.sortDirection) {
      throw new Error('sortDirection and sortProperty must be defined on the collection')
    }
    const aProp = a.get(this.sortProperty)
    const bProp = b.get(this.sortProperty)
    const d = sortDirectionTable[this.sortDirection]
    if (isEqual(aProp, bProp)) return 0
    return aProp > bProp ? d * 1 : d * -1
  }

  /*
   * Apply a filter in the form
   * { sort: [...], filter: {...} }
   * to the collection.
   */
  applyFilter(params, keep) {
    /* eslint complexity: [ 2, 9 ] */

    if (!params && keep) {
      params = { filter: this.defaultFilter, ...this.currentParams }
    } else if (!params) {
      params = { filter: this.defaultFilter }
    }

    // If not keeping the current set, reset pagination
    if (!keep) this.currentPage = 1

    // Get sort properties from query
    if (params.sort && params.sort.length) {
      [ this.sortProperty, this.sortDirection ] = params.sort
    } else {
      params.sort = [ this.sortProperty, this.sortDirection ]
    }

    // If no filters came in, set them to the defaults
    if (!params.filter || Object.keys(params.filter).length < 1) {
      params.filter = this.defaultFilter
    } else {
      this.currentFilter = params.filter
    }

    // Deal with pagination
    params.pagination = {
      pageSize: this.pageSize,
      page: this.currentPage
    }

    this.currentParams = { ...params }

    // Write the params to JSON
    const stringifiedParams = {}
    Object.keys(params).forEach((key) => {
      stringifiedParams[key] = JSON.stringify(params[key])
    })

    this.fetch({
      update: true,
      data: stringifiedParams,
      remove: !keep,
      success: () => {
        // this.sort({ silent: true })
        this.emit('filter')
      }
    })
  }

  loadMore() {
    this.currentPage++
    this.applyFilter(null, true)
  }

  /*
   * Reset the collection and load in the
   * contents, applying the default filter.
   */
  load() {
    this.reset([])
    this.applyFilter({ filter: this.defaultFilter })
  }

  /*
   * Retrieves a model by id, ensuring (if it
   * exists on the backend) that it is held
   * within the collection.
   * `cb` is expected to be: `function (err, model) {...}`
   */
  retrieve(id, cb) {
    let model = this.get(id)
    if (model) return cb(null, model)

    const onSuccess = () => {
      model.initialize()
      return cb(null, model)
    }

    const onError = () => {
      this.remove(model)
      return cb(new Error(`An item with id "${id}" could not be retrieved`))
    }

    this.add({ _id: id })
    model = this.get(id)
    model.fetch({
      success: onSuccess,
      error: onError
    })
  }

  fetch({ data, remove, success }) {
    fetch(`${this.apiUrl}?${stringify(data)}`, {
    })
      .then(res => res.json())
      .then((results) => {
        if (remove) this.reset()
        if (results.results && results.results.length) {
          results.results.map(datum => this.add(new this.Model(null, datum)))
        }
        success()
      })
  }
}

export default BaseCollection
