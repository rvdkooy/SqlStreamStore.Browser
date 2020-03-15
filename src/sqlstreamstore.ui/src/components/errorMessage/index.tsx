import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

const ErrorMessage = (props: { message: string }) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      <p>{ props.message }</p>
    </Alert>
  );
};

export default ErrorMessage;
