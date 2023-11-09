import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../assets/logo.png';
import AuthContext from '../../contexts/AuthContext';

const theme = createTheme();

export const SignIn = () => {
  const { dispatchAPI, urlSearch } = AuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const postLogin = async (body) => {
    try {
      const response = await dispatchAPI('LOGIN', body);
      if (typeof response === 'string') {
        setError(response);
      } else {
        if (urlSearch) navigate(urlSearch);
        else navigate(-1);
      }
    } catch (e) {
      setError('Erreur server');
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    postLogin({
      email: data.get('email'),
      password: data.get('password')
    });
  };

  return (
    <ThemeProvider theme={theme}>
      {error && <Alert severity="error">{error}</Alert>}
      <Container component="main" maxWidth="xs" data-testid="signin-container">
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
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputProps={{ 'data-testid': 'signin-email' }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputProps={{ 'data-testid': 'signin-password' }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-testid="submit-button"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
