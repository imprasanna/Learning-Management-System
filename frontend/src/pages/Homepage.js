import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Container, Grid, Box } from "@mui/material";
import styled from "styled-components";
import Students from "../assets/students.svg";
import { LightPurpleButton } from "../components/buttonStyles";

const Homepage = () => {
  return (
    <StyledContainer>
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={Students} alt="students" style={{ width: "80%" }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <StyledTitle>
              <FaGraduationCap
                style={{
                  fontSize: "4rem",
                  color: "#550080",
                  marginBottom: "10px",
                }}
              />
              <br />
              <span
                style={{ fontSize: "1.8rem", fontWeight: "300", color: "#666" }}
              >
                Welcome
              </span>
              <br />
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "200",
                  color: "#aaa",
                  margin: "5px 0",
                }}
              >
                to
              </span>
              <br />
              <span
                style={{
                  fontSize: "2.8rem",
                  fontWeight: "700",
                  color: "#550080",
                  marginTop: "10px",
                }}
              >
                LMS
              </span>
            </StyledTitle>
            <StyledText>
              Seamlessly create courses for respective classes and organize
              subjects efficiently. Use our Learning Management System to manage
              classes, add students and faculty effortlessly, track attendance,
              evaluate performance, and provide constructive feedback. Easily
              access records, view grades, and communicate effectively.
            </StyledText>
            <StyledBox>
              <StyledLink to="/choose">
                <LightPurpleButton variant="contained" fullWidth>
                  Login
                </LightPurpleButton>
              </StyledLink>

              <StyledText>
                Don't have an account?{" "}
                <Link
                  to="/Adminregister"
                  style={{
                    color: "#550080",
                    textDecoration: "underline",
                    fontWeight: "bold",
                  }}
                >
                  Sign up
                </Link>
              </StyledText>
            </StyledBox>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled.div`
  padding: 24px;
  background-color: #f4f4f4;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1; /* Tight spacing between lines */
  margin-bottom: 10px; /* Smaller bottom margin */
  gap: 2px; /* Minimal gap between elements */
`;

const StyledText = styled.p`
  color: #666666;
  margin-top: 20px;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
  line-height: 1.5;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  &:hover {
    color: #0056b3;
  }
`;
