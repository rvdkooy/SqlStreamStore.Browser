import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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
import usePrevious from '../hooks/usePrevious';
import { HalResource } from 'hal-rest-client';
import Modal from '../modal/modal';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  search: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    flex: '0 0 600px',
    maxWidth: '600px',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

interface Props {
  halLinks: { [key: string]: HalResource };
  fromPosition: string;
  onDelete: () => void;
}

export default function SearchBar(props: Props) {
  const classes = useStyles();
  const history = useHistory();
  const [showSearchInputField, setShowSearchInputField] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const params = useParams<{ streamId: string }>();
  const prevStreamId = usePrevious(params.streamId);

  useEffect(() => {
    if (params.streamId && !showSearchInputField) {
      setSearchString(params.streamId);
      setShowSearchInputField(true);
    }
    if ((prevStreamId && !params.streamId) && showSearchInputField) {
      setSearchString('');
      setShowSearchInputField(false);
    }
  }, [params.streamId, showSearchInputField, prevStreamId])

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const onShowSearchClicked = () => {
    setShowSearchInputField(true);
  };

  const onSearchSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    history.push(props.halLinks['streamStore:find'].uri.fill({ streamId: searchString }));
  };

  const onCloseSearchClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSearchString('');
    setShowSearchInputField(false);
    history.push('/stream'); // TODO: we lost the link to the all streams from here
  };

  return (
    <div>
      {
        (showSearchInputField) ?
          <div className={classes.root}>
            <Paper data-testid="search-container" component="form" className={classes.search} onSubmit={onSearchSubmit}>
              <IconButton
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                value={searchString}
                className={classes.input}
                placeholder="Search for stream id"
                inputProps={{ 'aria-label': 'Search for stream id' }}
                onChange={onSearchChange}
              />
              <IconButton
                onClick={onCloseSearchClicked}
                data-testid="close-search-button"
                aria-label="close search"
                title="Close search"
              >
                <ClearIcon />
              </IconButton>
            </Paper>
            {
              (params.streamId) ? 
                <Button
                  data-testid="delete-stream-button"
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => setOpenDeleteModal(true)}
                >
                  Delete stream
                </Button> : null
            }
          </div>
          :
          <div className={classes.search}>
            <IconButton
              data-testid="open-search-button"
              onClick={onShowSearchClicked}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem />

            <IconButton
              onClick={() => { }}
              disabled={!props.halLinks.first}
              aria-label="first page"
              data-testid="first-page-button"
              component={Link}
              to={props.halLinks.first ? props.halLinks.first.uri.uri : '#'}
              title="First page"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={() => { }}
              disabled={!props.halLinks.previous}
              aria-label="previous page"
              data-testid="previous-page-button"
              component={Link}
              to={props.halLinks.previous ? props.halLinks.previous.uri.uri : '#'}
              title="Previous page"
            >
              <KeyboardArrowLeft />
            </IconButton>
            <Typography>{`from position ${props.fromPosition}`}</Typography>
            <IconButton
              onClick={() => { }}
              disabled={!props.halLinks.next}
              aria-label="next page"
              data-testid="next-page-button"
              component={Link}
              to={props.halLinks.next ? props.halLinks.next.uri.uri : '#'}
              title="Next page"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={() => { }}
              disabled={!props.halLinks.last}
              aria-label="last page"
              data-testid="last-page-button"
              component={Link}
              to={props.halLinks.last ? props.halLinks.last.uri.uri : '#'}
              title="Last page"
            >
              <LastPageIcon />
            </IconButton>
          </div>
      }
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Are you absolutely sure?"
      >
        <div>This action cannot be undone. This will permanently delete this stream.</div>
      </Modal>
    </div>
  );
}
