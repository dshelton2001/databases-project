import React from 'react';
import Cookies from 'universal-cookie';
import './body_rsoview.css';
var url = require('url');
const route = require('./route.js');
const fakeEventCount = 20;
const faking = true;

const RSOViewBody = () => {
    var rsoid;
    const [message, setMessage] = React.useState('');
    const [result, setResult] = React.useState({});
    const [events, setEvents] = React.useState([]);

    const fillData = (contents) =>
    {
        if (!contents || contents === null)
        {
            var fakeRSO = {
                Name: "HAHAHA THE ULTIMATE RSO",
                Description: "IT IS I, THE ULTIMATE RSO!!!! We want to have fun and talk to you n all that :)",
                memberCount: 5,
                active: true
            }

            setResult(fakeRSO);

            var fakeEvents = [];

            for (let i = 0; i < fakeEventCount; i++)
            {
                var faker = {
                    Name: "The Ultimate Bot Event",
                    Description: formatDate(new Date()) + " - The bots have taken over",
                    EventID: 69
                };

                fakeEvents.push(faker);
            }

            setEvents(fakeEvents);

            return;
        }
    }

    const formatDate = (date) =>
    {
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    const redirectEvent = (EventID) =>
    {
        window.location = "/viewevent?eventid=" + EventID;
    }

    React.useEffect(() => {
        return () => {
            if (faking)
            {
                fillData(null);
            }
        };
	},[]);

    return (
        <div class = "trueBody">
            <div id="profile">
                <h1 class="title">{result.Name}</h1><a id="member"> - Members: <bold>{result.memberCount}</bold></a><br/>
                <p class="mainDesc">{result.Description}</p>
            </div>
            <b id="activity">{result.active? "" : "Not active"}</b>
            <h2 id="lessPadding">Events</h2>
            <div id="searchResults">
            {
                events.map((event) => (
                    <div id="searchResult">
                        <div id="name" onClick={() => redirectEvent(event.EventID)}>
                            {event.Name}
                        </div>
                        <div id="shellDesc">
                            <div id="desc">
                                {event.Description}
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