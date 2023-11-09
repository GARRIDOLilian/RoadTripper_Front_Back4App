import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Container,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../assets/logo.png';
import AuthContext from '../../contexts/AuthContext';
import { Link as LinkRouter } from 'react-router-dom';

const theme = createTheme();

export const SignUp = () => {
  const { dispatchAPI } = AuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const postRegister = async (body) => {
    try {
      const response = await dispatchAPI('REGISTER', body);
      if (typeof response === 'string') {
        setError(response);
      } else {
        navigate('/');
      }
    } catch (e) {
      setError('Erreur server');
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataToSend = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      confirm_password: data.get('confirm_password')
    };
    if (dataToSend.password === dataToSend.confirm_password) {
      postRegister(dataToSend);
    } else {
      setError('Invalid credentials: Password are not the same');
    }
  };

  return (
    <ThemeProvider theme={theme} >
      {error && <Alert severity="error">{error}</Alert>}
      <Container component="main" maxWidth="xs" data-testid="signup-container">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img src={logo} alt="Logo" style={{ marginBottom: -25 }} />
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  inputProps={{ 'data-testid': 'signup-username' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputProps={{ 'data-testid': 'signup-email' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputProps={{ 'data-testid': 'signup-password' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirm password"
                  type="password"
                  id="confirm_password"
                  autoComplete="new-password"
                  inputProps={{ 'data-testid': 'signup-confirm-password' }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-testid="submit-button"
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2">
                  <LinkRouter to="/signin">
                    Already have an account? Sign in
                  </LinkRouter>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
