import React from 'react';

import DefaultHeader from '../sections/header_default';
import RegisterBody from '../sections/body_register';
import DefaultFooter from '../sections/footer_default';

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