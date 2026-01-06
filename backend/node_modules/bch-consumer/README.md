# bch-consumer

_bch-consumer_ is a JS library for retrieving Bitcoin Cash (BCH) blockchain data from [ipfs-bch-wallet-consumer](https://github.com/Permissionless-Software-Foundation/ipfs-bch-wallet-consumer), which in turn gets its information from [ipfs-bch-wallet-service](https://github.com/Permissionless-Software-Foundation/ipfs-bch-wallet-service). This library is part of the [Cash Stack](https://cashstack.info).

## Installation

```
npm install --save bch-consumer
```

## Instantiation

```javascript
// Configure this constant for your infrastructure.
const RESTURL = 'https://free-bch.fullstack.cash'
// const RESTURL = 'http://localhost:5005'
console.log(`Using this REST URL for bch-consumer: ${RESTURL}`)

// Instantiate bch-consumer
const BchConsumer = require('bch-consumer')
const bchConsumer = new BchConsumer({ restURL: RESTURL })
```

## Examples

Here are some simple examples illustrating how to use this library. These examples assume the BCH blockchain.

### Get a Balance for an Address

```javascript
const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'
const result = await bchConsumer.bch.getBalance(addr)
console.log('result: ', result)
```

### Get UTXOs for an Address

```javascript
const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'
const result = await bchConsumer.bch.getUtxos(addr)
console.log('result: ', result)
```

### Send a Transaction

```javascript
const hex = '0100000001000000000000abcdef'
const result = await bchConsumer.bch.sendTx(hex)
console.log('result: ', result)
```

### Get Transaction History for an Address

```javascript
const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'
const result = await bchConsumer.bch.getTxHistory(addr)
console.log('result: ', result)
```

### Get Transaction Details for a TXID

```javascript
const txids = [
  '01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b'
]
const result = await bchConsumer.bch.getTxData(txids)
console.log('result: ', result)
```

### Lookup the Public Key for an Address

```javascript
const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'
const result = await bchConsumer.msg.getPubKey(addr)
console.log('result: ', result)
```

### Get Token Data

```javascript
const tokenId = '22f8475fd82a4163a64cdb0d868534d016964b3acc8a6f0e6572f3c373d01866'
const result = await bchConsumer.bch.getTokenData(tokenId)
console.log('result: ', result)
```

### Get the PSF Write Price

The PSF Write Price is the cost of hosting 1 MB of data to the [PSFFPP file pinning network](https://psffpp.com) for a year.

```javascript
const result = await bchConsumer.bch.getPsffppWritePrice()
console.log('result: ', result)
```

### Convert a CID to a JSON Object

The output of `getTokenData()` returns IPFS CIDs. If an IPFS CID resolves to a JSON file (like in the case of tokens), you can give the CID and retrieve the JSON object.

```javascript
const cid = 'bafkreigbgrvpagnmrqz2vhofifrqobigsxkdvnvikf5iqrkrbwrzirazhm'
const result = await bchConsumer.bch.cid2json({ cid })
console.log('result: ', result)
```



## Licence

[MIT](LICENSE.md)

