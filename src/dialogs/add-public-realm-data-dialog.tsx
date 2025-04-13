import { Dialog, DialogContent, DialogTitle, TextField, Button, DialogActions } from "@mui/material"
import { useState } from "react"
import { NewPublicRealmNote } from "~/types/public-realm-data/public-realm-note-db";


interface AddPublicRealmDataDialogProps {
  onNewDataItemCreated: (dataItem: NewPublicRealmNote) => void; 
  onClose: () => void 
}


export const AddPublicRealmDataDialog = ({ onClose, onNewDataItemCreated }: AddPublicRealmDataDialogProps) => {
  const [text, setText] = useState("")


  const onSubmit = async (dataItem: NewPublicRealmNote) => {
    onNewDataItemCreated(dataItem);
    onClose();
  };


  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add Public Realm Data</DialogTitle>
      <DialogContent style={{ paddingTop: '16px' }}>
        <TextField
          label="Notes"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => { onSubmit({ text, }); setText(""); }}
        >
          Add Data
        </Button>
      </DialogActions>
    </Dialog>
  )
}