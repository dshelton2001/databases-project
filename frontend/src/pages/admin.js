import React from 'react';

import AccountHeader from '../sections/header_account';
import AdminBody from '../sections/body_admin';
import DefaultFooter from '../sections/footer_default';

const Admin = () => {
    return (
        <div>
            <AccountHeader />
            <AdminBody />
            <DefaultFooter />
        </div>
    )
}

export default Admin;