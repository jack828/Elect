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
    // console.log('message', raw)
    const data = JSON.parse(raw)
    // Store the request raw
    // userContext.received[id] = data
    Object.keys(data).map((id) => {
      // key is request ID, data[key] is data
      // console.log({ key, data: data[key] })
      Object.keys(data[id]).map((key) => {
        userContext.vars.received[key] = data[id][key]
      })
    })
    console.log('11111111111111111111111111')
    console.dir(userContext.vars.received, { depth: 3, colors: true })
    console.log('11111111111111111111111111')
  })
  done()
}

async function selectParty(userContext, events, done) {
  const randomParty = await createRandomParty(mockSl)
  userContext.vars.party = randomParty()
  return done()
}

function generateId(userContext, events, done) {
  // console.dir(userContext, { depth: 3, colors: true })
  userContext.vars.id = hat()
  return done()
}


module.exports = {
  initListeners,
  selectParty,
  generateId
}
