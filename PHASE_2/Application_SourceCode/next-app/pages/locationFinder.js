/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import Select from "react-select";
import countryList from "react-select-country-list";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import React from "react";

import Button from "@atlaskit/button";

import Layout from "../components/layout";
import LocationCard from "../components/locationCard";
import domesticTravel from "../public/images/domesticTravel.png";
import internationalTravel from "../public/images/internationalTravel.png";
import Beaches from "../public/images/Beaches.png";
import Diving from "../public/images/Diving.png";
import Nightlife from "../public/images/Nightlife.png";
import Romance from "../public/images/Romance.png";
import Skiing from "../public/images/Skiing.png";
import Camping from "../public/images/Camping.png";
import Hiking from "../public/images/Hiking.png";
import Cycling from "../public/images/Cycling.png";
import Climbing from "../public/images/Climbing.png";
import Sightseeing from "../public/images/Sightseeing.png";
import Museums from "../public/images/Museums.png";

const headingStyles = css({
  textAlign: "center",
  margin: "50px",
});

const layoutStyles = css({
  margin: "30px",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  gap: "20px",
});

const buttonStyles = css({
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
});

const imageStyles = css({
  borderRadius: "50%",
});

const imageButtonStyles = css({
  border: "none",
  backgroundColor: "white",
  pointer: "cursor",
});

const cardContainerStyles = css({
  display: "flex",
});

const loadingStyles = css({
  margin: "30px",
});

const cardLayoutStyles = css({
  margin: "20px",
});

const selectorStyles = css({
  width: "500px",
});

let activity = null;
let loc2 = [];
export default function LocationFinder() {
  const [page1, showpage1] = React.useState(true);
  const [page2, showpage2] = React.useState(false);
  const [page3, showpage3] = React.useState(false);
  const [selector, showSelector] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [locator, setLocator] = React.useState(false);

  const [country, setCountry] = React.useState("");
  const [country2, setCountry2] = React.useState("");
  const options = React.useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    const value2 = value["label"].replace(/ /g, "_");
    console.log("selected country", value2);
    setCountry(value);
    setCountry2(value2);
  };

  const pageView1 = (locator) => {
    if (locator == "domestic") {
      setLocator(true);
      showpage1(false);
      showSelector(true);
    } else {
      showpage1(false);
      showpage2(true);
    }
  };

  const Activities = (props) => {
    return (
      <>
        <div id="page3">
          <button
            css={imageButtonStyles}
            onClick={async () => {
              loc2 = [];
              setLoading(true);
              loc2 = await pageView3(props.label1);
              setLoading(false);
              view();
            }}
          >
            <Image
              src={props.image1}
              css={imageStyles}
              width="200px"
              height="200px"
            ></Image>
            <h4>{props.label1}</h4>
          </button>
        </div>
      </>
    );
  };

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const pageView3 = async (activity) => {
    try {
      let locations = [];
      const response = await fetch(
        `https://earthroulette.xyz/tags?where={%22name%22:%20{%22$in%22:%20[%22${activity}%22,%22Activities%22]}}&sort=-score&max_results=1500&projection={%22location_id%22:%201,%20%22score%22:%201}`
      );
      const data = await response.json();
      let locationList = data["_items"];
      console.log(data);
      console.log(data["_items"]);
      let randomNumbers = [];

      while (randomNumbers.length < (locator ? 2 : 4)) {
        let activities = [];
        let i = getRndInteger(0, 1499);
        if (randomNumbers.indexOf(i) === -1) {
          let dict = {};
          console.log("random", randomNumbers);
          dict["id"] = locationList[i]["_id"];
          let locationName = locationList[i]["location_id"];
          let name = locationName.replace(/_/g, " ");
          name = name.replace(/2C/g, "");
          name = name.replace(/\d+/g, "");
          console.log("location name", name);
          dict["name"] = name;
          const response2 = await fetch(
            `https://earthroulette.xyz/places?where={%22id%22:%20%22${locationName}%22}`
          );
          const data2 = await response2.json();
          console.log("country", data2["_items"][0]["country_id"]);
          if (country2) {
            if (country2 != data2["_items"][0]["country_id"]) {
              continue;
            }
          }
          let infoList = data2["_items"][0]["content"]["sections"][0];
          let description = infoList["body"];
          const response3 = await fetch(
            `https://cdn.earthroulette.com/ER/bg/${locationName}-bg.jpg`
          );
          const data3 = await response3.blob();
          const imageObjectURL = URL.createObjectURL(data3);
          console.log("image", imageObjectURL);
          dict["image"] = imageObjectURL;
          description = description.split(". ", 2);
          console.log("original description", description);
          if (description[0].split(" ").length < 15 && description[1]) {
            description = description[0] + ". " + description[1];
          } else if (description[0].split(" ").length > 40) {
            description = description[0].split(",", 1)[0];
          } else {
            description = description[0];
          }
          if (description.split(" ").length > 53) {
            description = description.split(",", 1)[0];
          }
          description = description.replace(/<\/?[^>]+(>|$)/g, "");
          dict["description"] = description;
          console.log("info list", infoList);
          console.log("description", description);

          const response4 = await fetch(
            `https://earthroulette.xyz/poi?where={%22location_id%22:%20%22${locationName}%22}`
          );
          const data4 = await response4.json();
          let placesList = data4["_items"];
          let index = 0;
          console.log("places list", data4);
          while (activities.length < 4) {
            activities.push(placesList[index]["name"]);
            index = index + 1;
          }
          dict["activities"] = activities;
          console.log("activities", activities);
          locations.push(dict);
          randomNumbers.push(i);
        }
      }
      console.log("locations", locations);
      return locations;
    } catch (err) {
      alert("Oops,looks like we ran into an issue. Please try again!");
    }
  };

  const view = () => {
    showpage2(false);
    showpage3(true);
  };

  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <Layout pageTitle="Location Finder">
      <Head>
        <title>Location Finder</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="main">
        {page1 ? (
          <>
            <h1 css={headingStyles}>Where do you want to travel?</h1>
            <div css={layoutStyles} id="page1">
              <button
                css={imageButtonStyles}
                onClick={() => pageView1("domestic")}
              >
                <Image
                  src={domesticTravel}
                  css={imageStyles}
                  width="200px"
                  height="200px"
                ></Image>
                <h4>Domestic</h4>
              </button>
              <button
                css={imageButtonStyles}
                onClick={() => pageView1("international")}
              >
                <Image
                  src={internationalTravel}
                  css={imageStyles}
                  width="200px"
                  height="200px"
                ></Image>
                <h4>International</h4>
              </button>
            </div>
          </>
        ) : null}

        {selector ? (
          <div>
            <h2 css={headingStyles}>Choose a country you want to travel to</h2>
            <div css={layoutStyles}>
              <Select
                css={selectorStyles}
                options={options}
                value={country}
                onChange={changeHandler}
              />
              <Button
                appearance="primary"
                onClick={() => {
                  showSelector(false);
                  showpage2(true);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}

        {page2 ? (
          !loading ? (
            <div>
              <h2 css={headingStyles}>Select what activity interests you</h2>
              <div css={layoutStyles}>
                <Activities image1={Beaches} label1="Beaches" />
                <Activities image1={Diving} label1="Diving" />
                <Activities image1={Nightlife} label1="Nightlife" />
                <Activities image1={Romance} label1="Romantic" />
                <Activities image1={Skiing} label1="Skiing" />
              </div>
              <div css={layoutStyles}>
                <Activities image1={Camping} label1="Camping" />
                <Activities image1={Hiking} label1="Hiking" />
                <Activities image1={Cycling} label1="Cycling" />
                <Activities image1={Climbing} label1="Climbing" />
              </div>
              <div css={layoutStyles}>
                <Activities image1={Sightseeing} label1="Sightseeing" />
                <Activities image1={Museums} label1="Museums" />
              </div>
            </div>
          ) : (
            <p css={loadingStyles}>Loading...</p>
          )
        ) : null}

        {page3 ? (
          <div css={cardLayoutStyles}>
            <h1>Here are few locations you will love to visit</h1>
            <div css={cardContainerStyles}>
              {console.log("from card layout", loc2)}
              {loc2.map((element, key) => {
                return (
                  <LocationCard
                    image={element["image"]}
                    title={element["name"]}
                    description={element["description"]}
                    activities={element["activities"]}
                    key={key}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        <p css={buttonStyles}>
          <Button onClick={refreshPage}>Restart Quiz</Button>
        </p>
      </div>
    </Layout>
  );
}
