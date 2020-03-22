import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import prettyPrintJson from 'pretty-print-json';
import 'pretty-print-json/dist/pretty-print-json.css';
import { HalResource } from 'hal-rest-client';

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
  halResource: HalResource;
}

const MessageContent = (props: Props) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Stream ID:</Typography>
        <Typography>{props.halResource.prop('streamId')}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">message ID:</Typography>
        <Typography>{props.halResource.prop('messageId')}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Created:</Typography>
        <Typography>{props.halResource.prop('createdUtc')}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Type:</Typography>
        <Typography>{props.halResource.prop('type')}</Typography>
      </div>
      <div className={classes.propertyBlock}>
        <Typography variant="h6">Json Data:</Typography>
        <Paper className={classes.jsonData}>
          <pre dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(props.halResource.prop('payload')) }}></pre>
        </Paper>
      </div>
    </div>
  );
}

export default MessageContent;
