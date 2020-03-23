import React from 'react';
import { Switch, Route } from "react-router-dom";
import DashBoard from './views/dashboard/dashboard';
import StreamsView from './views/streams/main';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core';
import Header from './components/header/header';
import { createHalClient } from './services/hal';
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
      </div>
    </BrowserRouter>
  );
}

export default App;
