var express = require('express');
const RsoRouter = require('express').Router();
var pool = require('../utils/dbCon');
RsoRouter.post('/create', function(req,res)
{
    let retCode = 200;
	let message = "";
    const {name, description, uid} =req.body;  
    
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
        con.query(
        {
            sql: "SELECT * FROM admins WHERE uid = ?",
            values: [uid]
        }, function (err,results) 
        {
            if(err)
                throw err;

            con.release();

            if (!results[0])
            {
                retCode = 400;
                message = "user not found as admin."
                var ret = {message};
            }
            else
            {
                con.query({
                    sql: "INSERT IGNORE INTO Events SET ?",
                    values: {UID: uid, Name: name, Description: description}
                }, function (err, results)
                {
                    if(err)
                    {
                        if(con)
                            con.release();
                        throw err;
                    }
                    if(results && results.affectedRows > 0)
                    {
                        retCode = 201;
                    }
                    else
                    {
                        retCode = 409;
                        message = "failed. :("
                        var ret = {message};
                    }
                })
            }
            res.status(retCode).json(ret);

            });
        });
    }
    catch(e)
    {
		retCode = 404;
		var ret = {error: e.message};

		res.status(retCode).json(ret);
	}
});

RsoRouter.post('/RSOcreate', function(req, res) {
    let retCode = 200;
    let message = "";

    const { eventID, rsoID } = req.body;
    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            con.query({
                sql: "INSERT INTO RSOEvents (EventID, RSOID) VALUES (?, ?)",
                values: [eventID, rsoID]
            }, function(err, results) {
                if (err) {
                    if (con)
                        con.release();
                    throw err;
                }

                if (results && results.affectedRows > 0) {
                    retCode = 201;
                    message = "RSO event created successfully.";
                } else {
                    retCode = 409;
                    message = "Failed to create RSO event.";
                }

                const ret = { message };
                res.status(retCode).json(ret);
            });
        });
    } catch (e) {
        retCode = 404;
        var ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});


RsoRouter.post('/comment', function(req,res)
{
    console.log("hello");
    let retCode = 200;
    let message = "";
    const{eventID,uid,time,comment} = req.body;

    try
    {
        pool.getConnection(function(err, con) {
            if (err)
            {
                if (con)
                    con.release();
                throw err;
            }
        con.query({sql: "INSERT IGNORE INTO Comments SET ?", values: {EventID: eventID,UID: uid,Time: time,Comment: comment}},
            function (err,results) {
                if (err)
                {
                    if (con)
                        con.release();
                    throw err;
                }

                if(results && results.affectedRows > 0)
                {
                    retCode = 200;
                }
                else
                {
                    retCode = 409;
                    message = "comment failed to be made.";
                    var ret = {message};
                }

                res.status(retCode).json(ret);
            });
        });
    }
    catch(e)
    {
		retCode = 404;
		var ret = {error: e.message};

		res.status(retCode).json(ret);
	}
});

RsoRouter.post('/search', function(req, res) {
    let retCode = 200;
    let message = "base message.";

    const { search } = req.body;
    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            const sqlQuery = "SELECT * FROM Events WHERE Name LIKE ? OR Description LIKE ? OR Time LIKE ? OR LocationName LIKE ?";
            const searchTerm = `%${search}%`; 

            con.query({
                sql: sqlQuery,
                values: [searchTerm, searchTerm, searchTerm, searchTerm]
            }, function(err, results) {
                if (err) {
                    if (con)
                        con.release();
                    throw err;
                }

                res.status(retCode).json(results);
            });
        });
    } catch (e) {
        retCode = 404;
        var ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});


module.exports = RsoRouter;