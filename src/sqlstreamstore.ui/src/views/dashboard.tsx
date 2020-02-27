import React from 'react';
import Hero from '../components/mainHero/hero';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: 'auto',
    maxWidth: '1024px',
    margin: 'auto',
    paddingTop: '50px',
    paddingBottom: '50px',
    paddingLeft: '16px',
    paddingRight: '16px',
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  
  return (
    <div>
      <Hero />
      <Paper className={classes.paper}>
        <p>dfsd</p>
      </Paper>
    </div>
  );
};

export default Dashboard;
