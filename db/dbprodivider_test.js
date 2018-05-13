const dbprovider = require('./dbprovider');
const db = dbprovider.db;

console.log('Connected to ' + db.name);
db.insert('Hoang');