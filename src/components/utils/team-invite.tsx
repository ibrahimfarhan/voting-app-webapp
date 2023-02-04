import { Button, Dialog, DialogTitle, IconButton, withStyles } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import useCombinedState from '../../hooks/use-combined-state';
import CheckIcon from '@material-ui/icons/CheckCircle';
import styles from './team-invite.module.scss';
import { useEffect } from 'react';

const TeamInvite = ({ invitePromise }: { invitePromise: Promise<any> | null }) => {

  const [{ inviteLink, inviteLinkErr, dialogIsOpen, copied }, setState] = useCombinedState<any>({
    inviteLink: '',
    inviteLinkErr: '',
    dialogIsOpen: false,
    copied: false
  });

  useEffect(() => {
    if (!invitePromise) return;
    invitePromise.then(res => setState({
      inviteLink: `${window.location.origin}/team/join/${res.token}`,
      inviteLinkErr: '',
      dialogIsOpen: true,
      copied: false
    }))
      .catch(err => setState({ inviteLinkErr: err.message, inviteLink: '', dialogIsOpen: true, copied: false }));
  }, [invitePromise]);

  const handleDialogClose = () => {
    setState({ dialogIsOpen: false });
  }

  const handleCopy = inviteLink ? () => {
    navigator.clipboard.writeText(inviteLink);
    setState({ copied: true });
    setTimeout(() => setState({ copied: false }), 2000);
  } : undefined;

  return (
    <Dialog open={dialogIsOpen} onClose={handleDialogClose}>
      <DialogTitle>
        <div className={styles['invite-title']}>
          <strong>Copy Invitation Link</strong>
          <IconButton
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? <CheckIcon color="primary" /> : <FileCopyIcon />}
          </IconButton>
        </div>
      </DialogTitle>
      <div className={styles['invite-link']}>{inviteLink || inviteLinkErr}</div>
    </Dialog>
  )
}

export default TeamInvite
