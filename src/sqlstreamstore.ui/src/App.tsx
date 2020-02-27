import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core';
import Header from './components/header/header';
import MainContent from './components/mainContent/mainContent';
import 'typeface-roboto';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <MainContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
