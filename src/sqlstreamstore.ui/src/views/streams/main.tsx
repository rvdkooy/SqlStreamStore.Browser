import React, { useState, useEffect } from 'react';
import Searchbar from '../../components/Searchbar/searchbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import StreamsTable from './table';
import { Stream } from './models';

const useStyles = makeStyles({
  root: {
    padding: 10,
  },
  searchContainer: {
    padding: '10px 0',
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
  }
});

const StreamsView = () => {
  const classes = useStyles();
  const [streams, updateStreams] = useState<Array<Stream>>([]);
  const [status, updateStatus] = useState('error');


  async function retrieveStreams() {
    try {
      updateStatus('loading');
      const resp = await fetch('/api/streams');
      const streams = await resp.json();
      updateStreams(streams);
      updateStatus('done');
    } catch (err) {
      console.error(err);
      updateStatus('error');
    }
  }

  useEffect(() => {
    retrieveStreams();
  }, []);

  const onSearchStreamId = async (streamId: string) => {
    if (streamId) {
      const resp = await fetch('/api/streams/' + streamId);
      const streams = await resp.json();
      updateStreams(streams);
    } else {
      retrieveStreams();
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Searchbar
          onSearchStreamId={onSearchStreamId}
        />
      </div>
      {
        (status === 'loading') ?
          <div className={classes.progressContainer}>
            <CircularProgress></CircularProgress>
          </div> : null
      }
      {
        (status === 'error') ?
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            An error occured while retrieving the stream
          </Alert> : null
      }
      {
        (status === 'done') ? <StreamsTable streams={streams} /> : null
      }
    </div>
  );
};

export default StreamsView;
