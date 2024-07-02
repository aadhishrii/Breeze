import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';

export const GalaxyIndoorCheckbox = () => {
  return (
    <Checkbox
      value="default checkbox"
      label="Indoor"
      onChange={() => {}}
      name="checkbox-default"
      testId="cb-default"
    />
  );
};

export const GalaxyOutdoorCheckbox = () => {
  return (
    <Checkbox
      value="default checkbox"
      label="Outdoor"
      onChange={() => {}}
      name="checkbox-default"
      testId="cb-default"
    />
  );
};
