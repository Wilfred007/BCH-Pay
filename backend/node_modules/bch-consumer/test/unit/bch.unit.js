/*
  Unit tests for the bch.js library
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Unit under test
const BCH = require('../../lib/bch')

describe('#BCH', () => {
  let sandbox, uut

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    uut = new BCH({ restURL: 'fakeurl' })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw error if restURL is not input', () => {
      try {
        uut = new BCH()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'restURL required when instantiating BCH library'
        )
      }
    })
  })

  describe('#getBalance', () => {
    it('should request a balance for a single address', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const addr = 'testaddr'

      const result = await uut.getBalance(addr)

      assert.equal(result.key, 'value')
    })

    it('should throw an error if input is not a string', async () => {
      try {
        await uut.getBalance(123)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'Input must be a string (address) or an array of strings'
        )
      }
    })

    it('should request a balance for an array of addresses', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const addrs = ['testaddr1', 'testaddr2']

      const result = await uut.getBalance(addrs)

      assert.equal(result.key, 'value')
    })
  })

  describe('#getUtxos', () => {
    it('should request utxos for a single address', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const addr = 'testaddr'

      const result = await uut.getUtxos(addr)

      assert.equal(result.key, 'value')
    })

    it('should throw an error if input is not a string or array', async () => {
      try {
        await uut.getUtxos(123)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'addr parameter must be an array or a string'
        )
      }
    })

    it('should throw an error if input array has more than 20 elements', async () => {
      try {
        const addrs = []
        for (let i = 0; i < 25; i++) {
          addrs.push(i)
        }

        await uut.getUtxos(addrs)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'addr parameter must not exceed 20 elements'
        )
      }
    })

    it('should request UTXOs for an array of addresses', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const addrs = ['addr1', 'addr2']

      const result = await uut.getUtxos(addrs)

      assert.equal(result.key, 'value')
    })
  })

  describe('#sendTx', () => {
    it('should broadcast a transaction', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const hex = 'fakehex'

      const result = await uut.sendTx(hex)

      assert.equal(result.key, 'value')
    })

    it('should throw an error if input is not a string', async () => {
      try {
        await uut.sendTx(123)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'Input must be a string containing hex representation of a transaction'
        )
      }
    })
  })

  describe('#getTxHistory', () => {
    it('should get transaction history', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const addr = 'testaddr'

      const result = await uut.getTxHistory(addr)

      assert.equal(result.key, 'value')
    })

    it('should throw an error if input is not a string', async () => {
      try {
        await uut.getTxHistory(123)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'Input must be a string containing bitcoincash address'
        )
      }
    })
  })

  describe('#getTxData', () => {
    it('should get transaction data', async () => {
      // Mock network
      sandbox
        .stub(uut.axios, 'post')
        .resolves({ data: { txData: { key: 'value' } } })

      const txids = ['testaddr']

      const result = await uut.getTxData(txids)

      assert.equal(result.key, 'value')
    })

    it('should throw an error if input is not a string', async () => {
      try {
        await uut.getTxData(123)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'Input must be an array of strings representing TXIDs'
        )
      }
    })
  })

  describe('#getUsd', () => {
    it('should call the REST API', async () => {
      // Mock dependency
      sandbox.stub(uut.axios, 'get').resolves({ data: { usd: 300.00 } })

      const result = await uut.getUsd()

      assert.equal(result, 300.00)
    })
  })

  describe('#utxoIsValid', () => {
    it('should pass data to REST API', async () => {
      const utxo = {
        txid: 'fake'
      }

      // Mock dependency
      sandbox.stub(uut.axios, 'post').resolves({ data: true })

      const result = await uut.utxoIsValid(utxo)

      assert.equal(result, true)
    })

    it('should throw an error if axios throws an error', async () => {
      // Force an error
      sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

      try {
        const utxo = {
          txid: 'fake'
        }

        await uut.utxoIsValid(utxo)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'test error'
        )
      }
    })
  })

  describe('#getTokenData', () => {
    it('should pass data to REST API', async () => {
      const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'

      // Mock dependency
      sandbox.stub(uut.axios, 'post').resolves({ data: { a: 'b' } })

      const result = await uut.getTokenData(tokenId)

      assert.equal(result.a, 'b')
    })

    it('should throw an error if axios throws an error', async () => {
      // Force an error
      sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

      try {
        const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'

        await uut.getTokenData(tokenId)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'test error'
        )
      }
    })
  })

  describe('#getTokenData2', () => {
    it('should pass data to REST API', async () => {
      const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'

      // Mock dependency
      sandbox.stub(uut.axios, 'post').resolves({ data: { a: 'b' } })

      const result = await uut.getTokenData2(tokenId)

      assert.equal(result.a, 'b')
    })

    it('should throw an error if axios throws an error', async () => {
      // Force an error
      sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

      try {
        const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'

        await uut.getTokenData2(tokenId)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'test error'
        )
      }
    })
  })
})
