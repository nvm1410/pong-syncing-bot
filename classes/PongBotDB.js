import { MongoClient } from 'mongodb'

const URL = 'mongodb://localhost:27017';
const DB_NAME = 'pongBot';

export default class PongBotDB {
    async init() {
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db(DB_NAME);
        this.botCollection = db.collection('bots');
        return this
    }

    async resetAll() {
        // use for testing
        await this.botCollection.updateOne({ _id: 0 }, { $set: { startBlock: null, nonce: null, latestTransactionHash: null } }, { upsert: true })
    }

    async setStartBlock(startBlock) {
        // save as bots[0] for easy retrieve
        await this.botCollection.updateOne({ _id: 0 }, { $set: { startBlock } }, { upsert: true })
    }

    async getStartBlock() {
        const item = await this.botCollection.findOne({ _id: 0 })
        return item?.startBlock
    }

    async setNonce(nonce) {
        // save as bots[0] for easy retrieve
        await this.botCollection.updateOne({ _id: 0 }, { $set: { nonce } }, { upsert: true })
    }

    async getNonce() {
        const item = await this.botCollection.findOne({ _id: 0 })
        return item?.nonce ?? 0
    }

    async setLatestPingTransactionHash(latestTransactionHash) {
        await this.botCollection.updateOne({ _id: 0 }, { $set: { latestTransactionHash } }, { upsert: true })
    }

    async getLatestPingTransactionHash() {
        const item = await this.botCollection.findOne({ _id: 0 })
        return item?.latestTransactionHash
    }
}


