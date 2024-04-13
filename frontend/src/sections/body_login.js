import React from 'react';
import Cookies from 'universal-cookie';
const route = require('./route.js');

const LoginBody = () => {
    var username;
    var password;

    const [message, setMessage] = React.useState('');

    const redirectRegister = () => {
		window.location.href = "/register"
	}

    const redirectHome = () => {
		window.location.href = "/home"
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
                window.location.href = '/home';
            }
        }
        catch(e)
        {
            alert(e.toString());
            
            return;
        }
    }

    React.useEffect(() => {
		return () => {
			if (checkForCookie())
			{
				redirectHome();
			}
		};
	},[]);

    return (
        <div class = "trueBody">
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