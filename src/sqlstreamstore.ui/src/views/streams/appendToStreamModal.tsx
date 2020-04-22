import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Message from '../../components/messages/message';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (type: string, jsonData: string) => void;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

const isValidJson = (input: string) => {
  try {
    JSON.parse(input);
  } catch (e) {
    return false;
  }
  return true;
}


const AppendToStreamModal = (props: Props) => {
  const classes = useStyles();
  const [ type, updateType ] = useState('');
  const [ jsonData, updateJsonData ] = useState('');
  const [ jsonValid, updateJsonValid ] = useState(true);

  const onUpdateJsonData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!jsonValid) {
      const valid = isValidJson(e.target.value);
      updateJsonValid(valid);
    }
    updateJsonData(e.target.value);
  };

  const onSubmit = () => {
    const valid = isValidJson(jsonData);
    updateJsonValid(valid);
    if (valid) {
      props.onSubmit(type, jsonData);
    }
  };

  const canSubmit = !!type && !!jsonData;

  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Append message to stream</DialogTitle>
      <DialogContent>
        <div>
          <TextField
           className={classes.formControl}
            autoFocus
            variant="outlined"
            id="type"
            name="type"
            label="Type"
            type="text"
            value={type}
            onChange={(e) => updateType(e.target.value)}
            fullWidth
          />
          <TextField
            className={classes.formControl}
            id="jsondata"
            name="jsondata"
            label="JSON data"
            multiline
            rows={8}
            value={jsonData}
            onChange={onUpdateJsonData}
            variant="outlined"
          />
          {
            (!jsonValid) ? <Message severity="warning" message="Invalid json" /> : null
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
          </Button>
        <Button
          data-testid="submit-button"
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={!canSubmit}
        >
          Append
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppendToStreamModal;
