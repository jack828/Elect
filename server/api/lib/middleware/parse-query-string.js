const parseQueryStringObject = (parameter, defaultValue) => {
  if (!parameter) return defaultValue
  const result = JSON.parse(parameter)
  if (typeof result !== 'object') throw new Error(`Invalid parameter provided ${result}`)
  return Object.assign({}, defaultValue, result)
}

const parseSortOptions = (parameter) => {
  if (!parameter) return undefined
  const rawOptions = JSON.parse(parameter)
  let sort = 'asc'
  if (!Array.isArray(rawOptions)) return undefined
  if (!rawOptions.length) return undefined
  if (typeof rawOptions[1] !== 'undefined') [ , sort ] = rawOptions
  return [ [ rawOptions[0], sort ] ]
}

export default (req, res, next) => {
  try {
    req.query.filter = parseQueryStringObject(req.query.filter, {})
    req.query.sort = parseSortOptions(req.query.sort)
    req.query.pagination = parseQueryStringObject(req.query.pagination, {
      page: 1,
      pageSize: 50
    })
    req.query.keywords = req.query.keywords || ''
    next()
  } catch (e) {
    return res.status(400).json(new Error('Invalid JSON'))
  }
}
