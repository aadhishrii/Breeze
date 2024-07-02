/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { EventCard } from "../../components/eventCard";
import itineraryIcon from "../../public/images/itineraryIcon.png";

import AvatarGroup from "@atlaskit/avatar-group";

import Layout from "../../components/layout";

import Map from "../../public/images/map.png";

const layoutStyles = css({
  display: "flex",
  marginLeft: "30px",
  gap: "80px",
  justifyContent: "space-between",
  fontFamily: "'SF Pro Text', sans-serif",
  color: "#172B4D",
  marginBottom: "0",
});

const dateStyles = css({
  fontFamily: "'SF Pro Text', sans-serif",
  color: "#6B778C",
  fontWeight: 800,
  fontSize: 11,
});

const titleStyles = css({
  fontWeight: 600,
  fontSize: 27,
  marginTop: 3,
  marginBottom: 5,
});

const locationStyles = css({
  color: "#6B778C",
  fontWeight: 800,
  fontSize: 11,
  marginTop: 0,
});

const childStyles = css({
  maxWidth: "45rem",
  marginTop: "30px",
  marginBottom: "0",
});

const mainHeadingStyles = css({
  display: "flex",
  gap: "10px",
  marginTop: 7,
  marginBottom: 7,
});

const headingStyles = css({
  display: "flex",
  marginTop: 18,
  gap: "8rem",
});

const subheadingStyles = css({
  fontWeight: 500,
  marginTop: 20,
  marginBottom: 10,
  fontWeight: 700,
});

const descriptionStyles = css({
  width: "25rem",
  marginBottom: "25px",
});

const imageStyles = css({
  maxWidth: "40rem",
  margin: 0,
  height: "28.5rem",
});

const EventsContainerStyles = css({
  display: "flex",
  alignItems: "flex-start",
  flexFlow: "column nowrap",
  overflowX: "auto",
  flexGrow: 1,
  backgroundColor: "#CCCCCC",
  maxWidth: "100%",
  padding: "30px",
  margin: 0,
});

const EventsTitleStyles = css({
  fontSize: 24,
  marginBottom: 18,
  fontFamily: "'SF Pro Text', sans-serif",
});

const cardGroupContainerStyles = css({
  display: "flex",
  flexDirection: "row",
  gap: "21px",
});

export const Events = (props) => {
  return (
    <div css={EventsContainerStyles}>
      <div css={EventsTitleStyles}>Events</div>
      <div css={cardGroupContainerStyles}>
        {props.data && props.data.map((event) => (
          <EventCard
            type="event"
            id={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
          />
        ))}
      </div>
    </div>
  );
};

export default function ItineraryView({ itineraryData, eventData }) {
  return (
    <Layout pageTitle="Itinerary View" signInRequired>
      <Head>
        <title>View Itinerary</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={layoutStyles}>
        <div css={childStyles}>
          <div css={dateStyles}>{itineraryData.startDate} - {itineraryData.endDate}</div>
          <div css={mainHeadingStyles}>
            <Image src={itineraryIcon} layout="fixed" width={40} height={40} />
            <h1 css={titleStyles}>{itineraryData.title}</h1>
          </div>
          <div css={locationStyles}>{itineraryData.destination}</div>
          <h3 css={subheadingStyles}>Description</h3>
          <div css={descriptionStyles}>{itineraryData.description}</div>
          <div css={headingStyles}>
            <div style={{ fontWeight: 600 }}> Going</div>
              <div style={{ marginLeft: "15px" }}>
                <AvatarGroup appearance="stack" data={[]}/>
              </div>
          </div>
          <div css={headingStyles}>
            <div style={{fontWeight: 700}}>Covid Vaccination</div>
            <div>Mandatory</div>
          </div>
          <div css={headingStyles}>
            <div style={{fontWeight: 700}}>Travel Requirements</div>
            <div style={{paddingLeft: "17px"}}>
              You need to provide a negative test report at least 48 hours
              before boarding the flight.
            </div>
          </div>
        </div>
        <div css={imageStyles}>
          <Image src={Map} objectFit="contain" />
        </div>
      </div>
      <Events data={eventData}/>
    </Layout>
  );
}



// Return a list of possible value for name
export async function getStaticPaths() {
    const ids = await getAllItineraryIdsFromAPI();
    const paths = ids.map(itineraryId => {
      return {
          params: {
              id: itineraryId
          }
      }
    });
  
    return {
      paths,
      fallback: false
    }
  }
  
  const getAllItineraryIdsFromAPI = async () => {
    const apiResult = await fetch("http://127.0.0.1:8000/getItineraryIds")
    .then(response => response.json())
    .catch(err => {
      console.log("err: ", err);
    })
    return apiResult
  }
  
  const getItineraryDataFromAPI = async (itineraryId) => {
    const apiResult = await fetch(`http://127.0.0.1:8000/getItineraryData?id=${itineraryId}`)
    .then(response => response.json())
    .catch(err => {
      console.log("err: ", err);
    })
    return apiResult
  }

  export const getEvents = async (itineraryId) => {
    const apiResult = await fetch(`http://127.0.0.1:8000/getEventsInItinerary?id=${itineraryId}`)
    .then(response => response.json())
    .catch(err => {
      console.log("err: ", err);
    })
    return apiResult
  }
  
  // Fetch necessary data for the event using params.name
  export async function getStaticProps({ params }) {
    const itineraryData = await getItineraryDataFromAPI(params.id);
    const eventData = await getEvents(params.id);
    console.log("itineraryData:", itineraryData)
    return {
      props: {
        itineraryData,
        eventData
      }
    }
  }
  
