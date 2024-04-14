import PongBot from './classes/PongBot.js'


async function main() {
    const pongBot = new PongBot()
    await pongBot.init()
}


main()

