import React from 'react';
import { Alert, AlertTitle, Color } from '@material-ui/lab';

interface Props {
  title?: string;
  message: string;
  severity: Color;
}

const ErrorMessage = (props: Props) => {
  return (
    <Alert severity={props.severity}>
      <AlertTitle>{ props.title || 'Error' }</AlertTitle>
      <p>{ props.message }</p>
    </Alert>
  );
};

export default ErrorMessage;
