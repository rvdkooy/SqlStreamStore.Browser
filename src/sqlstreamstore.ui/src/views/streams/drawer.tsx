import React, { useState, useEffect } from 'react';
import usePrevious from '../../components/hooks/usePrevious'
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import streamsApi, { StreamMessage } from '../../services/streamsApi';
import MessageContent from './messageContent';

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
  streamId: string;
  messageId?: string;
}

const MessageDrawer = (props: Props) => {
  const classes = useStyles();
  const previousMessageId = usePrevious(props.messageId);
  const [streamMessage, setStreamMessage] = useState<StreamMessage | null>(null);

  useEffect(() => {
    if (!props.messageId && previousMessageId) {
      setStreamMessage(null);
    } else if (previousMessageId !== props.messageId) {
      const retrieveMessage = async (streamId: string, messageId: string) => {
        const message = await streamsApi.getMessage(streamId, messageId);
        setStreamMessage(message);
      }
      retrieveMessage(props.streamId, props.messageId);
    }
  }, [props.streamId, props.messageId, previousMessageId]);

  return (
    <Drawer anchor="right" open={!!props.messageId} >
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
        { (streamMessage) ? <MessageContent streamMessage={streamMessage} /> : null }
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
