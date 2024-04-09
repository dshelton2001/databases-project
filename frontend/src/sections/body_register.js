import React from 'react';
import Cookies from 'universal-cookie';
const route = require('./route.js');

const RegisterBody = () => {
    var username;
    var password;

    const [message, setMessage] = React.useState('');

    const redirectLogin = () => {
		window.location.href = "/login"
	}

    const tryRegister = async event =>
    {
        event.preventDefault();

        var object = {username:username.value, password:password.value};
        var input = JSON.stringify(object);

        try
        {
            const response = await fetch(route.buildRoute('/api/users/register'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());
            setMessage(ret.message);

            if (ret.uid === undefined)
            {
                return false;
            }
            else
            {
                setMessage(ret.uid);
                const cookies = new Cookies();
                cookies.set('login', ret.uid, 
                {
                    path: "/",
                    httpOnly: false,
                    sameSite: 'strict',
                    maxAge: 86400
                });
                window.location.href = '/login';
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
            <p>hello register now</p>
            <form onSubmit={tryRegister}>
                <div>Username <input id="user" ref={(c) => username = c}></input></div>
                <div> Password <input type="password" id="pass" ref={(c) => password = c}></input></div>
                <span id="result">{message}</span><br/>
                <button>Register</button>
            </form>
            <button onClick = {redirectLogin}>Login</button>
        </div>
    )

}

export default RegisterBody;