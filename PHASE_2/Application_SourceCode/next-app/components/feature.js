/** @jsxRuntime classic */
/** @jsx jsx */
import { css,jsx } from '@emotion/react';
import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@atlaskit/button';

const featureContainerStyles = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
})

const featureEnabledStyles = css({
    cursor: 'pointer',
    transition: '0.2s',
    borderRadius: 50,
    '&:hover': {
        backgroundColor: '#E6E6E6',
    }
})

const featureDisabledStyles = css({
    cursor: 'not-allowed',
})

export const Feature = (props) => {
    return (
        <div css={ featureContainerStyles }>
            <Link href={props.isDisabled ? '#' : props.href}>
                <Image href={props.isDisabled ? '#' : props.href} css={ props.isDisabled ? featureDisabledStyles : featureEnabledStyles} src={props.src} width={100} height={100}/>
            </Link>
            <Button 
            href={props.isDisabled ? '#' : props.href}
            appearance="subtle-link" isDisabled={props.isDisabled}>
                {props.label}
            </Button>
        </div>
)}