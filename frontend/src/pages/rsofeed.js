import React from 'react';

import AccountHeader from '../sections/account_header';
import RSOFeedBody from '../sections/rsofeed_body';
import DefaultFooter from '../sections/default_footer';

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