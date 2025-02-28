import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Paper, Box, CircularProgress, Button, Dialog } from "@mui/material";
import TableTemplate from "../../components/TableTemplate";

const StudentVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const location = useLocation();
  const subjectId = location.pathname.split("/").pop(); // Extract subject ID from URL

  useEffect(() => {
    if (subjectId) {
      const fetchData = async () => {
        setLoader(true);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/video/subject/${subjectId}`
          );
          console.log(response.data.data[0].videos);
          setVideos(response.data.data[0].videos || []);
        } catch (error) {
          console.error("Failed to fetch videos.", error);
        } finally {
          setLoader(false);
        }
      };
      fetchData();
    }
  }, [subjectId]);

  const handleVideoClick = (url) => {
    setVideoUrl(url);
    setOpenVideoDialog(true);
  };

  const closeVideoDialog = () => {
    setOpenVideoDialog(false);
    setVideoUrl("");
  };

  const videoColumns = [{ id: "title", label: "Video Title", minWidth: 170 }];

  const videoRows = videos.map((video) => ({
    title: video.chapter || "Untitled Video",
    id: video._id,
  }));

  const VideoButtonHaver = ({ row }) => {
    const video = videos.find((v) => v._id === row.id);
    return (
      <Button
        variant="contained"
        sx={{ backgroundColor: "#1f1f38", color: "white" }}
        onClick={() => handleVideoClick(video.videoUrl)}
      >
        Watch
      </Button>
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
    </Paper>
  );
};

export default StudentVideoList;
