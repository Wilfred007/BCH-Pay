/*
  Unit tests for the msg.js library
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Unit under test
const Message = require('../../lib/msg')

describe('#Message', () => {
  let sandbox, uut

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    uut = new Message({ restURL: 'fakeurl' })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw error if restURL is not input', () => {
      try {
        uut = new Message()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'restURL required when instantiating Message library'
        )
      }
    })
  })

  describe('#getPubKey', () => {
    it('should get a public key for an address', async () => {
      // Mock network
      sandbox.stub(uut.axios, 'post').resolves({ data: { key: 'value' } })

      const addr = 'testaddr'

      const result = await uut.getPubKey(addr)

      assert.equal(result.key, 'value')
    })

    it('should throw an error if input is not a string', async () => {
      try {
        await uut.getPubKey(123)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.equal(
          err.message,
          'Input must be a string containing bitcoincash address'
        )
      }
    })
  })
})
