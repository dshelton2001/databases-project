import React from 'react';

import AccountHeader from '../sections/header_account';
import RSOMineBody from '../sections/body_rso_mine';
import DefaultFooter from '../sections/footer_default';

const RSOMine = () => {
    return (
        <div>
            <AccountHeader />
            <RSOMineBody />
            <DefaultFooter />
        </div>
    )
}

export default RSOMine;