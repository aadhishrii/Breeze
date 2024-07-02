/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Image from "next/image";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import CryptoJS from "crypto-js";

import eventIcon from "../../public/images/eventIcon.png";
import warningSign from "../../public/images/warningSign.png";
import { EventItem } from "../home";

import AvatarGroup from "@atlaskit/avatar-group";
import Button from "@atlaskit/button";
import CheckCircleOutlineIcon from '@atlaskit/icon/glyph/check-circle-outline'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'

// import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
// import ProgressBar from '@atlaskit/progress-bar';
// import {ProgressExampleStandard, TestComponent} from "../../components/progressBar";
// import Progress from 
import ProgressBar from "react-bootstrap/ProgressBar";

import InfoIcon from '@atlaskit/icon/glyph/info'
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Tooltip from '@atlaskit/tooltip';

import Layout from "../../components/layout";
import LoadingPage from '../../components/loadingPage';
import CopyLink from "../../components/copyLink";

import EventAccessDenied from "../../components/eventAccessDenied";
import { LineChartComponent } from '../../components/linechart';
import MapComponent from "../../components/mapComponent";

import Banner from '@atlaskit/banner';
import { makeRiskAssessment, calculateRiskLevel } from "../../lib/util";


const contentContainerStyles = css({
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  backgroundColor: '#e8e8e8',
  padding: '44px 0 44px 0',
});

const contentStyles = css({
  width: '60vw',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  fontFamily: "Poppins",
});

const headerStyles = css({
  padding: '16px',
  backgroundColor: 'white',
});

const itineraryHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  whiteSpace: 'nowrap',
  opacity: 0.9,
});

const eventHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  whiteSpace: 'nowrap',
  paddingTop: '12px',
});

const buttonGroupStyles = css({
  display: 'flex', 
  gap: '12px'
});

const contentGridStyles = css({
  display: 'grid', 
  gridTemplateColumns: '6fr 4fr',
  gridAutoFlow: 'row',
  gap: '12px',
});

const contentColumnStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const contentItemStyles = css({
  background: 'white',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: '20px',
});

const titleStyles = css({
  fontSize: 20,
  fontWeight: 600,
  color: '#172B4D'
});

const subtitleStyles = css({
  fontSize: 16, 
  fontWeight: 600,
  color: '#091E42',
  paddingBottom: '6px',
});

const contentTextStyles = css({
  fontSize: 16, 
  color: '#091E42'
});

const backupEventContainerStyles = css({
  gridColumn: 'span 2'
})

const flexRowStyles = css({
  display: 'flex', 
  flexDirection: 'row',
  gap: '8px',
})


const SemanticWrapper = () => {
  return (
    <>
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet" />
      </Head>
    </>
  )
}

const ItineraryHeader = (props) => {
  const [itineraryData, setItineraryData] = useState([]);

  useEffect(async () => {
    setItineraryData(await getItineraryDataFromAPI(props.id));
  },[]);

  const date = `${itineraryData.startDate} - ${itineraryData.endDate}` 

  return (
    <div css={itineraryHeaderStyles}>
      <b style={{color: '#6B778C'}}>Part of</b>
      <EventItem hideAvatar type='itinerary' style={{height: '10px'}} id={itineraryData.id} title={itineraryData.title} date={date} location={itineraryData.destination}/>
    </div>
  )
}

const EventHeader = (props) => {   
  return (
      <div css={eventHeaderStyles}>
        <div style={{display: 'flex', gap: '10px'}}>
          <Image src={eventIcon} layout="fixed" width={30} height={30} />
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', gap: '12px', alignItems: 'end'}}> 
              <div css={titleStyles}>{ props.event.title }</div>
              <div style={{fontSize: 18, color: '#091E42'}}>{ props.event.date }</div>
            </div>
            <div style={{fontSize: 18, color: '#091E42'}}>{ props.event.location }, { props.event.postcode }</div>
          </div>
        </div>
        <div>
          <div style={{fontSize: 20, color: '#172B4D', textAlign: 'end'}}>Risk level: {props.risk}</div>
          <div style={{width: '12vw', paddingTop: '4px'}}>
          </div>
          <ProgressBar now={props.riskPercentage} label={`${props.riskPercentage}%`} variant={props.riskVariant}/>
        </div>
      </div>
  )
}


const ButtonHeader = (props) => {
  const [going, setGoing] = useState(false);

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div css={buttonGroupStyles}>
        <Button isSelected={props.content == 'about'} onClick={() => props.onContentChange('about')}>About</Button>
        <Button isSelected={props.content == 'riskAssessment'} onClick={() => props.onContentChange('riskAssessment')}>Risk Assessment</Button>
      </div>
      <div css={buttonGroupStyles}>
        <Button iconBefore={going ? <CheckCircleIcon/> : <CheckCircleOutlineIcon/>} onClick={() => setGoing(!going)} >Going</Button>
        <CopyLink link={props.shareableLink}/>
      </div>
    </div>
  )
}

const EventDetails = (props) => {
  const [backupEventData, setbackupEventData] = useState([]);
  const [eventAttendees, setEventAttendees] = useState([]);

  useEffect(async () => {
    setbackupEventData(await getEventDataFromAPI(props.event.backupEvent));
    setEventAttendees(await getEventAttendeesFromAPI(props.event.id));
  },[]);
  
  const goingData = eventAttendees.map((profile) => {
    return {
      email: profile.email,
      key: profile.id,
      name: profile.name,
      href: '#',
    }
  })

  return (
    <div css={contentGridStyles}>

      {/* Details */}
      <div css={contentItemStyles}>
        <div css={titleStyles}>Details</div>
        <div>
          <div css={subtitleStyles}>Date</div>
          <div css={contentTextStyles}>{props.event.date}</div>
        </div>
        <div>
          <div css={subtitleStyles}>Description</div>
          <div css={contentTextStyles}>{props.event.description}</div>
        </div>
        <div>
          <div css={subtitleStyles}>Going</div>
          {props.event.going &&
            <div style={{ marginTop: "8px" }}>
              <AvatarGroup appearance="stack" data={goingData} />
            </div>
          }
        </div>
      </div>

      {/* Event location */}
      <div css={contentItemStyles}>
        <div css={[titleStyles, flexRowStyles]}>
          Location 
          <Tooltip content="Zoom out to see nearby cases on map">
            <InfoIcon/>
          </Tooltip>
        </div>
        <div css={contentTextStyles}>{props.event.location}</div>
        {/* <MapComponent location={props.event.location} cases={props.assessment.nearbyCases}/> */}
      </div>

      {/* Backup event */}
      <div css={[backupEventContainerStyles, contentItemStyles]}>
        <div css={titleStyles}>Backup event</div>
        {props.event.backupId ?
          <EventItem type='event' style={{height: '10px'}} id={backupEventData.id} title={backupEventData.title} date={backupEventData.date} location={backupEventData.location}/>
          : <Button>Add Backup Event</Button>
        }
      </div>

    </div>
  )
}

const RiskAssessment = (props) => {
  return (
    <div css={contentGridStyles}>

      {/* lefthand column */}
      <div css={contentColumnStyles}>

        {/* Assessment */}
        <div css={contentItemStyles}>
          <div css={titleStyles}>Assessment</div>
          <div>
            <div css={contentTextStyles}><b style={{marginRight: '10px'}}>Risk:</b>{props.assessment.level}</div>
            <div style={{paddingTop: '16px'}}>
              <ProgressBar now={props.assessment.percentage} label={`${props.assessment.percentage}%`} variant={props.assessment.variant}/>
            </div>
          </div>
          <div>
            <div css={contentTextStyles}>{props.assessment.explanation}</div>
          </div>
        </div>

        {/* Cases */}
        <div css={contentItemStyles}>
          <div css={titleStyles}>Cases</div>
          <div style={{display: 'flex', flexDirection: 'row', gap: "30%"}}>
            <div css={contentTextStyles}>Today: <b>{props.assessment.currentCaseCount}</b></div>
            <div css={contentTextStyles}>Total: <b>{props.assessment.populationInfo[0]}</b></div>
          </div>
          <div css={flexRowStyles}>
            <InfoIcon size="medium"/>
            <div css={subtitleStyles}>1 in {props.assessment.ratio} people have COVID in this area</div>
          </div>
          <div css={subtitleStyles}>Trend</div> 
          <LineChartComponent data={props.assessment.historicalCases}/>
        </div>

      </div>

      {/* righthand column */}
      <div css={contentColumnStyles}>

        {/* Venue details */}
        <div css={contentItemStyles}>
          <div css={titleStyles}>Venue details</div>
          <div css={contentTextStyles}><b style={{marginRight: '10px'}}>Exposure:</b>{props.event.exposure}</div>
          <div css={contentTextStyles}><b style={{marginRight: '10px'}}>Venue:</b>{props.event.venueType}</div>
          <div css={contentTextStyles}><b style={{marginRight: '10px'}}>Capacity:</b>{props.event.capacity}</div>
        </div>

        {/* Disease information */}
        <div css={contentItemStyles}>
          <div css={titleStyles}>Disease information</div>
          <div css={contentTextStyles}><b style={{marginRight: '10px'}}>Disease:</b>COVID-19</div>
          <div css={contentTextStyles}>
            <div css={subtitleStyles}>Symptoms:</div>
            Common:
            <li>fever</li>
            <li>cough</li>
            <li>tiredness</li>
            <li>loss of taste or smell</li>
          </div>
          <div css={contentTextStyles}>
            Less common:
            <li>sore throat</li>
            <li>headache</li>
            <li>aches and pains</li>
            <li>diarrhoea</li>
            <li>a rash on skin, or discolouration of fingers or toes</li>
            <li>red or irritated eyes</li>
          </div>
        </div>

      </div>
    </div>
  )
}


export default function EventView({ eventData, riskAssessment, locationData }) {
  const secret =  "GalaxyTeamIsTheBest";
  
  const accesskey = CryptoJS.AES.encrypt(eventData.title, secret).toString();
  const shareableLink = (eventData.isPublic) ? `localhost:3000/event/${eventData.id}` :  `localhost:3000/event/${eventData.id}?accesskey=${encodeURIComponent(accesskey)}`

  const [content, setContent] = useState('about');

  if (!eventData.isPublic) {
    const { status } = useSession()
    const router = useRouter()

    if (status === "loading") {
      return (
        <Layout pageTitle="Event View">
          <LoadingPage/>
        </Layout>
      )
    }

    if (status === "unauthenticated") {
      var inputAccesskey;
      if (router.query.accesskey != undefined) {
        var inputAccesskey = decodeURIComponent(CryptoJS.AES.decrypt(router.query.accesskey, secret).toString(CryptoJS.enc.Utf8));
      }

      if (inputAccesskey !== eventData.title) {
        return (
          <Layout pageTitle="Event View">
            <EventAccessDenied/>
          </Layout>
        )
      }
    }
  }

  return (
    <Layout pageTitle="Event View">
      <Head>
        <title>Event View</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={contentContainerStyles}>
        <div css={contentStyles}>
          {riskAssessment.level === 'high' && <Banner
            appearance="warning"
            icon={<WarningIcon label="" secondaryColor="inherit" />}
            isOpen
          >
            {riskAssessment.explanation}
          </Banner>}
          <div css={headerStyles}>
            {eventData.itinerary && <ItineraryHeader id={eventData.itinerary}/>}
            <EventHeader event={eventData} risk={riskAssessment.level} riskPercentage={riskAssessment.percentage} riskVariant={riskAssessment.variant}/>
          </div>
          <ButtonHeader shareableLink={shareableLink} content={content} onContentChange={setContent}/>
          {content == 'about' && <EventDetails event={eventData} locationData={locationData} assessment={riskAssessment}/>}
          {content == 'riskAssessment' && <RiskAssessment event={eventData} assessment={riskAssessment}/>}
        </div>
      </div>
    </Layout>
  );
}

// Return a list of possible value for name
export async function getStaticPaths() {
  const ids = await getAllEventIdsFromAPI();
  const paths = ids.map(eventId => {
    return {
        params: {
            id: eventId
        }
    }
  });

  return {
    paths,
    fallback: false
  }
}

const getAllEventIdsFromAPI = async () => {
  const apiResult = await fetch("http://127.0.0.1:8000/getEventIds")
  .then(response => response.json())
  .catch(err => {
    console.log("err: ", err);
  })
  return apiResult
}

const getEventDataFromAPI = async (id) => {
  const apiResult = await fetch(`http://127.0.0.1:8000/getEventData?id=${id}`)
  .then(response => response.json())
  .catch(err => {
    console.log("err: ", err);
  })
  return apiResult
}

const getEventAttendeesFromAPI = async (id) => {
  const apiResult = await fetch(`http://127.0.0.1:8000/getEventAttendees?id=${id}`)
  .then(response => response.json())
  .catch(err => {
    console.log("err: ", err);
  })
  return apiResult
}

const getItineraryDataFromAPI = async (id) => {
  const apiResult = await fetch(`http://127.0.0.1:8000/getItineraryData?id=${id}`)
  .then(response => response.json())
  .catch(err => {
    console.log("err: ", err);
  })
  return apiResult
}


// Fetch necessary data for the event using params.name
export async function getStaticProps({ params }) {
  console.log("humbug");
  const eventData = await getEventDataFromAPI(params.id)

  const dateArray = eventData.date.split("/")
  const date = new Date(dateArray[2], dateArray[1], dateArray[0]);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  eventData.date = date.toLocaleDateString("en-US", options);

  const apiRiskData = await getEventRiskAssessment(eventData.postcode);
  const nearbyCases = await getNearbyCases(eventData.postcode);


  // calculate risk percentage
  const ratio = apiRiskData[2][0]/apiRiskData[2][1];
  const riskPercentage = Math.floor(makeRiskAssessment(eventData, ratio)*100);
  
  // calculate the risk level status
  const riskLevel = calculateRiskLevel(riskPercentage);

  
  const riskAssessment = {
    level: riskLevel[1],
    percentage: riskPercentage,
    explanation: "Due to the event being indoors, in public and of low capacity, we recommend you stay clear of this event unless in a small, vaccinated group.",
    currentCaseCount: apiRiskData[0].confirmed_cases_count[0],
    historicalCases: apiRiskData[1].slice(-14),
    populationInfo: apiRiskData[2],
    ratio: Math.floor(apiRiskData[2][1]/apiRiskData[2][0]),
    nearbyCases: nearbyCases,
    variant: riskLevel[0]
  }

  return {
    props: {
      eventData,
      riskAssessment,
    }
  }
}

const getEventRiskAssessment = async (postcode) => {
  const apiResult = await fetch(`http://127.0.0.1:8000/riskAssessment?postcode=${postcode}`)
  .then(response => response.json())
  .catch(err => {
    console.log("err: ", err);
  })
  return apiResult
}

const getNearbyCases = async (postcode) => {
  const apiResult = await fetch(`http://127.0.0.1:8000/getnearbyCovidCaseByPostcode?postcode=${postcode}`)
  .then(response => response.json())
  .catch(err => {
    console.log("err: ", err);
  })
  return apiResult
}