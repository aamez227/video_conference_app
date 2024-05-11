import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Participant from '../pages/participant/Participant';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import makeRequest from '../axios';
import { toastNotification } from '../utils/toast';

interface JoinConferenceFormProps {
  sessionId: string;
  onClose: () => void;
}

const JoinConferenceForm: React.FC<JoinConferenceFormProps> = ({ sessionId, onClose }) => {
  const [open, setOpen] = React.useState(true);
  const [name, setName] = useLocalStorage<string>('participantName', '');
  const mutationKey = ['session']
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const mutation = useMutation({
    mutationKey,
    mutationFn: (requestBody: any) => {
      return makeRequest.post('sessions/join', requestBody)
    },
    onSuccess: (data: any) => {
      const result = data.data;
      if (result && result.participantId) {
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
      }
      return result;
    },
    onError: (error: any) => {
      toastNotification(error.response?.data.message, 'error');
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const enteredName = formJson.name;
    const requestBody =
    {
      "sessionId": sessionId,
      "name": enteredName
    }
    try {
      const response = await mutation.mutateAsync(requestBody);
      const result = response.data;
      if (result && result.participantId) {
        toastNotification(result.message, 'info');
        setName(enteredName);
        handleClose();
      }
    } catch (error:any) {
      toastNotification(error.response.data.message, 'error');
    }
    
  };

  if (name) {
    return <Participant />;
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Please enter your name!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Full name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Join</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default JoinConferenceForm;
