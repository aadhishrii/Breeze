/** @jsxRuntime classic */
/** @jsx jsx */
import { css,jsx } from '@emotion/react';
import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import TableTree from '@atlaskit/table-tree';

import { useSession } from 'next-auth/react';

import Layout from '../components/layout';
import EventTag from '../components/eventTag';
import { EventCard } from '../components/eventCard';
import { Feature } from '../components/feature';

import eventFeatureIcon from '../public/images/EventFeatureIcon.png';
import itineraryFeatureIcon from '../public/images/ItineraryFeatureIcon.png';
import locationFinderIcon from '../public/images/LocationFinderIcon.png';
import calendarIcon from '../public/images/CalendarIcon.png';
import eventIcon from '../public/images/eventIcon.png';
import itineraryIcon from '../public/images/itineraryIcon.png';

import { getUserItineraries, getUserEvents, getProfileData } from '../lib/util';


const featureGroupContainerStyles = css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '36px',
    padding: '30px',
})

const RecentEventsContainerStyles = css({
    display: 'flex',
    alignItems: 'flex-start',
    flexFlow: 'column nowrap',
    overflowX: 'auto',
    flexGrow: 1,
    backgroundColor: '#d6d6d6',
    maxWidth: '100%',
    padding: '30px',
})

const RecentEventsTitleStyles = css ({
    fontSize: 24,
    marginBottom: 18,
    fontFamily: "'SF Pro Text', sans-serif",
})

const cardGroupContainerStyles = css ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '21px'
})

const EventsContainerStyles = css ({
    padding: '30px',
})

const EventsTitleStyles = css ({
    fontSize: 24,
    fontFamily: "'SF Pro Text', sans-serif",
    marginBottom: '-30px',
})

const eventItemOuterContainerStyles = css({
    display: 'flex',
    fontFamily: "'SF Pro Text', sans-serif",
    marginLeft: '12px',
    justifyContent: 'space-between'
})

const eventItemChildContainerStyles = css({
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
});

export const FeatureContainer = () => {
    return (
    <div css={ featureGroupContainerStyles }>
        <Feature href="/event/creator" src={eventFeatureIcon} label="Create event"/>
        <Feature href="/itinerary/creator" src={itineraryFeatureIcon} label="Create itinerary"/>
        <Feature href="/calendar" src={calendarIcon} label="Calendar"/>
        <Feature href="/locationFinder" src={locationFinderIcon} label="Location Finder"/>
    </div>
)}

export const RecentEvents = (props) => {
    return (
    <div css={ RecentEventsContainerStyles }>
        <div css={ RecentEventsTitleStyles }>
            Recent
        </div>
        <div css={ cardGroupContainerStyles }>
            {props.eventData && props.eventData.map((event) => (
                <EventCard type='event' id={event.id} title={event.title} date={event.date} location={event.location}/>
            ))}
            {props.itineraryData && props.itineraryData.map((itinerary) => {
                const date = `${itinerary.startDate} - ${itinerary.endDate}` 
                return <EventCard type='itinerary' id={itinerary.id} title={itinerary.title} date={date} location={itinerary.destination}/>
            })}
        </div>
    </div>
)}

export const EventItem = (props) => {
    const { data: session } = useSession()
    return (
        <Link href={props.type==='event' ? `/event/${props.id}` : `/itinerary/${props.id}`}>
            <Button style={props.ischild ? {width:'calc(100vw - 125px)'} : {width:'calc(100vw - 100px)'}} appearance="subtle" iconBefore={<Image src={props.type==='event' ? eventIcon : itineraryIcon}/>}>
                <div css={eventItemOuterContainerStyles}>
                    <div css={eventItemChildContainerStyles}>
                        <div >{props.title}</div>
                        <div style={{color: '#6B778C'}}>{props.date} | {props.location}</div>
                        {props.type==='event' && props.risk && EventTag(props.risk)}
                    </div>
                    {!props.hideAvatar && session &&
                        <div css={eventItemChildContainerStyles}>
                            Created by
                            <Avatar src={session.user.image}/>
                        </div>
                    }
                </div>
            </Button>
      </Link>
    )
};

const createItems = (eventData, itineraryData) => {
    const items = itineraryData.map((itinerary) => {
        const events = eventData.filter(event => event.itinerary == itinerary.id).map((event) => {
            return {
                id: event.id,
                content: {
                    item: <EventItem ischild type='event' id={event.id} title={event.title} date={event.date} location={event.location} risk={event.risk}/>,
                },
                hasChildren: false,
            }
        })
        const date = `${itinerary.startDate} - ${itinerary.endDate}` 
        return {
            id: itinerary.id,
            content: {
                item: <EventItem type='itinerary' style={{height: '10px'}} id={itinerary.id} title={itinerary.title} date={date} location={itinerary.destination}/>,
            },
            hasChildren: events.length !== 0,
            children: events,
        }
    })

    const remainingEvents = eventData.filter(event => event.itinerary == null)
    if (remainingEvents.length !== 0) {
        const items2 = remainingEvents.map((event) => {
            return {
                id: event.id,
                content: {
                    item:  <EventItem type='event' id={event.id} title={event.title} date={event.date} location={event.location} risk={event.risk}/>,
                },
                hasChildren: false,
                children: [],
            }
        });
        return items.concat(items2);
    }

    return items;
}

export const EventsTable = (props) => {

    const items = createItems(props.eventData, props.itineraryData);

    return (
    <div css={ EventsContainerStyles }>
        <div css={ EventsTitleStyles }>
            Your Events
        </div>
        <TableTree
            columns={[Item]}
            headers={['']}
            columnWidths={['100%']}
            items={items}
        />
    </div>
)}

const Item = (props) => <span>{props.item}</span>;

export default function Home() {
    const { data: session } = useSession({ required: true })
    
    const [eventData, setEventData] = useState([]);
    const [itineraryData, setItineraryData] = useState([]);

    useEffect(async () => {
        if (session) {
            const user = await getProfileData(session.user.email);
            setEventData(await getUserEvents(user.id));
            setItineraryData(await getUserItineraries(user.id));
        }
      },[session]);

    return (
        <Layout pageTitle="Home" signInRequired>
            <Head>
                <title>Event Creator</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FeatureContainer/>
            {session && 
                <>
                    <RecentEvents eventData={eventData} itineraryData={itineraryData}/>
                    <EventsTable eventData={eventData} itineraryData={itineraryData}/>
                </>
            }
        </Layout>
    );
}