import React from 'react';
import Cookies from 'universal-cookie';
import './login_register.css';
const route = require('./route.js');

const RegisterBody = () => {
    var username;
    var password;

    const [message, setMessage] = React.useState('');

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
                setMessage("Registered successfully. Redirecting...");
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
        <div class = "trueBody">
            <p class="loginText">Register</p>
            <form class="dothing" onSubmit={tryRegister}>
                <div class="user"><label>Username </label><input id="user" ref={(c) => username = c}></input></div>
                <div class="pass"><label id="passwordText">Password </label><input type="password" id="pass" ref={(c) => password = c}></input></div>
                <span class="result" id="result">{message}</span><br/>
                <button id="submit">Register</button>
            </form>
        </div>
    )

}

export default RegisterBody;