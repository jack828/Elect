const moment = require('moment')

module.exports = (serviceLocator) => {
  const maxLoginAttempts = serviceLocator.config.adminMaxLoginAttempts
  const accountLockoutTimeMinutes = serviceLocator.config.adminAccountLockoutTimeMinutes

  const setNextAllowedLoginAttemptDate = (admin, cb) => {
    const date = moment().add(accountLockoutTimeMinutes, 'minutes').toDate()
    const data = {
      _id: admin._id,
      nextAllowedLoginAttemptDate: date
    }
    serviceLocator.administratorService.partialUpdate(data, {}, cb)
  }

  const incrementFailedAttemptCount = (admin, cb) => {
    const adminId = serviceLocator.administratorService.idType(admin._id)
    serviceLocator.serviceDatabase.collection('administrator').findAndModify(
      { _id: adminId },
      [ [ '_id', 'desc' ] ],
      { $inc: { failedLoginAttempts: 1 } },
      { upsert: false, new: true },
      cb
    )
  }

  const resetFailedAttemptCount = (admin, cb) => {
    const data = {
      _id: admin._id,
      failedLoginAttempts: 0,
      nextAllowedLoginAttemptDate: null
    }
    serviceLocator.administratorService.partialUpdate(data, {}, cb)
  }

  const check = (admin, cb) => {
    const failedError = new Error('Too many failed login attempts. Try again later.')
    const now = new Date()
    const isPastNextAllowedLoginAttemptDate = admin.nextAllowedLoginAttemptDate
      && now >= admin.nextAllowedLoginAttemptDate

    if (!admin.failedLoginAttempts || admin.failedLoginAttempts < maxLoginAttempts) {
      cb()
    } else if (admin.failedLoginAttempts >= maxLoginAttempts && isPastNextAllowedLoginAttemptDate) {
      resetFailedAttemptCount(admin, cb)
    } else if (admin.failedLoginAttempts >= maxLoginAttempts
      && !admin.nextAllowedLoginAttemptDate) {
      setNextAllowedLoginAttemptDate(admin, (error) => {
        // intentionally ignore error, we still want to lock them out, even if something falls over
        serviceLocator.logger.error(error)
        return cb(failedError)
      })
    } else {
      return cb(failedError)
    }
  }

  return {
    check,
    incrementFailedAttemptCount,
    resetFailedAttemptCount
  }
}
