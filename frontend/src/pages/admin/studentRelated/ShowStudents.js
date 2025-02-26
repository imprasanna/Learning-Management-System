import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteStudent,
  getAllStudents,
} from "../../../redux/studentRelated/studentHandle";
import { Paper, Box, IconButton } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  BlackButton,
  BlueButton,
  GreenButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";

import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  CircleNotificationsRounded,
} from "@mui/icons-material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popup from "../../../components/Popup";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector(
    (state) => state.student
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const deleteHandler = async (deleteID) => {
    try {
      await dispatch(deleteStudent(deleteID));
      setMessage("Student deleted successfully.");
      dispatch(getAllStudents(currentUser._id, "Students"));
    } catch (err) {
      setMessage("Failed to delete student. Please try again.");
      console.error(err);
    } finally {
      setShowPopup(true);
    }
  };

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

  const confirmDelete = () => {
    if (deleteID) {
      deleteHandler(deleteID);
    }
    closeConfirmDialog();
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const studentRows =
    studentsList &&
    studentsList.length > 0 &&
    studentsList.map((student) => {
      return {
        name: student.name,
        rollNum: student.rollNum,
        sclassName: student.sclassName.sclassName,
        id: student._id,
      };
    });

  const StudentButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate("/Admin/students/student/attendance/" + row.id);
    };
    const handleMarks = () => {
      navigate("/Admin/students/student/marks/" + row.id);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };
    return (
      <>
        <IconButton onClick={() => openConfirmDialog(row.id)} color="secondary">
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <React.Fragment>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <BlackButton
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      </>
    );
  };

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Student",
      action: () => navigate("/Admin/addstudents"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Students",
      action: () => deleteHandler(currentUser._id, "Students"),
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
                onClick={() => navigate("/Admin/addstudents")}
              >
                Add Students
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {Array.isArray(studentsList) && studentsList.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
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
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </>
  );
};

export default ShowStudents;
