var express = require('express');
const usersRouter = require('express').Router();

var pool = require('../utils/dbCon');

usersRouter.post('/login', function(req, res) {
	// start every API endpoint with the default return codes
	let retCode = 200;
	let message = "";
	var resp;

	// if we're using a post command, there is usually a body to pull from
	// only pull the variables we need
	// make sure the front-end sends the correct variable names in the json
	const {username, password} = req.body;

	console.log("Begin LOGIN for User " + username);

	// we use try to force a 404 if there is trouble with the API call
	// and so it doesn't crash the server yippee
	// TO-DO: make less messy
	try
	{	
		pool.getConnection(async (err, con) =>
		{
			if (err)
			{
				if (con)
					con.release();
				throw err;
			}

			// TO-DO: rewrite query request so it can accept more than one variable
			// without crashing
			const result = await con.query({
				sql: "SELECT * FROM users WHERE (Username = ?)",
				values: [username]
			}, function(err, results)
			{
				if (err)
					throw err;
			});

			con.release();
		});
		
		// TO-DO: Currently cannot get any variables to exist outside of the
		// query regaridng to its result. Find a way to do so
		// so the code isn't insanely messy
		var ret = {result: result[0], message};
	}
	catch (e)
	{
		retCode = 404;
		var ret = {error: e.message};
	}

	res.status(retCode).json(ret);
});

module.exports = usersRouter;