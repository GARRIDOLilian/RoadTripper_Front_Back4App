import background_image from '../assets/background_image.jpg';

const styles = {
  backgroundContainer: {
    backgroundImage: 'url(' + background_image + ')'
  },
  backgroundTrip: {
    backgroundImage: 'url(' + background_image + ')',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'nowrap'
  },
  formSearch: {
    backgroundColor: 'rgba(255, 145, 0, 0.7)',
    width: '70%',
    padding: '20px 20px',
    borderRadius: '5px',
    flexDirection: 'column',
    alignItems: 'center'
  },

  formRow: {
    padding: '10px 0px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  formRowNotCentered: {
    padding: '0px 12px',
    display: 'flex',
    flexDirection: 'row'
  },

  title_principal: {
    fontSize: '6vw',
    fontWeight: 'bold',
    color: 'white',
    margin: '30px'
  },

  buttonDefault: {
    backgroundColor: 'orange',
    borderColor: 'rgba(255, 145, 0)'
  },

  buttonStyle: {
    backgroundColor: '#111111',
    borderColor: '#111111',
    padding: '15px 50px',
    textDecoration: 'none'
  },

  inputSearch: {
    backgroundColor: 'white',
    borderRadius: '5px'
  },

  arrowRight: {
    fontSize: '53px',
    margin: '10px',
    alignItems: 'center'
  },

  arrowSlider: {
    fontSize: '53px',
    margin: '0'
  },

  videoContainer: {
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center'
  },

  carousselContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%'
  },

  footerStyle: {
    width: '100%',
    backgroundColor: '#141414',
    marginTop: '100px',
    padding: '20px 0',
    color: 'grey',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '0.5px'
  },

  footerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  footerRow2: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '30vw'
  },

  footerRow3: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'right',
    justifyContent: 'space-between',
    width: '30vw',
    flexFlow: 'row-reverse'
  }
};

export default styles;
