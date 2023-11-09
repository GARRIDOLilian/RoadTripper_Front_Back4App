import * as React from 'react';
import { Grid, AppBar, Button, Toolbar } from '@mui/material';
import styles from '../styles/styles';
import logo from '../assets/logo_simple.png';
import useAuhContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Layout = ({ children }) => {
  const { user, dispatchAPI } = useAuhContext();
  const navigate = useNavigate();
  return (
    <>
      <AppBar
        position="absolute"
        style={{ backgroundColor: 'rgba(0,0,0,0' }}
        elevation={0}
        data-testid="appbar"
      >
        <Toolbar sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Button variant="h6" color="inherit">
            <img src={logo} alt="Logo" width="100" />
          </Button>
          {!user ? (
            <Button
              onClick={() => navigate('/signin')}
              variant="contained"
              style={styles.buttonDefault}
              sx={{ my: 1, mx: 1.5 }}
            >
              Login
            </Button>
          ) : (
            <div>
              <Button
                variant="contained"
                onClick={() => navigate(`/profile/${user?.id}`)}
                // style={styles.buttonDefault}
                sx={{ my: 1, mx: 1.5 }}
              >
                Profile
              </Button>
              <Button
                onClick={() => dispatchAPI('LOGOUT')}
                variant="contained"
                style={styles.buttonDefault}
                sx={{ my: 1, mx: 1.5 }}
              >
                Logout
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Grid item md={12} xs={24}>
        <div>{children}</div>
      </Grid>

      <div style={styles.footerStyle}>
        <div style={styles.footerRow}>
          <img src={logo} alt="Logo" width="100" style={{ opacity: '0.8' }} />
          <div style={styles.footerRow2}>
            <div style={styles.footerRow3}>
              <p>PRIVACY POLICY</p>
              <p>TERMS OF SERVICE</p>
              <p>COPYRIGHT</p>
            </div>
            <div style={styles.footerRow3}>
              <p>© Epic Road Trip, 2022</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
