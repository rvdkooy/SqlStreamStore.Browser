import React from 'react';
import { Switch, Route } from "react-router-dom";
import DashBoard from '../../views/dashboard';
import StreamsView from '../../views/streams/main';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  content: {
    marginTop: '60px',
    flexGrow: 1,
    height: '100vh',
  },
});

const MainContent = () => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <Switch>
        <Route exact path="/">
          <DashBoard />
        </Route>
        <Route path="/streams">
          <StreamsView />
        </Route>
      </Switch>
    </main>
  );
};

export default MainContent;
