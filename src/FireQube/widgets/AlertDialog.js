import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  //setOpen(props.openFlag);  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props.openFlag}
        onClose={props.closeHandle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <p style={{fontweight:'bold'}}>{props.title}</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>{props.msg}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.okHandle} autoFocus>
            OK
          </Button>
          <Button onClick={props.closeHandle}>Cancel</Button>
        </DialogActions>
      </Dialog>     
    </div>
  );
}