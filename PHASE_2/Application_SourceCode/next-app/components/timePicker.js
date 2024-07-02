import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';

const GalaxyTimePicker = (props) => {

  const handleTimeSelect = (newTime) => {
    console.log(newTime);
    props.onChange(newTime)
  }
  return (
    <>
      <TimePicker onChange={handleTimeSelect}/>
    </>
  )
};

export default GalaxyTimePicker;