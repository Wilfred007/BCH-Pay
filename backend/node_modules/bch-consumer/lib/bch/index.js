/*
  BCH-specific endpoints.
*/

// Global npm libraries
const axios = require('axios')

// Local libraries
const TransactionHistory = require('./transaction-history')

class BCH {
  constructor (localConfig = {}) {
    this.restURL = localConfig.restURL
    if (!this.restURL) {
      throw new Error('restURL required when instantiating BCH library')
    }

    // Encapsulate dependencies
    this.axios = axios
    this.transactionHistory = new TransactionHistory()

    // Add methods from other libraries.
    this.getTxHistory = this.transactionHistory.getTxHistory

    // Bind 'this' object to all methods.
    this.getBalance = this.getBalance.bind(this)
    this.getUtxos = this.getUtxos.bind(this)
    this.sendTx = this.sendTx.bind(this)
    this.getTxData = this.getTxData.bind(this)
    this.getUsd = this.getUsd.bind(this)
    this.utxoIsValid = this.utxoIsValid.bind(this)
    this.getTokenData = this.getTokenData.bind(this)
    this.getTokenData2 = this.getTokenData2.bind(this)
    this.getPsffppWritePrice = this.getPsffppWritePrice.bind(this)
    this.cid2json = this.cid2json.bind(this)
  }

  /**
   * @api bch.getBalance() getBalance()
   * @apiName getBalance
   * @apiGroup BCH
   * @apiDescription Get the balance for a BCH address.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const addr = 'bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9'
   *     const balance = await bchConsumer.bch.getBalance(addr)
   *     console.log(balance)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getBalance (addr) {
    // Input validation
    let body = { addresses: [] }
    if (typeof addr === 'string') {
      // Input is a single address string.
      body = { addresses: [addr] }
    } else if (Array.isArray(addr)) {
      // Input is an array of address strings
      body = { addresses: addr }
    } else {
      throw new Error('Input must be a string (address) or an array of strings')
    }

    const result = await this.axios.post(`${this.restURL}/bch/balance`, body)

    // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`);
    return result.data
  }

  /**
   * @api bch.getUtxos() getUtxos()
   * @apiName getUtxos
   * @apiGroup BCH
   * @apiDescription Get UTXOs controlled by a BCH address.
   * A single address can passed as a string, or an array of up to 20 addresses
   * can be passed to do a bulk lookup of UTXOs.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const addr = 'bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9'
   *     const utxos = await bchConsumer.bch.getUtxos(addr)
   *     console.log(utxos)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getUtxos (addr) {
    if (typeof addr === 'string') {
      // Single Address

      const body = {
        address: addr
      }

      const result = await this.axios.post(`${this.restURL}/bch/utxos`, body)

      return result.data

      //
    } else {
      // Array of addresses

      // Input validation
      if (!Array.isArray(addr)) {
        throw new Error('addr parameter must be an array or a string')
      }
      if (addr.length > 20) {
        throw new Error('addr parameter must not exceed 20 elements')
      }

      const body = {
        addresses: addr
      }

      const result = await this.axios.post(`${this.restURL}/bch/utxosBulk`, body)

      return result.data
    }
  }

  /**
   * @api bch.sendTx() sendTx()
   * @apiName sendTx
   * @apiGroup BCH
   * @apiDescription Broadcast a transaction to the BCH network.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const hex = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000"
   *     const txid = await bchConsumer.bch.sendTx(hex)
   *     console.log(txid)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async sendTx (hex) {
    // Input validation
    if (typeof hex !== 'string') {
      throw new Error(
        'Input must be a string containing hex representation of a transaction'
      )
    }

    const body = {
      hex
    }

    const result = await this.axios.post(`${this.restURL}/bch/broadcast`, body)

    // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`);
    return result.data
  }

  /**
   * @api bch.getTxData() getTxData()
   * @apiName getTxData
   * @apiGroup BCH
   * @apiDescription Get detailed transaction data for a TXID.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const txid = "01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b"
   *     const txData = await bchConsumer.bch.getTxData([txid])
   *     console.log(txData)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getTxData (txids) {
    // Input validation
    if (!Array.isArray(txids)) {
      throw new Error('Input must be an array of strings representing TXIDs')
    }

    const body = {
      txids
    }

    const result = await this.axios.post(`${this.restURL}/bch/txData`, body)
    // console.log(
    //   `result.data.txData: ${JSON.stringify(result.data.txData, null, 2)}`
    // )

    return result.data.txData
  }

  /**
   * @api bch.getUsd() getUsd()
   * @apiName getUsd
   * @apiGroup BCH
   * @apiDescription Get the current price of BCH in USD.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const bchPrice = await bchConsumer.bch.getUsd()
   *     console.log(bchPrice)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  // Get the current price of BCH in USD.
  async getUsd () {
    const result = await this.axios.get(`${this.restURL}/price/usd`)
    // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

    return result.data.usd
  }

  /**
   * @api bch.utxoIsValid() utxoIsValid()
   * @apiName utxoIsValid
   * @apiGroup BCH
   * @apiDescription Validate that a UTXO is still spendable.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const addr = 'bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9'
   *     const utxos = await bchConsumer.bch.getUtxos(addr)
   *     const utxo = utxos.bchUtxos[0]
   *     const isValid = await bchConsumer.bch.utxoIsValid(utxo)
   *     console.log(isValid)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async utxoIsValid (utxo) {
    const body = {
      utxo
    }

    const result = await this.axios.post(`${this.restURL}/bch/utxoIsValid`, body)
    // console.log(
    //   `result.data.txData: ${JSON.stringify(result.data.txData, null, 2)}`
    // )

    return result.data
  }

  /**
   * @api bch.getTokenData() getTokenData()
   * @apiName getTokenData
   * @apiGroup BCH
   * @apiDescription Get PS002 data associated with an SLP token or NFT.
   *
   * Arguments:
   * - tokenId - (required) string containing token ID
   * - withTxHistory - (optional) Include transaction history. Default is false.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
   *     const tokenData = await bchConsumer.bch.getTokenData(tokenId)
   *     console.log(tokenData)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getTokenData (tokenId, withTxHistory = false) {
    const body = {
      tokenId,
      withTxHistory
    }

    const result = await this.axios.post(`${this.restURL}/bch/getTokenData`, body)
    // console.log(
    //   `result.data.txData: ${JSON.stringify(result.data.txData, null, 2)}`
    // )

    return result.data
  }

  /**
   * @api bch.getTokenData2() getTokenData2()
   * @apiName getTokenData2
   * @apiGroup BCH
   * @apiDescription Get PS007 token icon and other media
   *
   * Arguments:
   * - tokenId - (required) string containing token ID
   * - updateCache - (optional) Boolean, false by default. If true, server will refresh its mutable data cache.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
   *     const tokenData = await bchConsumer.bch.getTokenData2(tokenId)
   *     console.log(tokenData)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getTokenData2 (tokenId, updateCache = false) {
    console.log('getTokenData2() updateCache: ', updateCache)

    const body = {
      tokenId,
      updateCache
    }

    const result = await this.axios.post(`${this.restURL}/bch/getTokenData2`, body)
    // console.log(
    //   `result.data.txData: ${JSON.stringify(result.data.txData, null, 2)}`
    // )

    return result.data
  }

  /**
   * @api bch.get() getPsffppWritePrice()
   * @apiName getPsffppWritePrice
   * @apiGroup BCH
   * @apiDescription Get PSFFPP price to pin 1MB of data
   *
   * Arguments:
   * - none
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const writePrice = await bchConsumer.bch.getPsffppWritePrice()
   *     console.log(writePrice)
   *     // 0.08335233
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  async getPsffppWritePrice () {
    // console.log('getTokenData2() updateCache: ', updateCache)

    const result = await this.axios.get(`${this.restURL}/price/psffpp`)
    // console.log(
    //   `result.data.txData: ${JSON.stringify(result.data.txData, null, 2)}`
    // )

    return result.data.psfPrice
  }

  /**
   * @api bch.cid2json() cid2json()
   * @apiName cid2json
   * @apiGroup BCH
   * @apiDescription Convert a CID to a JSON object.
   */
  async cid2json (inObj = {}) {
    const { cid } = inObj

    if (!cid) {
      throw new Error('cid is required')
    }

    const result = await this.axios.get(`${this.restURL}/ipfs/cid2json/${cid}`)
    return result.data
  }
}

module.exports = BCH
