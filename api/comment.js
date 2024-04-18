var express = require('express');
const commentRouter = require('express').Router();
var pool = require('../utils/dbCon');

commentRouter.post('/get', function(req, res) 
{
    let retCode = 200;
    let message = "";
    const { eventid } = req.body;

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            con.query({
                    sql: "SELECT * FROM Comments WHERE EventID = ?",
                    values: [eventid]
                },
                function(err, results) {
                    if (err) {
                        if (con) con.release();
                        throw err;
                    }
                    if (results && results.length > 0) {
                        retCode = 200;
                        message = "Comments retrieved successfully.";
                    } else {
                        retCode = 404;
                        message = "No comments found for the specified EventID.";
                    }
                    res.status(retCode).json({ message, comments: results });
                }
            );
        });
    } catch (e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});


commentRouter.post('/delete', function(req, res) 
{
    let retCode = 200;
    let message = "";
    const { commentID } = req.body;

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            con.query({
                    sql: "DELETE FROM Comments WHERE CommentID = ?",
                    values: [commentID]
                },
                function(err, results) {
                    if (err) {
                        if (con) con.release();
                        throw err;
                    }
                    if (results && results.affectedRows > 0) {
                        retCode = 200;
                        message = "Comment deleted successfully.";
                    } else {
                        retCode = 404;
                        message = "Comment not found.";
                    }
                    res.status(retCode).json({ message });
                }
            );
        });
    } catch (e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});

commentRouter.post('/comment', function(req,res)
{
    console.log("hello");
    let retCode = 200;
    let message = "";
    var datetime = new Date();
    const{eventID, uid, comment} = req.body;

    try
    {
        pool.getConnection(function(err, con) {
            if (err)
            {
                if (con)
                    con.release();
                throw err;
            }
        con.query({sql: "INSERT IGNORE INTO Comments SET ?", values: {EventID: eventID,UID: uid,Time: datetime,Comment: comment}},
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

commentRouter.post('/edit', function(req, res) {
    console.log("Editing comment");
    let retCode = 200;
    let message = "";
    const { commentID, comment } = req.body; 

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }
            con.query({
                    sql: "UPDATE Comments SET Comment = ? WHERE CommentID = ?",
                    values: [comment, commentID]
                },
                function(err, results) {
                    if (err) {
                        if (con)
                            con.release();
                        throw err;
                    }

                    if (results && results.affectedRows > 0) {
                        retCode = 200;
                        message = "Comment updated successfully.";
                    } else {
                        retCode = 404;
                        message = "Comment not found.";
                    }

                    res.status(retCode).json({ message });
                });
        });
    } catch (e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});

module.exports = commentRouter;