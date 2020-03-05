import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Searchbar from '../components/Searchbar/searchbar';
import IconButton from '@material-ui/core/IconButton';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

interface Stream {
  messageId: string;
  createdUtc: string;
  streamVersion: string;
  streamId: string;
  type: string;
  position: number
}

const useStyles = makeStyles({
  root: {
    padding: 10,
  },
  searchContainer: {
    padding: '10px 0',
  },
  tableHeader: {
    padding: 10,
  },
  actionColumn: {
    width: 30,
  }
});

const Streams = () => {
  const classes = useStyles();

  const [streams, updateStreams] = useState<Array<Stream>>([]);
  useEffect(() => {
    async function retrieveStreams() {
      const resp = await fetch('/api/streams');
      const streams = await resp.json();
      console.log(streams);
      updateStreams(streams);
    }
    retrieveStreams();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Searchbar />  
      </div>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="streams table" size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.actionColumn}></TableCell>
              <TableCell>Created UTC</TableCell>
              <TableCell>Stream ID</TableCell>
              <TableCell>Message ID</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {streams.map(s => (
              <TableRow key={s.messageId}>
                <TableCell component="th" scope="row" className={classes.actionColumn}>
                <IconButton
                  aria-label="open stream"
                >
                  <OpenInBrowserIcon />
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(s.createdUtc).toLocaleString()}
                </TableCell>
                <TableCell>{s.streamId}</TableCell>
                <TableCell>{s.messageId}</TableCell>
                <TableCell>{s.streamVersion}</TableCell>
                <TableCell>{s.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Streams;
