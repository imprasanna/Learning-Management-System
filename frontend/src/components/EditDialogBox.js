import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const EditDialogBox = ({
  open,
  onClose,
  onConfirm,
  setSelectedEditRow,
  studentData,
}) => {
  const [marks, setMarks] = useState(studentData?.marks || "");
  const [marksError, setMarksError] = useState(false);

  const handleMarksChange = (event) => {
    const value = event.target.value;
    if (value !== "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setMarks(value);
      setMarksError(false);
    } else {
      setMarksError(true);
    }
  };

  const handleConfirm = () => {
    if (marks < 0 || marks > 100) {
      setMarksError(true);
      return;
    }
    const updatedRow = { ...studentData, marks: Number(marks) };
    setSelectedEditRow(updatedRow);  // Update the row in the parent
    onConfirm(updatedRow);
  };

  useEffect(() => {
    setMarks(studentData?.marks || "");
  }, [studentData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Result</DialogTitle>
      <DialogContent>
        <DialogContentText>Edit the marks below. Name and Roll Number are not editable.</DialogContentText>
        
        <TextField
          label="Name"
          value={studentData?.name || ""}
          fullWidth
          disabled
          margin="normal"
        />

        <TextField
          label="Roll Number"
          value={studentData?.rollNum || ""}
          fullWidth
          disabled
          margin="normal"
        />

        <TextField
          label="Marks"
          type="number"
          value={marks}
          onChange={handleMarksChange}
          fullWidth
          margin="normal"
          error={marksError}
          helperText={marksError ? "Marks must be between 0 and 100" : ""}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialogBox;
