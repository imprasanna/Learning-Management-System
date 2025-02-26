import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteSubject } from "../../../redux/sclassRelated/sclassHandle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  const openConfirmDialog = (id) => {
    setDeleteID(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteID(null);
  };

  const deleteHandler = async (deleteID) => {
    try {
      await dispatch(deleteSubject(deleteID));
      setMessage("Subject deleted successfully.");
      dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    } catch (err) {
      setMessage("Failed to delete class. Please try again.");
      console.error(err);
    } finally {
      setShowPopup(true);
    }
  };

  const confirmDelete = () => {
    if (deleteID) {
      deleteHandler(deleteID);
    }
    closeConfirmDialog();
  };

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const subjectRows = Array.isArray(subjectsList)
    ? subjectsList.map((subject) => ({
        subName: subject.subName || "N/A",
        sessions: subject.sessions || 0,
        sclassName: subject.sclassName?.sclassName || "N/A",
        sclassID: subject.sclassName?._id || "",
        id: subject._id,
      }))
    : [];

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => openConfirmDialog(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)
          }
        >
          View
        </BlueButton>
      </>
    );
  };

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/subjects/chooseclass")}
              >
                Add Subjects
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                <TableTemplate
                  buttonHaver={SubjectsButtonHaver}
                  columns={subjectColumns}
                  rows={subjectRows}
                />
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this subject? This action cannot be undone."
      />
    </>
  );
};

export default ShowSubjects;
