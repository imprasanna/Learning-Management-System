import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Paper, Box, IconButton } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllNotices,
  deleteNotice,
} from "../../../redux/noticeRelated/noticeHandle";
import TableTemplate from "../../../components/TableTemplate";
import { GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice
  );
  const { currentUser } = useSelector((state) => state.user);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const openConfirmDialog = (id) => {
    setDeleteID(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteID(null);
  };

  const confirmDelete = async () => {
    if (deleteID) {
      try {
        await dispatch(deleteNotice(deleteID));
        setMessage("Notice deleted successfully.");
        dispatch(getAllNotices(currentUser._id, "Notice"));
      } catch (err) {
        setMessage("Failed to delete notice. Please try again.");
        console.error(err);
      } finally {
        setConfirmDialogOpen(false);
      }
    }
  };

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows =
    noticesList &&
    noticesList.length > 0 &&
    noticesList.map((notice) => {
      const date = new Date(notice.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toISOString().substring(0, 10)
          : "Invalid Date";
      return {
        title: notice.title,
        details: notice.details,
        date: dateString,
        id: notice._id,
      };
    });

  const NoticeButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => openConfirmDialog(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    );
  };

  const actions = [
    {
      icon: <NoteAddIcon color="primary" />,
      name: "Add New Notice",
      action: () => navigate("/Admin/addnotice"),
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
                onClick={() => navigate("/Admin/addnotice")}
              >
                Add Notice
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {Array.isArray(noticesList) && noticesList.length > 0 && (
                <TableTemplate
                  buttonHaver={NoticeButtonHaver}
                  columns={noticeColumns}
                  rows={noticeRows}
                />
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
        </>
      )}

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this notice? This action cannot be undone."
      />
    </>
  );
};

export default ShowNotices;
