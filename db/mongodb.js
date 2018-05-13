let db = {
	
	name : "MongoDB",
	
	insert: function(data) {
		console.log(data + ' was inserted to MongoDB!!!');
	}
	
};

module.exports.db = db;