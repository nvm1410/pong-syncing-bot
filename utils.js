export async function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ConsoleMessage = {
    MISSING_ENV: 'MISSING_ENV_VARIABLES',
    SHOULD_INIT_FIRST: 'SHOULD_INIT_FIRST',
    START_PONG: 'START_PONG',
    END_PONG: 'END_PONG',
    UPDATE_START_BLOCK_FAILED: 'UPDATE_START_BLOCK_FAILED',
    ALL_MISSING_PINGS: 'ALL_MISSING_PINGS',
    PONG_ALL_MISSING_PINGS_FAILED: 'PONG_ALL_MISSING_PINGS_FAILED',
    PONG_FAILED: 'PONG_FAILED',
    LISTEN_TO_PING: 'STARTED_LISTENING_TO_PING_EVENTS',
    PING_EVENT_RECEIVED: 'PING_EVENT_RECEIVED',
    FAILED_TO_SAVE_NONCE: 'FAILED_TO_SAVE_NONCE',
    START_BLOCK_FROM_CHAIN: 'START_BLOCK_FROM_CHAIN'
}
