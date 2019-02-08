import bodyParser from 'body-parser'
import { promisify } from 'util'
import searchEndpointBuilder from '../../lib/search-endpoint-builder'

module.exports = (serviceLocator) => {
  const middleware = [
    // TODO: auth
    bodyParser.json()
  ]

  searchEndpointBuilder(
    serviceLocator.electionService,
    '/api/elections',
    serviceLocator.router,
    serviceLocator.logger,
    []
  )
  // TODO crud-endpoint-builder

  serviceLocator.server.post('/api/elections/new', middleware, (req, res, next) => {
    serviceLocator.electionService.create(req.body, (error, admin) => {
      if (error) {
        if (error.errors) {
          return res.status(400).json({ errors: error.errors })
        }
        return next(error)
      }
      res.status(201).json(admin)
    })
  })

  serviceLocator.server.put('/api/elections/:id', middleware, async (req, res, next) => {
    const { id } = req.params

    const { _id } = await promisify(serviceLocator.electionService.read)(id)
    if (!_id) return res.status(404).json({ status: 'Not found' })

    serviceLocator.electionService.partialUpdate(req.body, (error, admin) => {
      if (error) {
        if (error.errors) {
          return res.status(400).json({ errors: error.errors })
        }
        return next(error)
      }
      res.status(200).json(admin)
    })
  })
}
