import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import './index.css';
import Login from './components/Login/Login';
import Trackers from './components/Trackers/Trackers'; 
import History from './components/History/History';
import Logout from './components/Logout/Logout';
import Header from './components/Header/Header';

const App: React.FC = () => {
  return (
    <div style={{maxWidth: "1700px", margin: "auto"}}>       
      <BrowserRouter>
      <Header/>  
        <Routes>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.trackers} element={<Trackers />} />
          <Route path={ROUTES.history} element={<History />} />
          <Route path={ROUTES.logout} element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
