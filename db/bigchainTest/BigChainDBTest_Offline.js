// ****************** OFFLINE INSTALLATION ******************
// Running and testing the latest version of BigchainDB is easy. Make sure you have a recent version of Docker Compose installed in your host.
// https://docs.docker.com/compose/install/
// Whenever you are ready, fire up a terminal and run:

// git clone https://github.com/bigchaindb/bigchaindb.git
// cd bigchaindb
// make run
// BigchainDB should be reachable now on http://localhost:9984/.


// *********************** TEST *********************
// We begin by importing the BigchainDB driver
const driver = require('bigchaindb-driver')

// Next, we define a constant containing the API path.
const API_PATH = 'http://localhost:9984/api/v1/'

// Create Connection With BigchainDB
// A simple connection with BigchainDB can be established like this.
const conn = new driver.Connection(API_PATH)

// Cryptographic Identities Generation
// Alice and Bob are represented by public/private key pairs. The private key is used to sign transactions, meanwhile the public key is used to verify that a signed transaction was indeed signed by the one who claims to be the signee.
const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()

// Digital Asset Definition
// As an example, let’s consider the creation and transfer of a digital asset that represents a bicycl
const assetdata = {
        'bicycle': {
                'serial_number': 'abcd1234',
                'manufacturer': 'Bicycle Inc.',
        }
}

// Metadata Definition (optional)
//You can optionally add metadata to a transaction. Any JSON object is accepted.
// For example, the bicycle will be transferred on earth which is metadata
const metadata = {'planet': 'earth'}

// Asset Creation
// We’re now ready to create the digital asset. First, let’s make a ‘CREATE’ transaction
const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
);

// Sign the transaction with private key of Alice to fulfill it
const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)

// And sent over to a BigchainDB node
conn.postTransactionCommit(txCreateAliceSimpleSigned)

// Notice the transaction id
txid = txCreateAliceSimpleSigned.id

// Check it out
console.log('txid = ' + txid);
