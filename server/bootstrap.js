const { join } = require('path')
const glob = require('glob')
const componentLoader = require('component-loader')
const createServer = require('./server')

// Use this for standard environment setup that is need on all entry points.
// This will often be where components are initialised
module.exports = (serviceLocator, cb) => {
  const server = createServer(serviceLocator)

  serviceLocator
    .register('server', server)
    // Allow possible switching of router away from express
    .register('router', server)

  const componentGlobs = [
    join(__dirname, '/services/**/init.js'),
    join(__dirname, '/services/**/api.js')
  ]
  // eslint-disable-next-line
  const componentPaths = [].concat.apply([], componentGlobs.map(path => glob.sync(path)))
  // eslint-disable-next-line
  const components = componentPaths.map(p => require(p))

  componentLoader(components, loadComponentFn => loadComponentFn.bind(null, serviceLocator), cb)
}
