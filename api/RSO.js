var express = require('express');
const RsoRouter = require('express').Router();
var pool = require('../utils/dbCon');

RsoRouter.post('/create', function(req,res)
{
    let retCode = 200;
	let message = "";
    const {name, description, uid} =req.body;  
    
    console.log("Begin CREATE for RSO " + name);

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

                if (!results[0])
                {
                    retCode = 400;
                    message = "user not found as admin."
                    var ret = {message};
                }
                else
                {
                    con.query({
                        sql: "INSERT IGNORE INTO RSOs SET ?",
                        values: {Name: name, Description: description}
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
                            const rsoid = results.insertId;

                            con.query({sql: "INSERT INTO RSOCreationHistory SET ?",
                            values: {UID: uid, RSOID: rsoid}}, function (err, resultsHistory) {
                                if(err)
                                {
                                    if (con)
                                        con.release();
                                    throw err;
                                }

                                if(resultsHistory && resultsHistory.affectedRows > 0)
                                {
                                    retCode = 200;
                                }
                                else
                                {
                                    retCode = 409;
                                    message = "failed in rso creation";
                                    var ret = {message};
                                }

                                res.status(retCode).json(ret);
                            });
                            retCode = 201;
                        }
                        else
                        {
                            retCode = 409;
                            message = "failed. :("
                            var ret = {message};

                            res.status(retCode).json(ret);
                        }
                    })
                }
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

RsoRouter.post('/search', function(req,res)
{
    let retCode = 200;
    let message = "base message.";

    const {name} = req.body;

    try
	{	
		// start by contacting the pool
		pool.getConnection(function(err, con) 
        {
			if (err)
			{
				if (con)
					con.release();
				throw err;
			}
            
            con.query({sql: "SELECT * FROM rsos WHERE Name LIKE ?",
            values: ["%" + name + "%"]}, function (err, results) {
            if(err)
                throw err;
            con.release();

            if(results[0])
            {
                message = "hooray";
                var ret = {result: results, message};
            }
            else
            {
                retCode = 400;
                message = "Not found."
                var ret = {message};
            }
            res.status(retCode).json(ret);

        })
        });

    }
    catch(e)
    {
		retCode = 404;
		var ret = {error: e.message};
		res.status(retCode).json(ret);
    }
});



module.exports = RsoRouter;