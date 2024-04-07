import React from 'react';

const DefaultHeader = () => {
	const redirectLogin = () => {
		window.location.href = "/login"
	}

	const redirectRegister = () => {
		window.location.href = "/register"
	}

	return (
		<header>
			<div>
				<button onClick = {redirectLogin}>Login</button>
				<button onClick = {redirectRegister}>Sign up now!</button>
			</div>
		</header>
	);
}

export default DefaultHeader;