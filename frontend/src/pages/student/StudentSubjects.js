import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
  Table,
  TableBody,
  TableHead,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import axios from "axios";
import CustomBarChart from "../../components/CustomBarChart";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading } = useSelector(
    (state) => state.user
  );

  const [openPopup, setOpenPopup] = useState(false);
  const [referenceText, setReferenceText] = useState("");

  useEffect(() => {
    dispatch(getUserDetails(currentUser._id, "Student"));
  }, [dispatch, currentUser._id]);

  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState("table");

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (subjectMarks.length > 0) {
      dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
    }
  }, [subjectMarks, dispatch, currentUser.sclassName._id]);

  const handleViewVideos = (subjectId) => {
    navigate(`/Student/videos/${subjectId}`);
  };

  const handleViewReferences = async (subjectId) => {
    const requestData = {
      classId: currentUser.sclassName._id,
      subjectId: subjectId,
      rollNum: currentUser.rollNum,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/recommendStudent",
        requestData
      );
      const reference =
        response.data.data.personalizedReference || "No references recommended";
      setReferenceText(reference);
      setOpenPopup(true);
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Videos</StyledTableCell>
                <StyledTableCell>Marks</StyledTableCell>
                <StyledTableCell>References</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectMarks.map((result, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{result.subName.subName}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#1f1f38", color: "white" }}
                      onClick={() => handleViewVideos(result.subName._id)}
                    >
                      View Videos
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>{result.marksObtained}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#1f1f38", color: "white" }}
                      onClick={() => handleViewReferences(result.subName._id)}
                    >
                      View References
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
            <DialogTitle>Recommended References</DialogTitle>
            <DialogContent>
              {isValidURL(referenceText) ? (
                <Typography>
                  <a
                    href={referenceText}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1f1f38", fontWeight: "bold" }}
                  >
                    {referenceText}
                  </a>
                </Typography>
              ) : (
                <Typography
                  style={{
                    color:
                      referenceText === "No references recommended"
                        ? "#FF5733"
                        : "black",
                  }}
                >
                  {referenceText}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPopup(false)} color="primary">
                Hide
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default StudentSubjects;
