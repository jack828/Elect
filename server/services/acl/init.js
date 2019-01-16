const acl = require('secure/access-control-list')

const init = (serviceLocator, done) => {
  serviceLocator.register('acl', acl(serviceLocator.logger))
  done()
}

module.exports = () => ({ acl: init })
