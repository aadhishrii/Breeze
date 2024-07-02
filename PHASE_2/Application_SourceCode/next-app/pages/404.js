/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Layout from '../components/layout';

const errorContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'large',
    gap: '30px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh'
}

export default function Custom404() {
    return (
        <Layout pageTitle="404">
            <div css={errorContainerStyles}>
                404 - Page Not Found
            </div>
        </Layout>
    )
}