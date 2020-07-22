import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import prettyPrintJson from 'pretty-print-json';
import 'pretty-print-json/dist/pretty-print-json.css';
import { HalResource } from 'hal-rest-client';
import ErrorMessage from '../../components/messages/message';

const useStyles = makeStyles((theme) => ({
  jsonData: {
    padding: 10,
    fontSize: theme.typography.fontSize,
  },
  tabs: {
    marginTop: 30,
  },
  propertyBlock: {
    marginBottom: '8px',
  }
}));

interface Props {
  halResource: HalResource;
}

const MessageContent = (props: Props) => {
  let prettyPrintedJsonData;
  let prettyPrintedJsonMetaData;

  try {
    prettyPrintedJsonData = prettyPrintJson.toHtml(props.halResource.prop('payload'));
    prettyPrintedJsonMetaData = prettyPrintJson.toHtml(props.halResource.prop('metadata'));
  } catch (err) {
    console.warn(err);
  }
  const [activeTab, updateActiveTab] = useState(0);
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
      <Paper square className={classes.tabs}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => updateActiveTab(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Payload" />
            <Tab label="Metadata" />
          </Tabs>
        </Paper>
        <Paper className={classes.jsonData}>
          <TabPanel value={activeTab} index={0}>
            {
              (prettyPrintedJsonData) ?
                <pre dangerouslySetInnerHTML={{ __html: prettyPrintedJsonData }}></pre> :
                <ErrorMessage severity="error" message="Unable to parse payload" />
            }
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            {
              (prettyPrintedJsonMetaData) ?
                <pre dangerouslySetInnerHTML={{ __html: prettyPrintedJsonMetaData }}></pre> :
                <ErrorMessage severity="error" message="Unable to parse metadata" />
            }
          </TabPanel>
        </Paper>
      </div>
    </div>
  );
}

function TabPanel(props: { children: JSX.Element | JSX.Element[], value: number, index: number }) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default MessageContent;
