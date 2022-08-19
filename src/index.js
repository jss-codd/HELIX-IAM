import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { KeycloackContextProvider } from './components/Keycloack/KeycloackContext';

/* 
Version : 1.0.0,
Author: Aniket Pandey ,
Date: 21 july 2022,
changes: remove permissions to view user list.
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
