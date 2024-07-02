/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import LoadingPage from './loadingPage';

const caseMarkerStyles = css({
  width: '30px',
  height: '30px',
  border: '5px solid #f44336',
  borderRadius: '50%',
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: '4',
  cursor: 'pointer'
});

const CaseMarker = (props) => {
  return (
    <div css={caseMarkerStyles}>
      <div>{props.cases}</div>
    </div>
  )
};

const MapComponent = (props) => {

    const [locationData, setLocationData] = useState();

    useEffect(async () => {
        setLocationData(await getGeocodeData(props.location));
    },[]);

    if (!locationData) {
        return (
            <LoadingPage/>
        )
    }

    const renderMarkers = (map, maps) => {
      let marker = new maps.Marker({
        position: { lat: locationData.latitude, lng: locationData.longitude },
        map,
      });
      return marker;
    };

    var defaultProps = {
        center: {
            lat: locationData.latitude,
            lng: locationData.longitude,
        },
        zoom: 15
    };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAMfds0qzM7jNWpNQak2xNQ6LwYQTIpxH8" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
      >
        {props.cases && props.cases.map((obj) => (
          <CaseMarker
            lat={obj.latitude}
            lng={obj.longitude}
            cases={obj.cases}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}

const getGeocodeData = async (location) => {
    const apiResult = await fetch(`http://api.positionstack.com/v1/forward?access_key=5371e1243c72779267265c6e6148f89f&query=${location}`)
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log("err: ", err);
    })
    console.log("Geolocation API called: LIMITED CALLS DO NOT SPAM")
    return apiResult.data[0];
}

export default MapComponent;