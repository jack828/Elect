import bodyParser from 'body-parser'

module.exports = (serviceLocator) => {
  // Admin login only
  serviceLocator.router.post('/api/login', bodyParser.json({ extended: false }), (req, res) => {
    serviceLocator.authenticationProvider.authenticate(req.body, (error, administrator) => {
      if (error) {
        switch (error.message) {
          case 'Wrong Email and password combination.':
          case 'No password for user. Reset required.':
          case 'Too many failed login attempts. Try again later.':
          default:
            serviceLocator.logger.warn(error.message)
            return res.status(401).json({ error: error.message })
        }
      }
      const {
        password,
        passwordSalt,
        ...cleanAdmin
      } = administrator
      res.status(200).json(cleanAdmin)
    })
  })
}
