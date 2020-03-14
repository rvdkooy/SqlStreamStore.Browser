import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core';
import Header from './components/header/header';
import MainContent from './components/mainContent/mainContent';
import { setBasePath } from './services/streamsApi';
import 'typeface-roboto';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

const baseElement = document.querySelector('base');
const basename = baseElement ? baseElement.getAttribute('href') : '/';
setBasePath(basename);

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter basename={basename || undefined}>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <MainContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
