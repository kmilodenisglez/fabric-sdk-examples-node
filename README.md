## Install the node modules

Compatibility only with Node 10 and 12 version

```bash
npm i
```
## Import User credential
- The first time you must uncomment the Step 1, "importUserToWallet" function in run.js

This function imports the user credentials that it will use for connections to the "fabric-client-wallet" folder.

Note: The Step.1 should only be done the first time, OR if you delete the "fabric-client-wallet" folder.

## Create gateway connection with peer node of Org1 network

Initialize the network channel using the discovery options from the gateway connect.

Note: With service discovery active. To use the discovery service, the application will have to define just one peer. 
I use peer "peer0.org1.example.com", see the network-config-be.yaml.

For more information about "service discovery" see:
- https://hyperledger.github.io/fabric-sdk-node/release-1.4/tutorial-discovery-fabric-network.html
- https://hyperledger-fabric.readthedocs.io/en/release-1.4/discovery-overview.html#how-service-discovery-works-in-fabric


#### CODE EXAMPLES

createContractListener: https://github.com/hyperledger/fabric-sdk-node/blob/d667ac98e521550ab90d69d8489b2d48db19e858/test/scenario/features/lib/network.js#L271

createBlockListener: https://github.com/hyperledger/fabric-sdk-node/blob/d667ac98e521550ab90d69d8489b2d48db19e858/test/scenario/features/lib/network.js#L303

#### SOME FABRIC-NETWORK INTERFACES
```ts
getChannel(): Channel;
getContract(chaincodeId: string, name?: string): Contract;
addBlockListener(listenerName: string, callback: (error: Error, block?: Client.Block | Client.FilteredBlock) => Promise<void> | void, options?: EventListenerOptions): Promise<BlockEventListener>;
addCommitListener(transactionId: string, callback: (error: Error, transactionId?: string, status?: string, blockNumber?: string) => Promise<void> | void, options?: EventListenerOptions): Promise<CommitEventListener>;
unregisterAllEventListeners(): void;

```

#### SOME CONTRACT INTERFACES
```ts
addContractListener(listenerName: string, eventName: string, callback: (error: Error, event?: Client.ChaincodeEvent | Client.ChaincodeEvent[], blockNumber ?: string, transactionId ?: string, status ?: string) => Promise <void> | void , options ?: EventListenerOptions): Promise<ContractEventListener>;
addDiscoveryInterest(interest: DiscoveryInterest): Contract;
```