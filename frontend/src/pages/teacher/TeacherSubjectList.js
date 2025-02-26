import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import axios from "axios";
import { Paper, Button } from "@mui/material";
import TableTemplate from "../../components/TableTemplate";

const ShowSubjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subjectsList, loading, error } = useSelector((state) => state.sclass);
  const { currentUser, currentRole } = useSelector((state) => state.user);

  const teacherId = currentUser._id;

  useEffect(() => {
    if (currentRole === "Teacher" && currentUser?._id) {
      console.log("Fetching subjects for teacher:", currentUser._id);
      dispatch(getSubjectList(currentUser._id, "TeacherSubject"));
    }
  }, [currentRole, currentUser?._id, dispatch]);

  useEffect(() => {
    // Fetch subjects
    axios
      .get(`http://localhost:4000/TeacherSubject/${teacherId}`)
      .then((response) => {
        // nothing
      })
      .catch(() => {
        // nothing
      });
  }, [currentUser._id]);

  if (error) {
    console.error("Error fetching subjects:", error);
  }

  const subjectColumns = [
    { id: "subName", label: "Subject Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const formattedSubjects = Array.isArray(subjectsList)
    ? subjectsList
    : subjectsList && typeof subjectsList === "object"
    ? [subjectsList]
    : [];

  const subjectRows = formattedSubjects.map((subject) => ({
    subName: subject.subName || "N/A",
    sessions: subject.sessions || 0,
    sclassName:
      typeof subject.sclassName === "object"
        ? subject.sclassName.sclassName
        : String(subject.sclassName) || "N/A",
    sclassID:
      typeof subject.sclassName === "object"
        ? subject.sclassName._id
        : String(subject.sclassName) || "",
    id: subject._id,
  }));

  const SubjectButtonHaver = ({ row }) => {
    return (
      <Button
        style={{ backgroundColor: "#1f1f38", color: "white" }}
        onClick={() => navigate("/Teacher/videos")}
      >
        View
      </Button>
    );
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      {loading ? (
        <div>Loading...</div>
      ) : currentRole !== "Teacher" ? (
        <div>Unauthorized: Only teachers can view this section.</div>
      ) : subjectRows.length === 0 ? (
        <div>No subjects found.</div>
      ) : (
        <TableTemplate
          columns={subjectColumns}
          rows={subjectRows}
          buttonHaver={SubjectButtonHaver}
        />
      )}
    </Paper>
  );
};

export default ShowSubjects;
