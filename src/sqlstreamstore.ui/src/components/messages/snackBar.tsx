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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={props.open}
      autoHideDuration={5000}
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

export const triggerSuccessMessage = (message: string) => {
  _snackbarListeners.forEach(l => l({ message, severity: 'success' }));
};
  
export const triggerErrorMessage = (message: string) => {
  _snackbarListeners.forEach(l => l({ message, severity: 'error' }));
};
