import React from 'react';

import AccountHeader from '../sections/header_account';
import EventViewBody from '../sections/body_eventview';
import DefaultFooter from '../sections/footer_default';

const EventView = () => {
    return (
        <div>
            <AccountHeader />
            <EventViewBody />
            <DefaultFooter />
        </div>
    )
}

export default EventView;