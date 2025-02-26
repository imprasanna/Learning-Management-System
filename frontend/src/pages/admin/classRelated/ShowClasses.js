import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteClass,
  getAllSclasses,
} from "../../../redux/sclassRelated/sclassHandle";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";

import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import styled from "styled-components";
import Popup from "../../../components/Popup";

// Note this ......-----
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // -----------------------------------------------------------------------------------------
  const deleteHandler = async (deleteID) => {
    try {
      await dispatch(deleteClass(deleteID));
      setMessage("Class deleted successfully.");
      dispatch(getAllSclasses(adminID, "Sclass"));
    } catch (err) {
      setMessage("Failed to delete class. Please try again.");
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
  // ----------------------------------------------------------------------

  const sclassColumns = [{ id: "name", label: "Class Name", minWidth: 170 }];

  const sclassRows = sclassesList?.map((sclass) => ({
    name: sclass.sclassName,
    id: sclass._id,
  }));

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <PostAddIcon />,
        name: "Add Subjects",
        action: () => navigate("/Admin/addsubject/" + row.id),
      },
      {
        icon: <PersonAddAlt1Icon />,
        name: "Add Student",
        action: () => navigate("/Admin/class/addstudents/" + row.id),
      },
    ];
    return (
      <ButtonContainer>
        {/* look here also for triggering confirmation dialog ------------------------------------------*/}
        <IconButton onClick={() => openConfirmDialog(row.id)} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}
        >
          View
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Add Students & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {actions.map((action, index) => (
            <MenuItem key={index} onClick={action.action}>
              <ListItemIcon fontSize="small">{action.icon}</ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {getresponse ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addclass")}
              >
                Add Class
              </GreenButton>
            </Box>
          ) : (
            <>
              {sclassesList?.length > 0 && (
                <TableTemplate
                  buttonHaver={SclassButtonHaver}
                  columns={sclassColumns}
                  rows={sclassRows}
                />
              )}
              <Box
                sx={{
                  position: "fixed",
                  bottom: 16,
                  right: 16,
                  zIndex: 9999,
                }}
              >
                <BlueButton
                  variant="contained"
                  onClick={() => navigate("/Admin/addclass")}
                  sx={{
                    backgroundColor: "#1976d2 !important",
                    position: "fixed",
                    top: 600,
                    right: 20,
                    zIndex: 9999,
                    "&:hover": {
                      backgroundColor: "#3019d2 !important",
                    },
                  }}
                >
                  Add New Class
                </BlueButton>
              </Box>
            </>
          )}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      {/* Look here --------------------------------------------- */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this class? This action cannot be undone."
      />
    </>
  );
};

export default ShowClasses;

const styles = {
  styledPaper: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
