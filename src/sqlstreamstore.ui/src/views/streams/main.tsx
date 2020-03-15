import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Searchbar from '../../components/Searchbar/searchbar';
import ProgressIndicator from '../../components/progressIndicator';
import { makeStyles } from '@material-ui/core';
import ErrorMessage from '../../components/errorMessage';
import StreamsTable from './table';
import MessageDrawer from './drawer';
import streamsApi, { StreamResponse } from '../../services/streamsApi';

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
  const [streams, updateStreams] = useState<Array<StreamResponse>>([]);
  const [status, updateStatus] = useState('loading');

  useEffect(() => {
    async function retrieveStreams(streamId?: string) {
      try {
        updateStatus('loading');
        const streamResponse = await streamsApi.getStreams(streamId);
        updateStreams(streamResponse);
        updateStatus('done');
      } catch (err) {
        console.error(err);
        updateStatus('error');
      }
    }
    
    retrieveStreams(params.streamId);
  }, [params.streamId]);

  const onDrawerCloseButtonClicked = () => {
    history.push(`/streams/${params.streamId}`);
  };

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Searchbar
          onSearchStreamId={(streamId) => history.push(`/streams/${streamId}`)}
        />
      </div>
      {
        (status === 'loading') ? <ProgressIndicator />: null
      }
      {
        (status === 'error') ? <ErrorMessage message="An error occured while retrieving streams" /> : null
      }
      {
        (status === 'done') ? <StreamsTable streams={streams} /> : null
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
