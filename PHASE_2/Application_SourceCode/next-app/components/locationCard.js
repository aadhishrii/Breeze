/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const cardStyles = css({
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
  transition: "0.3s",
  width: "300px",
  height: "650px",
  margin: "20px",
});

const containerStyles = css({
  padding: "2px 16px",
});

export default function locationCard(props) {
  return (
    <Link href="/itinerary/creator">
      <section css={cardStyles}>
        <img src={props.image} width="300" height="200" />
        <div css={containerStyles}>
          <h3>{props.title}</h3>
          <p>{props.description}</p>
          <h4>This place is know for:</h4>
          {props.activities.map((element, key) => {
            return <p key={key}>{element}</p>;
          })}
        </div>
      </section>
    </Link>
  );
}
