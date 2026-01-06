/*
  Messaging library. These endpoints for encrypted messaging.
*/

// Global npm libraries
const axios = require('axios')

class Message {
  constructor (localConfig = {}) {
    this.restURL = localConfig.restURL
    if (!this.restURL) {
      throw new Error('restURL required when instantiating Message library')
    }

    // Encapsulate dependencies
    this.axios = axios
  }

  /**
   * @api Message.getPubKey() getPubKey()
   * @apiName getPubKey
   * @apiGroup Message
   * @apiDescription Get the public key for a BCH address.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const addr = 'bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9'
   *     const pubkey = await bchConsumer.msg.getPubKey(addr)
   *     console.log(pubkey)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getPubKey (addr) {
    // Input validation
    if (typeof addr !== 'string') {
      throw new Error('Input must be a string containing bitcoincash address')
    }

    const body = {
      address: addr
    }
    const result = await this.axios.post(`${this.restURL}/bch/pubkey`, body)

    // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`);
    return result.data
  }
}

module.exports = Message
