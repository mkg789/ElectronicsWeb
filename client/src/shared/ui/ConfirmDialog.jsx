import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
