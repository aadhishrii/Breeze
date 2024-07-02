/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { SimpleTag as Tag } from '@atlaskit/tag';

export default function EventTag(key) {
    switch(key) {
      case 'low':
        return (<Tag text="Low risk" color="green" />);
      case 'moderate':
        return (<Tag text="Moderate risk" color="yellow" />);
      case 'high':
        return (<Tag text="High risk" color="red" />);
      case 'done':
          return (<Tag text="Done" color="greyLight" />);
      default:
        return (<Tag text="invalid risk" color="grey" />); 
    }
}