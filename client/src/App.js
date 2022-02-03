import React,{Fragment,useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import './App.css';
import MessengerPage from './views/public/messenger/messengerPage';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<MessengerPage title="Messenger" />} />
        </Routes>
      </Router>

    </Fragment>
  );
}

export default App;
