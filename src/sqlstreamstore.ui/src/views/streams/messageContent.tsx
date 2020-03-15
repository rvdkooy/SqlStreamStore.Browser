import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { StreamMessage } from '../../services/streamsApi';
import prettyPrintJson from 'pretty-print-json';
import 'pretty-print-json/dist/pretty-print-json.css';

const useStyles = makeStyles((theme) => ({
  jsonData: {
    padding: 10,
    fontSize: theme.typography.fontSize,
  },
  propertyBlock: {
    marginBottom: '8px',
  }
}));

interface Props {
  streamMessage: StreamMessage;
}

const MessageContent = (props: Props) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Stream ID:</Typography>
        <Typography>{props.streamMessage.streamId}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">message ID:</Typography>
        <Typography>{props.streamMessage.messageId}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Created:</Typography>
        <Typography>{props.streamMessage.createdUtc}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Type:</Typography>
        <Typography>{props.streamMessage.type}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Json Data:</Typography>
        <Paper className={classes.jsonData}>
          <pre dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(JSON.parse(props.streamMessage.jsonData)) }}></pre>
        </Paper>
      </div>
    </div>
  );
}

export default MessageContent;
