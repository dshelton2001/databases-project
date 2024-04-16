var express = require('express');
const EventRouter = require('express').Router();
var pool = require('../utils/dbCon');

EventRouter.post('/create', function(req, res) {
    let retCode = 200;
    let message = "";
    const { locationname, Name, time, description, uid, isPrivate } = req.body;

    try {
        // Start by contacting the pool
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            
            con.query({
                sql: "INSERT INTO Events (LocationName, Name, Time, Description) VALUES (?, ?, ?, ?)",
                values: [locationname, Name, time, description]
            }, function(err, results) {
                if (err) {
                    if (con) con.release();
                    throw err;
                }
                if (results && results.affectedRows > 0) {
                    const eventID = results.insertId; 
                    
                    con.query({
                        sql: "INSERT INTO EventCreationHistory (EventID, UID) VALUES (?, ?)",
                        values: [eventID, uid] 
                    }, function(err, historyResult) {
                        if (err) {
                            if (con) con.release();
                            throw err;
                        }
                        if (historyResult && historyResult.affectedRows > 0) {
                            retCode = 201;
                            message = "Event created successfully and history recorded.";
                            
                            // Insert into either PublicEvents or PrivateEvents based on isPrivate 
                            const eventsTable = isPrivate ? "PrivateEvents" : "PublicEvents";
                            con.query({
                                sql: `INSERT INTO ${eventsTable} (EventID) VALUES (?)`,
                                values: [eventID]
                            }, function(err, eventsResult) {
                                if (err) {
                                    if (con) con.release();
                                    throw err;
                                }
                                if (eventsResult && eventsResult.affectedRows > 0) {
                                    // Success
                                    res.status(retCode).json({ message });
                                } else {
                                    // Failed to insert into the respective events table
                                    retCode = 500;
                                    message = `Failed to insert into ${eventsTable}.`;
                                    res.status(retCode).json({ message });
                                }
                            });
                        } else {
                            // Failed to record event creation history
                            retCode = 500;
                            message = "Failed to record event creation history.";
                            res.status(retCode).json({ message });
                        }
                    });
                } else {
                    // Failed to create event
                    retCode = 409;
                    message = "Failed to create event."
                    res.status(retCode).json({ message });
                }
            });
        });
    } catch (e) {
        // Error handling
        retCode = 404;
        var ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});


EventRouter.post('/RSOcreate', function(req, res) {
    let retCode = 200;
    let message = "";

    const { eventID, rsoID, uid } = req.body;
    const currentTime = new Date(); 

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            // Check if the user is the admin of the specified RSO
            con.query({
                sql: "SELECT * FROM RSOCreationHistory WHERE RSOID = ? AND UID = ?",
                values: [rsoID, uid]
            }, function(err, results) {
                if (err) {
                    if (con)
                        con.release();
                    throw err;
                }

                if (results.length === 0) {
                    retCode = 403; // Forbidden
                    message = "You are not authorized to create an event for this RSO.";
                    const ret = { message };
                    return res.status(retCode).json(ret);
                }

                // Retrieve events associated with the same RSO
                con.query({
                    sql: "SELECT E.EventID, E.Name, E.LocationName, E.Description, E.Time " +
                        "FROM Events AS E INNER JOIN RSOEvents AS R ON E.EventID = R.EventID " +
                        "WHERE R.RSOID = ?",
                    values: [rsoID]
                }, function(err, results) {
                    if (err) {
                        if (con)
                            con.release();
                        throw err;
                    }

                    // Check for overlapping event times
                    const overlappingEvent = results.find(event => {
                        const eventTime = new Date(event.Time);
                        return eventTime.getTime() === currentTime.getTime();
                    });

                    if (overlappingEvent) {
                        retCode = 409;
                        message = "An event in the same RSO is already scheduled at this time.";
                        const ret = { message };
                        res.status(retCode).json(ret);
                    } else {
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
                    }
                });
            });
        });
    } catch (e) {
        retCode = 404;
        const ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});



EventRouter.post('/comment', function(req,res)
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

EventRouter.post('/search', function(req, res) 
{
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

EventRouter.post('/editcomment', function(req, res) {
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


module.exports = EventRouter;