/** @jsxRuntime classic */
/** @jsx jsx */
import { css,jsx } from '@emotion/react';
import React from 'react';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle'

const AccessDeniedContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'large',
    gap: '15px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh'
}

export default function EventAccessDenied() {
    return (
        <div css={ AccessDeniedContainerStyles }>
            <CrossCircleIcon size='large'/>
            You do not have permission to view this event
        </div>
    )
}
