import React from 'react';
import './header.css';

const DefaultHeader = () => {
	const redirectLogin = () => {
		window.location.href = "/login"
	}

	const redirectRegister = () => {
		window.location.href = "/register"
	}

	const redirectIndex = () => {
		window.location.href = "/"
	}

	return (
		<header>
			<div class = "header">
				<a id = "logo" onClick = {redirectIndex}>The Database</a>
				<div id = "buttons">
					<a id = "hbutton" onClick = {redirectLogin}>Login</a>
					<a id = "hbutton" onClick = {redirectRegister}>Sign up now!</a>
				</div>
			</div>
		</header>
	);
}

export default DefaultHeader;