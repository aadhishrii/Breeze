/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from "react";
import Button from "@atlaskit/button/standard-button";
import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition
} from "@atlaskit/modal-dialog";
import { RadioGroup } from "@atlaskit/radio";

import Form, { Field } from "@atlaskit/form";


const sendDataToAPI = (data, user) => {
    const requestJson = {
        profile: user.email,
        vaccinationDose: data.vaccinationDose,
    };
    fetch("http://127.0.0.1:8000/updateVaccinationStatus", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestJson),
    })
    .then(response => response.json())
    .then(responseData => {
        console.log('Success:', responseData);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

const VaccinationForm = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <Button onClick={open}>Add vaccination</Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog onClose={close}>
            <Form
                onSubmit={async (data) => {
                    sendDataToAPI(data, props.user);
                    props.onChange(data.vaccinationDose);
                    close();
                }}
            >
              {({ formProps }) => (
                <form id="form-with-id" {...formProps}>
                  <ModalHeader>
                    <ModalTitle>Set vaccination status</ModalTitle>
                  </ModalHeader>

                  <ModalBody>
                    <p>
                      Select how many doses of the COVID-19 Vaccine you have had
                    </p>
                    <Field name="vaccinationDose" label="Doses" isRequired>
                      {({ fieldProps: { value, ...others } }) => (
                        <RadioGroup
                          options={[
                            { value: "0", label: "0" },
                            { value: "1", label: "1" },
                            { value: "2", label: "2" },
                            { value: "3", label: "3" }
                          ]}
                          {...others}
                        />
                      )}
                    </Field>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={close} appearance="subtle">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      form="form-with-id"
                      appearance="primary"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Form>
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
};

export default VaccinationForm;
