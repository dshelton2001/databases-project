import React from 'react';
import Cookies from 'universal-cookie';
import './header.css';
const route = require('./route.js');

const DefaultHeader = () => {
	const redirectRSOSearch = () => {
		window.location.href = "/rso/search";
	}

	const redirectRSOMine = () => {
		window.location.href = "/rso/acct";
	}

	const redirectEventSearch = () => {
		window.location.href = "/event";
	}

	const redirectIndex = () => {
		window.location.href = "/";
	}

	const redirectAdmin = () => {
		window.location.href = "/admin";
	}

	const redirectLogout = () => {
		const cookies = new Cookies();
		cookies.remove('login');

		window.location.href = "/";
	}

	const checkForCookie = () => {
		const cookies = new Cookies();

		var cookie = cookies.get('login');

		if (cookie)
		{
			return true;
		}

		return false;
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
				return <p>Wowie</p>
			}
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
	}

	// React.useEffect() makes it run once the webpage loads
	// This way, we cannot avoid loading user information
	React.useEffect(() => {
		return () => {
			if (!checkForCookie())
			{
				redirectLogout();
			}

			checkForAdmin();
		};
	},[]);

	return (
		<header>
			<div class = "header">
				<a id="logo" onClick={redirectIndex}>The Database</a>
				<div id="buttons">
					<a id="hbutton" onClick={redirectRSOMine}>My RSO's</a>
					<a id="hbutton" onClick={redirectEventSearch}>Events</a>
					<a id="hbutton" onClick={redirectRSOSearch}>RSO Search</a>
					<b id="hspace"/>
					<a id="hbutton" class="admin" onClick={redirectAdmin}>Manage</a>
					<b id="hspace"/>
					<a id="hbutton" onClick={redirectLogout}>Logout</a>
				</div>
			</div>
		</header>
	);
}

export default DefaultHeader;