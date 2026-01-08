const BCHJS = require('@psf/bch-js').default;
const bchaddr = require('bchaddrjs-slp');
const bchjs = new BCHJS({ restURL: process.env.RESTURL || 'https://chipnet.fullstack.cash/v6/' });

class BCHService {
    /**
     * Generate a new BCH address and private key (for internal use/hot wallet)
     * In a real app, you'd use an xPub to generate unique addresses for each invoice.
     */
    async generateAddress() {
        try {
            const mnemonic = bchjs.Mnemonic.generate(128);
            console.log('Mnemonic generated');
            const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);
            console.log('Root seed generated');
            const masterHDNode = bchjs.HDNode.fromSeed(rootSeed);
            const account = bchjs.HDNode.derivePath(masterHDNode, "m/44'/1'/0'");
            const node = bchjs.HDNode.derivePath(account, "0/0");

            const address = bchaddr.toTestnetAddress(bchjs.HDNode.toCashAddress(node));
            console.log('Address generated:', address);
            const WIF = bchjs.HDNode.toWIF(node);
            console.log('WIF generated');

            return {
                address,
                WIF,
                mnemonic
            };
        } catch (error) {
            console.error('Error generating BCH address:', error);
            throw error;
        }
    }

    /**
     * Get balance for a specific address
     */
    async getBalance(address) {
        try {
            const balance = await bchjs.Electrumx.balance(address);
            return balance.balance;
        } catch (error) {
            console.error(`Error getting balance for ${address}:`, error);
            throw error;
        }
    }

    /**
     * Check if an address has received a payment
     */
    async getTransactions(address) {
        try {
            const history = await bchjs.Electrumx.transactions(address);
            return history.transactions;
        } catch (error) {
            console.error(`Error getting transactions for ${address}:`, error);
            throw error;
        }
    }

    /**
     * Convert Satoshis to BCH
     */
    toBCH(satoshis) {
        return bchjs.BitcoinCash.toBitcoinCash(satoshis);
    }

    /**
     * Convert BCH to Satoshis
     */
    toSatoshi(bch) {
        return bchjs.BitcoinCash.toSatoshi(bch);
    }

    /**
   * Sweep funds from an address to another (e.g., to an exchange)
   */
    async sweep(fromWIF, toAddress) {
        try {
            const ecPair = bchjs.ECPair.fromWIF(fromWIF);
            const fromAddress = bchjs.ECPair.toCashAddress(ecPair);

            const uxtos = await bchjs.Electrumx.utxo(fromAddress);
            if (uxtos.utxos.length === 0) throw new Error('No UTXOs found to sweep');

            const transactionBuilder = new bchjs.TransactionBuilder();
            let totalAmount = 0;

            for (const utxo of uxtos.utxos) {
                transactionBuilder.addInput(utxo.tx_hash, utxo.tx_pos);
                totalAmount += utxo.value;
            }

            // Estimate fee (simplified)
            const byteCount = bchjs.BitcoinCash.getByteCount({ P2PKH: uxtos.utxos.length }, { P2PKH: 1 });
            const fee = byteCount * 1.1; // 1.1 sat/byte
            const sendAmount = totalAmount - fee;

            transactionBuilder.addOutput(toAddress, Math.floor(sendAmount));

            for (let i = 0; i < uxtos.utxos.length; i++) {
                transactionBuilder.sign(i, ecPair, null, transactionBuilder.hashTypes.SIGHASH_ALL, uxtos.utxos[i].value);
            }

            const tx = transactionBuilder.build();
            const hex = tx.toHex();
            const txid = await bchjs.RawTransactions.sendRawTransaction(hex);

            return txid;
        } catch (error) {
            console.error('Error sweeping BCH:', error);
            throw error;
        }
    }
}

module.exports = new BCHService();
