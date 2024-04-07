import React from 'react';

import DefaultHeader from '../sections/header_default';
import LoginBody from '../sections/body_login';
import DefaultFooter from '../sections/footer_default';

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