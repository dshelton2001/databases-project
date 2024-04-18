import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import DateTimePicker from 'react-datetime-picker';
const route = require('./route.js');

const CreateEvent = () => {
    var name;
    var description;
    var location;
    var eventid = -1;

    const [message, setMessage] = React.useState('');
    const [value, onChange] = React.useState(new Date());
    const [searchParams, setSearchParams] = useSearchParams();
    
    const redirectHome = () => {
		window.location.href = "/home";
	}

    const redirectAdmin = () => {
		window.location.href = "/admin";
	}

    const checkForAdmin = async event =>
	{
		const cookies = new Cookies();
		var cookie = cookies.get('login');

		var object = { uid: cookie };
		var input = JSON.stringify(object);

		try
        {
            const response = await fetch(route.buildRoute('/api/users/checkadmin'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

			if (!ret.isAdmin)
			{
				redirectHome();
			}
        }
        catch(e)
        {
            alert(e.toString());
            
            redirectHome();
        }
	}

    const tryCreateRSOEvent = async event =>
    {
        const cookies = new Cookies();
        var uid = cookies.get('login');
        var object = {eventid:eventid, rsoid:searchParams.get("rsoid"), uid};
        var input = JSON.stringify(object);

        

        try
        {
            const response = await fetch(route.buildRoute('/api/event/rsocreate'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            // incase we decide to make message non-emp
            setMessage(ret.message);
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
    }

    const tryCreateEvent = async event =>
    {
        event.preventDefault();
        if (!name.value || name.value.length > 29)
        {
            setMessage("Error with name value");

            return;
        }

        if (!location.value || location.value.length > 29)
        {
            setMessage("Error with location value");

            return;
        }

        if (description.value.length > 299)
        {
            setMessage("Description is too long!");

            return;
        }

        var time = formatDate(value);
        const cookies = new Cookies();
        var uid = cookies.get('login');
        var object = {name:name.value, description:description.value, locationname:location.value, time, uid, isPrivate: false};
        var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/event/create'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            // incase we decide to make message non-emp
            // setMessage(ret.message);

            if (ret.eventid === undefined)
            {
                return false;
            }
            else
            {
                var rsoid = searchParams.get("rsoid");
                if (rsoid != null)
                {
                    eventid = ret.eventid;
                    tryCreateRSOEvent();
                }

                // setMessage("Event Created! Redirecting...");

                // window.location.href = '/event/view?eventid=' + ret.eventid;
            }
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
    }

    const formatDate = (date) =>
    {
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    React.useEffect(() => {
		return () => {
			checkForAdmin();
		};
	},[]);

    return (
        <div class = "trueBody">
            <div class="menuText">Create an RSO</div>
            <div class="adminBack">< button onClick={redirectAdmin} class="adminBackButton">Back</button></div>
            <br/>
            <form class="createRSO" onSubmit={tryCreateEvent}>
                <div id="label"><label id="labelName">Name </label></div><input ref={(c) => name = c}/><br/>
                <div id="label"><label id="labelDesc">Description </label></div><textArea ref={(c) => description = c}/><br/>
                <div id="label"><label id="labelName">Location </label></div><input ref={(c) => location = c}/><br/>
                <div id="label"><label id="labelName">Date/Time </label></div><div id="calendar"><DateTimePicker onChange={onChange} value={value} /><br/></div>
                <span class="result" id="result">{message}</span><br/>
                <div class="center"><button id="submit">Create</button></div>
            </form>
        </div>
    )
}

export default CreateEvent;