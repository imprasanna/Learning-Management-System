import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { AccountCircle, School, Group } from "@mui/icons-material";
import { FaGraduationCap } from "react-icons/fa";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, currentRole } = useSelector(
    (state) => state.user
  );

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = async (user) => {
    if (visitor === "guest") {
      setLoader(true);
      try {
        const response = await fetch(`/api/guestCredentials?role=${user}`);
        const fields = await response.json();
        dispatch(loginUser(fields, user));
      } catch (error) {
        setMessage("Failed to fetch guest credentials");
        setShowPopup(true);
        setLoader(false);
      }
    } else {
      navigate(`/${user}login`);
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher") {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <StyledHeader onClick={() => navigate("/")}>
        <FaGraduationCap style={{ fontSize: "3rem", marginRight: "10px" }} />
        LMS
      </StyledHeader>
      <Container>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Admin")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <AccountCircle fontSize="large" />
                </Box>
                <StyledTypography>Admin</StyledTypography>
                <StyledDescription>
                  - Manage app data and resources efficiently.
                  <br />- Control institutional settings and access.
                </StyledDescription>
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Student")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <School fontSize="large" />
                </Box>
                <StyledTypography>Student</StyledTypography>
                <StyledDescription>
                  - Access course materials and assignments.
                  <br />- Engage with learning resources.
                </StyledDescription>
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Teacher")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <Group fontSize="large" />
                </Box>
                <StyledTypography>Teacher</StyledTypography>
                <StyledDescription>
                  - Create and manage courses and assignments.
                  <br />- Monitor student progress effectively.
                </StyledDescription>
              </StyledPaper>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #f0f7ff, #c2d5ff);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Adjusted for positioning */
  padding: 2rem;
`;

const StyledHeader = styled.h1`
  color: #550080;
  cursor: pointer;
  font-size: 2.5rem; /* Increased size */
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
`;

const StyledPaper = styled(Paper)`
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  color: #4a4a4a;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #d3e4ff;
    color: #000000;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #550080;
`;

const StyledDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.5;
  text-align: center;
`;
