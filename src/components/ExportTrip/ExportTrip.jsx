import React from 'react';
import { useNavigate } from 'react-router-dom';
import './exportTrip.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItem
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
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
import useAuthContext from '../../contexts/AuthContext';

export const ExportTrip = ({ open, onClose, onDownload, activities }) => {
  const navigate = useNavigate();
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
  const { user, dispatchAPI, savedActivities, token, setSavedActivities } =
    useAuthContext();
  const onCloseExport = () => {
    onClose();
  };
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

  const saveMyTrip = async () => {
    if (!savedActivities._id) {
      const response = await dispatchAPI('POST', {
        url: '/trip',
        body: { user: user.id, ...savedActivities }
      });
      setSavedActivities(response.data.result);
    } else {
      await dispatchAPI('PATCH', {
        url: `/trip/${savedActivities._id}`,
        body: savedActivities
      });
    }
  };
  const displayOrnOtCollapse = (city) => {
    if (openCollapse) {
      setOpenCollapse(false);
    } else setOpenCollapse(city);
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseExport}
      maxWidth="sm"
      fullWidth={true}
      data-testid="exporttrip-container"
    >
      <DialogTitle className="exporttrip-title-container">
        <span>Export your trip !</span>
        <IconButton
          onClick={() => {
            onCloseExport();
          }}
          data-testid="exporttrip-btn-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <p>
          <b>Download or print</b> your trip with activities !
        </p>
        <List
          subheader={
            <ListSubheader component="div">
              <h3 className="exporttrip-list-title">Summary</h3>
            </ListSubheader>
          }
        >
          <ListItemButton
            onClick={() => {
              displayOrnOtCollapse(activities?.from);
            }}
          >
            <ListItemText primary={`From : ${activities?.from?.city}`} />
          </ListItemButton>

          {activities?.waypoints?.map((way) => (
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
                {openCollapse === way.city ? <ExpandLess /> : <ExpandMore />}
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
                      <ListItemIcon>{listOfActivities[key].icon}</ListItemIcon>
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
                            <ListItemText primary={r.name} />
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
                displayOrnOtCollapse(activities?.to?.city);
              }}
            >
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary={activities?.to?.city} />
              {openCollapse === activities?.to?.city ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
            <Collapse in={openCollapse === activities?.to?.city} unmountOnExit>
              {activities?.to?.activities &&
                Object.entries(activities?.to?.activities).map(
                  ([key, value]) => (
                    <>
                      <ListItemButton
                        onClick={() => {
                          setOpenByType({
                            ...openByType,
                            [key]: !openByType[key]
                          });
                        }}
                      >
                        <ListItemIcon>
                          {listOfActivities[key].icon}
                        </ListItemIcon>
                        <ListItemText primary={key} />
                        {openByType[key] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse
                        in={
                          openCollapse === activities?.to?.city &&
                          openByType[key]
                        }
                        unmountOnExit
                      >
                        <List>
                          {value.map((r) => (
                            <ListItem key={r.xid} sx={{ pl: 4 }}>
                              <ListItemText primary={r.name} />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </>
                  )
                )}
            </Collapse>
          </>
        </List>
      </DialogContent>

      <DialogActions
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {!user || !token ? (
          <Button
            variant="text"
            onClick={() => {
              navigate('/signin', { replace: true });
            }}
          >
            Login for save your trip
          </Button>
        ) : (
          <Button
            startIcon={<FileDownloadIcon />}
            variant="contained"
            disabled={!user || !token}
            onClick={() => {
              saveMyTrip();
            }}
          >
            Save my trip
          </Button>
        )}
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          onClick={() => {
            onDownload();
          }}
          data-testid="exporttrip-btn-download"
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportTrip;
