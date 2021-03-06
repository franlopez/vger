import React from 'react';
import {render} from 'react-dom';

import Vger from './components/Vger.jsx';

function start() {
  render(<Vger/>, document.getElementById('app'));
}

var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
if ( isApp ) {
  // Running on PhoneGap
  document.addEventListener("deviceready", start, false);
} else {
  // Running on Browser
  start();
}
