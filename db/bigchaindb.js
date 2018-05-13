let db = {
	
	name : "BigchainDB",
	
	insert: function(data) {
		console.log(data + ' was inserted to BigchainDB!!!');
	}
	
};

module.exports.db = db;