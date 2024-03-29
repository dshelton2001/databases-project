var express = require('express');
const RsoRouter = require('express').Router();
var pool = require('../utils/dbCon');

RsoRouter.post('/create', function(req,res){
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
    con.query({
            sql: "SELECT * FROM admins WHERE uid = ?",
            values: [uid]
        }, function (err,results) {
            if(err)
                throw err;

            con.release();

            if (results[0])
            {
                var ret = {result: results[0], message};
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
catch(e)
    {
		retCode = 404;
		var ret = {error: e.message};

		res.status(retCode).json(ret);
	}
});
module.exports = RsoRouter;