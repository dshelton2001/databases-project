var express = require('express');
const EventRouter = require('express').Router();
var pool = require('../utils/dbCon');

EventRouter.post('/create', function(req, res) {
    let retCode = 200;
    let message = "";
    const { locationname, name, time, description, uid, isPrivate } = req.body;

    try {
        // Start by contacting the pool
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            
            con.query({
                sql: "INSERT INTO Events (LocationName, Name, Time, Description) VALUES (?, ?, ?, ?)",
                values: [locationname, name, time, description]
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
    const { eventID, rsoID, uid } = req.body;
    let retCode = 200;
    let message = "";

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con)
                    con.release();
                throw err;
            }

            // Retrieve the event time from the Events table
            con.query({
                sql: "SELECT Time FROM Events WHERE EventID = ?",
                values: [eventID]
            }, function(err, eventResult) {
                if (err) {
                    if (con)
                        con.release();
                    throw err;
                }

                const eventTime = eventResult[0].Time;

                // Check if the user is an admin of the specified RSO
                con.query({
                    sql: "SELECT 1 FROM RSOCreationHistory WHERE RSOID = ? AND UID = ?",
                    values: [rsoID, uid]
                }, function(err, adminResult) {
                    if (err) {
                        if (con)
                            con.release();
                        throw err;
                    }

                    if (adminResult.length === 0) {
                        retCode = 403;
                        message = "You are not authorized to create an event for this RSO.";
                        return res.status(retCode).json({ message });
                    }

                    // Check if there is an event with the same time in the RSO
                    con.query({
                        sql: "SELECT * FROM RSOEvents WHERE RSOID = ?",
                        values: [rsoID]
                    }, function(err, rsoEventsResult) {
                        if (err) {
                            if (con)
                                con.release();
                            throw err;
                        }

                        // If there are events in the RSO, check for time overlap
                        if (rsoEventsResult.length > 0) {
                            const rsoEventIDs = rsoEventsResult.map(row => row.EventID);
                            console.log("in here");
                            con.query({
                                sql: "SELECT * FROM events WHERE EXISTS (SELECT 1 FROM rsoevents WHERE events.EventID = rsoevents.EventID AND rsoevents.RSOID = ?) AND Time = ?",
                                values: [rsoEventIDs, eventTime]
                            }, function(err, overlapResult) {
                                if (err) {
                                    if (con)
                                        con.release();
                                    throw err;
                                }

                                if (overlapResult.length > 0) {
                                    retCode = 409;
                                    message = "An event in the same RSO is already scheduled at this time.";
                                    return res.status(retCode).json({ message });
                                }

                                // Insert the event into RSOEvents table
                                con.query({
                                    sql: "INSERT INTO RSOEvents (EventID, RSOID) VALUES (?, ?)",
                                    values: [eventID, rsoID]
                                }, function(err, insertResult) {
                                    if (err) {
                                        if (con)
                                            con.release();
                                        throw err;
                                    }

                                    if (insertResult && insertResult.affectedRows > 0) {
                                        retCode = 201;
                                        message = "RSO event created successfully.";
                                    } else {
                                        retCode = 409;
                                        message = "Failed to create RSO event.";
                                    }

                                    res.status(retCode).json({ message });
                                });
                            });
                        } else {
                            // Insert the event into RSOEvents table since there are no events in the RSO
                            con.query({
                                sql: "INSERT INTO RSOEvents (EventID, RSOID) VALUES (?, ?)",
                                values: [eventID, rsoID]
                            }, function(err, insertResult) {
                                if (err) {
                                    if (con)
                                        con.release();
                                    throw err;
                                }

                                if (insertResult && insertResult.affectedRows > 0) {
                                    retCode = 201;
                                    message = "RSO event created successfully.";
                                } else {
                                    retCode = 409;
                                    message = "Failed to create RSO event.";
                                }

                                res.status(retCode).json({ message });
                            });
                        }
                    });
                });
            });
        });
    } catch (e) {
        retCode = 500;
        message = "Internal Server Error";
        res.status(retCode).json({ message });
    }
});




EventRouter.post('/search', function(req, res) 
{
    let retCode = 200;
    let message = "";

    const { search } = req.body;

    console.log("Starting EVENTSEARCH for term " + search);

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

                var ret = {results, message};

                res.status(retCode).json(ret);
            });
        });
    } catch (e) {
        retCode = 404;
        var ret = { error: e.message };
        res.status(retCode).json(ret);
    }
});

// we'll need to make a fork of this that pulls from all rsos the user is a part of
EventRouter.post('/RSOsearch', function(req, res) 
{
    let retCode = 200;
    let message = "";
    const { rsoid } = req.body;

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            con.query({
                    sql: "SELECT * FROM events WHERE EXISTS (SELECT 1 FROM RSOEvents WHERE events.EventID = rsoevents.EventID AND RSOID = ?)",
                    values: [rsoid]
                },
                function(err, results) {
                    if (err) {
                        if (con) con.release();
                        throw err;
                    }
                    if (results && results.length > 0) {
                        retCode = 200;
                        message = "RSO Events retrieved successfully.";
                    } else {
                        retCode = 404;
                        message = "No RSO events found for the specified RSOID.";
                    }

                    res.status(retCode).json({ message, results });
                }
            );
        });
    } catch (e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});

EventRouter.get('/allpublic', function(req, res) 
{
    let retCode = 200;
    let message = "";

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            con.query({
                    sql: "SELECT * FROM PublicEvents"
                },
                function(err, results) {
                    if (err) {
                        if (con) con.release();
                        throw err;
                    }
                    if (results && results.length > 0) {
                        retCode = 200;
                        message = "Public events retrieved successfully.";
                    } else {
                        retCode = 404;
                        message = "No public events found.";
                    }
                    res.status(retCode).json({ message, results });
                }
            );
        });
    } catch (e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});


EventRouter.post('/searchseeable', function(req, res) 
{
    let retCode = 200;
    let message = "";

    const { search, uid } = req.body;

    const searchTerm = `%${search}%`; 

    console.log("Starting EVENTPUBLICSEARCH for term " + search);

    try {
        pool.getConnection(function(err, con) {
            if (err) {
                if (con) con.release();
                throw err;
            }
            con.query({
                    sql: "SELECT * FROM events WHERE (Name LIKE ? OR LocationName LIKE ?) AND (EXISTS (SELECT 1 FROM publicevents WHERE PublicEvents.EVENTID = Events.EVENTID) OR EXISTS (SELECT 1 FROM rsoevents WHERE rsoevents.EVENTID = events.EVENTID AND EXISTS (SELECT 1 FROM rsomembers WHERE rsomembers.UID = ?)))",
                    values: [searchTerm, searchTerm, searchTerm, searchTerm, uid]
                },
                function(err, results) {
                    if (err) {
                        if (con) con.release();
                        throw err;
                    }
                    if (results && results.length > 0) {
                        retCode = 200;
                        message = "All events retrieved successfully.";
                    } else {
                        retCode = 404;
                        message = "No events found.";
                    }
                    res.status(retCode).json({ message, results });
                }
            );
        });
    } catch (e) {
        retCode = 500;
        res.status(retCode).json({ error: e.message });
    }
});


module.exports = EventRouter;