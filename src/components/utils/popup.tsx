import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useEffect, useState } from "react";
import styles from './popup.module.scss';

export interface PopupProps {
  title?: string
  msg: string | undefined;
  variant: "error" | "info"
  onClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined
}

const Popup = ({ title = 'Error', msg, variant, onClose }: PopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(Boolean(msg));
  }, [msg]);

  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    setIsOpen(false);
    if (onClose) onClose(event, reason);
  }

  return (
    <Dialog classes={{ paper: styles.container }} open={isOpen} onClose={handleClose} transitionDuration={{ exit: 0 }}>
      <DialogTitle disableTypography className={styles.title}>{title}</DialogTitle>
      <div className={styles.msg + (variant === 'error' ? ' ' + styles.error : '')}>{msg}</div>
    </Dialog>
  );
};

export default Popup;
