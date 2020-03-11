import React, { useState, useEffect } from 'react';
import { useParams, useHistory  } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  content: {
    width: 500,
    padding: theme.spacing(3),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
}));

const MessageDrawer = () => {
  const classes = useStyles();
  const params = useParams<{ messageId: string, streamId: string }>();
  const [ open, setOpen ] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (params.messageId && !open) {
      setOpen(true);
    }
    if (!params.messageId && open) {
      setOpen(false);
    }
  }, [params, open]);

  const onCloseButtonClicked = () => {
    history.push(`/streams/${params.streamId}`);
  };

  return (
    <Drawer anchor="right" open={open} >
      <div className={classes.drawerHeader}>
        <IconButton onClick={onCloseButtonClicked}>
          <CloseIcon />
        </IconButton>
      </div>
      <div
        className={classes.content}
        role="presentation"
        // onClick={toggleDrawer(side, false)}
        // onKeyDown={toggleDrawer(side, false)}
      >
        test
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
