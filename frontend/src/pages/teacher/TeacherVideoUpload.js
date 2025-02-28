import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";

const TeacherVideoUpload = () => {
  const [videos, setVideos] = useState([{ chapter: "", video: null }]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const teacherName = userState?.currentUser?._id || "";

  const handleChange = (index, field) => (event) => {
    const newVideos = [...videos];
    if (field === "video") {
      newVideos[index][field] = event.target.files[0];
    } else {
      newVideos[index][field] = event.target.value;
    }
    setVideos(newVideos);
  };

  const handleAddVideo = () =>
    setVideos([...videos, { chapter: "", video: null }]);

  const handleRemoveVideo = (index) => () => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoader(true);

    if (!teacherName) {
      setMessage("Missing required user data. Please log in again.");
      setShowPopup(true);
      setLoader(false);
      return;
    }

    for (let video of videos) {
      if (!video.chapter.trim()) {
        setMessage("Video title cannot be empty.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      if (!video.video) {
        setMessage("Please upload a video file.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
    }

    try {
      for (let video of videos) {
        const formData = new FormData();
        formData.append("teacherName", teacherName);
        formData.append("chapter", video.chapter);
        formData.append("video", video.video);

        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/teacher/video`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Upload failed. Try again.");
          setShowPopup(true);
          setLoader(false);
          return;
        }
      }

      navigate("/Teacher/videos");
    } catch (error) {
      setMessage("Network Error. Please try again.");
      setShowPopup(true);
    }

    setLoader(false);
  };

  return (
    <form onSubmit={submitHandler}>
      <Box mb={2}>
        <Typography variant="h6">Upload Videos</Typography>
      </Box>
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Video Title"
                variant="outlined"
                value={video.chapter}
                onChange={handleChange(index, "chapter")}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <input
                type="file"
                accept="video/*"
                onChange={handleChange(index, "video")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {index > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveVideo(index)}
                >
                  Remove
                </Button>
              )}
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleAddVideo}>
            Add Another Video
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loader}
            >
              {loader ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload"
              )}
            </Button>
          </Box>
        </Grid>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </Grid>
    </form>
  );
};

export default TeacherVideoUpload;
