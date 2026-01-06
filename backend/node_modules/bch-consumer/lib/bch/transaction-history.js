/*
  This library controlls transactions and transaction history, including utility
  methods for sorting transactions.
*/

class TransactionHistory {
  /**
   * @api bch.getTransactions() getTransactions()
   * @apiName getTransactions
   * @apiGroup BCH
   * @apiDescription Get transaction history for a BCH address.
   *
   * @apiExample {js} Example usage:
   * (async () => {
   *   try {
   *     const addr = 'bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9'
   *     const txs = await bchConsumer.bch.getTransactions(addr)
   *     console.log(txs)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   */
  // TODO: Add inputs for pagination and sorting.
  async getTxHistory (addr, sortOrder) {
    // Input validation
    if (typeof addr !== 'string') {
      throw new Error('Input must be a string containing bitcoincash address')
    }

    const body = {
      address: addr,
      sortOrder
    }

    const result = await this.axios.post(`${this.restURL}/bch/txHistory`, body)
    // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

    return result.data
  }
}

module.exports = TransactionHistory
