import React from 'react';
import {useSearchParams} from 'react-router-dom';
import Cookies from 'universal-cookie';
var url = require('url');
const route = require('./route.js');
const fakeEventCount = 20;
const faking = false;

const RSOViewBody = () => {
    var eventid;
    const [message, setMessage] = React.useState('');
    const [event, setEvent] = React.useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [comments, setComments] = React.useState([]);

    const fillData = (contents) =>
    {
        if (!contents || contents === null)
        {
            var fakeRSO = {
                Name: "HAHAHA THE ULTIMATE EVENT",
                Description: "IT IS I, THE ULTIMATE EVENT!!!! Please, go ahead and do the thing :)",
                Time: formatDate(new Date())
            }

            setEvent(fakeRSO);

            var fakeComments = [];

            for (let i = 0; i < fakeEventCount; i++)
            {
                var faker = {
                    Name: "Bot001",
                    Comment: formatDate(new Date()) + " - Wow this looks fun!",
                };

                fakeComments.push(faker);
            }

            setComments(fakeComments);

            return;
        }
    }

    const formatDate = (date) =>
    {
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    const redirectEvent = (EventID) =>
    {
        window.location = "/event/view?eventid=" + EventID;
    }

    const getComments = async event =>
    {
        eventid = searchParams.get("eventid");
        var object = { eventid };
		var input = JSON.stringify(object);

        const response = await fetch(route.buildRoute('/api/comment/get'), {
            method:'post',
            body: input,
            headers: {'Content-Type': 'application/json'}
        });

        var ret = JSON.parse(await response.text());

        setComments(ret.comments);
    }

    const getEvent = async event =>
    {
        eventid = searchParams.get("eventid");;
        var object = { eventid };
		var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/event/get'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            if (ret.result)
            {
                setEvent(ret.result[0]);

                getComments();
            }
        }
        catch(e)
        {
            alert(e.toString());
            
            return false;
        }
    }

    React.useEffect(() => {
        return () => {
            if (faking)
            {
                fillData(null);

                return;
            }

            getEvent();
        };
	},[]);

    return (
        <div class = "trueBody">
            <div id="profile">
                <h1 class="title">{event.Name}</h1><a id="member"> - <bold>{event.Time}</bold></a><br/>
                <p class="mainDesc">{event.Description}</p>
            </div>
            <b id="activity"></b>
            <h2 id="lessPadding">Comments</h2>
            <div id="searchResults">
            {
                comments.map((comment) => (
                    <div id="searchResult">
                        <div id="name">
                            {comment.UID}
                        </div>
                        <div id="shellDesc">
                            <div id="desc">
                                {comment.Comment}
                            </div>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default RSOViewBody;