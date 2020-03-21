import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import Searchbar from '../../components/Searchbar/searchbar';
import ProgressIndicator from '../../components/progressIndicator';
import { makeStyles } from '@material-ui/core';
import ErrorMessage from '../../components/errorMessage';
import StreamsTable from './table';
import MessageDrawer from './drawer';
import { getHalClient } from '../../services/hal';
import { HalResource } from 'hal-rest-client';

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
  const params = useParams<{ streamId: string, messageId: string }>();
  const [halResponse, updateHalResponse] = useState<HalResource>();
  const [status, updateStatus] = useState('loading');

  const halClient = getHalClient();
  const routeMatch = useRouteMatch();
  const q = useLocation().search;
  useEffect(() => {
    async function retrieveStreams() {
      try {
        updateStatus('loading');
        const fetchHalResponse = await halClient.fetchResource(`.${routeMatch.url}${q}`);
        updateHalResponse(fetchHalResponse);
        updateStatus('done');
      } catch (err) {
        console.error(err);
        updateStatus('error');
      }
    }

    retrieveStreams();
  }, [params, routeMatch, halClient, q]);

  const onDrawerCloseButtonClicked = () => {
    history.push(`/streams/${params.streamId}`);
  };

  return (
    <div className={classes.root}>

      {
        (status === 'loading') ? <ProgressIndicator /> : null
      }
      {
        (status === 'error') ? <ErrorMessage message="An error occured while retrieving streams" /> : null
      }
      {
        (status === 'done' && halResponse) ?
          <div>
            <div className={classes.searchContainer}>
              <Searchbar
                halLinks={halResponse.links}
                fromPosition={halResponse.prop('fromPosition')}
              />
            </div>
            <StreamsTable streams={halResponse.prop('streamStore:message') as HalResource[]} />
          </div> : null
      }
      <MessageDrawer
        onCloseButtonClicked={onDrawerCloseButtonClicked}
        messageId={params.messageId}
        streamId={params.streamId}
      />
    </div>
  );
};

export default StreamsView;
