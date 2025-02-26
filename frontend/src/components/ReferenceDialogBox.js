import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import Popup from "./Popup";

const EditReferencesDialog = ({ open, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const teacherId = currentUser?._id;

  const [resources, setResources] = useState(["", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (index, value) => {
    const updatedResources = [...resources];
    updatedResources[index] = value;
    setResources(updatedResources);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:4000/addreferences", {
        teacherId,
        resources,
      });

      setMessage("Done Successfully");
      setShowPopup(true);
      setResources(["", "", ""]); // Clear input fields after submission
      onClose();
    } catch (error) {
      console.error("Error adding references:", error);
      setMessage("Failed to add references. Please try again.");
      setShowPopup(true);
    }
  };

  // Handle closing the dialog (clears input fields)
  const handleClose = () => {
    setResources(["", "", ""]); // Clear input fields on cancel
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Edit References
        </DialogTitle>
        <DialogContent>
          {["Group A (Good)", "Group B (Average)", "Group C (Poor)"].map(
            (label, index) => (
              <Box key={index} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  label="Reference"
                  variant="outlined"
                  value={resources[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  margin="dense"
                />
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save References
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Component for Success/Error Message */}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default EditReferencesDialog;
