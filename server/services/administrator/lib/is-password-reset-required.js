module.exports = (administrator) => {
  if (administrator) {
    const now = new Date()
    if (!administrator.passwordResetDate || administrator.passwordResetDate <= now) return true
  }
  return false
}
