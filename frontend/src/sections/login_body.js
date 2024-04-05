import React from 'react';
const route = require('../sections/route.js');

const LoginBody = () => {
    var username;
    var password;

    const [message, setMessage] = React.useState('');

    const tryLogin = event =>
    {
        event.preventDefault();

        var object = {username:username.value, password:password.value};
        var input = JSON.stringify(object);

        try
        {
            const response = fetch(route.buildRoute('/api/users/login'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            if (response.message !== undefined)
            {
                var retMessage = JSON.parse(response.message);
                setMessage(retMessage);
            }

            if (response.result === undefined)
            {
                return false;
            }
            else
            {
                window.location.href = '/menu';
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
                <div><label>Password</label> <input id="pass" ref={(c) => password = c}/></div>
                <button>Login</button>
                <span type="button" id="result">{message}</span>
                <span id="loginResult">{message}</span>
            </form>
            <button>Register</button>
        </div>
    )
}

export default LoginBody;