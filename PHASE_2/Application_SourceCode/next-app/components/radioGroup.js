import React from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, { Field, FieldProps, FormFooter } from '@atlaskit/form';

import { RadioGroup } from '@atlaskit/radio';
import { OptionsPropType } from '@atlaskit/radio/types';

const options = [
  { name: 'color', value: 'red', label: 'Household' },
  { name: 'color', value: 'blue', label: 'Business' },
  { name: 'color', value: 'blue', label: 'Public space' },
];

export default function FormExampleSimple() {
  return (
    <div>
      <Form onSubmit={(data) => console.log('form data', data)}>
        {({ formProps }) => {
          return (
            <form {...formProps} name="form-example">
              <Field
                label="regular radio group"
                name="fruit"
                defaultValue="peach"
              >
                {({ fieldProps }) => (
                  <RadioGroup {...fieldProps} options={options} />
                )}
              </Field>
            </form>
          );
        }}
      </Form>
    </div>
  );
}