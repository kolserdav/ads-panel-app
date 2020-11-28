import React from 'react';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import * as Types from '../react-app-env';


export default function TransitionsPopper(props: Types.PopperProps) {
  const { anchorEl, content } = props;
  const open = Boolean(anchorEl);
  // eslint-disable-next-line prettier/prettier
  const id = open ? 'transitions-popper' : undefined
  return (
    <div>
      <Popper placement="bottom-start" id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Fade {...TransitionProps} timeout={350}>
            {content}
          </Fade>
        )}
      </Popper>
    </div>
  );
}