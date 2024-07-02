import React, { useState } from 'react';

import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import LinkIcon from '@atlaskit/icon/glyph/link'

import {CopyToClipboard} from 'react-copy-to-clipboard';

const beforeCopying = "Copy to Clipboard";
const afterCopying = 'Copied';

const CopyLink = (props) => {
  const [message, setMessage] = React.useState(beforeCopying);
  const updateTooltip = React.useRef();

  React.useLayoutEffect(() => {
    updateTooltip.current?.();
  }, [message]);

  console.log(props.link)

  return (
    <Tooltip
      content={({ update }) => {
        updateTooltip.current = update;
        return message;
      }}
    >
        <CopyToClipboard text={props.link}>
            <Button 
                onClick={() => setMessage(afterCopying)}
                iconBefore={<LinkIcon/>}
            >
                Share Event
            </Button>
        </CopyToClipboard>
    </Tooltip>
  );
};

export default CopyLink;