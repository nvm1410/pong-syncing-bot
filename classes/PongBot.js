import { ethers } from "ethers";
import PongBotDB from './PongBotDB.js'
import PingPong from '../contracts/PingPong.json' assert { type: "json" }
import 'dotenv/config'
import { ConsoleMessage, timeout } from "../utils.js";
import PQueue from 'p-queue';

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const CONTRACT_ADDRESS = '0xA7F42ff7433cB268dD7D59be62b00c30dEd28d3D'



export default class PongBot {
    async init() {
        if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
            throw (ConsoleMessage.MISSING_ENV)
        }
        const pongBotDB = new PongBotDB()
        this.pongBotDB = await pongBotDB.init()
        this.provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        this.signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, PingPong.abi, this.signer)

        await this.updateStartBlock()

        // pong missing pings if any
        await this.pongAllMissingPings()

        // listen to ping events
        this.listenToPingEvents()
    }

    async updateStartBlock() {
        if (!this.contract) {
            throw (ConsoleMessage.SHOULD_INIT_FIRST)
        }
        try {
            const startBlockFromChain = await this.provider.getBlockNumber()
            const startBlockFromDB = await this.pongBotDB.getStartBlock();
            this.startBlock = startBlockFromDB || startBlockFromChain
            console.log(ConsoleMessage.START_BLOCK_FROM_CHAIN, startBlockFromChain)
            await this.pongBotDB.setStartBlock(this.startBlock)
        } catch (e) {
            console.log(ConsoleMessage.UPDATE_START_BLOCK_FAILED)
            console.log(e)
            // retry after 2 seconds
            await timeout(2000)
            await this.updateStartBlock()
        }
    }

    async pongAllMissingPings() {
        if (!this.contract) {
            throw (ConsoleMessage.SHOULD_INIT_FIRST)
        }
        try {
            // get latest ping transaction hash
            const latestTransactionHash = await this.pongBotDB.getLatestPingTransactionHash()


            if (latestTransactionHash) {
                // check if this hash has a corresponding pong (since when pong, we saved the hash before calling contract pong)
                const pongEvents = await this.contract.queryFilter(this.contract.filters.Pong, this.startBlock)
                const pongTransactions = await Promise.all(pongEvents.filter(event => event.data === latestTransactionHash).map(event => this.provider.getTransaction(event.transactionHash)))

                if (!pongTransactions.filter(x => x).some(transaction => transaction.from === this.signer.address)) {
                    await this.pong(latestTransactionHash)
                }
            }

            // query for all ping events from the start block
            const pingEvents = await this.contract.queryFilter(this.contract.filters.Ping, this.startBlock)

            const latestPingIndex = pingEvents.findIndex(event => event.transactionHash === latestTransactionHash)
            const missingPings = pingEvents.slice((latestPingIndex === -1) ? undefined : (latestPingIndex + 1))


            console.log(ConsoleMessage.ALL_MISSING_PINGS, missingPings.map(x => x.transactionHash))

            for (const { transactionHash } of missingPings) {
                await this.pong(transactionHash)
            }
        } catch (e) {
            console.log(ConsoleMessage.PONG_ALL_MISSING_PINGS_FAILED)
            console.log(e)
            // retry after 2 seconds
            await timeout(2000)
            await this.pongAllMissingPings()
        }
    }

    async pong(transactionHash) {
        if (!this.contract) {
            throw (ConsoleMessage.SHOULD_INIT_FIRST)
        }
        try {
            console.log(ConsoleMessage.START_PONG, transactionHash)
            // set transaction hash in the db first
            await this.pongBotDB.setLatestPingTransactionHash(transactionHash)

            const currentNonce = Math.max(await this.signer.getNonce(), await this.pongBotDB.getNonce())
            await this.contract.pong(transactionHash, {
                nonce: currentNonce,
            })
            // have another try catch to save nonce
            try {
                // save latest nonce to db after transaction response
                await this.pongBotDB.setNonce(currentNonce + 1)
            } catch (e) {
                console.log(ConsoleMessage.FAILED_TO_SAVE_NONCE)
            }
            console.log(ConsoleMessage.END_PONG, transactionHash)
        }
        catch (e) {
            console.log(ConsoleMessage.PONG_FAILED, transactionHash)
            console.log(e)
            // retry after 2 seconds
            await timeout(2000)
            await this.pong(transactionHash)
        }
    }

    listenToPingEvents() {
        if (!this.contract) {
            throw (ConsoleMessage.SHOULD_INIT_FIRST)
        }
        console.log(ConsoleMessage.LISTEN_TO_PING)
        //handle pong in a queue of 1 to make sure pongs are in order
        const queue = new PQueue({ concurrency: 1, autoStart: true });
        this.contract.on(this.contract.filters.Ping, (payload) => {
            queue.add(() => this.pong(payload.log.transactionHash))
        })
    }
}