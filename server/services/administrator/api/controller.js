import bodyParser from 'body-parser'
import searchEndpointBuilder from '../../lib/search-endpoint-builder'

module.exports = (serviceLocator) => {
  const middleware = [
    // TODO: auth
    bodyParser.json()
  ]

  searchEndpointBuilder(
    serviceLocator.administratorService,
    '/api/administrators',
    serviceLocator.router,
    serviceLocator.logger,
    []
  )

  serviceLocator.server.post('/api/administrators/new', middleware, (req, res, next) => {
    serviceLocator.administratorService.create(req.body, (error, admin) => {
      if (error) {
        if (error.errors) {
          return res.status(400).json({ errors: error.errors })
        }
        return next(error)
      }
      res.status(201).json(admin)
    })
  })
}
