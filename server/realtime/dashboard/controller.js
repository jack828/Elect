const { promisify } = require('util')

module.exports = (serviceLocator) => {
  const { wss, electionService, userService } = serviceLocator

  wss.on('dashboard:load', async (id, data, req) => {
    // TODO get current vote status of logged in user
    const election = await electionService.findActive()
    const { key } = data

    // Almost acts as a "login"
    const user = await promisify(userService.findOne)({ key })
    req.session.user = user

    await req.session.save()

    if (id) {
      wss.emit(id, { election })
    }
  })
}
