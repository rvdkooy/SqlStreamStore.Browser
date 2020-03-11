import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FilterList from '@material-ui/icons/FilterList';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import { makeStyles } from '@material-ui/core';
import { StreamResponse } from '../../services/streamsApi';

interface Props {
  streams: StreamResponse[];
}

const useStyles = makeStyles({
  linkIcon: {
    verticalAlign: 'middle',
    marginRight: 4,
  },
  link: {
    marginRight: 20,
  },
});

const StreamsTable = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();

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
          {props.streams.map(s => (
            <TableRow key={s.messageId}>
              <TableCell component="th" scope="row">
                {new Date(s.createdUtc).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link className={classes.link} to={`/streams/${s.streamId}`}>
                  <FilterList className={classes.linkIcon} /> Filter</Link>
                  {s.streamId}
              </TableCell>
              <TableCell>
                <Link className={classes.link} to={`/streams/${s.streamId}/${s.messageId}`}>
                  <FormatListBulletedOutlinedIcon className={classes.linkIcon} />Open
                </Link>
                {s.messageId}
              </TableCell>
              <TableCell>{s.streamVersion}</TableCell>
              <TableCell>{s.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default StreamsTable;
