import React from 'react';

import AccountHeader from '../sections/header_account';
import EventSearchBody from '../sections/body_event_search';
import DefaultFooter from '../sections/footer_default';

const EventSearch = () => {
    return (
        <div>
            <AccountHeader />
            <EventSearchBody />
            <DefaultFooter />
        </div>
    )
}

export default EventSearch;