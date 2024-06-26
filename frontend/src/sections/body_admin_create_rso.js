import React from 'react';
import Cookies from 'universal-cookie';
const route = require('./route.js');

const CreateRSO = () => {
    var name;
    var description;

    const [message, setMessage] = React.useState('');
    
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

    const tryCreateRSO = async event =>
    {
        event.preventDefault();
        const cookies = new Cookies();
        var uid = cookies.get('login');

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

        var object = {name:name.value, description:description.value, uid};
        var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/rso/create'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

            // incase we decide to make message non-emp
            setMessage(ret.message);

            if (ret.rsoid === undefined)
            {
                return false;
            }
            else
            {
                setMessage("RSO Created! Redirecting...");

                window.location.href = '/admin/managerso?rsoid=' + ret.rsoid;
            }
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
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
            <form class="createRSO" onSubmit={tryCreateRSO}>
                <div id="label"><label id="labelName">Name </label></div><input ref={(c) => name = c}/><br/>
                <div id="label"><label id="labelDesc">Description </label></div><textArea ref={(c) => description = c}/><br/>

                <span class="result" id="result">{message}</span><br/>
                <div class="center"><button id="submit">Create</button></div>
            </form>
        </div>
    )
}

export default CreateRSO;