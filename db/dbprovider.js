// This is the provider for database implementation modules

const mongodb = require('./mongodb');
const bigchaindb = require('./bigchaindb');

// List of existing modules, please use 1
//let db = mongodb.db;
let db = bigchaindb.db;

module.exports.db = db;