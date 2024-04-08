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





module.exports = RsoRouter;