/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import Image from 'next/image';
import Link from 'next/link';

import { token } from "@atlaskit/tokens";
import { N50A, N40A, N0 } from "@atlaskit/theme/colors";
import { ButtonItem } from '@atlaskit/menu';

import eventIcon from '../public/images/eventIcon.png';
import itineraryIcon from '../public/images/itineraryIcon.png';

const eventCardStyles = css ({
    display: 'flex',
    gap: '3px',
    fontFamily: "'SF Pro Text', sans-serif",
    flexDirection: 'column',
	padding: `6px`,
    width: '200px',
	boxShadow: token(
		"elevation.shadow.raised",
		`0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`
	),
	backgroundColor: token(
		'elevation.surface.raised',
		N0
	),
})

const cardTitleStyles = css ({
    fontSize: 24,
    whiteSpace: 'normal',
})

const cardDateStyles = css ({
    fontSize: 14,
    whiteSpace: 'normal',
})

const cardLocationStyles = css ({
    fontSize: 14,
    whiteSpace: 'normal',
})


export const EventCard = (props) => {
    return (
    <Link href={props.type==='event' ? `/event/${props.id}` : `/itinerary/${props.id}`}>
        <div css={ eventCardStyles }>
            <ButtonItem appearance='subtle'>
                <Image src={props.type==='event' ? eventIcon : itineraryIcon} layout="fixed" width={40} height={40}/>
                <div css={cardDateStyles}>{props.date}</div>
                <div css={cardTitleStyles}>{props.title}</div>
                <div css={cardLocationStyles}>{props.location}</div>
            </ButtonItem>
        </div>
    </Link>
)}