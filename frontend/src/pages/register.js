import React from 'react';

import DefaultHeader from '../sections/default_header';
import RegisterBody from '../sections/register_body';
import DefaultFooter from '../sections/default_footer';

const Register = () => {
    return (
        <div>
            <DefaultHeader />
            <RegisterBody />
            <DefaultFooter />
        </div>
    )
}

export default Register;