const { promisify } = require('util')

module.exports = async (serviceLocator) => {
  const random = list => list[Math.floor(Math.random() * list.length)]

  const parties = await promisify(serviceLocator.partyService.find)({ enabled: true })
  const sortedParties = parties.sort((a, b) => b.createdDate - a.createdDate)

  const weightedRandom = (options) => {
    const table = []
    Object.keys(options).map((key) => {
      // The constant 10 below should be computed based on the
      // weights in the options for a correct and optimal table size.
      // E.g. the options { 0:0.999, 1:0.001 } will need constant 1000
      for (let j = 0; j < options[key] * 100; j++) {
        table.push(key)
      }
    })
    return () => random(table)
  }

  return weightedRandom({
    [sortedParties[0]._id]: 0.30, // Green
    [sortedParties[1]._id]: 0.25, // Labour
    [sortedParties[2]._id]: 0.20, // Lib dem
    [sortedParties[3]._id]: 0.10, // SNP
    [sortedParties[4]._id]: 0.10, // Tory
    null: 0.05 // Spoilt
  })
}
