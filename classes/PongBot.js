import { ethers } from "ethers";
import 'dotenv/config'
import PingPong from '../contracts/PingPong.json' assert { type: "json" }

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const CONTRACT_ADDRESS = '0xA7F42ff7433cB268dD7D59be62b00c30dEd28d3D'



export default class PongBot {
    async init() {
        if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
            throw ('Missing env variables')
        }
        this.provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        this.signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
        this.startBlock = 5687500
        // this.startBlock = await provider.getBlockNumber()
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, PingPong.abi, this.provider)
    }

    async pongAllMissingPings() {
        if (!this.contract) {
            throw ('Should init first')
        }
        // get latest pong transaction hash

        // query for all ping events from the start block
        const pingEvents = await this.contract.queryFilter(this.contract.filters.Ping, 5687500)
    }
}