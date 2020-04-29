import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import CommandBar from './commandBar';
import ProgressIndicator from '../../components/progressIndicator';
import { makeStyles } from '@material-ui/core';
import ErrorMessage from '../../components/messages/message';
import StreamsTable from './table';
import MessageDrawer from './drawer';
import { HalResource } from 'hal-rest-client';
import usePrevious from '../../components/hooks/usePrevious';
import ConfirmDeleteModal from './confirmDelete';
import AppendToStreamModal from './appendToStreamModal';
import { getHalClient } from '../../services/hal';
import { triggerSuccessMessage, triggerErrorMessage } from '../../components/messages/snackBar';
import { v4 } from 'uuid';

interface State {
  openDeleteModal: boolean;
  openAppendModal: boolean,
  halState?: HalResource,
  messages: HalResource[],
  status: string,
}

const useStyles = makeStyles({
  root: {
    padding: 10,
  },
  searchContainer: {
    padding: '10px 0',
  },
});

const StreamsView = () => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState<State>({
    openDeleteModal: false,
    openAppendModal: false,
    halState: undefined,
    messages: [],
    status: 'loading',
  });
  const params = useParams<{ streamId: string, version: string }>();
  const previousStreamId = usePrevious(params.streamId);
  const previousVersion = usePrevious(params.version);
  const routeMatch = useRouteMatch();
  const queryStrings = useLocation().search;

  const retrieveStreams = useCallback(async () => {
    try {
      const halClient = getHalClient();
      setState((prevState) => ({ ...prevState, status: 'loading' }));
      let halResponse = await halClient.fetchResource(`.${routeMatch.url}${queryStrings}`);
      const streamStoreMessages = halResponse.prop('streamStore:message');
      let messages = streamStoreMessages;
      
      if (streamStoreMessages instanceof HalResource) {
        halResponse = await halClient.fetchResource(streamStoreMessages.link('streamStore:feed').uri.uri);
        messages = halResponse.prop('streamStore:message');
      }
      setState((prevState) => ({ ...prevState, halState: halResponse, messages, status: 'done' }));
    } catch (err) {
      console.error(err);
      setState((prevState) => ({ ...prevState, status: 'error' }));
    }
  }, [routeMatch.url, queryStrings]);

  useEffect(() => {
    if (!params.streamId || params.streamId !== previousStreamId) {
      retrieveStreams();
    }
    if (previousVersion && !params.version) {
      retrieveStreams();
    }
  }, [params.streamId, previousStreamId, previousVersion, params.version, retrieveStreams ]);

  const onDrawerClose = () => {
    if (state.halState) {
      history.push('../' + state.halState.link('streamStore:feed').uri.uri);
    }
  };

  const onConfirmDelete = async () => {
    try {
      if (state.halState) {
        await state.halState.delete();
        setState({ ...state, openDeleteModal: false });
        history.push('/stream');
        triggerSuccessMessage('Successfully deleted the stream');
      }
    } catch (err) {
      console.error(err);
      history.push('/stream');
      triggerErrorMessage('Couldn\'t delete the stream');
    }
  };

  const onConfirmSubmit = async (type: string, jsonData: string) => {
    try {
      if (state.halState) {
        const halClient = getHalClient();
        await halClient.create(state.halState.uri.uri, {
          messageId: v4(),
          type,
          jsonData: JSON.parse(jsonData),
        });
        setState({ ...state, openAppendModal: false });
        triggerSuccessMessage('Successfully appended a message to the stream');
      }
    } catch (err) {
      console.error(err);
      triggerErrorMessage('Couldn\'t append a message the to stream');
    }
  };
  
  return (
    <div className={classes.root}>
      {
        (state.status === 'loading') ? <ProgressIndicator /> : null
      }
      {
        (state.status === 'error') ? <ErrorMessage severity="error" message="An error occured while retrieving streams" /> : null
      }
      {
        (state.status === 'done' && state.halState) ?
          <div>
            <div className={classes.searchContainer}>
              <CommandBar
                halState={state.halState}
                onDeleteStream={() => setState({ ...state, openDeleteModal: true })}
                onAppendStream={() => setState({ ...state, openAppendModal: true })}
              />
            </div>
            <StreamsTable streams={state.messages} />
            <MessageDrawer
              onClose={onDrawerClose}
              version={params.version}
            />
            <ConfirmDeleteModal
              open={state.openDeleteModal}
              onClose={() => setState({ ...state, openDeleteModal: false })}
              onConfirm={onConfirmDelete}
            >
              <span>This action cannot be undone. This will permanently delete the stream.</span>
            </ConfirmDeleteModal>
            <AppendToStreamModal
              open={state.openAppendModal}
              onClose={() => setState({ ...state, openAppendModal: false })}
              onSubmit={onConfirmSubmit}
            />
          </div> : null
      }
    </div>
  );
};

export default StreamsView;
