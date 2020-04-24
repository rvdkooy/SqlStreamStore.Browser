import React, { useState, useEffect,useCallback } from 'react';
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
import useHalClient from '../../components/hooks/useHalClient';
import { triggerMessage } from '../../components/messages/snackBar';
import { v4 } from 'uuid';

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
  const params = useParams<{ streamId: string, version: string }>();
  const [openDeleteModal, updateOpenDeleteModal] = useState(false);
  const [openAppendModal, updateOpenAppendModal] = useState(false);
  const [halState, updateHalState] = useState<HalResource>();
  const [messages, updateMessages] = useState<HalResource[]>([]);
  const [status, updateStatus] = useState('loading');
  const previousStreamId = usePrevious(params.streamId);
  const halClient = useHalClient();
  const routeMatch = useRouteMatch();
  const queryStrings = useLocation().search;

  
  const retrieveStreams = useCallback(async () => {
    try {
      updateStatus('loading');
      let halResponse = await halClient.fetchResource(`.${routeMatch.url}${queryStrings}`);
      const streamStoreMessage = halResponse.prop('streamStore:message');
      if (streamStoreMessage instanceof HalResource) {
        halResponse = await halClient.fetchResource(streamStoreMessage.link('streamStore:feed').uri.uri);
        updateMessages(halResponse.prop('streamStore:message'));
      } else {
        updateMessages(streamStoreMessage);
      }

      updateHalState(halResponse);
      updateStatus('done');
    } catch (err) {
      console.error(err);
      updateStatus('error');
    }
  }, [routeMatch.url, halClient, queryStrings]);

  useEffect(() => {
    if (!params.streamId || params.streamId !== previousStreamId) {
      retrieveStreams();
    }
  }, [params.streamId, previousStreamId, retrieveStreams]);

  const onDrawerClose = (refresh?: boolean) => {
    if (halState) {
      history.push('../' + halState.link('streamStore:feed').uri.uri);
    }
    if (refresh) {
      retrieveStreams();
    }
  };

  const onConfirmDelete = async () => {
    try {
      if (halState) {
        await halState.delete();
        updateOpenDeleteModal(false);
        history.push('/stream');
        triggerMessage({
          message: 'Successfully deleted the stream',
          severity: "success",
        });
      }
    } catch (err) {
      console.error(err);
      history.push('/stream');
      triggerMessage({
        message: 'Couldn\'t delete the stream',
        severity: "error",
      });
    }
  };

  const onConfirmSubmit = async (type: string, jsonData: string) => {
    try {
      if (halState) {
        await halClient.create(halState.uri.uri, {
          messageId: v4(),
          type,
          jsonData: JSON.parse(jsonData),
        });
        updateOpenAppendModal(false);
        triggerMessage({
          message: 'Successfully appended a message to the stream',
          severity: "success",
        });
      }
    } catch (err) {
      console.error(err);
      triggerMessage({
        message: 'Couldn\'t append a message the to stream',
        severity: "error",
      });
    }
  };
  
  return (
    <div className={classes.root}>
      {
        (status === 'loading') ? <ProgressIndicator /> : null
      }
      {
        (status === 'error') ? <ErrorMessage severity="error" message="An error occured while retrieving streams" /> : null
      }
      {
        (status === 'done' && halState) ?
          <div>
            <div className={classes.searchContainer}>
              <CommandBar
                halState={halState}
                onDeleteStream={() => updateOpenDeleteModal(true)}
                onAppendStream={() => updateOpenAppendModal(true)}
              />
            </div>
            <StreamsTable streams={messages} />
            <MessageDrawer
              onClose={onDrawerClose}
              version={params.version}
            />
            <ConfirmDeleteModal
              open={openDeleteModal}
              onClose={() => updateOpenDeleteModal(false)}
              onConfirm={onConfirmDelete}
            >
              <span>This action cannot be undone. This will permanently delete the stream.</span>
            </ConfirmDeleteModal>
            <AppendToStreamModal
              open={openAppendModal}
              onClose={() => updateOpenAppendModal(false)}
              onSubmit={onConfirmSubmit}
            />
          </div> : null
      }
    </div>
  );
};

export default StreamsView;
