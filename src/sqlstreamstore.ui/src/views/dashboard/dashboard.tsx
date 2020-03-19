import React, { useEffect, useState } from 'react';
import Hero from '../../components/mainHero/hero';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import BookIcon from '@material-ui/icons/Book';
import GithubIcon from '@material-ui/icons/GitHub';
import Card from './card';
import ErrorMessage from '../../components/errorMessage';
import ProgressIndicator from '../../components/progressIndicator';
import { Link } from 'react-router-dom';
import { getHalClient } from '../../services/hal';

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
  }
}));

interface ServerInfo {
  provider: string;
  versions: { streamStore: string };
}

const Dashboard = () => {
  const classes = useStyles();
  const [serverInfo, setServerInfo] = useState<ServerInfo>();
  const [status, setStatus] = useState('loading');
  const halClient = getHalClient();
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const resource = await halClient.fetchResource('/');
        const versions = resource.prop('versions') as { streamStore: string };
        setServerInfo({
          provider: resource.prop('provider'),
          versions: { streamStore: versions.streamStore.indexOf('+') !== -1 ? 
            versions.streamStore.split('+')[0]: 
            versions.streamStore,
          },
        });
        setStatus('done');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    } 
    fetch();
  }, [halClient]);

  return (
    <div>
      <Hero />
      {
        (status === 'loading') ? <ProgressIndicator /> : null
      }
      {
        (status === 'error') ? <ErrorMessage message="An error occured while retrieving the dashboard information!" /> : null
      }
      {
        status === 'done' && serverInfo ?
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
                  <Typography variant="caption" color="textSecondary" className={classes.normalCaption}>{ serverInfo.provider }</Typography>
                </div>
                <div>
                  <Typography className={classes.fatCaption} variant="caption">Version:</Typography>
                  <Typography variant="caption" color="textSecondary" className={classes.normalCaption}>{ serverInfo.versions.streamStore }</Typography>
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
          </Paper> : null
      }
    </div>
  );
};

export default Dashboard;
