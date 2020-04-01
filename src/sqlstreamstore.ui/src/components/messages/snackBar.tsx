import React from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

interface Props {
  open: boolean;
  message: string;
  severity: Color;
}

const SnackBar = (props: Props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={props.open} autoHideDuration={6000}
    >
      <Alert severity={props.severity}>
        { props.message }
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
