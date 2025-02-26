import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableTemplate from "../../components/TableTemplate";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import Popup from "../../components/Popup";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const TeacherVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const teacherName = currentUser?._id;

  useEffect(() => {
    if (teacherName) {
      const fetchData = async () => {
        setLoader(true);
        try {
          const response = await axios.post(
            "http://localhost:4000/teacher/video/all",
            { teacherName }
          );
          setVideos(response.data.videos || []);
        } catch (error) {
          console.error("Failed to fetch videos.", error);
        } finally {
          setLoader(false);
        }
      };
      fetchData();
    }
  }, [teacherName]);

  const openConfirmDialog = (id) => {
    setDeleteID(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteID(null);
  };

  const deleteHandler = async () => {
    if (!deleteID) return;

    try {
      await axios.post("http://localhost:4000/teacher/video/delete", {
        teacherName,
        chapterId: deleteID,
      });

      setVideos((prevVideos) =>
        prevVideos.filter((video) => video._id !== deleteID)
      );
      setMessage("Video deleted successfully.");
    } catch (err) {
      setMessage("Failed to delete video. Please try again.");
    } finally {
      setShowPopup(true);
      closeConfirmDialog();
    }
  };

  const handleVideoClick = (url) => {
    setVideoUrl(url);
    setOpenVideoDialog(true);
  };

  const closeVideoDialog = () => {
    setOpenVideoDialog(false);
    setVideoUrl("");
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
    setEditedTitle(video.chapter || "Untitled Video");
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingVideo(null);
    setEditedTitle("");
  };

  const handleEditSave = async () => {
    if (!editingVideo) return;

    try {
      await axios.put("http://localhost:4000/teacher/video", {
        teacherName,
        chapterId: editingVideo._id,
        chapter: editedTitle,
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === editingVideo._id
            ? { ...video, chapter: editedTitle }
            : video
        )
      );

      setMessage("Video updated successfully.");
      setShowPopup(true);
    } catch (error) {
      setMessage("Failed to update video. Please try again.");
      setShowPopup(true);
    }

    closeEditDialog();
  };

  const videoColumns = [{ id: "title", label: "Video Title", minWidth: 170 }];

  const videoRows = videos.map((video) => ({
    title: (
      <span
        onClick={() => handleVideoClick(video.videoUrl)}
        style={{
          textDecoration: "underline",
          color: "blue",
          cursor: "pointer",
        }}
      >
        {video.chapter || "Untitled Video"}
      </span>
    ),
    id: video._id,
  }));

  const VideoButtonHaver = ({ row }) => {
    const video = videos.find((v) => v._id === row.id);
    return (
      <>
        <IconButton onClick={() => handleEditClick(video)}>
          <MdModeEdit color="primary" />
        </IconButton>
        <IconButton onClick={() => openConfirmDialog(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    );
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      {loader ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : videos.length === 0 ? (
        <div>No videos available.</div>
      ) : (
        <TableTemplate
          buttonHaver={VideoButtonHaver}
          columns={videoColumns}
          rows={videoRows}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1f1f38", color: "white" }}
          onClick={() => navigate("/Teacher/upload")}
        >
          Add Videos
        </Button>
      </Box>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={deleteHandler}
        title="Confirm Delete"
        message="Are you sure you want to delete this video? This action cannot be undone."
      />

      <Dialog
        open={openVideoDialog}
        onClose={closeVideoDialog}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: "relative", padding: 2 }}>
          <iframe
            width="100%"
            height="500px"
            src={videoUrl}
            title="Video Preview"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </Box>
      </Dialog>

      {/* Edit Video Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Video Title"
            variant="outlined"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TeacherVideoList;
