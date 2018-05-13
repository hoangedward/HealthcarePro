// ****************** REGISTER TESTNET ******************
// We can start from
// https://www.bigchaindb.com/developers/getstarted/
// Go to testnet.bigchaindb.com and register an account to get API KEY


// ************************ TEST ************************
// We begin by importing the BigchainDB driver
const driver = require('bigchaindb-driver')

// Cryptographic Identities Generation
const alice = new driver.Ed25519Keypair()

// Create Connection With BigchainDB
// A simple connection with BigchainDB can be established like this.
const conn = new driver.Connection(
    'https://test.bigchaindb.com/api/v1/',
    { app_id: '02fc01e8',
      app_key: '0c6cd03806d8456ffa3bcf831f133cb9' })
			
// Asset Creation
// We’re now ready to create the digital asset. First, let’s make a ‘CREATE’ transaction
const tx = driver.Transaction.makeCreateTransaction(
    { message: 'Hello Edward!' },
    null,
    [ driver.Transaction.makeOutput(
        driver.Transaction.makeEd25519Condition(alice.publicKey))],
    alice.publicKey)
		
// Sign the transaction with private key of Alice to fulfill it
const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)

// And sent over to a BigchainDB node
conn.postTransactionCommit(txSigned)

// Notice the transaction id
txid = txSigned.id

// Check it out
console.log('txid = ' + txid);
console.log('Check out your transaction on BigchainDB Testnet: ' + 'https://test.bigchaindb.com/api/v1/transactions/' + txid);