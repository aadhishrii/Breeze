import React from 'react';
import Select from '@atlaskit/select';

export const SelectDeparture = (props) => {

  const handleDepartureSelect = (data) => {
    props.onChange(data.label);
  };

  return (
    <>
      <Select
        onChange={handleDepartureSelect}
        inputId="single-select-example"
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Adelaide, Australia', value: 'adelaide' },
          { label: 'Brisbane, Australia', value: 'brisbane' },
          { label: 'Canberra, Australia', value: 'canberra' },
          { label: 'Darwin, Australia', value: 'darwin' },
          { label: 'Hobart, Australia', value: 'hobart' },
          { label: 'Melbourne, Australia', value: 'melbourne' },
          { label: 'Perth, Australia', value: 'perth' },
          { label: 'Sydney, Australia', value: 'sydney' },
        ]}
        placeholder="Sydney, Australia"
      />
    </>
  )
};


export const SelectDestination = (props) => {
  const handleSelectDestination = (data) => {
    props.onChange(data.label);
  };  
  return (
    <>
      <Select
        onChange={handleSelectDestination}
        inputId="single-select-example"
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Adelaide, Australia', value: 'adelaide' },
          { label: 'Brisbane, Australia', value: 'brisbane' },
          { label: 'Canberra, Australia', value: 'canberra' },
          { label: 'Darwin, Australia', value: 'darwin' },
          { label: 'Hobart, Australia', value: 'hobart' },
          { label: 'Melbourne, Australia', value: 'melbourne' },
          { label: 'Perth, Australia', value: 'perth' },
          { label: 'Sydney, Australia', value: 'sydney' },
        ]}
        placeholder="Melbourne, Australia"

      />
    </>
  )
};

export const BackupEvent = () => {

  const handleBackupSelect = (data) => {

  }
  return (
    <>
      <Select
        onChange={handleBackupSelect}
        inputId="single-select-example"
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Adelaide, Australia', value: 'adelaide' },
          { label: 'Brisbane, Australia', value: 'brisbane' },
          { label: 'Canberra, Australia', value: 'canberra' },
          { label: 'Darwin, Australia', value: 'darwin' },
          { label: 'Hobart, Australia', value: 'hobart' },
          { label: 'Melbourne, Australia', value: 'melbourne' },
          { label: 'Perth, Australia', value: 'perth' },
          { label: 'Sydney, Australia', value: 'sydney' },
        ]}
        placeholder="Melbourne, Australia"
      />
    </>
  )
};
