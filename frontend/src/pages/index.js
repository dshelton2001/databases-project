import React from 'react';

import DefaultHeader from '../sections/header_default';
import IndexBody from '../sections/body_index';
import DefaultFooter from '../sections/footer_default';

const Index = () => {
    return (
        <div>
            <DefaultHeader />
            <IndexBody />
            <DefaultFooter />
        </div>
    )
}

export default Index;