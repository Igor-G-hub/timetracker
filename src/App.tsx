import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import './index.css';
import User from './components/User/User';
import Trackers from './components/Trackers/Trackers'; 
import History from './components/History/History';
import Header from './components/Header/Header';
import { useSelector } from 'react-redux';
import { authSelector } from './redux/selectors/appSelector';
import RequireAuth from './components/RequireAuth/RequireAuth';
import { auth } from './firebase-config';
import store from './store';
import { SET_IS_AUTH } from './redux/actionTypes/appActionType';
import {onAuthStateChanged} from 'firebase/auth';

const App: React.FC = () => {
  const isAuth = useSelector(authSelector);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      console.log("IDE onAuthStateChanged", currentUser);
        store.dispatch({
          type: SET_IS_AUTH,
          payload: {
            isAuth: !!currentUser
          }
        })
     
    })
  }, [])
 
  return (
    <div style={{maxWidth: "1700px", margin: "auto"}}>       
      <BrowserRouter>
      <RequireAuth isAuth={isAuth}>
        <Routes>
          {/* <Route path={ROUTES.login} element={<User />} /> */}
          <Route path={ROUTES.trackers} element={<Trackers />} />
          <Route path={ROUTES.history} element={<History />} />
        </Routes>
        </RequireAuth>
      </BrowserRouter>
    </div>
  );
};

export default App;
