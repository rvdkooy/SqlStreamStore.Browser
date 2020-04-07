import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { FirstPage, LastPage, KeyboardArrowLeft,
  KeyboardArrowRight, Search, Clear, Delete } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import usePrevious from '../../components/hooks/usePrevious';
import { HalResource } from 'hal-rest-client';
import ConfirmDeleteModal from './confirmDelete';
import { triggerMessage } from '../../components/messages/snackBar';

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
  halState: HalResource;
}

export default function SearchBar(props: Props) {
  const { halState } = props;
  const classes = useStyles();
  const history = useHistory();
  const [showSearchInputField, updateShowSearchInputField] = useState(false);
  const [searchString, updateSearchString] = useState('');
  const [openDeleteModal, updateOpenDeleteModal] = useState(false);
  const params = useParams<{ streamId: string }>();
  const prevStreamId = usePrevious(params.streamId);

  useEffect(() => {
    if (params.streamId && !showSearchInputField) {
      updateSearchString(params.streamId);
      updateShowSearchInputField(true);
    }
    if ((prevStreamId && !params.streamId) && showSearchInputField) {
      updateSearchString('');
      updateShowSearchInputField(false);
    }
  }, [params.streamId, showSearchInputField, prevStreamId])

  const onSearchSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    history.push(halState.link('streamStore:find').uri.fill({ streamId: searchString }));
  };

  const onCloseSearchClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateSearchString('');
    updateShowSearchInputField(false);
    history.push('/stream'); // TODO: we lost the link to the all streams from here
  };

  const onConfirmDelete = async () => {
    try {
      await halState.delete();
      history.push('/stream');
      triggerMessage({
        message: 'Successfully deleted the stream',
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      history.push('/stream');
      triggerMessage({
        message: 'Couldn\'t delete the stream',
        severity: "error",
      });
    }
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
                <Search />
              </IconButton>
              <InputBase
                value={searchString}
                className={classes.input}
                placeholder="Search for stream id"
                inputProps={{ 'aria-label': 'Search for stream id' }}
                onChange={(e) => updateSearchString(e.target.value)}
              />
              <IconButton
                onClick={onCloseSearchClicked}
                data-testid="close-search-button"
                aria-label="close search"
                title="Close search"
              >
                <Clear />
              </IconButton>
            </Paper>
            {
              (halState.prop('streamStore:delete-stream')) ? 
                <Button
                  data-testid="delete-stream-button"
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => updateOpenDeleteModal(true)}
                  startIcon={<Delete />}  
                >
                  Delete stream
                </Button> : null
            }
          </div>
          :
          <div className={classes.search}>
            <IconButton
              data-testid="open-search-button"
              onClick={() => updateShowSearchInputField(true)}
              aria-label="search"
            >
              <Search />
            </IconButton>

            <Divider orientation="vertical" flexItem />

            <IconButton
              disabled={!halState.link('first')}
              aria-label="first page"
              data-testid="first-page-button"
              component={Link}
              to={halState.link('first') ? halState.link('first').uri.uri : '#'}
              title="First page"
            >
              <FirstPage />
            </IconButton>
            <IconButton
              disabled={!halState.link('previous')}
              aria-label="previous page"
              data-testid="previous-page-button"
              component={Link}
              to={halState.link('previous') ? halState.link('previous').uri.uri : '#'}
              title="Previous page"
            >
              <KeyboardArrowLeft />
            </IconButton>
            <Typography>{`from position ${props.halState.prop('fromPosition')}`}</Typography>
            <IconButton
              disabled={!halState.link('next')}
              aria-label="next page"
              data-testid="next-page-button"
              component={Link}
              to={halState.link('next') ? halState.link('next').uri.uri : '#'}
              title="Next page"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              disabled={!halState.link('last')}
              aria-label="last page"
              data-testid="last-page-button"
              component={Link}
              to={halState.link('last') ? halState.link('last').uri.uri : '#'}
              title="Last page"
            >
              <LastPage />
            </IconButton>
          </div>
      }
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => updateOpenDeleteModal(false)}
        onConfirm={onConfirmDelete}
      >
        <span>This action cannot be undone. This will permanently delete the stream.</span>
      </ConfirmDeleteModal>
    </div>
  );
}
