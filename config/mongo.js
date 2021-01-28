// mongo requires
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// mongo settings
const url = 'mongodb://localhost:27017';
const database = 'chat';
const collectionName = 'users';

const init = () => {
// connect to the database
	MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
		assert.strictEqual(null, err);
		console.log(`Connected successfully to '${database}' database at '${url}' server`);
		let db = client.db(database);
		return db;
	});
};

module.exports = init;

