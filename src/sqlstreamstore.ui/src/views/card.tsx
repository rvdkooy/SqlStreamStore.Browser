import React from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

interface Props {
  children?: JSX.Element | JSX.Element[];
  // action?: JSX.Element | JSX.Element[];
}

const useStyles = makeStyles({
  root: {
    minWidth: '250px',
  },
});

const DashboardCard = (props: Props) => {
  const classes = useStyles();
  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        {props.children}
      </CardContent>
      {/* <CardActions>
        { props.action }
      </CardActions> */}
    </Card>
  );
};

export default DashboardCard;
