const theme = {
  palette: {
    primary: {
      main: '#09869a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#03182b',
      contrastText: '#fff',
    },
    lightGray: {
      main: '#efefef',
      dark: '#cfcfcf',
      contrastText: '#333',
    },
    black: {
      main: '#333',
      contrastText: '#fff',
    },
    white: {
      main: '#fff',
      contrastText: '#333',
    },
  },
  text: {
    primary: '#333',
    white: '#fff',
    placeholder: '#757575',
    disabled: '#c0c0c0',
  },
  layout: {
    pc: {
      containerWidth: '1280px',
      headerHeight: '80px',
      headerDenseHeight: '56px',
      footerHeight: '250px',
      heroHeight: '420px',
      pankuzuHeight: '40px',
      content: {
        titleHeight: '240px',
        width: '1280px',
        xPadding: '20px',
      },
      headerFixedPos: 200,
    },
    sp: {
      containerWidth: '375px',
      headerHeight: '60px',
      headerDenseHeight: '60px',
      footerHeight: '40px',
      heroHeight: '230px',
      pankuzuHeight: '20px',
      content: {
        titleHeight: '120px',
        width: '100%',
        xPadding: '20px',
      },
      headerFixedPos: 100,
    },
  },
  breakpoints: {
    sp: 640,
    pcSm: 1280,
    pc: Infinity,
  },
};

export default theme;
