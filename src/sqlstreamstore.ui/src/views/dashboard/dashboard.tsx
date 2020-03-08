import React from 'react';
import Hero from '../../components/mainHero/hero';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import Card from './card';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: 'auto',
    maxWidth: '1024px',
    margin: 'auto',
    paddingTop: '50px',
    paddingBottom: '50px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  cardContainer: {
    marginTop: '50px',
    marginBottom: '150px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  fatCaption: {
    fontSize: theme.typography.h6.fontSize,
    marginRight: theme.spacing(),
  },
  normalCaption: {
    fontSize: '20px',
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero />
      <Paper className={classes.paper}>
        <div className={classes.buttonContainer}>
          <Button variant="outlined" size="large" color="primary" component={Link} to="/streams">
            Browse streams
          </Button>
        </div>
        <div className={classes.cardContainer}>
          <Card>
            <div>
              <Typography className={classes.fatCaption} variant="caption">Provider:</Typography>
              <Typography variant="caption" color="textSecondary" className={classes.normalCaption}>In memory</Typography>
            </div>
            <div>
              <Typography className={classes.fatCaption} variant="caption">Version:</Typography>
              <Typography variant="caption" color="textSecondary" className={classes.normalCaption}>5.4</Typography>
            </div>
          </Card>
          <Card>
            <Typography color="textSecondary" gutterBottom># streams</Typography>
            <Typography gutterBottom variant="h3">17.463</Typography>
          </Card>
          <Card>
            <Typography color="textSecondary" gutterBottom># messages</Typography>
            <Typography gutterBottom variant="h3">46.875</Typography>
          </Card>
        </div>
      </Paper>
    </div>
  );
};

export default Dashboard;
