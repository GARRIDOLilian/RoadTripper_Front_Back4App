/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Carousel } from '@trendyol-js/react-carousel';
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import './Home.css';
import background_image from '../../assets/background_image.jpg';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN; // Set your mapbox token here

export const Home = () => {
  var items = [
    { id: 'aiYpDDHKy18' },
    { id: 'U7GERQe49uQ' },
    { id: 'i6aysLjPYqs' }
  ];

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [activities, setActivities] = useState({
    Restaurants: false,
    Events: false,
    Accommodations: false,
    Transports: false,
    Bars: false,
    Culturals: false,
    Sports: false
  });

  function suggestionSelectFrom(result) {
    // , lat, lon, text
    setFrom(result);
  }
  function suggestionSelectTo(result) {
    // , lat, lon, text
    setTo(result);
  }

  const onChangeActivities = (e, name) => {
    setActivities({ ...activities, [name]: e.target.checked });
  };

  return (
    <div data-testid="home-container">
      <div
        style={{ backgroundImage: 'url(' + background_image + ')' }}
        className="background-container"
      >
        <p className="title-principal">
          Road <span style={{ color: 'orange' }}>Trip</span>, Road{' '}
          <span style={{ color: 'orange' }}>Life</span>
        </p>
        <div className="form-search">
          <div className="form-row">
            <MapboxAutocomplete
              publicKey={accessToken}
              inputClass="search_style"
              onSuggestionSelect={suggestionSelectFrom}
              resetSearch={false}
              placeholder="From"
            ></MapboxAutocomplete>

            <KeyboardDoubleArrowRightIcon className="arrow-right" />

            <MapboxAutocomplete
              publicKey={accessToken}
              inputClass="search_style"
              onSuggestionSelect={suggestionSelectTo}
              resetSearch={false}
              placeholder="To"
            ></MapboxAutocomplete>

            <Link
              style={{ textDecoration: 'none' }}
              className="btn-travel"
              to={{
                pathname: `/map/${from}/${to}/${activities.Restaurants}/${activities.Events}/${activities.Accommodations}/${activities.Transports}/${activities.Bars}/${activities.Culturals}/${activities.Sports}`
              }}
            >
              <Button
                variant="contained"
                className="button-style"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#111111',
                  padding: '15px 50px',
                  textDecoration: 'none'
                }}
                endIcon={<FlightIcon />}
              >
                Travel
              </Button>
            </Link>
          </div>
          <div className="formRowNotCentered">
            <FormGroup>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginLeft: 12
                }}
              >
                {Object.entries(activities).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        onChange={() => onChangeActivities(event, key)}
                        sx={{
                          color: '#000000',
                          '&.Mui-checked': { color: '#111111' }
                        }}
                      />
                    }
                    label={key}
                    checked={value}
                  />
                ))}
              </div>
            </FormGroup>
          </div>
        </div>
      </div>
      <div className="video-container">
        <p className="title-principal">
          <span style={{ color: 'orange' }}>Shared Experiences</span>
        </p>
        <div className="caroussel-container">
          <Carousel
            show={1}
            style={{ overflow: 'hidden' }}
            leftArrow={
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <KeyboardArrowLeftIcon className="arrow-slider" />
              </div>
            }
            rightArrow={
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <KeyboardArrowRightIcon className="arrow-slider" />
              </div>
            }
          >
            {items.map((item) => (
              <div
                key={item}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <iframe
                  width="853"
                  height="480"
                  src={`https://www.youtube.com/embed/` + item.id}
                  title={item.id}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};
