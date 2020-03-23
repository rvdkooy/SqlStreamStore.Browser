import React from 'react';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import FilterList from '@material-ui/icons/FilterList';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import { makeStyles, Typography } from '@material-ui/core';
import { HalResource } from 'hal-rest-client';

interface Props {
  streams: HalResource[];
}

const useStyles = makeStyles((theme) => ({
  linkIcon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
  link: {
    marginRight: 20,
  },
  noResults: {
    padding: '40px 0',
    display: 'flex',
    justifyContent: 'center',
  },
  noResultsIcon: {
    marginRight: theme.spacing(1),
  }
}));

const StreamsTable = (props: Props) => {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="streams table">
        <TableHead>
          <TableRow>
            <TableCell>Created UTC</TableCell>
            <TableCell>Stream ID</TableCell>
            <TableCell>Message ID</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Position</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.streams.map(halRes => (
            <TableRow key={halRes.prop('messageId')}>
              <TableCell component="th" scope="row">
                {new Date(halRes.prop('createdUtc')).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link className={classes.link} to={halRes.link('streamStore:feed').uri.uri}>
                  <FilterList className={classes.linkIcon} /> Filter</Link>
                  {halRes.prop('streamId')}
              </TableCell>
              <TableCell>
                <Link className={classes.link} to={halRes.link('streamStore:message').uri.uri}>
                  <FormatListBulletedOutlinedIcon className={classes.linkIcon} />Open
                </Link>
                {halRes.prop('messageId')}
              </TableCell>
              <TableCell>{halRes.prop('streamVersion')}</TableCell>
              <TableCell>{halRes.prop('position')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        (!props.streams.length) ? 
          <div className={classes.noResults}>
            <SentimentDissatisfiedIcon className={classes.noResultsIcon} />
            <Typography>No results...</Typography>
          </div> : null
      }
      
    </TableContainer>
  )
};

export default StreamsTable;
