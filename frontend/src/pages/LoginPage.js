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
  Backdrop,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaGraduationCap } from "react-icons/fa";
import { LightPurpleButton } from "../components/buttonStyles";
import styled from "styled-components";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";
import adminBg from "../assets/adminImage.png";
import teacherBg from "../assets/teacherImage.png";
import studentBg from "../assets/studentImage.jpg";

const theme = createTheme({
  palette: {
    primary: { main: "#550080" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") navigate("/Admin/dashboard");
      else if (currentRole === "Student") navigate("/Student/dashboard");
      else if (currentRole === "Teacher") navigate("/Teacher/dashboard");
    } else if (status === "failed" || status === "error") {
      setMessage(status === "error" ? "Network Error" : response);
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  const getBackgroundImage = () => {
    switch (role) {
      case "Admin":
        return adminBg;
      case "Teacher":
        return teacherBg;
      case "Student":
        return studentBg;
      default:
        return adminBg;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                cursor: "pointer",
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
              sx={{ mb: 2, color: "#2c2143", fontWeight: 600 }}
            >
              {role} Login
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Welcome back! Please enter your details
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {role === "Student" ? (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="rollNumber"
                    label="Enter your Roll Number"
                    name="rollNumber"
                    autoFocus
                    error={rollNumberError}
                    helperText={rollNumberError && "Roll Number is required"}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="studentName"
                    label="Enter your name"
                    name="studentName"
                    error={studentNameError}
                    helperText={studentNameError && "Name is required"}
                  />
                </>
              ) : (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Enter your email"
                  name="email"
                  autoFocus
                  error={emailError}
                  helperText={emailError && "Email is required"}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? "text" : "password"}
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={passwordError}
                helperText={passwordError && "Password is required"}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <LightPurpleButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </LightPurpleButton>
              {role === "Admin" && (
                <Grid container sx={{ mt: 2 }}>
                  <Typography>Don't have an account?</Typography>
                  <StyledLink to="/Adminregister">Sign up</StyledLink>
                </Grid>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${getBackgroundImage()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={guestLoader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </ThemeProvider>
  );
};

export default LoginPage;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #550080;
  font-weight: bold;
  margin-left: 5px;
`;
