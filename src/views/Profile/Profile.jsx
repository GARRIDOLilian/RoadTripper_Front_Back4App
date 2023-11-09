import React, { useState, useEffect } from 'react';
import {
  List,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItem,
  Box,
  Container,
  Button,
  Badge,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RoomIcon from '@mui/icons-material/Room';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MuseumIcon from '@mui/icons-material/Museum';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router';
import AuthContext from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

export const Profile = () => {
  const { dispatchAPI, user } = AuthContext();
  const navigate = useNavigate();

  const [openCollapse, setOpenCollapse] = React.useState(false);
  const [error, setError] = useState();
  const [shareLink, setShareLink] = useState();
  const [openByType, setOpenByType] = React.useState({
    Restaurants: false,
    Events: false,
    Accomodations: false,
    Transports: false,
    Bars: false,
    Culturals: false,
    Sports: false
  });
  const [trips, setTrips] = useState([]);
  const [openShare, setOpenShare] = useState(false);
  const { id } = useParams();
  const listOfActivities = {
    Restaurants: {
      icon: <LocalDiningIcon sx={{ color: '#ffbf00' }} />,
      color: '#ffbf00'
    },
    Events: {
      icon: <EmojiEventsIcon sx={{ color: '#fff53b' }} />,
      color: '#fff53b'
    },
    Accommodations: {
      icon: <HotelIcon sx={{ color: '#2957ff' }} />,
      color: '#2957ff'
    },
    Transports: {
      icon: <DirectionsBusIcon sx={{ color: '#00c8ff' }} />,
      color: '#00c8ff'
    },
    Bars: {
      icon: <LocalBarIcon sx={{ color: '#f200d6' }} />,
      color: '#f200d6'
    },
    Culturals: {
      icon: <MuseumIcon sx={{ color: '#c800d6' }} />,
      color: '#c800d6'
    },
    Sports: {
      icon: <SportsTennisIcon sx={{ color: '#00ff1e' }} />,
      color: '#00ff1e'
    }
  };

  const getData = async () => {
    const response = await dispatchAPI('GET', { url: `/trip/${id}` });
    setTrips(response.data.trips);
  };
  useEffect(() => {
    getData();
  }, [id]);
  const displayOrnOtCollapse = (city) => {
    if (openCollapse) {
      setOpenCollapse(false);
    } else setOpenCollapse(city);
  };
  const setCurrentActivity = async (item) => {
    try {
      const rep = await dispatchAPI('POST', {
        url: '/generate',
        responseType: 'arraybuffer',
        body: {
          report: { ...item }
        }
      });
      const bfArray = new Uint8Array(rep.data.data);
      const blob = new Blob([bfArray], {
        type: `application/docx`
      });
      let link = document.createElement('a');
      link.download = 'trip.docx';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      setError('error server');
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Box>
          <p
            style={{
              fontSize: 25,
              textAlign: 'center',
              backgroundColor: 'orange'
            }}
          >{`Hi ${user.username} !`}</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 25
            }}
          >
            <span>{`You have ${trips.length} trips saved.`}</span>
            <Button onClick={() => navigate('/')}>Back Home</Button>
          </div>
        </Box>

        {trips.map((ele) => (
          <Box key={ele._id} style={{ border: '0.2px solid', margin: 10 }}>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h3 className="exporttrip-list-title">Summary</h3>
                  <Button
                    type="primary"
                    onClick={() => setCurrentActivity(ele)}
                  >
                    Print
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setShareLink(
                        `${
                          process.env.NODE_ENV === 'development'
                            ? 'http://localhost:3000'
                            : 'https://app-ert-g25.herokuapp.com'
                        }/trip/${ele._id}`
                      );
                      setOpenShare(true);
                    }}
                  >
                    Share link
                  </Button>
                </ListSubheader>
              }
            >
              <ListItemButton
                onClick={() => {
                  displayOrnOtCollapse(ele?.from?.city);
                }}
              >
                <ListItemText primary={`From : ${ele?.from?.city}`} />
              </ListItemButton>

              {ele?.waypoints?.map((way) => (
                <>
                  <ListItemButton
                    onClick={() => {
                      displayOrnOtCollapse(way.city);
                    }}
                  >
                    <ListItemIcon>
                      <RoomIcon />
                    </ListItemIcon>

                    <ListItemText primary={way.city} />

                    {openCollapse === way.city ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                  <Collapse in={openCollapse === way.city} unmountOnExit>
                    {Object.entries(way.activities).map(([key, value]) => (
                      <>
                        <ListItemButton
                          onClick={() => {
                            setOpenByType({
                              ...openByType,
                              [key]: !openByType[key]
                            });
                          }}
                        >
                          <Badge
                            style={{ marginLeft: 100 }}
                            badgeContent={value.length}
                            color="primary"
                          >
                            <ListItemIcon>
                              {listOfActivities[key].icon}
                            </ListItemIcon>
                          </Badge>
                          <ListItemText primary={key} />
                          {openByType[key] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse
                          in={openCollapse === way.city && openByType[key]}
                          unmountOnExit
                        >
                          <List>
                            {value.map((r) => (
                              <ListItem key={r.xid} sx={{ pl: 4 }}>
                                <ListItemText
                                  primary={r.name}
                                  secondary={
                                    <>
                                      {`Longitude: ${r.point.lon} - latitude: ${r.point.lat}`}
                                    </>
                                  }
                                />

                                <div>{`${r.dist.toFixed(2)} m`}</div>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </>
                    ))}
                  </Collapse>
                </>
              ))}

              <>
                <ListItemButton
                  onClick={() => {
                    displayOrnOtCollapse(ele?.to?.city);
                  }}
                >
                  <ListItemIcon>
                    <RoomIcon />
                  </ListItemIcon>
                  <ListItemText primary={ele?.to?.city} />
                  {openCollapse === ele?.to?.city ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse in={openCollapse === ele?.to?.city} unmountOnExit>
                  {ele?.to?.activities &&
                    Object.entries(ele?.to?.activities).map(([key, value]) => (
                      <>
                        <ListItemButton
                          onClick={() => {
                            setOpenByType({
                              ...openByType,
                              [key]: !openByType[key]
                            });
                          }}
                        >
                          <Badge
                            style={{ marginLeft: 100 }}
                            badgeContent={value.length}
                            color="primary"
                          >
                            <ListItemIcon>
                              {listOfActivities[key].icon}
                            </ListItemIcon>
                          </Badge>
                          <ListItemText primary={key} />
                          {openByType[key] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse
                          in={openCollapse === ele?.to?.city && openByType[key]}
                          unmountOnExit
                        >
                          <List>
                            {value.map((r) => (
                              <ListItem
                                alignItems="flex-start"
                                key={r.xid}
                                sx={{ pl: 4 }}
                              >
                                <ListItemText
                                  primary={r.name}
                                  secondary={
                                    <>
                                      {`Longitude: ${r.point.lon} - latitude: ${r.point.lat}`}
                                    </>
                                  }
                                />

                                <div>{`${r.dist.toFixed(2)} m`}</div>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </>
                    ))}
                </Collapse>
              </>
            </List>
          </Box>
        ))}
        {error && <Alert severity="error">{error}</Alert>}
        <Dialog
          open={openShare}
          keepMounted
          onClose={() => openShare(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Copy this link and share it !'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {shareLink}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenShare(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};
