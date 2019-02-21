module.exports = (serviceLocator) => {
  const { wss, userService } = serviceLocator

  wss.on('register', async (id, data) => {
    userService.create(data, (error, user) => {
      if (error) {
        if (error.errors) {
          return wss.emit(id, { errors: error.errors })
        }
        serviceLocator.logger.error('Register error', error)
        return wss.emit(id, { errors: 'Something unexpected occured, please try again later' })
      }

      const { password, passwordSalt, ...cleanUser } = user
      wss.emit(id, { user: cleanUser })
    })
  })

  wss.on('login', async (id, data) => {
    userService.authenticate(data, (error, user) => {
      if (error) {
        if (error.errors) {
          return wss.emit(id, { errors: error.errors })
        }
        serviceLocator.logger.error('Login error', error)
        return wss.emit(id, { errors: 'Something unexpected occured, please try again later' })
      }

      const { password, passwordSalt, ...cleanUser } = user
      wss.emit(id, { user: cleanUser })
    })
  })
}
