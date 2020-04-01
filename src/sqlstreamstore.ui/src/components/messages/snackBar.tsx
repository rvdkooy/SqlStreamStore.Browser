import React from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

interface SnackbarProps {
  open: boolean;
  message: string;
  severity: Color;
  onClose: () => void;
}

export interface SnackbarMessage {
  message: string;
  severity: Color;
};

const SnackBar = (props: SnackbarProps) => {
  return (
    <Snackbar
      onClose={props.onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={props.open}
      autoHideDuration={6000}
    >
      <Alert elevation={6} variant="filled" severity={props.severity} onClose={props.onClose}>
        { props.message }
      </Alert>
      
    </Snackbar>
  );
};

export default SnackBar;

let _snackbarListeners: Array<(message: SnackbarMessage) => void> = [];

export const listenOnMessages = (cb: (message: SnackbarMessage) => void) => {
  _snackbarListeners.push(cb);
};

export const listenOffMessages = (cb: (message: SnackbarMessage) => void) => {
  _snackbarListeners = _snackbarListeners.filter(l => l !== cb);
};

export const triggerMessage = (message: SnackbarMessage) => {
  _snackbarListeners.forEach(l => l(message));
};
