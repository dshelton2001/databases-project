import React from 'react';
import Cookies from 'universal-cookie';
import './header.css';

const DefaultHeader = () => {
	const redirectHome = () => {
		window.location.href = "/home"
	}

	const redirectIndex = () => {
		window.location.href = "/"
	}


	const redirectLogout = () => {
		const cookies = new Cookies();
		cookies.remove('login');

		window.location.href = "/"
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

	// React.useEffect() makes it run once the webpage loads
	// This way, we cannot avoid loading user information
	React.useEffect(() => {
		return () => {
			if (!checkForCookie())
			{
				redirectLogout();
			}
		};
	},[]);

	return (
		<header>
			<div class = "header">
				<a id="logo" onClick={redirectIndex}>The Database</a>
				<div id="buttons">
				<a id="hbutton" onClick={redirectHome}>Search</a>
					<a id="hbutton" onClick={redirectLogout}>Logout</a>
				</div>
			</div>
		</header>
	);
}

export default DefaultHeader;