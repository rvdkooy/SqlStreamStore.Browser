import React from 'react';
import Hero from '../../components/mainHero/hero';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import BookIcon from '@material-ui/icons/Book';
import GithubIcon from '@material-ui/icons/GitHub';
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
  },
  cardIconContainer: {
    display: 'block',
    flexDirection: 'column',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '60px',
    color: theme.palette.grey[700],
    // marginRight: 10,
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
              <a className={classes.cardIconContainer} href="https://sqlstreamstore.readthedocs.io/en/latest/">
                <BookIcon className={classes.cardIcon} />
                <Typography color="textSecondary" gutterBottom>Read the docs</Typography>
              </a>
          </Card>
          <Card>
            <a className={classes.cardIconContainer} href="https://github.com/SQLStreamStore/SQLStreamStore">
              <GithubIcon className={classes.cardIcon} />
              <Typography color="textSecondary" gutterBottom>Github</Typography>
            </a>
          </Card>
        </div>
      </Paper>
    </div>
  );
};

export default Dashboard;
