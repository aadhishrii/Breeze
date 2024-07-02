import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';

export const GalaxyDatePickerStart = (props) => {
  const handleDateChange = (data) => {
    console.log('date changed: ', data);
    props.onChange(data);
  }
  return (
    <>
      <DatePicker onChange={handleDateChange}/>
    </>
  )
};

export const GalaxyDatePickerEnd = (props) => {
  const handleDateChange = (data) => {
    console.log('date changed: ', data);
    props.onChange(data);
  }
  return (
    <>
      <DatePicker onChange={handleDateChange}/>
    </>
  )
};

