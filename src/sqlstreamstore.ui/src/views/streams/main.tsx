import React, { useState, useEffect,useCallback } from 'react';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import CommandBar from './commandBar';
import ProgressIndicator from '../../components/progressIndicator';
import { makeStyles } from '@material-ui/core';
import ErrorMessage from '../../components/messages/message';
import StreamsTable from './table';
import MessageDrawer from './drawer';
import { HalResource } from 'hal-rest-client';
import usePrevious from '../../components/hooks/usePrevious'
import useHalClient from '../../components/hooks/useHalClient'

const useStyles = makeStyles({
  root: {
    padding: 10,
  },
  searchContainer: {
    padding: '10px 0',
  },
});

const StreamsView = () => {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams<{ streamId: string, version: string }>();
  const [halState, updateHalState] = useState<HalResource>();
  const [messages, updateMessages] = useState<HalResource[]>([]);
  const [status, updateStatus] = useState('loading');
  const previousStreamId = usePrevious(params.streamId);
  const halClient = useHalClient();
  const routeMatch = useRouteMatch();
  const queryStrings = useLocation().search;
  
  const retrieveStreams = useCallback(async () => {
    try {
      updateStatus('loading');
      let halResponse = await halClient.fetchResource(`.${routeMatch.url}${queryStrings}`);
      const streamStoreMessage = halResponse.prop('streamStore:message');
      if (streamStoreMessage instanceof HalResource) {
        halResponse = await halClient.fetchResource(streamStoreMessage.link('streamStore:feed').uri.uri);
        updateMessages(halResponse.prop('streamStore:message'));
      } else {
        updateMessages(streamStoreMessage);
      }

      updateHalState(halResponse);
      updateStatus('done');
    } catch (err) {
      console.error(err);
      updateStatus('error');
    }
  }, [routeMatch.url, halClient, queryStrings]);

  useEffect(() => {
    if (!params.streamId || params.streamId !== previousStreamId) {
      retrieveStreams();
    }
  }, [params.streamId, previousStreamId, retrieveStreams]);

  const onDrawerClose = (refresh?: boolean) => {
    if (halState) {
      history.push('../' + halState.link('streamStore:feed').uri.uri);
    }
    if (refresh) {
      retrieveStreams();
    }
  };

  return (
    <div className={classes.root}>
      {
        (status === 'loading') ? <ProgressIndicator /> : null
      }
      {
        (status === 'error') ? <ErrorMessage severity="error" message="An error occured while retrieving streams" /> : null
      }
      {
        (status === 'done' && halState) ?
          <div>
            <div className={classes.searchContainer}>
              <CommandBar halState={halState} />
            </div>
            <StreamsTable streams={messages} />
            <MessageDrawer
              onClose={onDrawerClose}
              version={params.version}
            />
          </div> : null
      }
    </div>
  );
};

export default StreamsView;
