/* eslint-disable valid-jsdoc */
import React, { useEffect, useState, useRef } from 'react';
import './Maps.css';
import ExportTrip from '../../components/ExportTrip/ExportTrip';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Snackbar,
  Alert
} from '@mui/material';
import AuthContext from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlag,
  faFlagCheckered,
  faLocationDot,
  faCirclePlus,
  faDeleteLeft,
  faShareNodes,
  faCloudArrowUp,
  faTrash,
  faFileExport,
  faEye,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MuseumIcon from '@mui/icons-material/Museum';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import CloseIcon from '@mui/icons-material/Close';
import { useParams, Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import parse from 'html-react-parser';
import useAuthContext from '../../contexts/AuthContext';
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN; // Set your mapbox token here

const Maps = () => {
  const { savedActivities, setSavedActivities, setUrlSearch } =
    useAuthContext();
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const popup = useRef();
  const formAddWaypoint = useRef();
  const waypointList = useRef();
  const [directions, setDirection] = useState(null);
  const [waypoints, setWaypoints] = useState([]);

  const { dispatchAPI, token, user } = AuthContext();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [actModalOpen, setActModalOpen] = useState(window.screen.width > 1000);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    text: '',
    showLogin: false
  });
  const [currentCity, setCurrentCity] = useState();

  const {
    from,
    to,
    eats,
    events,
    accomodations,
    transports,
    bars,
    culturals,
    sports
  } = useParams();
  useEffect(() => {
    setUrlSearch(
      `/map/${from}/${to}/${eats}/${events}/${accomodations}/${transports}/${bars}/${culturals}/${sports}`
    );
  }, [
    from,
    to,
    eats,
    events,
    accomodations,
    transports,
    bars,
    culturals,
    sports
  ]);

  const [activities, setActivities] = useState({
    Restaurants: {
      active: JSON.parse(eats),
      icon: <RestaurantMenuIcon sx={{ color: '#ffbf00' }} />,
      color: '#ffbf00',
      data: [],
      markers: []
    },
    Events: {
      active: JSON.parse(events),
      icon: <EmojiEventsIcon sx={{ color: '#fff53b' }} />,
      color: '#fff53b',
      data: [],
      markers: []
    },
    Accommodations: {
      active: JSON.parse(accomodations),
      icon: <HotelIcon sx={{ color: '#2957ff' }} />,
      color: '#2957ff',
      data: [],
      markers: []
    },
    Transports: {
      active: JSON.parse(transports),
      icon: <DirectionsBusIcon sx={{ color: '#00c8ff' }} />,
      color: '#00c8ff',
      data: [],
      markers: []
    },
    Bars: {
      active: JSON.parse(bars),
      icon: <LocalBarIcon sx={{ color: '#f200d6' }} />,
      color: '#f200d6',
      data: [],
      markers: []
    },
    Culturals: {
      active: JSON.parse(culturals),
      icon: <MuseumIcon sx={{ color: '#c800d6' }} />,
      color: '#c800d6',
      data: [],
      markers: []
    },
    Sports: {
      active: JSON.parse(sports),
      icon: <SportsTennisIcon sx={{ color: '#00ff1e' }} />,
      color: '#00ff1e',
      data: [],
      markers: []
    }
  });

  const [coordCityOrigin, setCoordCityOrigin] = useState({
    from: {
      lon: 0,
      lat: 0
    },
    to: {
      lon: 0,
      lat: 0
    }
  });

  /**
   *
   * @param {*} ville
   * @returns
   */
  async function fetchCoordinates(ville) {
    var obj = await dispatchAPI('GET', {
      url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ville}.json?access_token=${mapboxgl.accessToken}`
    }).then((res) => {
      var obj_city = {
        name: res.data.features[0].place_name,
        coordinates: [
          res.data.features[0].geometry.coordinates[0],
          res.data.features[0].geometry.coordinates[1]
        ]
      };
      return obj_city;
    });
    return obj;
  }

  const onChangeActivities = (e, name) => {
    setActivities({
      ...activities,
      [name]: { ...activities[name], active: e.target.checked }
    });
    activities[name].markers.forEach((marker) => {
      if (e.target.checked == true) {
        marker.addTo(map);
      } else {
        marker.remove();
      }
    });
  };
  const showPopup = (formName) => {
    popup.current.style.display = 'flex';
    if (formName === 'addwaypoint') {
      formAddWaypoint.current.style.display = 'flex';
    } else {
      popup.current.style.display = 'none';
    }
  };

  const suggestionSelectAddWaypoint = (e) => {
    popup.current.style.display = 'none';
    formAddWaypoint.current.style.display = 'none';
    fetchCoordinates(e).then((tab) => {
      setWaypoints([...waypoints, tab]);
    });
  };

  const deleteWaypoints = () => {
    for (let i = 0; i < waypoints.length - 1; i++) {
      directions.removeWaypoint(i);
    }
    setWaypoints([]);
  };

  const removeWaypoint = (index, name) => {
    setWaypoints(waypoints.filter((item) => item.name !== name));
    directions.removeWaypoint(index);
  };

  // Export or print trip
  const onCloseExportModal = () => {
    setExportModalOpen(false);
  };

  const generateBodyFileTrip = () => {
    const username = user.username != null ? user.username : '';
    // const emptyActivities = {
    //   Restaurants: [],
    //   Events: [],
    //   Accommodations: [],
    //   Transports: [],
    //   Bars: [],
    //   Culturals: [],
    //   Sports: []
    // };
    const bodyFile = {
      url: '/generate',
      responseType: 'arraybuffer',
      body: {
        report: {
          ...savedActivities,
          from: {
            city: from,
            point: coordCityOrigin.from
          },
          start_date: Date.now(),
          user: {
            ...user,
            username: username
          }
        }
      }
    };

    return bodyFile;
  };

  const getFileFromAPI = async (dataAPI) => {
    const result = await dispatchAPI('POST', dataAPI).then((res) => {
      if (res.status === 200) {
        const buffer = new Uint8Array(res.data.data);
        const file = {
          file: new Blob([buffer], { type: 'application/docx' }),
          status: 200
        };
        return file;
      } else {
        return { file: null, status: res.status };
      }
    });
    return result;
  };

  const onDownloadTrip = async () => {
    console.log(user);

    if (token !== null) {
      const dataAPI = generateBodyFileTrip();
      const rep = await getFileFromAPI(dataAPI);
      let link;
      switch (rep.status) {
        case 200:
          link = document.createElement('a');
          link.download = 'trip.docx';
          link.href = URL.createObjectURL(rep.file);
          link.click();
          URL.revokeObjectURL(link.href);
          break;
        case 401:
          setAlertConfig({
            open: true,
            text: 'You must be logged in to download your trip.',
            showLogin: true
          });
          break;
        default:
          setAlertConfig({ open: true, text: 'Error', showLogin: false });
          break;
      }
    } else {
      setAlertConfig({
        open: true,
        text: 'You must be logged in to download your trip.',
        showLogin: true
      });
    }
  };
  const showMarkerPopup = (tab_activity, une_activity) => {
    activities[tab_activity[0]].markers.map((obj) => {
      if (obj.getPopup().isOpen()) {
        obj.togglePopup();
      }
    });
    var obj_marker = activities[tab_activity[0]].markers[une_activity[0]];
    obj_marker.togglePopup();
  };

  const toggleSaveActivity = (activity, tabName) => {
    let activitiesForWay;
    let typeOfactivity;
    if (currentCity === to) {
      if (
        savedActivities &&
        savedActivities.to &&
        savedActivities.to.activities &&
        savedActivities.to.activities[tabName]
      )
        typeOfactivity = {
          ...savedActivities.to.activities,
          [tabName]: [...savedActivities.to.activities[tabName], activity]
        };
      else {
        typeOfactivity = {
          ...savedActivities?.to?.activities,
          [tabName]: [activity]
        };
      }
    } else {
      activitiesForWay = waypoints.map((ele, index) => {
        console.log(ele);
        if (ele.name === currentCity) {
          if (
            savedActivities.waypoints &&
            savedActivities.waypoints[index] &&
            savedActivities.waypoints[index].activities[tabName]
          ) {
            return {
              city: currentCity,
              point: { lon: ele.coordinates[0], lat: ele.coordinates[1] },
              activities: {
                ...savedActivities?.waypoints[index]?.activities,
                [tabName]: [
                  ...savedActivities.waypoints[index].activities[tabName],
                  activity
                ]
              }
            };
          } else if (
            savedActivities.waypoints &&
            savedActivities.waypoints[index]
          ) {
            return {
              city: currentCity,
              point: { lon: ele.coordinates[0], lat: ele.coordinates[1] },
              activities: {
                ...savedActivities.waypoints[index].activities,
                [tabName]: [activity]
              }
            };
          }
          return {
            city: currentCity,
            point: { lon: ele.coordinates[0], lat: ele.coordinates[1] },
            activities: {
              [tabName]: [activity]
            }
          };
        }
        return {
          city: ele.name,
          point: { lon: ele.coordinates[0], lat: ele.coordinates[1] },
          activities: {
            ...savedActivities?.waypoints[index]?.activities
          }
        };
      });
    }
    const result = {
      ...savedActivities,
      from: {
        city: from,
        point: coordCityOrigin.from
      },
      to: {
        city: to,
        point: coordCityOrigin.to,
        activities: { ...savedActivities?.to?.activities, ...typeOfactivity }
      },
      waypoints: activitiesForWay
    };
    setSavedActivities(result);
  };

  const gestionMarkers = (action, value, activitiesName) => {
    if (action === 'clearAll') {
      Object.entries(activities).map((tab) => {
        if (tab[1].markers != '') {
          Object.entries(tab[1].markers).map((markers) => {
            markers[1].remove();
          });
        }
      });
    } else if (action === 'addMarker') {
      let list_kinds = '';
      let kinds = value.kinds.split(',');
      kinds.map((tab) => {
        list_kinds += tab + ', ';
      });
      const popup = new mapboxgl.Popup({
        offset: [0, 0],
        className: 'popup_style_markers'
      })
        .setLngLat([value.point.lon, value.point.lat])
        .setMaxWidth('300px')
        .addTo(map);

      popup.on('open', (e) => {
        /* Voir XID
        N191031796
        Q2467833
        */
        const json = { xid: value.xid };
        dispatchAPI('POST', {
          url: '/places/details',
          body: json
        }).then((res) => {
          map.flyTo({
            center: [res.data.details.point.lon, res.data.details.point.lat],
            zoom: 13
          });

          var adress = '';
          if (res.data.details.address.road != undefined)
            adress += res.data.details.address.road;
          if (res.data.details.address.postcode != undefined)
            adress += ' ' + res.data.details.address.postcode;
          if (res.data.details.address.village != undefined)
            adress += ' ' + res.data.details.address.village;
          if (res.data.details.address.country != undefined)
            adress += ' ' + res.data.details.address.country;

          e.target.setHTML(
            '<h2>' +
              value.name +
              '</h2><p><strong>' +
              Math.round(value.dist) +
              'm</strong> - <i style="color:grey">' +
              list_kinds +
              '</i></p><p>Adress: ' +
              adress +
              '</p>'
          );
        });
      });

      const marker = new mapboxgl.Marker({
        color: activities[activitiesName].color
      })
        .setLngLat([value.point.lon, value.point.lat])
        .setPopup(popup)
        .addTo(map);

      if (activities[activitiesName].active == false) {
        marker.remove();
      }

      return marker;
    }
  };

  /**
   *
   */
  const getActivitiesByCity = async (e) => {
    const objet = await fetchCoordinates(e.target.value);
    setCurrentCity(e.target.value);
    const json = {
      points: [
        {
          coordinates: [objet.coordinates[0], objet.coordinates[1]]
        }
      ],
      filters:
        'restaurants,accomodations,transport,nightclubs,bars,amusements,cultural,sport'
    };
    dispatchAPI('POST', {
      url: '/places/coordinates',
      body: json
    }).then((res) => {
      const list_activities = {};
      gestionMarkers('clearAll');
      Object.entries(activities).map(([key]) => {
        list_activities[key] = {
          ...activities[key],
          data: [],
          markers: []
        };
      });

      res.data.places[0].map((tab) => {
        if (tab.name != '') {
          let tab_kinds = tab.kinds.split(',');
          tab_kinds.map((kind) => {
            switch (kind) {
              case 'foods':
                list_activities['Restaurants'].data.push(tab);
                list_activities['Restaurants'].markers.push(
                  gestionMarkers('addMarker', tab, 'Restaurants')
                );
                break;
              case 'nightclubs':
                list_activities['Events'].data.push(tab);
                list_activities['Events'].markers.push(
                  gestionMarkers('addMarker', tab, 'Events')
                );
                break;
              case 'accomodations':
                list_activities['Accommodations'].data.push(tab);
                list_activities['Accommodations'].markers.push(
                  gestionMarkers('addMarker', tab, 'Accommodations')
                );
                break;
              case 'transport':
                list_activities['Transports'].data.push(tab);
                list_activities['Transports'].markers.push(
                  gestionMarkers('addMarker', tab, 'Transports')
                );
                break;
              case 'bars':
                list_activities['Bars'].data.push(tab);
                list_activities['Bars'].markers.push(
                  gestionMarkers('addMarker', tab, 'Bars')
                );
                break;
              case 'cultural':
                list_activities['Culturals'].data.push(tab);
                list_activities['Culturals'].markers.push(
                  gestionMarkers('addMarker', tab, 'Culturals')
                );
                break;
              case 'sport':
                list_activities['Sports'].data.push(tab);
                list_activities['Sports'].markers.push(
                  gestionMarkers('addMarker', tab, 'Sports')
                );
                break;
            }
          });
        }
      });

      setActivities(list_activities);
    });
  };
  const saveMyTrip = async () => {
    if (savedActivities && user) {
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
    }
  };

  useEffect(() => {
    const initializeMap = async ({ setMap, mapContainer }) => {
      var origine = await fetchCoordinates(from);
      var destination = await fetchCoordinates(to);

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: origine.coordinates,
        zoom: 8
      });

      setCoordCityOrigin({
        from: {
          lon: origine.coordinates[0],
          lat: origine.coordinates[1]
        },
        to: {
          lon: destination.coordinates[0],
          lat: destination.coordinates[1]
        }
      });

      var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        alternatives: true,
        steps: true,
        overview: 'full',
        annotations: 'duration,speed,distance',
        controls: {
          inputs: false,
          instructions: true
        },
        interactive: false
      });

      map.addControl(directions, 'bottom-left');

      map.on('load', () => {
        setMap(map);
        map.resize();
        directions.setOrigin(origine.coordinates);
        directions.setDestination(destination.coordinates);
        setDirection(directions);

        // var parser = new DOMParser();
        // var doc = parser.parseFromString(directions.container.innerHTML, 'text/html');
        var parsedDirections = parse(directions.container.innerHTML);
        var tripTime =
          parsedDirections.props?.children[0]?.props.children[1]?.props
            .children[3].props.children;
        var tripLength =
          parsedDirections.props?.children[0]?.props.children[1]?.props
            .children[5].props.children;
        var directionsList = [];
        console.log(tripLength);
        console.log(tripTime);
        // console.log(parsedDirections.props.children[0].props.children[3].props.children[1].props.children[1].props.children)
        var array =
          parsedDirections.props.children[0]?.props.children[3]?.props
            .children[1].props.children[1].props.children;
        for (var i = 1; i < array.length - 1; i = i + 2) {
          // console.log(i)
          var dir = {};
          if (i + 2 >= array.length) {
            dir = {
              instruction: array[i].props.children[3].props.children
            };
          } else {
            dir = {
              instruction: array[i].props.children[3].props.children,
              distance: array[i].props.children[5].props.children
            };
          }
          directionsList.push(dir);
        }
      });
    };
    if (!map) initializeMap({ setMap, mapContainer });

    if (directions && waypoints.length > 0) {
      waypoints.map((tab, index) => {
        directions.addWaypoint(index, tab.coordinates);
      });
    }

    addEventListener('resize', () => {
      if (window.screen.width > 1000) {
        setActModalOpen(true);
      } else {
        setActModalOpen(false);
      }
    });
  }, [
    map,
    from,
    to,
    eats,
    events,
    accomodations,
    transports,
    bars,
    culturals,
    sports,
    waypoints
  ]);

  return (
    <div data-testid="map-container">
      <div ref={(el) => (mapContainer.current = el)} className="mapWrapper">
        <div className="popup" ref={popup}>
          <div className="formAddWaypoint" ref={formAddWaypoint}>
            <IconButton
              title="Close popup"
              size="small"
              sx={{
                position: 'absolute',
                right: '5px',
                top: '5px',
                color: '#eb4034'
              }}
              onClick={() => {
                showPopup();
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
            <h2 style={{ marginTop: '5px' }}>Add a waypoint</h2>
            <MapboxAutocomplete
              publicKey={mapboxgl.accessToken}
              inputClass="searchStyle"
              onSuggestionSelect={suggestionSelectAddWaypoint}
              resetSearch={false}
              placeholder="New waypoint"
            ></MapboxAutocomplete>
          </div>
        </div>
        <div className="mapWaypointsContainer">
          <div className="menuActionWaypoint">
            <IconButton
              aria-label="create_waypoint"
              title="Save the trip"
              size="small"
              color="primary"
              disabled={!user}
              onClick={() => saveMyTrip()}
            >
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </IconButton>
            <IconButton
              aria-label="create_waypoint"
              title="Add a waypoint"
              size="small"
              color="primary"
              onClick={() => {
                showPopup('addwaypoint');
              }}
            >
              <FontAwesomeIcon icon={faCirclePlus} />
            </IconButton>
            <IconButton
              aria-label="create_waypoint"
              title="Delete all waypoints"
              size="small"
              color="primary"
              disabled
              onClick={() => deleteWaypoints}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
            <IconButton
              aria-label="create_waypoint"
              title="Share your trip"
              size="small"
              color="primary"
              disabled
            >
              <FontAwesomeIcon icon={faShareNodes} />
            </IconButton>
            <IconButton
              aria-label="export_trip"
              title="Export the trip"
              size="small"
              color="primary"
              onClick={() => {
                setExportModalOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faFileExport} />
            </IconButton>
            <Link to={{ pathname: `/profile/${user?.id}` }}>
              <IconButton
                aria-label="create_waypoint"
                title="Toggle menu visibility"
                size="small"
                color="primary"
                disabled={!user || !token}
              >
                <FontAwesomeIcon icon={faEye} />
              </IconButton>
            </Link>
            <IconButton
              aria-label="create_waypoint"
              title="Choose activities"
              size="small"
              color="primary"
              className="btn-activities-mobile"
              onClick={() => {
                setActModalOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faLocationDot} />
            </IconButton>
          </div>
          <div className="listWaypointsContainer">
            <div className="waypointsContainer">
              <FontAwesomeIcon icon={faFlag} />
              <span className="textWaypoints">{from}</span>
            </div>
            <div ref={waypointList}>
              {waypoints.map((tab, index) => {
                return (
                  <div key={tab.name} className="waypointsContainer">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span className="textWaypoints">{tab.name}</span>
                    <IconButton
                      aria-label="delete_waypoint"
                      color="error"
                      size="small"
                      onClick={() => removeWaypoint(index, tab.name)}
                    >
                      <FontAwesomeIcon fontSize="inherit" icon={faDeleteLeft} />
                    </IconButton>
                  </div>
                );
              })}
            </div>
            <div className="waypointsContainer">
              <FontAwesomeIcon icon={faFlagCheckered} />
              <span className="textWaypoints">{to}</span>
            </div>
          </div>
        </div>
        <Link className="backHomeButton" to={{ pathname: `/` }}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#8A8ACB' }}
            startIcon={<ArrowBackIcon />}
          >
            Back Home
          </Button>
        </Link>
        {actModalOpen && (
          <div className="mapActivitiesContainer">
            <div className="act-title">
              <h2>Activities</h2>
              <IconButton
                onClick={() => {
                  setActModalOpen(false);
                }}
                className="act-modal-close"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className="checkboxContainer">
              {Object.entries(activities).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      onChange={(event) => onChangeActivities(event, key)}
                      sx={{
                        color: '#3BB2D0',
                        '&.Mui-checked': { color: '#8A8ACB' }
                      }}
                    />
                  }
                  label={key}
                  checked={value.active}
                />
              ))}
            </div>
            <div className="selectCityContainer">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">City</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="City"
                  onChange={getActivitiesByCity}
                >
                  <MenuItem value="default" disabled>
                    Choose a city
                  </MenuItem>
                  {waypoints.map((tab) => {
                    return (
                      <MenuItem key={tab.name} value={tab.name}>
                        {tab.name}
                      </MenuItem>
                    );
                  })}
                  <MenuItem value={to}>{to}</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              {Object.entries(activities).map((tab) => {
                let empty_activities = false;
                if (tab[1].data == '') {
                  empty_activities = true;
                }
                if (tab[1].active) {
                  return (
                    <Accordion key={tab} disabled={empty_activities}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{tab[0]}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List sx={{ width: '100%' }}>
                          {Object.entries(tab[1].data).map((tab_places) => {
                            let list_kinds = tab_places[1].kinds.split(',');
                            if (tab_places[1].name != '') {
                              return (
                                <ListItemButton
                                  key={tab_places}
                                  alignItems="flex-start"
                                >
                                  <ListItemAvatar
                                    onClick={() =>
                                      showMarkerPopup(tab, tab_places)
                                    }
                                  >
                                    {tab[1].icon}
                                  </ListItemAvatar>
                                  <ListItemText
                                    onClick={() =>
                                      showMarkerPopup(tab, tab_places)
                                    }
                                    primary={tab_places[1].name}
                                    secondary={
                                      <React.Fragment>
                                        <Typography
                                          sx={{ display: 'inline' }}
                                          component="span"
                                          variant="body2"
                                          color="text.primary"
                                        >
                                          {Math.round(tab_places[1].dist)}m
                                        </Typography>
                                        {' - '}
                                        {Object.entries(list_kinds).map(
                                          (val) => {
                                            return val[1] + ', ';
                                          }
                                        )}
                                      </React.Fragment>
                                    }
                                  />
                                  {/* <Checkbox
                                  onClick={(e) => {
                                    toggleSaveActivity(tab_places[1], e.target.checked)
                                  }}
                                  sx={{
                                    color: tab[1].color,
                                    '&.Mui-checked': { color: tab[1].color }
                                  }}
                                /> */}
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                      // console.log(tab)
                                      toggleSaveActivity(tab_places[1], tab[0]);
                                    }}
                                  >
                                    +
                                  </Button>
                                </ListItemButton>
                              );
                            }
                          })}
                          ;
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
      <ExportTrip
        open={exportModalOpen}
        onClose={onCloseExportModal}
        onDownload={onDownloadTrip}
        activities={savedActivities}
      />
      <Snackbar
        open={alertConfig.open}
        autoHideDuration={6000}
        onClose={() => {
          setAlertConfig({
            open: false,
            text: alertConfig.text,
            showLogin: alertConfig.showLogin
          });
        }}
      >
        <Alert
          severity="error"
          onClose={() => {
            setAlertConfig({
              open: false,
              text: alertConfig.text,
              showLogin: alertConfig.showLogin
            });
          }}
        >
          {alertConfig.text + ' '}
          {alertConfig.showLogin && <Link to="/signin">Sign in</Link>}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Maps;
