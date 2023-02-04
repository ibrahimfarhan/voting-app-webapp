import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ShowFirstChild from './show-first-child';
import { isPromise } from '../../utils/utils';

interface TriggerProps {
  open: () => void;
  close: () => void;
};

export interface ConfirmationDialogProps {
  title: string;
  message?: string;
  acceptText?: string;
  cancelText?: string;
  action: <T>() => any | Promise<T>;
  renderTrigger: React.FC<TriggerProps>;
  onSuccess?: (data: any) => any;
  onError?: (error: Error) => any;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title, message, acceptText, cancelText, renderTrigger: Trigger, action, onSuccess, onError
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAcceptance = () => {
    const actionReturn = action();
    if (!isPromise(actionReturn)) return handleClose();
    setLoading(true);
    actionReturn
      .then((data: any) => {
        onSuccess && onSuccess(data);
      })
      .catch((error: Error) => {
        onError && onError(error);
      })
      .finally(() => { setLoading(false); handleClose(); });
  };

  return (
    <>
      <Trigger open={handleClickOpen} close={handleClose} />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={loading}
        disableBackdropClick={loading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        {message && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained" disabled={loading}>
            {cancelText ?? 'Cancel'}
          </Button>
          <Button onClick={handleAcceptance} color="primary" variant="contained" autoFocus disabled={loading}>
            <ShowFirstChild inCase={loading}>
              <CircularProgress size={20} />
              <>{acceptText ?? 'Yes'}</>
            </ShowFirstChild>
            {loading}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
