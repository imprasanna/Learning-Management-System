import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaGraduationCap } from "react-icons/fa";
import adminBg from "../../assets/adminImage.png";
import { LightPurpleButton } from "../../components/buttonStyles";
import { registerUser } from "../../redux/userRelated/userHandle";
import styled from "styled-components";
import Popup from "../../components/Popup";

const theme = createTheme({
  palette: {
    primary: { main: "#550080" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [adminNameError, setAdminNameError] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);
  const role = "Admin";

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.adminName.value;
    const schoolName = event.target.schoolName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!name || !schoolName || !email || !password) {
      if (!name) setAdminNameError(true);
      if (!schoolName) setSchoolNameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    const fields = { name, email, password, role, schoolName };
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "adminName") setAdminNameError(false);
    if (name === "schoolName") setSchoolNameError(false);
  };

  useEffect(() => {
    if (
      status === "success" ||
      (currentUser !== null && currentRole === "Admin")
    ) {
      navigate("/Admin/dashboard");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      console.log(error);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Header with Logo */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                mb: 2,
              }}
            >
              <FaGraduationCap size={32} color="#550080" />
              <Typography
                variant="h4"
                sx={{ ml: 1, fontWeight: 600, color: "#550080" }}
              >
                LMS
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ mb: 1, color: "#2c2143", fontWeight: 600 }}
            >
              Admin Register
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 2, textAlign: "center", fontSize: "0.9rem" }}
            >
              Create your own Courses by registering as an admin.
              <br />
              Add students, faculty, classes, and manage the system easily.
            </Typography>

            {/* Form Fields */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="dense"
                required
                fullWidth
                id="adminName"
                label="Enter your name"
                name="adminName"
                autoComplete="name"
                autoFocus
                error={adminNameError}
                helperText={adminNameError && "Name is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                id="schoolName"
                label="Enter the name of your institution"
                name="schoolName"
                autoComplete="off"
                error={schoolNameError}
                helperText={schoolNameError && "Institute name is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordError && "Password is required"}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <LightPurpleButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </LightPurpleButton>
              <Grid container justifyContent="center">
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Already have an account?
                </Typography>
                <StyledLink to="/Adminlogin">Log in</StyledLink>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${adminBg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </ThemeProvider>
  );
};

export default AdminRegisterPage;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #550080;
  font-weight: bold;
`;
