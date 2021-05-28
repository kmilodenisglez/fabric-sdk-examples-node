const fabricClient = require('fabric-client');
const {FileSystemWallet} = require("fabric-network");
const {User} = require("fabric-client");
const path = require("path");
const fs = require("fs");
const {Gateway} = require("fabric-network");
const {X509WalletMixin} = require("fabric-network");

const username = "user"

/**
 * getWallet
 * @description
 * return FileSystemWallet
 * @param {NetworkProfile} [ccp] connection network profile (.yaml)
 * @return {FileSystemWallet}
 * */
module.exports.getWallet = (ccp) => {
    // Create a new file system based wallet for managing identities.
    const walletPath = ccp.client.credentialStore.cryptoStore.path
    return new FileSystemWallet(walletPath);
}


// *  ***************  importPeerUserOnWallet - this would be done only once  ***********************
/**
 * importPeerUserOnWallet
 * @description
 * import keystore and signcert to wallet in connection profile,
 *
 * @param {NetworkProfile} [ccp] conection network profile (.yaml)
 * @param orgName
 * @param {string} [mspID] msp id name
 * @param {string} mspConfigPath CORE_PEER_MSPCONFIGPATH
 *
 * @return Client.User
 * */
module.exports.importPeerUserOnWallet = async (ccp, orgName, mspID, mspConfigPath) => {

    let user = new User({
        name: username,
        roles: ['client', 'user'],
        affiliation: [orgName.toLowerCase()]
    });

    let cryptoSuite = fabricClient.newCryptoSuite();

    const keystore = fs.readFileSync(path.resolve(mspConfigPath, 'keystore','c75bd6911aca808941c3557ee7c97e90f3952e379497dc55eb903f31b50abc83_sk')).toString('utf-8')
    const signcert = fs.readFileSync(path.resolve(mspConfigPath, 'signcerts','User1@org1.example.com')).toString('utf-8')

    const privateKey = await cryptoSuite.importKey(keystore, {ephemeral: true})
    // const publicKey = cryptoSuite.importKey(readSingleFileOnThePath(signcert), {ephemeral: true});

    await user.setEnrollment(privateKey, signcert, mspID)

    // create admin identity
    const identity = X509WalletMixin.createIdentity(mspID, signcert, privateKey.toBytes());

    const wallet = module.exports.getWallet(ccp);
    if (! await wallet.exists(username)) {
        await wallet.import(username, identity);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: username, discovery: {enabled: true, asLocalhost: true}});

    gateway.getClient().setCryptoSuite(cryptoSuite);

    return await gateway.getClient().setUserContext(user)
}

// You must first call importPeerUserOnWallet, to import the user to the wallet.
// getGateway
module.exports.getGateway = async (connectionProfile, asLocalInDiscovery = false) => {
    const wallet = module.exports.getWallet(connectionProfile);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists("user");
    if (!userExists) {
        return Promise.reject(Error(`An identity for the user "${username}" does not exist in the wallet`));
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
        wallet,
        identity: username,
        discovery: {enabled: true, asLocalhost: asLocalInDiscovery}
    }).catch((err) => {
        throw err
    })
gateway.getNetwork()
    // return gateway with identity
    return gateway
}