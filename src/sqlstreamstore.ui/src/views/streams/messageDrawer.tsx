import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import streamsApi, { StreamMessage } from '../../services/streamsApi';
import prettyPrintJson from 'pretty-print-json';
import 'pretty-print-json/dist/pretty-print-json.css';

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
  jsonData: {
    padding: 10,
    fontSize: theme.typography.fontSize,
  },
  propertyBlock: {
    marginBottom: '8px',
  }
}));

const MessageDrawer = () => {
  const classes = useStyles();
  const params = useParams<{ messageId: string, streamId: string }>();
  const [open, setOpen] = useState(false);
  const [streamMessage, setStreamMessage] = useState<StreamMessage | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (params.messageId && !open) {
      const retrieveMessage = async (streamId: string, messageId: string) => {
        const message = await streamsApi.getMessage(streamId, messageId);
        setStreamMessage(message);
      }

      setOpen(true);
      retrieveMessage(params.streamId, params.messageId);
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
      >
        {
          (streamMessage) ?
            <div>
              <div className={classes.propertyBlock}>
                <Typography variant="h6">Stream ID:</Typography>
                <Typography>{streamMessage.streamId}</Typography>
              </div>
              <div className={classes.propertyBlock}>
                <Typography variant="h6">message ID:</Typography>
                <Typography>{streamMessage.messageId}</Typography>
              </div>
              <div className={classes.propertyBlock}>
                <Typography variant="h6">Created:</Typography>
                <Typography>{streamMessage.createdUtc}</Typography>
              </div>
              <div className={classes.propertyBlock}>
                <Typography variant="h6">Type:</Typography>
                <Typography>{streamMessage.type}</Typography>
              </div>
              <div className={classes.propertyBlock}>
                <Typography variant="h6">Json Data:</Typography>
                <Paper className={classes.jsonData}>
                  <pre dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(JSON.parse(streamMessage.jsonData)) }}></pre>
                </Paper>
              </div>
            </div> : null
        }
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
