import React from 'react';
const route = require('./route.js');

const LoginBody = () => {
    var username;
    var password;

    const [message, setMessage] = React.useState('');

    const redirectRegister = () => {
		window.location.href = "/register"
	}

    const tryLogin = async event =>
    {
        event.preventDefault();

        var object = {username:username.value, password:password.value};
        var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/users/login'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());
            setMessage(ret.message);

            if (ret.result === undefined)
            {
                return false;
            }
            else
            {
                window.location.href = '/home';
            }
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
    }

    return (
        <div>
            <p>hello login now</p>
            <form onSubmit={tryLogin}>
                <div><label>Username</label> <input id="user" ref={(c) => username = c}/></div>
                <div><label>Password</label> <input type="password" id="pass" ref={(c) => password = c}/></div>
                <span id="result">{message}</span><br/>
                <button>Login</button>
            </form>
            <button onClick = {redirectRegister}>Register</button>
        </div>
    )
}

export default LoginBody;