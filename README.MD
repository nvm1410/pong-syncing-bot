<h1 align="center">Pong Bot</h1>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#run-locally">Run locally</a></li>
  </ul>
</details>

## About The Project

A bot that calls pong() function for everytime a Ping() emitted.
Smart contract: [PingPong](https://sepolia.etherscan.io/address/0xa7f42ff7433cb268dd7d59be62b00c30ded28d3d)

## Run Locally

1. Get dependencies:
   ```
   yarn
   ```
2. Make sure mongoDb is installed and running in your localhost (you can update database configurations in classes/PongBotDB.js)
3. Create .env file and add some environment variables:

Your Sepolia RPC URL
    ```
   SEPOLIA_RPC_URL
   ```
Your account private key (use to call pong)
    ```
   PRIVATE_KEY
    ```

4. Run the bot:
   ```
   node index
   ```


