module.exports = (serviceLocator) => {
  const { wss, userService } = serviceLocator

  wss.on('register', (id, data) => {
    userService.create(data, async (error, user, req) => {
      if (error) {
        if (error.errors) {
          return wss.emit(id, { errors: error.errors })
        }
        serviceLocator.logger.error('Register error', error)
        return wss.emit(id, { errors: 'Something unexpected occured, please try again later' })
      }

      const { password, passwordSalt, previousPasswords, ...cleanUser } = user

      req.session.user = cleanUser

      await req.session.save()

      wss.emit(id, { user: cleanUser })
    })
  })

  wss.on('login', (id, data, req) => {
    userService.authenticate(data, async (error, user) => {
      if (error) {
        // TODO fix this bit, messages aren't right - error.message
        if (error.errors) {
          return wss.emit(id, { errors: error.errors })
        }
        serviceLocator.logger.error('Login error', error)
        return wss.emit(id, {
          errors: 'Incorrect email address or password combination. Please try again.'
        })
      }

      const { password, passwordSalt, previousPasswords, ...cleanUser } = user

      req.session.user = cleanUser

      await req.session.save()

      wss.emit(id, { user: cleanUser })
    })
  })
}
