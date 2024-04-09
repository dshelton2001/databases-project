import React from 'react';
import Cookies from 'universal-cookie';

const DefaultHeader = () => {
	const redirectHome = () => {
		window.location.href = "/home"
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
			<div>
				<button onClick = {redirectHome}>Home</button>
				<button onClick = {redirectLogout}>Logout</button>
			</div>
		</header>
	);
}

export default DefaultHeader;