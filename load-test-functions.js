const hat = require('hat')
const createRandomParty = require('./server/support/scripts/random-party')

const mockSl = {
  partyService: {
    find: (q, cb) => cb(null, [
      { _id: '5cbb582e8832730876626d16' },
      { _id: '5cbb57058832730876626d13' },
      { _id: '5cbb57d78832730876626d14' },
      { _id: '5cbb57eb8832730876626d15' },
      { _id: '5cbb56e08832730876626d12' }
    ])
  }
}

async function selectParty(context, events, done) {
  const randomParty = await createRandomParty(mockSl)
  context.vars.party = randomParty()
  return done()
}

function generateId(context, events, done) {
  context.vars.id = hat()
  return done()
}

module.exports = {
  selectParty,
  generateId
}
