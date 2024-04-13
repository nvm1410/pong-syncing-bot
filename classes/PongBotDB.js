import CyclicDb from "@cyclic.sh/dynamodb"
import 'dotenv/config'


const CYCLIC_DB = process.env.CYCLIC_DB

export default class PongBotDB {
    constructor() {
        this.db = CyclicDb(CYCLIC_DB)
        this.botCollection = this.db.collection("bots")
    }

    async resetStartBlock() {
        // save as bots[0] for easy retrieve
        await this.botCollection.set('0', {
            startBlock: null
        })
    }

    async setStartBlock(startBlock) {
        // save as bots[0] for easy retrieve
        await this.botCollection.set('0', {
            startBlock
        })
    }

    async getStartBlock() {
        const item = await this.botCollection.get('0')
        return item?.props?.startBlock
    }

    async setNonce(nonce) {
        // save as bots[0] for easy retrieve
        await this.botCollection.set('0', {
            nonce
        })
    }

    async getNonce() {
        const item = await this.botCollection.get('0')
        return item?.props?.nonce ?? 0
    }

    async setLatestPingTransactionHash(latestTransactionHash) {
        const item = await this.botCollection.get('0')
        await item.set({ latestTransactionHash })
    }

    async getLatestPingTransactionHash() {
        const item = await this.botCollection.get('0')
        return item?.props?.latestTransactionHash
    }
}


