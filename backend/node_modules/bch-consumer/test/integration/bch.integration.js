/*
  Integration tests for the bch.js library.
*/

// Configure this constant for your use in the test.
// const RESTURL = 'https://free-bch.fullstack.cash'
// const RESTURL = 'https://bc01-ca-bch-consumer.fullstackcash.nl'
// const RESTURL = 'https://bch-consumer-anacortes-wa-usa.fullstackcash.nl'
const RESTURL = 'https://dev-consumer.psfoundation.info'
// const RESTURL = 'http://localhost:5005'
console.log(`Using this REST URL for integration tests: ${RESTURL}`)

// npm libraries
const assert = require('chai').assert

// Unit under test
const BCH = require('../../lib/bch')
const uut = new BCH({ restURL: RESTURL })

describe('#bch.js', () => {
  describe('#getBalance', () => {
    it('should get BCH balance for a single address', async () => {
      const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'

      const result = await uut.getBalance(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)

      assert.property(result, 'balances')
      assert.property(result.balances[0].balance, 'confirmed')
    })

    it('should get BCH balance for an array of addresses', async () => {
      const addr = [
        'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7',
        'bitcoincash:qpfu89emmh0mpkwfkyewtx28gyr2lgesxqmk6te0ha'
      ]

      const result = await uut.getBalance(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)

      assert.property(result, 'balances')
      assert.property(result.balances[0].balance, 'confirmed')

      // Assert that addresses are included
      assert.equal(result.balances[0].address, addr[0])
      assert.equal(result.balances[1].address, addr[1])
    })
  })

  describe('#getUtxos', () => {
    it('should get UTXOs for a single address', async () => {
      const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'

      const result = await uut.getUtxos(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.property(result[0], 'bchUtxos')
      assert.property(result[0], 'slpUtxos')
    })

    it('should get UTXOs for an array of address', async () => {
      const addr = [
        'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7',
        'bitcoincash:qpfu89emmh0mpkwfkyewtx28gyr2lgesxqmk6te0ha'
      ]

      const result = await uut.getUtxos(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      // assert.property(result[0], 'bchUtxos')
      // assert.property(result[0], 'slpUtxos')

      assert.equal(result.data[0].address, addr[0])
      assert.equal(result.data[1].address, addr[1])
    })
  })

  describe('#sendTx', () => {
    it('should try to broadcast a hex tx', async () => {
      const hex =
        '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000'

      const result = await uut.sendTx(hex)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, false)
      assert.equal(result.endpoint, 'broadcast')
    })
  })

  describe('#getTxHistory', () => {
    it('should get transaction history for an address', async () => {
      const addr = 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'

      const result = await uut.getTxHistory(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.address, addr)
      assert.isArray(result.txs)

      // Assert descending sort order.
      assert.isAbove(result.txs[0].height, result.txs[1].height)
    })
  })

  describe('#getTxData', () => {
    it('should get TX data for a single TXID', async () => {
      const txids = [
        '01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b'
      ]

      const result = await uut.getTxData(txids)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result[0].txid, txids[0])
      assert.property(result[0], 'vin')
      assert.property(result[0], 'vout')
    })
  })

  describe('#getUsd', () => {
    it('should get the price of BCH in USD', async () => {
      const result = await uut.getUsd()
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isAbove(result, 0)
    })
  })

  describe('#utxoIsValid', () => {
    it('should return true for valid UTXO with fullnode properties', async () => {
      const utxo = {
        txid: '18481843a36aa2f9b83560006e587cec24cdb617923b5bdcb77e1ff76fcfbc70',
        vout: 0
      }

      const result = await uut.utxoIsValid(utxo)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'utxoIsValid')
      assert.equal(result.isValid, true)
    })

    it('should return true for valid UTXO with fulcrum properties', async () => {
      const utxo = {
        tx_hash: '18481843a36aa2f9b83560006e587cec24cdb617923b5bdcb77e1ff76fcfbc70',
        tx_pos: 0
      }

      const result = await uut.utxoIsValid(utxo)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'utxoIsValid')
      assert.equal(result.isValid, true)
    })

    it('should return false for valid UTXO with fullnode properties', async () => {
      const utxo = {
        txid: '17754221b29f189532d4fc2ae89fb467ad2dede30fdec4854eb2129b3ba90d7a',
        vout: 0
      }

      const result = await uut.utxoIsValid(utxo)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'utxoIsValid')
      assert.equal(result.isValid, false)
    })

    it('should return false for valid UTXO with fulcrum properties', async () => {
      const utxo = {
        tx_hash: '17754221b29f189532d4fc2ae89fb467ad2dede30fdec4854eb2129b3ba90d7a',
        tx_pos: 0
      }

      const result = await uut.utxoIsValid(utxo)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'utxoIsValid')
      assert.equal(result.isValid, false)
    })

    it('should work with getUtxos()', async () => {
      const addr = 'bitcoincash:qpfu89emmh0mpkwfkyewtx28gyr2lgesxqmk6te0ha'

      const utxos = await uut.getUtxos(addr)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const result = await uut.utxoIsValid(utxos[0].infoUtxos[0])

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'utxoIsValid')
      assert.equal(result.isValid, true)
    })
  })

  describe('#getTokenData', () => {
    it('should get PS002 data from a valid token', async () => {
      const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'

      const result = await uut.getTokenData(tokenId)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'getTokenData')

      assert.property(result.tokenData, 'genesisData')
      assert.property(result.tokenData, 'immutableData')
      assert.property(result.tokenData, 'mutableData')
    })

    it('should get data for token not following PS002', async () => {
      const tokenId = '2624df798d76986231c7acb0f6923f537223da44ba6e25171186ab4056a58b64'

      const result = await uut.getTokenData(tokenId)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'getTokenData')

      assert.property(result.tokenData, 'genesisData')
      assert.property(result.tokenData, 'immutableData')
      assert.property(result.tokenData, 'mutableData')

      assert.deepEqual(result.tokenData.mutableData, '')
    })

    it('should get token data with transaction history', async () => {
      const tokenId = '43eddfb11c9941edffb8c8815574bb0a43969a7b1de39ad14cd043eaa24fd38d'

      const result = await uut.getTokenData(tokenId, true)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result.tokenData.genesisData.txs)
    })
  })

  // describe('#getTokenData2', () => {
  //   it('should get PS002 data from a valid token', async () => {
  //     const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
  //
  //     const result = await uut.getTokenData2(tokenId)
  //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.equal(result.success, true)
  //     assert.equal(result.status, 200)
  //     assert.equal(result.endpoint, 'getTokenData2')
  //
  //     assert.property(result.tokenData, 'tokenStats')
  //     assert.property(result.tokenData, 'mutableData')
  //     assert.property(result.tokenData, 'immutableData')
  //     assert.property(result.tokenData, 'tokenIcon')
  //     assert.property(result.tokenData, 'fullSizedUrl')
  //     assert.property(result.tokenData, 'optimizedTokenIcon')
  //     assert.property(result.tokenData, 'optimizedFullSizedUrl')
  //     assert.property(result.tokenData, 'iconRepoCompatible')
  //     assert.property(result.tokenData, 'ps002Compatible')
  //   })
  // })

  describe('#getPsffppWritePrice', () => {
    it('should get the price in PSF tokens to pin 1MB of content to the PSFFPP network', async () => {
      const result = await uut.getPsffppWritePrice()
      console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result)
    })
  })

  describe('#cid2json', () => {
    it('should convert a CID to a JSON object', async () => {
      const cid = 'bafkreigbgrvpagnmrqz2vhofifrqobigsxkdvnvikf5iqrkrbwrzirazhm'

      const result = await uut.cid2json({ cid })
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.property(result, 'json')
    })

    it('should throw an error if no CID is provided', async () => {
      try {
        await uut.cid2json()
        // console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.fail('Expected an error to be thrown')
      } catch (err) {
        assert.equal(err.message, 'cid is required')
      }
    })
  })
})
