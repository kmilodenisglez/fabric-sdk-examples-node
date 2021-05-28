const yaml = require('js-yaml');
const fs = require("fs");
const path = require('path')
const {getGateway} = require("./utils");
const {importPeerUserOnWallet} = require("./utils");

// **Privi ORGANIZATION Name**
let orgName = "org1"
// Privi msp ID
let mspId = "org1MSP"
// Privi channel id
let channelId = "mychannel"
// Privi smartcontract name
let smartcontractName = "marbles"

const CORE_PEER_MSPCONFIGPATH = path.resolve('./organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp')

const connectionProfilePath = path.resolve('./network-config.yaml')


// Step 1. This would be done only once
importUserToWallet().then(r => console.log(r))

// Step 2 - 3 - 4
run().then(r => null)




// Step 1. This would be done only once
async function importUserToWallet() {
    const ccp = yaml.load(fs.readFileSync(connectionProfilePath))

    // import user credential to  --./fabric-client-wallet-- wallet
    return await importPeerUserOnWallet(ccp, orgName, mspId, CORE_PEER_MSPCONFIGPATH).catch((err) => console.log(err.message))
}

async function run () {
    const ccp = yaml.load(fs.readFileSync(connectionProfilePath))

    // Step 2. Get Gateway
    const gateway = await getGateway(ccp)
    // Step 3. Get Network
    const network = await gateway.getNetwork(channelId)

    // Step 4. Get Contract Installed in PEER
    const contract = network.getContract(smartcontractName);

    console.log(contract)

    // from here look at the doc
    // https://hyperledger.github.io/fabric-sdk-node/release-1.4/tutorial-listening-to-events.html

    // you can use this function for Block Listener
    // network.addBlockListener

    // this function for Contract Listener
    // contract.addContractListener
}
