import React from 'react';

import AccountHeader from '../sections/header_account';
import AdminCreateBody from '../sections/body_admin_create_rso';
import DefaultFooter from '../sections/footer_default';

const AdminCreateRSO = () => {
    return (
        <div>
            <AccountHeader />
            <AdminCreateBody />
            <DefaultFooter />
        </div>
    )
}

export default AdminCreateRSO;