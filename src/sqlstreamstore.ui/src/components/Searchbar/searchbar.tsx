import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    maxWidth: '600px',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: '0 10px',
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

interface Props {
  onSearchStreamId: (streamId: string) => void;
}

export default function CustomizedInputBase(props: Props) {
  const classes = useStyles();
  const [showSearchInputField, setShowSearchInputField] = useState(false);
  return (
    <div>
      {
        (showSearchInputField) ?
          <Paper component="form" className={classes.root}>
            <IconButton
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="Search for stream id"
              inputProps={{ 'aria-label': 'Search for stream id' }}
              onChange={(e) => props.onSearchStreamId(e.target.value)}
            />
            <IconButton
              onClick={() => setShowSearchInputField(false)}
              className={classes.iconButton}
              aria-label="close search"
            >
              <ClearIcon />
            </IconButton>
          </Paper>
          :
          <div className={classes.root}>

            <IconButton
              onClick={() => setShowSearchInputField(true)}
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem />

            <IconButton
              onClick={() =>{}}
              disabled={false}
              aria-label="first page"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={() =>{}}
              disabled={false}
              aria-label="previous page"
            >
              <KeyboardArrowLeft />
            </IconButton>
            <Typography>page 1</Typography>
            <IconButton
              onClick={() =>{}}
              disabled={false}
              aria-label="next page"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={() =>{}}
              disabled={false}
              aria-label="last page"
            >
              <LastPageIcon />
            </IconButton>
          </div>
      }
    </div>
  );
}