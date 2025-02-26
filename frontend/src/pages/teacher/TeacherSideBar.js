import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import { useSelector } from "react-redux";

const TeacherSideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const sclassName = currentUser.teachSclass;

  const location = useLocation();
  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon
              color={
                location.pathname === ("/" || "/Teacher/dashboard")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Teacher/student">
          <ListItemIcon>
            <PersonOutlineIcon
              color={
                location.pathname.startsWith("/Teacher/student")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary={`Student`} />
        </ListItemButton>

        <ListItemButton component={Link} to="/Teacher/subject">
          <ListItemIcon>
            <AssignmentIcon
              color={
                location.pathname.startsWith("/Teacher/subject")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary={`Subject`} />
        </ListItemButton>

        {/* side bar for Result section */}
        <ListItemButton component={Link} to="/Teacher/result">
          <ListItemIcon>
            <QuizIcon
              color={
                location.pathname.startsWith("/Teacher/result")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Result" />
        </ListItemButton>
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListSubheader component="div" inset>
          User
        </ListSubheader>
        <ListItemButton component={Link} to="/Teacher/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith("/Teacher/profile")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton component={Link} to="/logout">
          <ListItemIcon>
            <ExitToAppIcon
              color={
                location.pathname.startsWith("/logout") ? "primary" : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </React.Fragment>
    </>
  );
};

export default TeacherSideBar;
