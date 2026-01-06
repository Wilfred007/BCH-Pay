/*
  A JS library for interacting with the ipfs-bch-wallet-consumer REST API
*/

// Local libraries
const BCH = require('./lib/bch')
const Message = require('./lib/msg')

class BchConsumer {
  constructor (localConfig = {}) {
    // Allow URL to be overridden at startup.
    this.restURL = localConfig.restURL
    if (!this.restURL) {
      // Default value.
      this.restURL = 'https://free-bch.fullstack.cash'
      localConfig.restURL = this.restURL
    }

    // Encapsulate dependencies
    this.bch = new BCH(localConfig)
    this.msg = new Message(localConfig)
  }
}

module.exports = BchConsumer
