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

function initListeners(userContext, events, done) {
  userContext.vars.received = {}
  userContext.ws.on('message', (raw) => {
    const data = JSON.parse(raw)
    Object.keys(data).map((id) => {
      // key is request ID, data[key] is data from the request
      Object.keys(data[id]).map((key) => {
        userContext.vars.received[key] = data[id][key]
      })
    })
  })
  done()
}

async function selectParty(userContext, events, done) {
  const randomParty = await createRandomParty(mockSl)
  userContext.vars.party = randomParty()
  return done()
}

function generateId(userContext, events, done) {
  userContext.vars.id = hat()
  return done()
}


module.exports = {
  initListeners,
  selectParty,
  generateId
}
