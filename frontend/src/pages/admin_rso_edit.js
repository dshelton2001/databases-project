import React from 'react';

import AccountHeader from '../sections/header_account';
import RSOEditBody from '../sections/body_admin_rso_edit';
import DefaultFooter from '../sections/footer_default';

const AdminRSOEdit = () => {
    return (
        <div>
            <AccountHeader />
            <RSOEditBody />
            <DefaultFooter />
        </div>
    )
}

export default AdminRSOEdit;