const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const init = (serviceLocator, done) => {
  const { config, server } = serviceLocator
  const { session: { maxAge, secret } } = config

  serviceLocator.register(
    'sessionParser',
    session({
      key: 'sid',
      secret,
      resave: true,
      saveUninitialized: false,
      cookie: { maxAge, secure: true },
      store: new MongoStore({
        db: serviceLocator.serviceDatabase,
        clear_interval: 3600
      })
    })
  )

  server.use(cookieParser(secret))

  server.use(serviceLocator.sessionParser)

  done()
}

module.exports = () => ({ session: [ 'database', init ] })
