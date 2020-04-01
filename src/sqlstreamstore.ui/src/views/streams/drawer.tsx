import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import usePrevious from '../../components/hooks/usePrevious';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ErrorMessage from '../../components/messages/message';
import ProgressIndicator from '../../components/progressIndicator';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MessageContent from './messageContent';
import { HalResource } from 'hal-rest-client';
import { getHalClient } from '../../services/hal';

const useStyles = makeStyles((theme) => ({
  content: {
    width: 800,
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

interface Props {
  onCloseButtonClicked: () => void;
  version?: string;
}

const MessageDrawer = (props: Props) => {
  const classes = useStyles();
  const [status, updateStatus] = useState('loading');
  const [halResource, setHalResource] = useState<HalResource | null>();
  const previousVersion = usePrevious(props.version);
  const halClient = getHalClient();
  const routeMatch = useRouteMatch();

  useEffect(() => {
    if (!props.version && previousVersion) {
      setHalResource(null);
    } else if (previousVersion !== props.version) {
      const retrieveMessage = async () => {
        try {
          updateStatus('loading');
          const fetchHalResponse = await halClient.fetchResource(`.${routeMatch.url}`);
          setHalResource(fetchHalResponse);
          updateStatus('done');
        } catch (err) {
          console.error(err);
          updateStatus('error');
        }
      }
      retrieveMessage();
    }
  }, [props.version, previousVersion, halClient, routeMatch.url]);

  return (
    <Drawer anchor="right" open={!!props.version} >
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.onCloseButtonClicked}>
          <CloseIcon />
        </IconButton>
      </div>
      <div
        data-testid="drawer-content"
        className={classes.content}
        role="presentation"
      >
        {
          (status === 'done' && halResource) ? <MessageContent halResource={halResource} /> : null
        }
        {
          (status === 'loading') ? <ProgressIndicator /> : null
        }
        {
          (status === 'error') ? <ErrorMessage severity="error" message="An error occured while retrieving the message" /> : null
        }
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
