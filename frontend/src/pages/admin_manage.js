import React from 'react';

import AccountHeader from '../sections/header_account';
import AdminManageBody from '../sections/body_admin_manage';
import DefaultFooter from '../sections/footer_default';

const AdminManage = () => {
    return (
        <div>
            <AccountHeader />
            <AdminManageBody />
            <DefaultFooter />
        </div>
    )
}

export default AdminManage;