import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import logo from '../../images/logo.svg'

const useStyles = makeStyles((theme) => ({
  hero: {
    height: '300px',
    backgroundColor: theme.palette.primary.main,
    paddingTop: '40px',
  },
  heroText: {
    textAlign: 'center',
    color: theme.palette.common.white,
  },
  logo: {
    height: '120px',
  }
}));

const MainHero = () => {
  const classes = useStyles();
  return (
    <div className={classes.hero}>
      <div className={classes.heroText}>
        <img className={classes.logo} src={logo} alt="sqlstreamstore logo" />
        <Typography variant="h3">
          SqlStreamStore Browser
        </Typography>
        <Typography>
          Version 1.4.5
        </Typography>
      </div>
    </div>
  );
};

export default MainHero;
