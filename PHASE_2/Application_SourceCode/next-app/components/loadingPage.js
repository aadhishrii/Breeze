/** @jsxRuntime classic */
/** @jsx jsx */
import { css,jsx } from '@emotion/react';
import React from 'react';
import Spinner from '@atlaskit/spinner';

const loadingContentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh'
}

export default function LoadingPage() {
    return (
        <div css={ loadingContentContainerStyles }>
            <Spinner size='large'/>
            Loading
        </div>
    )
}
