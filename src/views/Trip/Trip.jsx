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
  Badge
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
import styles from '../../styles/styles';
import AuthContext from '../../contexts/AuthContext';

const theme = createTheme();

export const Trip = () => {
  const { dispatchAPI } = AuthContext();
  const [openCollapse, setOpenCollapse] = React.useState(false);
  const [openByType, setOpenByType] = React.useState({
    Restaurants: false,
    Events: false,
    Accomodations: false,
    Transports: false,
    Bars: false,
    Culturals: false,
    Sports: false
  });

  const [trip, setTrip] = useState();
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
    const response = await dispatchAPI('GET', { url: `/trip/byid/${id}` });
    setTrip(response.data.trip);
  };
  useEffect(() => {
    getData();
  }, [id]);
  const displayOrnOtCollapse = (city) => {
    if (openCollapse) {
      setOpenCollapse(false);
    } else setOpenCollapse(city);
  };
  return (
    trip && (
      <ThemeProvider theme={theme}>
        <div style={styles.backgroundTrip} component="main" maxWidth="xl">
          <p style={styles.title_principal}>
            Road <span style={{ color: 'orange' }}>Trip</span>, Road{' '}
            <span style={{ color: 'orange' }}>Life</span>
          </p>
          <Box
            key={trip._id}
            style={{
              border: '0.2px solid',
              width: '70%',
              backgroundColor: 'white'
            }}
          >
            <List
              subheader={
                <ListSubheader
                  component="div"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h3 className="exporttrip-list-title">Summary</h3>
                </ListSubheader>
              }
            >
              <ListItemButton
                onClick={() => {
                  displayOrnOtCollapse(trip?.from?.city);
                }}
              >
                <ListItemText primary={`From : ${trip?.from?.city}`} />
              </ListItemButton>

              {trip?.waypoints?.map((way) => (
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
                    displayOrnOtCollapse(trip?.to?.city);
                  }}
                >
                  <ListItemIcon>
                    <RoomIcon />
                  </ListItemIcon>
                  <ListItemText primary={trip?.to?.city} />
                  {openCollapse === trip?.to?.city ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse in={openCollapse === trip?.to?.city} unmountOnExit>
                  {trip?.to?.activities &&
                    Object.entries(trip?.to?.activities).map(([key, value]) => (
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
                          in={
                            openCollapse === trip?.to?.city && openByType[key]
                          }
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
        </div>
      </ThemeProvider>
    )
  );
};
