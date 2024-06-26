var express = require('express');
const usersRouter = require('express').Router();
var pool = require('../utils/dbCon');

usersRouter.post('/login', function(req, res) {
	// start every API endpoint with the default return codes
	let retCode = 200;
	let message = "";

	// if we're using a post command, there is usually a body to pull from
	// only pull the variables we need
	// make sure the front-end sends the correct variable names in the json
	const {username, password} = req.body;

	console.log("Begin LOGIN for User " + username);

	// we use try to force a 404 if there is trouble with the API call
	// and so it doesn't crash the server yippee
	try
	{	
		// start by contacting the pool
		pool.getConnection(function(err, con) {
			if (err)
			{
				if (con)
					con.release();
				throw err;
			}

			// unfortunately, as nodejs runs async, we must perform our return functions
			// within this query 
			con.query({
				sql: "SELECT users.uid FROM users WHERE Username = ? AND Password = ?",
				values: [username, password]
			}, function (err, results) {
				if (err)
					throw err;

				con.release();

				// check if login was successful
				if (results[0])
				{
					var ret = {uid: results[0].uid, message};
				}
				else
				{
					retCode = 400;
					message = "Incorrect username/password combination"
					var ret = {message};
				}
				
				res.status(retCode).json(ret);
			});
		});
	}
	catch (e)
	{
		retCode = 404;
		var ret = {error: e.message};

		res.status(retCode).json(ret);
	}
});

usersRouter.post('/register', function(req, res) {
	// start every API endpoint with the default return codes
	let retCode = 200;
	let message = "";

	// this'll have more in it once we solidify what customization our users have
	// like fn, ln, etc.
	const {username, password} = req.body;

	// To-do: maybe make this better
	if (!username || !password)
	{
		message = "invalid input";
		retCode = 400;
		var ret = {message};

		res.status(retCode).json(ret);

		return;
	}

	console.log("Begin REGISTER for User " + username);

	try
	{	
		// start by contacting the pool
		pool.getConnection(function(err, con) {
			if (err)
			{
				if (con)
					con.release();
				throw err;
			}

			// ignore is added since we want to do error checking ourselves
			// for duplicate entries
			con.query({
				sql: "INSERT IGNORE INTO users SET ?",
				values: {Username: username, Password: password}
			}, function (err, results) {
				if (err)
				{
					if (con)
						con.release();
					throw err;
				}

				// error checking
				var ret;

				if (results && results.affectedRows > 0)
				{
					retCode = 201;
					ret = {uid:results.insertId, message};
				}
				else
				{
					// annoying, but we need to make sure we can give a good
					// explanation to devs when error checking :)
					if (results && results.affectedRows == 0)
					{
						retCode = 400;
						message = "Duplicate user or invalid input";
					}
					else
					{
						retCode = 409;
						message = "User creation failed when sent to server";
					}

					ret = {message};
				}

				
				res.status(retCode).json(ret);
			});
		});
	}
	catch (e)
	{
		retCode = 404;
		var ret = {error: e.message};

		res.status(retCode).json(ret);
	}
});

usersRouter.post('/makeadmin', function(req, res) {
	// start every API endpoint with the default return codes
	let retCode = 200;
	let message = "";

	const {uid} = req.body;

	if (!uid)
	{
		message = "invalid input";
		retCode = 400;
		var ret = {message};

		res.status(retCode).json(ret);

		return;
	}

	console.log("Begin MAKEADMIN for UID " + uid);

	try
	{	
		// start by contacting the pool
		pool.getConnection(function(err, con) {
			if (err)
			{
				if (con)
					con.release();
				throw err;
			}

			// ignore is added since we want to do error checking ourselves
			// for duplicate entries
			con.query({
				sql: "INSERT IGNORE INTO admins SET ?",
				values: {UID: uid}
			}, function (err, results) {
				if (err)
				{
					if (con)
						con.release();
					throw err;
				}

				// error checking
				if (results && results.affectedRows > 0)
				{
					retCode = 201;
				}
				else
				{
					// annoying, but we need to make sure we can give a good
					// explanation to devs when error checking :)
					if (results && results.affectedRows == 0)
					{
						retCode = 400;
						message = "Duplicate user or invalid input";
					}
					else
					{
						retCode = 409;
						message = "User creation failed when sent to server";
					}
				}

				var ret = {message};
				res.status(retCode).json(ret);
			});

			
		});
	}
	catch (e)
	{
		retCode = 404;
		var ret = {error: e.message};

		res.status(retCode).json(ret);
	}
});

usersRouter.post('/checkadmin', function(req, res) {
    let retCode = 200;
    let message = "User is not an admin.";
	let isAdmin = false;

    const { uid } = req.body;

	console.log("Begin CHECKADMIN for UID " + uid);

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            
            const sql = "SELECT * FROM Admins WHERE UID = ?";
            const values = [uid];
            
            con.query(sql, values, function (err, results) {
                if (err) throw err;
                con.release();
                
                if (results.length > 0) {
                    message = "User is an admin.";
					isAdmin = true;
                }
				
                res.status(retCode).json({ isAdmin, message });
            });
        });
    } catch(e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});

usersRouter.post('/checksuperadmin', function(req, res) {
    let retCode = 200;
    let message = "User is not a superadmin.";

    const { uid } = req.body;

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            
            const sql = "SELECT * FROM SuperAdmins WHERE UID = ?";
            const values = [uid];
            
            con.query(sql, values, function (err, results) {
                if (err) throw err;
                con.release();
                
                if (results.length > 0) {
                    message = "User is a superadmin.";
                }
                res.status(retCode).json({ message });
            });
        });
    } catch(e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});

// HERE YOU GO
usersRouter.post('/RSOusers', function(req, res) {
    const { rsoID } = req.body;

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            con.query({
                sql: "SELECT COUNT(*) AS userCount FROM RSOMembers WHERE RSOID = ?",
                values: [rsoID]
            }, function(err, results) {
                if (err) {
                    if (con)
                        con.release();
                    throw err;
                }

                if (results.length === 0) {
                    const message = "No users found for the specified RSO ID.";
                    return res.status(404).json({ message });
                }

                const userCount = results[0].userCount;

                res.status(200).json({ userCount });
            });
        });
    } catch (e) {
        const ret = { error: e.message };
        res.status(500).json(ret);
    }
});


module.exports = usersRouter;