import React from 'react';

import AccountHeader from '../sections/header_account';
import RSOFeedBody from '../sections/body_rsofeed';
import DefaultFooter from '../sections/footer_default';

const RSOFeed = () => {
    return (
        <div>
            <AccountHeader />
            <RSOFeedBody />
            <DefaultFooter />
        </div>
    )
}

export default RSOFeed;