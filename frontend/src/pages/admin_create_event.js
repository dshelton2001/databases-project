import React from 'react';

import AccountHeader from '../sections/header_account';
import AdminCreateBody from '../sections/body_admin_create_event';
import DefaultFooter from '../sections/footer_default';

const AdminCreateEvent = () => {
    return (
        <div>
            <AccountHeader />
            <AdminCreateBody />
            <DefaultFooter />
        </div>
    )
}

export default AdminCreateEvent;