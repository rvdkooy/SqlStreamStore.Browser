import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

interface Props {
  open: boolean;
  onClose: () =>  void;
  title: string;
  children: JSX.Element | JSX.Element[];
}

const Modal = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{ props.title }</DialogTitle>
      <DialogContent>
        { props.children }
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
          </Button>
        <Button onClick={() => {}} variant="contained" color="secondary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default Modal;
