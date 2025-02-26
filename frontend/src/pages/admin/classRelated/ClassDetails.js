import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { Box, Container, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, sclassStudents, sclassDetails, loading } = useSelector(
    (state) => state.sclass
  );
  const { teachersList } = useSelector((state) => state.teacher);

  const classID = params.id;

  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
    dispatch(getAllTeachers()); // Fetch all teachers
  }, [dispatch, classID]);

  useEffect(() => {
    if (teachersList && classID) {
      // Filter teachers based on the specific class ID
      const teachersForClass = teachersList.filter(
        (teacher) => teacher.teachSclass._id === classID
      );
      setFilteredTeachers(teachersForClass);
    }
  }, [teachersList, classID]);

  const [value, setValue] = useState("1");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const subjectColumns = [
    { id: "name", label: "Subject Name", minWidth: 170 },
    { id: "code", label: "Study Material Link", minWidth: 100 },
  ];

  const subjectRows = subjectsList.map((subject) => ({
    name: subject.subName,
    code: subject.subCode,
    id: subject._id,
  }));

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    name: student.name,
    rollNum: student.rollNum,
    id: student._id,
  }));

  const ClassDetailsSection = () => {
    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Class Details
        </Typography>
        <Typography variant="h5" gutterBottom>
          Class Name: {sclassDetails?.sclassName || "N/A"}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Subjects: {subjectsList.length}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Students: {sclassStudents.length}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Teachers: {filteredTeachers.length}
        </Typography>
      </>
    );
  };

  const ClassSubjectsSection = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Subjects List:
      </Typography>
      <TableTemplate columns={subjectColumns} rows={subjectRows} />
    </>
  );

  const ClassStudentsSection = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Students List:
      </Typography>
      <TableTemplate columns={studentColumns} rows={studentRows} />
    </>
  );

  const ClassTeachersSection = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Teachers List:
      </Typography>
      {filteredTeachers.length > 0 ? (
        filteredTeachers.map((teacher) => (
          <Typography key={teacher._id}>
            {teacher.name} (
            {teacher.teachSubject?.subName || "No subject assigned"})
          </Typography>
        ))
      ) : (
        <Typography>No teachers assigned to this class.</Typography>
      )}
    </>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box sx={{ width: "100%" }}>
          <TabContext value={value}>
            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
              <TabPanel value="1">
                <ClassDetailsSection />
              </TabPanel>
              <TabPanel value="2">
                <ClassSubjectsSection />
              </TabPanel>
              <TabPanel value="3">
                <ClassStudentsSection />
              </TabPanel>
              <TabPanel value="4">
                <ClassTeachersSection />
              </TabPanel>
            </Container>
          </TabContext>
        </Box>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ClassDetails;
