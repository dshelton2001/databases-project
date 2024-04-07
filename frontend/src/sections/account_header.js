import React from 'react';

const DefaultHeader = () => {
	const redirectHome = () => {
		window.location.href = "/home"
	}

	const redirectLogout = () => {
		window.location.href = "/"
	}

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