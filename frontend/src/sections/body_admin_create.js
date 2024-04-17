import React from 'react';
import Cookies from 'universal-cookie';
import './body_rsofeed.css';
const route = require('./route.js');

const RSOFeed = () => {
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

    React.useEffect(() => {
		return () => {
			checkForAdmin();
		};
	},[]);

    return (
        <div class = "trueBody">
            <div class="menuText">Create an RSO</div>
            <div class="adminBack">< button onClick={redirectAdmin} class="adminBackButton">Back</button></div>
            <p id="result">{message}</p>
            
            
        </div>
    )
}

export default RSOFeed;