const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR'

module.exports = (serviceLocator) => {
  const { wss, electionService } = serviceLocator

  wss.on('dashboard:load', async (id, data, req) => {
    // TODO get current vote status of logged in user
    const election = await electionService.findActive()
    const { key } = data

    const { user } = req.session
    const notLoggedIn = !user
    const incorrectKey = !notLoggedIn && user.key !== key
    const keyExpired = !notLoggedIn && new Date() > user.keyExpiry

    console.log({ user, key, notLoggedIn, incorrectKey, keyExpired })

    if (notLoggedIn || incorrectKey || keyExpired) {
      return wss.emit(id, { error: AUTHENTICATION_ERROR })
    }

    wss.emit(id, { election })
  })
}
