import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import usePrevious from '../../components/hooks/usePrevious';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ErrorMessage from '../../components/messages/message';
import ProgressIndicator from '../../components/progressIndicator';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import DeleteButton from '@material-ui/icons/Delete';
import ConfirmDeleteModal from './confirmDelete';
import { triggerMessage } from '../../components/messages/snackBar';
import MessageContent from './messageContent';
import { HalResource } from 'hal-rest-client';
import { getHalClient } from '../../services/hal';

const useStyles = makeStyles((theme) => ({
  content: {
    width: 800,
    padding: theme.spacing(3),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
}));

interface Props {
  onCloseButtonClicked: () => void;
  version?: string;
}

const MessageDrawer = (props: Props) => {
  const classes = useStyles();
  const [status, updateStatus] = useState('loading');
  const [halResource, setHalResource] = useState<HalResource | null>();
  const [openDeleteModal, updateOpenDeleteModal] = useState(false);
  const previousVersion = usePrevious(props.version);
  const halClient = getHalClient();
  const routeMatch = useRouteMatch();

  useEffect(() => {
    if (!props.version && previousVersion) {
      setHalResource(null);
    } else if (previousVersion !== props.version) {
      const retrieveMessage = async () => {
        try {
          updateStatus('loading');
          const fetchHalResponse = await halClient.fetchResource(`.${routeMatch.url}`);
          setHalResource(fetchHalResponse);
          updateStatus('done');
        } catch (err) {
          console.error(err);
          updateStatus('error');
        }
      }
      retrieveMessage();
    }
  }, [props.version, previousVersion, halClient, routeMatch.url]);

  const onConfirmDelete = async () => {
    try {
      if (halResource) {
        await halResource.delete();
        triggerMessage({
          message: 'Successfully deleted the message',
          severity: "success",
        });
        props.onCloseButtonClicked();
      }
    } catch (err) {
      console.error(err);
      triggerMessage({
        message: 'Couldn\'t delete the message',
        severity: "error",
      });
    }
    finally{
      updateOpenDeleteModal(false);
    }
  };

  return (
    <Drawer anchor="right" open={!!props.version} >
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.onCloseButtonClicked}>
          <CloseIcon />
        </IconButton>

        {
          (halResource && halResource.prop('streamStore:delete-message')) ? 
            <Button
              data-testid="delete-message-button"
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => updateOpenDeleteModal(true)}
              startIcon={<DeleteButton />}  
            >
              Delete message
            </Button> : null
        }
      </div>
      <div
        data-testid="drawer-content"
        className={classes.content}
        role="presentation"
      >
        {
          (status === 'done' && halResource) ? <MessageContent halResource={halResource} /> : null
        }
        {
          (status === 'loading') ? <ProgressIndicator /> : null
        }
        {
          (status === 'error') ? <ErrorMessage severity="error" message="An error occured while retrieving the message" /> : null
        }
        <ConfirmDeleteModal
          open={openDeleteModal}
          onClose={() => updateOpenDeleteModal(false)}
          onConfirm={onConfirmDelete}
        >
          <span>This action cannot be undone. This will permanently delete the message.</span>
        </ConfirmDeleteModal>
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
