import React from 'react';
import {useSearchParams} from 'react-router-dom';
import Cookies from 'universal-cookie';
import './body_rso_view.css';
var url = require('url');
const route = require('./route.js');
const fakeEventCount = 20;
const faking = false;

const RSOViewBody = () => {
    var rsoid;
    const [message, setMessage] = React.useState('');
    const [RSO, setRSO] = React.useState({});
    const [events, setEvents] = React.useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [memberInfo, setMemberInfo] = React.useState({});

    const fillData = (contents) =>
    {
        if (!contents || contents === null)
        {
            const memberCount = 5;
            var fakeRSO = {
                Name: "HAHAHA THE ULTIMATE RSO",
                Description: "IT IS I, THE ULTIMATE RSO!!!! We want to have fun and talk to you n all that :)",
                memberCount: memberCount,
                active: memberCount > 4? true : false
            };

            var fakeMemberInfo = {
                memberCount: 5,
                isActive: true
            };

            setRSO(fakeRSO);
            setMemberInfo(fakeMemberInfo);

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

    const getEvents = async event =>
    {
        var object = { rsoid };
		var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/event/rsosearch'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());
            
            setEvents(ret.results);
        }
        catch(e)
        {
            alert(e.toString());
            
            return false;
        }
    }

    const getMemberInfo = async event =>
    {
        var object = { rsoid };
		var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/rso/RSOCount'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            setMemberInfo(ret);
        }
        catch(e)
        {
            alert(e.toString());
            
            return false;
        }
    }

    const joinRSO = async event =>
    {
        const cookies = new Cookies();
		var cookie = cookies.get('login');

		var object = { uid: cookie, rsoid: searchParams.get("rsoid") };
		var input = JSON.stringify(object);
        try
        {
            const response = await fetch(route.buildRoute('/api/rso/join'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());
        }
        catch(e)
        {
            alert(e.toString());
            
            return false;
        }
    }

    const getRSO = async event =>
    {
        var object = { rsoid };
		var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/rso/getfromid'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            if (!ret.result)
                setRSO({Name: "RSO does not exist."})
            else
                setRSO(ret.result);

            getEvents();
            getMemberInfo();
        }
        catch(e)
        {
            alert(e.toString());
            
            return false;
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
            rsoid = searchParams.get("rsoid");

            if (faking)
            {
                fillData(null);
            }

            if (!rsoid)
            {
                setRSO({Name: "An RSOID is required."});

                return;
            }

            getRSO();
        };
	},[]);

    return (
        <div class = "trueBody">
            <div id="profile">
                <h1 class="title">{RSO.Name}</h1>
                <div class="center"><button id="submit" onClick={joinRSO}>Join</button></div>
                <div id="member">Members: <bold>{memberInfo.memberCount}</bold></div>
                <div id="activity">{memberInfo.isActive? "" : "Not active"}</div>
                <h2 class="descTitle">Description</h2>
                <p class="mainDesc">{RSO.Description}</p>
            </div>
            
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