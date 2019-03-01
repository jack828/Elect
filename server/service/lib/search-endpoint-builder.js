import parseQueryString from './middleware/parse-query-string'
import createfilterParser from './filter-parser'

export default (service, url, router, logger, middleware, config = {}) => {
  router.get(`${url}/:id`, middleware, (req, res) => {
    service.read(req.params.id, (error, entity) => {
      if (error) {
        logger.error(error.stack)
        return res.status(400).json(error)
      }
      if (!entity) return res.status(404).json({ status: 'Not found' })
      res.json(entity)
    })
  })

  router.get(url, middleware, parseQueryString, (req, res) => {
    logger.debug('GET received (Search)', JSON.stringify(req.query))

    const sort = (req.query.sort && req.query.sort[0][0] === 'score')
      ? { score: { $meta: 'textScore' } }
      : req.query.sort
    const options = { sort }
    const parseFilter = createfilterParser(service.schema)

    if (!Number.isNaN(req.query.pagination.pageSize)) {
      options.limit = req.query.pagination.pageSize
      if (!Number.isNaN(req.query.pagination.page)) {
        options.skip = (req.query.pagination.page - 1) * req.query.pagination.pageSize
      }
    }

    req.query.filter = parseFilter(req.query.filter)

    if (config && config.beforeHook) {
      req.query.filter = config.beforeHook(req.query.filter)
    }

    service.search(req.query.keywords, req.query.filter, options, (error, data, count) => {
      if (error) {
        logger.error(error.stack)
        return res.json(error, 400)
      }

      if (config && config.afterHook) {
        data = config.afterHook(data)
      }

      res.json({
        results: data,
        page: req.query.pagination.page,
        pageSize: req.query.pagination.pageSize,
        totalItems: count
      })
    })
  })
}
