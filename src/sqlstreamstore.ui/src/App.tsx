import React, { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import DashBoard from './views/dashboard/dashboard';
import StreamsView from './views/streams/main';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core';
import Header from './components/header/header';
import { createHalClient } from './services/hal';
import SnackBar, { listenOnMessages, listenOffMessages, SnackbarMessage } from './components/messages/snackBar';
import 'typeface-roboto';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  content: {
    marginTop: '60px',
    flexGrow: 1,
    height: '100vh',
  },
});

const baseElement = document.querySelector('base');
const basename = baseElement ? baseElement.getAttribute('href') : '/';
createHalClient(basename);

function App() {
  const classes = useStyles();
  const [snackbarState, updateSnackbarState] = useState<SnackbarMessage>();

  useEffect(() => {
    const snackBarListener = (message: SnackbarMessage) => {
      updateSnackbarState(message);
    };
    
    listenOnMessages(snackBarListener);
    return () => {
      listenOffMessages(snackBarListener);
    };
  }, []);

  const closeSnackbar = () => {
    updateSnackbarState(undefined);
  };

  return (
    <BrowserRouter basename={basename || undefined}>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <main className={classes.content}>
          <Switch>
            <Route exact path="/">
              <DashBoard />
            </Route>
            <Route path="/(stream|streams)/:streamId?/:version?">
              <StreamsView />
            </Route>
          </Switch>
        </main>
        <SnackBar
          onClose={closeSnackbar}
          message={snackbarState?.message || ''}
          severity={snackbarState?.severity || 'info'}
          open={!!snackbarState}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
