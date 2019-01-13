
const init = (serviceLocator, done) => {
  serviceLocator.router.get('/test', (req, res) => {
    res.sendStatus(418)
  })

  done()
}

module.exports = () => ({ test: [ 'database', init ] })
