import React from 'react';
import { Alert, AlertTitle, Color } from '@material-ui/lab';

interface Props {
  message: string;
  severity: Color;
}

const ErrorMessage = (props: Props) => {
  return (
    <Alert severity={props.severity}>
      <AlertTitle>Error</AlertTitle>
      <p>{ props.message }</p>
    </Alert>
  );
};

export default ErrorMessage;
