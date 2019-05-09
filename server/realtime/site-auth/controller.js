const constituencies = require('../../../lib/constituency-slugs.json')

module.exports = (serviceLocator) => {
  const { wss, userService } = serviceLocator
  const random = list => list[Math.floor(Math.random() * list.length)]

  wss.on('register', (id, data, client) => {
    userService.create(data, async (error, user) => {
      if (error) {
        if (error.errors) {
          return wss.emit(id, { errors: error.errors })
        }
        serviceLocator.logger.error('Register error', error)
        return wss.emit(id, { errors: 'Something unexpected occured, please try again later' })
      }

      const { password, passwordSalt, ...cleanUser } = user

      client.session.user = cleanUser

      wss.emit(id, { user: cleanUser })
    })
  })

  wss.on('login', (id, data, client) => {
    userService.authenticate(data, async (error, user) => {
      if (error) {
        if (error.errors) {
          return wss.emit(id, { errors: error.errors })
        }
        serviceLocator.logger.error('Login error', error)
        return wss.emit(id, {
          errors: 'Incorrect email address or password combination. Please try again.'
        })
      }

      const { password, passwordSalt, ...cleanUser } = user

      client.session.user = cleanUser

      wss.emit(id, { user: cleanUser })
    })
  })

  wss.on('mock-login', async (id, data, client) => {
    userService.create({
      firstName: 'Mock',
      lastName: 'User',
      emailAddress: `${Math.random()}@electtest.co.uk`,
      password: `${Math.random()}`,
      constituency: random(constituencies).slug,
      key: 'load-test-mock-key'
    }, async (error, user) => {
      if (error) {
        return wss.emit(id, {
          errors: 'Error creating mock user. Please try again.'
        })
      }

      client.session.user = user

      wss.emit(id, { user })
    })
  })
}
