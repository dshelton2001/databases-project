import React from 'react';

import AccountHeader from '../sections/header_account';
import RSOSearchBody from '../sections/body_rso_search';
import DefaultFooter from '../sections/footer_default';

const RSOSearch = () => {
    return (
        <div>
            <AccountHeader />
            <RSOSearchBody />
            <DefaultFooter />
        </div>
    )
}

export default RSOSearch;