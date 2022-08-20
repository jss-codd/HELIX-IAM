import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { KeycloackContextProvider } from './components/Keycloack/KeycloackContext';

/*
Version : 1.0.1,
Author: Aniket Pandey ,
Date: 21 july 2022,
changes: add feature of add , update. delete application.

Version : 1.0.2,
Author: Aniket Pandey ,
Date: 19 Aug 2022,
changes: fix uppercase application and logo issue .
*/

ReactDOM.render(
  <React.StrictMode>
   <KeycloackContextProvider>
   <App />
   </KeycloackContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
