import React, { useState, useEffect } from "react";
import { LightPurpleButton, PurpleButton } from "../../components/buttonStyles";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils/apiFetch";
import TableWithActions from "../../components/TableWithActions";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useSnackBarController from "../../components/useSnackBar";
import EditDialogBox from "../../components/EditDialogBox";
import AddReferenceBox from "../../components/ReferenceDialogBox";

function Result() {
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackBarController();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [classId, setClassId] = useState(
    currentUser.teachSclass?._id.toString()
  );
  const [subjectId, setSubjectId] = useState(
    currentUser.teachSubject?._id.toString()
  );
  const [teacherId, setTeacherId] = useState(currentUser._id.toString());
  const [subject, setSubject] = useState("");
  const [useEffectDependency, setUseEffectDependency] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReference, setOpenReference] = useState(false);
  const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
  const [selectedEditRow, setSelectedEditRow] = useState(null);
  const [reference, setReference] = useState([]);

  const onOpenDelete = () => {
    setOpenDelete(true);
  };

  const onOpenEdit = () => {
    setOpenEdit(true);
  };

  const onOpenReference = () => {
    setOpenReference(true);
  };

  const onCloseReference = () => {
    setOpenReference(false);
  };

  const onCloseEdit = () => {
    setOpenEdit(false);
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
  };

  const refetchResults = () => {
    setUseEffectDependency((prev) => prev + 1);
  };

  const onDelete = (rollNum) => {
    onOpenDelete();
    setSelectedDeleteRow(rollNum);
  };

  const onEdit = (rollNum) => {
    const selectedRow = result.find((row) => row.rollNum === rollNum);
    onOpenEdit();
    setSelectedEditRow(selectedRow); // Pass the full row data
  };

  const fetchAllResult = async (url, method, body) => {
    try {
      const response = await apiRequest(url, method, body);
      if (response.success) {
        const resultData = response.data.map((row, index) => {
          return {
            id: index + 1,
            ...row,
            grade: row.marks === null ? null : row.grade,
          };
        });

        setResult(resultData);
      }
    } catch (error) {
      showErrorSnackbar(`Error: ${error.message}`);
    }
  };

  const handleAddReference = async (updatedReference) => {
    console.log("calling handleAddReference");
    console.log("calling addReferenceReq");
    try {
      const response = await apiRequest(
        "http://localhost:4000/addreferences",
        "POST",
        {
          teacherId: teacherId,
          resources: updatedReference,
        }
      );
      if (response.success) {
        // setSubject(response.subName);
        showSuccessSnackbar("Reference added successfully");
      }
    } catch (error) {
      showErrorSnackbar(`Error: ${error.message}`);
    }
  };

  const fetchSubject = async (url, method) => {
    console.log("calling fetchSubject");
    try {
      const response = await apiRequest(url, method);
      if (response.success) {
        setSubject(response.subName);
      }
    } catch (error) {
      showErrorSnackbar(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    console.log("Teacher id", teacherId);
    fetchAllResult("http://localhost:4000/teacher/result", "POST", {
      classId: classId,
      subjectId: subjectId,
    });
  }, [classId, subjectId, useEffectDependency]);

  useEffect(() => {
    // console.log("calling useEffect", teacherId);
    // fetchSubject(`http://localhost:4000/TeacherSubject/${teacherId}`, "GET");
    if (teacherId) {
      console.log("Fetching subject with teacherId:", teacherId);
      fetchSubject(`http://localhost:4000/TeacherSubject/${teacherId}`, "GET");
    } else {
      console.log("Skipping fetchSubject because teacherId is undefined");
    }
  }, [teacherId]);

  const columns = [
    { id: "id", label: "S.N", minWidth: 100, align: "center" },
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "rollNum", label: "Roll Number", minWidth: 100, align: "center" },
    { id: "marks", label: "Marks", minWidth: 100, align: "center" },
    { id: "grade", label: "Grade", minWidth: 100, align: "center" },
  ];

  const handleEdit = async (updatedRow) => {
    // console.log("Updating row:", updatedRow);
    const res = await apiRequest(
      "http://localhost:4000/teacher/result/update",
      "POST",
      {
        rollNum: updatedRow.rollNum,
        subjectId: subjectId,
        classId: classId,
        marks: updatedRow.marks,
      }
    );

    if (res.success) {
      showSuccessSnackbar("Successfully updated result!");
      refetchResults();
    } else {
      showErrorSnackbar("Error updating result!");
    }
    onCloseEdit();
    refetchResults();
  };

  const handleDelete = async () => {
    const res = await apiRequest(
      "http://localhost:4000/teacher/result/delete",
      "POST",
      { rollNum: selectedDeleteRow, subjectId: subjectId, classId: classId }
    );
    if (res.success) {
      showSuccessSnackbar("Successfully deleted result!");
    } else {
      onCloseDelete();
      showErrorSnackbar("Error deleting result!");
    }
    onCloseDelete();
    refetchResults();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/teacher/result/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId: classId, subjectId: subjectId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Convert response to Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> tag to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_results.csv"; // Set filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      window.URL.revokeObjectURL(url);
      showSuccessSnackbar("Successfully downloaded  result!");
    } catch (error) {
      showErrorSnackbar("Error downloading result result!");
    }
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        // height="100vh" // Ensures the button is at the bottom
        p={2}
      >
        <h1 sx={{ margin: 2 }}> Result</h1>
        <PurpleButton onClick={handleDownload}>Downlaod Result</PurpleButton>

        <PurpleButton onClick={onOpenReference}>Add reference</PurpleButton>
      </Box>
      <TableWithActions
        columns={columns}
        rows={result}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ConfirmationDialog
        open={openDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title="Delete Result"
        message="Are you sure you want to delete this result?"
      />
      <EditDialogBox
        open={openEdit}
        onClose={onCloseEdit}
        onConfirm={handleEdit}
        setSelectedEditRow={setSelectedEditRow} // Pass setSelectedEditRow
        studentData={selectedEditRow}
      />

      <AddReferenceBox
        open={openReference}
        onClose={onCloseReference}
        onConfirm={handleAddReference}
        setReference={setReference}
        reference={reference}
      />
    </div>
  );
}

export default Result;
