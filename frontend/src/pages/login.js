import React from 'react';

import DefaultHeader from '../sections/default_header';
import LoginBody from '../sections/login_body';
import DefaultFooter from '../sections/default_footer';

const Login = () => {
    return (
        <div>
            <DefaultHeader />
            <LoginBody />
            <DefaultFooter />
        </div>
    )
}

export default Login;