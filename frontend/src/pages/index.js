import React from 'react';

import DefaultHeader from '../sections/default_header';
import IndexBody from '../sections/index_body';
import DefaultFooter from '../sections/default_footer';

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