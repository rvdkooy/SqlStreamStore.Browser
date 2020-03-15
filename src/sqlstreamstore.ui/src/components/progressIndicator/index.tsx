import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';  
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
  },
});

const ProgressIndicator = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.progressContainer}>
      <CircularProgress></CircularProgress>
    </div>
  );
}

export default ProgressIndicator;
