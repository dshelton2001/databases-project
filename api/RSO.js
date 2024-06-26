var express = require('express');
const RsoRouter = require('express').Router();
var pool = require('../utils/dbCon');

RsoRouter.post('/create', function(req,res)
{
    let retCode = 200;
	let message = "";
    const {name, description, uid} = req.body;  
    
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

                                    var ret = {rsoid: results.insertId, message};
                                }
                                else
                                {
                                    retCode = 409;
                                    message = "Failed to create RSO.";
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

RsoRouter.post('/getmine', function(req,res)
{
    let retCode = 200;
    let message = "base message.";

    const {uid} = req.body;

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
            
            con.query({
                sql: "SELECT * FROM rsos WHERE EXISTS (SELECT 1 FROM rsomembers WHERE rsomembers.RSOID = rsos.RSOID AND rsomembers.UID = ?);",
                values: [uid]},
            function (err, results) {
                if(err)
                    throw err;
                con.release();
                
                if(results[0])
                {
                    message = results.length + " result(s) for \"" + "My RSO" + "\".";
                    var ret = {results:results, message};
                }
                else
                {
                    retCode = 209;
                    message = "No results for \"" + "My RSO" + "\". You should join one!";
                    var ret = {results: results, message};
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

RsoRouter.post('/search', function(req,res)
{
    let retCode = 200;
    let message = "base message.";

    const {search, getAll} = req.body;

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
            
            con.query({
                sql: "SELECT * FROM rsos WHERE Name LIKE ?",
                values: ["%" + search + "%"]},
            function (err, results) {
                if(err)
                    throw err;
                con.release();
                
                if(results[0])
                {
                    message = results.length + " result(s) for \"" + search + "\".";
                    var ret = {results:results, message};
                }
                else
                {
                    retCode = 209;
                    message = "No results for \"" + search + "\".";
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

RsoRouter.post('/getfromid', function(req,res)
{
    let retCode = 200;
    let message = "base message.";

    const {rsoid} = req.body;

    console.log("Begin GETFROMID for RSOID " + rsoid);

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
            
            con.query({
                sql: "SELECT * FROM rsos WHERE RSOID = ?",
                values: [rsoid]},
            function (err, results) {
                if(err)
                    throw err;
                con.release();
                
                if(results[0])
                {
                    message = "Results exists! Wow!";
                    var ret = {result: results[0], message};
                }
                else
                {
                    retCode = 209;
                    message = "RSO does not exist.";
                    var ret = {results, message};
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

RsoRouter.post('/join', function(req,res)
{
    let retCode = 200;
    let message = "base message.";

    const {uid, rsoid} = req.body;

    console.log("Begin JOIN for UID " + uid + " & RSOID " + rsoid);

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
            
            con.query({
                sql: "INSERT IGNORE INTO rsomembers SET ?",
                values: {UID: uid, RSOID: rsoid}
            }, function (err, results) {
                if(err)
                    throw err;
                con.release();

                if(results && results.affectedRows > 0)
                {
                    message = "Successfully joined.";
                    var ret = {result: results[0], message};
                }
                else
                {
                    retCode = 400;
                    message = "Error with User or RSO information. Refresh and try again."
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


RsoRouter.post('/unjoin', function(req, res) {
    let retCode = 200;
    let message = "base message.";

    const { uid, rsoid } = req.body;

    try {
        // start by contacting the pool
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            con.query({
                sql: "DELETE FROM rsomembers WHERE UID = ? AND RSOID = ?",
                values: [uid, rsoid]
            }, function(err, results) {
                if (err)
                    throw err;
                con.release();

                if (results && results.affectedRows > 0) {
                    message = "Unjoined.";
                    var ret = { result: results[0], message };
                } else {
                    retCode = 400;
                    message = "No work."
                    var ret = { message };
                }
                res.status(retCode).json(ret);
            })
        });
    } catch (e) {
        retCode = 404;
        var ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});


RsoRouter.post('/edit', function(req, res) {
    let retCode = 200;
    let message = "Base message.";

    const { rsoid, name, description } = req.body; 

    try {
        // Start by contacting the pool
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            
            const sql = "UPDATE rsos SET Name = ?, Description = ? WHERE RSOID = ?";
            const values = [name, description, rsoid];
            
            con.query(sql, values, function (err, result) {
                if (err) throw err;
                con.release();
                
                if (result.affectedRows > 0) {
                    message = "edit successful.";
                } else {
                    retCode = 400;
                    message = "edit not successful.";
                }
                res.status(retCode).json({ message });
            });
        });
    } catch(e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});

RsoRouter.post('/RSOCount', function(req, res) {
    let retCode = 200;
    let message = "";

    const { rsoid } = req.body; 

    if (!rsoid) {
        retCode = 400;
        message = "RSO ID is required.";
        return res.status(retCode).json({ message });
    }

    console.log("Begin RSOCount for RSOID " + rsoid);

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            con.query({
                sql: "SELECT COUNT(UID) AS memberCount FROM RSOMembers WHERE RSOID = ?",
                values: [rsoid]
            }, function(err, results) {
                if (err) {
                    if (con)
                        con.release();
                    throw err;
                }

                if (results.length === 0) {
                    retCode = 404;
                    message = "RSO not found.";
                    return res.status(retCode).json({ message });
                }

                const memberCount = results[0].memberCount;
                const isActive = memberCount >= 5 ? true : false;

                const ret = { memberCount, isActive, message };
                res.status(retCode).json(ret);
            });
        });
    } catch (e) {
        retCode = 500;
        const ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});

RsoRouter.post('/getmanaged', function(req,res)
{
    let retCode = 200;
    let message = "base message.";

    const {uid} = req.body;

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
            
            con.query({
                sql: "SELECT * FROM rsos WHERE EXISTS (SELECT 1 from rsocreationhistory WHERE rsos.RSOID = rsocreationhistory.RSOID AND rsocreationhistory.UID = ?)",
                values: [uid]},
            function (err, results) {
                if(err)
                    throw err;
                con.release();
                
                if(results[0])
                {
                    message = results.length + " result(s) for managed RSO's.";
                    var ret = {results:results, message};
                }
                else
                {
                    retCode = 209;
                    message = "No results for managed RSO's. Create one!";
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