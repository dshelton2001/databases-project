import React from 'react';

import AccountHeader from '../sections/header_account';
import IndexBody from '../sections/body_index';
import DefaultFooter from '../sections/footer_default';

const Home = () => {
    return (
        <div>
            <AccountHeader />
            <IndexBody />
            <DefaultFooter />
        </div>
    )
}

export default Home;