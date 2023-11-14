import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import AxiosClient from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const theme = createTheme();

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState({ value: "", error: false, message: "" });
  const [password, setPassword] = useState({
    value: "",
    error: false,
    message: "",
  });
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [sendRequest, setSendRequest] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (!email.value) {
      setEmail((prev) => ({
        ...prev,
        error: true,
        message: "Email is required",
      }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      setEmail((prev) => ({
        ...prev,
        error: true,
        message: "Invalid email format",
      }));
      isValid = false;
    } else {
      setEmail((prev) => ({ ...prev, error: false, message: "" }));
    }

    if (!password.value) {
      setPassword((prev) => ({
        ...prev,
        error: true,
        message: "Password is required",
      }));
      isValid = false;
    } else if (password.value.length < 6) {
      setPassword((prev) => ({
        ...prev,
        error: true,
        message: "Password must be at least 6 characters long",
      }));
      isValid = false;
    } else {
      setPassword((prev) => ({ ...prev, error: false, message: "" }));
    }

    return !isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) return;

    setSendRequest(true);

    try {
      const { data } = await AxiosClient.post("/auth/login", {
        email: email.value,
        password: password.value,
      });
      localStorage.setItem("token", data.token.accessToken);
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      setSendRequest(false);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      if (
        ["Wrong password", "User not found"].some((e) =>
          errorMessage.includes(e)
        )
      ) {
        setAlert({ state: true, message: "Email or password is incorrect" });
      } else {
        setAlert({ state: true, message: errorMessage });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Habit Maker
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail({ ...email, value: e.target.value })}
              value={email.value}
              required={true}
              helperText={email.message}
              error={email.error}
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                setPassword({ ...password, value: e.target.value })
              }
              value={password.value}
              required={true}
              helperText={password.message}
              error={password.error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign in
            </Button>
          </Box>
          {sendRequest && <LoadingBar />}
          {alert.state && <HttpErrorNotification message={alert.message} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
