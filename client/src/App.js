import React,{Fragment,useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import './App.css';
import MessengerPage from './views/public/messenger/messengerPage';
import {useDispatch,useSelector} from 'react-redux';
import LoginPage from './views/public/authentication/loginPage';
import {userLogout,setUserInfo} from './features/user';
import {userTokenValidationApiCall} from './services/authentication';
import ChatPage from './views/public/messenger/chatPage';
function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value);
  
  useEffect(() => {
    const verifyToken = async() => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if(!accessToken){
          dispatch(userLogout());
          return false;
        }
        await userTokenValidationApiCall(accessToken).then(res => {
          if(res.status === 200){
            dispatch(setUserInfo({
              id: res.data.user.id,
              name: res.data.user.firstName + ' ' + res.data.user.lastName,
              email: res.data.user.email,
              isLoggedIn: true,
            }));
            return true;
          }
        }).catch(err => {
          dispatch(userLogout());
          return false;
        }
        );
      }catch(e){
          dispatch(userLogout());
          console.log(e);
          return false;
        }
    }
    verifyToken();
  } ,[dispatch]);

  return (
    <Fragment>
      <Router>
        <Routes>
          {/* <Route path="/" element={user.isLoggedIn ?<MessengerPage title="Messenger | KhalilDevs" />:<Navigate to="/login" />} /> */}
          <Route path="/messenger/" element={<MessengerPage title="Messenger | KhalilDevs" />} />
          <Route path="/chat/" element={user.isLoggedIn ?<ChatPage title="Messenger | KhalilDevs" />:<Navigate to="/login" />} />
          <Route path="/login" element={user.isLoggedIn ?<Navigate to="/chat" /> :<LoginPage title="Login | KhalilDevs" />} />
        </Routes>
      </Router>

    </Fragment>
  );
}

export default App;
