import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './body_rso_view.css';
var url = require('url');
const route = require('./route.js');

const RSOViewBody = (props) => {
    let rsoid;
    var name;
    var description;

    // const [name, setName] = React.useState("");
    // const [description, setDescription] = React.useState(props.desc);

    const [message, setMessage] = React.useState('');
    const [events, setEvents] = React.useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [memberInfo, setMemberInfo] = React.useState({});

    const redirectAdmin = () => {
		window.location.href = "/admin/manage";
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
            {
                setMessage("RSO does not exist.")
            }
            else
            {
                // setName(ret.result.Name);
                // setDescription(ret.result.Description);

                document.getElementById("actualName").value = ret.result.Name;
                document.getElementById("actualDesc").innerHTML = ret.result.Description;
            }

            getEvents();
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
        window.location = "/admin/manageevent?eventid=" + EventID;
    }

    const tryEditRSO = async event =>
    {
        event.preventDefault();

        if (!name.value)
        {
            setMessage("The name can't be empty!");

            return;
        }

        if (name.value.length > 29)
        {
            setMessage("Name is too long!");

            return;
        }

        if (description.value.length > 299)
        {
            setMessage("Description is too long!");

            return;
        }

        var object = {rsoid: searchParams.get("rsoid"), name: name.value, description: description.value};
        var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/rso/edit'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            // incase we decide to make message non-emp
            setMessage(input);
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
    }

    React.useEffect(() => {
        return () => {
            rsoid = searchParams.get("rsoid");

            if (!rsoid)
            {
                setMessage("An RSOID is required.");

                return;
            }

            getRSO();
        };
	},[]);

    return (
        <div class = "trueBody">
            <div class="menuText">Manage RSO</div>
            <div class="adminBack">< button onClick={redirectAdmin} class="adminBackButton">Back</button></div>
            <br/>
            <form class="createRSO" onSubmit={tryEditRSO}>
                <div id="label"><label id="labelName">Name </label></div><input id="actualName" ref={(c) => name = c}/><br/>
                <div id="label"><label id="labelDesc">Description </label></div><textArea id="actualDesc" ref={(c) => description = c}/><br/>

                <span class="result" id="result">{message}</span><br/>
                <div class="center"><button id="submit">Edit</button></div>
            </form>
            <br/>
            <br/>
            <h2 id="lessPadding">Edit events</h2>
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
    );
}

export default RSOViewBody;