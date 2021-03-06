import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: JSX.Element | JSX.Element[];
}

const ConfirmDelete = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Are you absolutely sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { props.children }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
          </Button>
        <Button data-testid="confirm-button" onClick={props.onConfirm} variant="contained" color="secondary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
