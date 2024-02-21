var mysql = require('mysql');

// so we can get extra data if we're running it locally from our git
const isDebug = process.env.NODE_ENV === 'production';

const host = process.env.DB_URL;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

var pool = mysql.createPool({
	connectionLimit: 100,
	host,
	port,
	user,
	password,
	database,
	debug: isDebug
});

module.exports = pool;