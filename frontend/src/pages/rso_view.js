import React from 'react';

import AccountHeader from '../sections/header_account';
import RSOViewBody from '../sections/body_rso_view';
import DefaultFooter from '../sections/footer_default';

const RSOView = () => {
    return (
        <div>
            <AccountHeader />
            <RSOViewBody />
            <DefaultFooter />
        </div>
    )
}

export default RSOView;