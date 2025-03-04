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

  const [resources, setResources] = useState([
    [""], // Group A
    [""], // Group B
    [""], // Group C
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (groupIndex, itemIndex, value) => {
    const updatedResources = [...resources];
    updatedResources[groupIndex][itemIndex] = value;
    setResources(updatedResources);
  };

  // Handle adding more references
  const handleAddMore = (groupIndex) => {
    if (resources[groupIndex].length < 3) {
      const updatedResources = [...resources];
      updatedResources[groupIndex].push("");
      setResources(updatedResources);
    }
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
      setResources([[""], [""], [""]]); // Clear input fields after submission
      onClose();
    } catch (error) {
      console.error("Error adding references:", error);
      setMessage("Failed to add references. Please try again.");
      setShowPopup(true);
    }
  };

  // Handle closing the dialog
  const handleClose = () => {
    setResources([[""], [""], [""]]); // Clear input fields on cancel
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
            (label, groupIndex) => (
              <Box key={groupIndex} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {label}
                </Typography>
                {resources[groupIndex].map((value, itemIndex) => (
                  <TextField
                    key={itemIndex}
                    fullWidth
                    label={`Reference ${itemIndex + 1}`}
                    variant="outlined"
                    value={value}
                    onChange={(e) =>
                      handleChange(groupIndex, itemIndex, e.target.value)
                    }
                    margin="dense"
                  />
                ))}
                <Button
                  onClick={() => handleAddMore(groupIndex)}
                  disabled={resources[groupIndex].length >= 3}
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Add More
                </Button>
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
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default EditReferencesDialog;
