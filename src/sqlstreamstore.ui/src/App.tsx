import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import 'typeface-roboto';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  content: {
    marginTop: '80px',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
});

function App() {
  const [streams, updateStreams] = useState<Array<{ messageId: string }>>([]);
  useEffect(() => {
    async function retrieveStreams() {
      const resp = await fetch('/api/streams');
      const streams = await resp.json();
      console.log(streams);
      updateStreams(streams);
    }
    retrieveStreams();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6">
            SqlStreamStore Browser
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        { streams.map(s => (<Typography key={s.messageId}>{ s.messageId }</Typography>)) }
      </main>
    </div>
  );
}

export default App;
