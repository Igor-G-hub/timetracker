import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { ROUTES } from './routes';
import { TabMenu } from 'primereact/tabmenu';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import Login from './components/Login/Login';
import Trackers from './components/Trackers/Trackers'; 
import History from './components/History/History';
import Logout from './components/Logout/Logout';

const App: React.FC = () => {
  const items = [
    {label: 'Trackers', icon: 'pi pi-fw pi-home'},
    {label: 'History', icon: 'pi pi-fw pi-calendar'},
    {label: 'Logout', icon: 'pi pi-fw pi-pencil'},
];
  return (
    <>
       <div>
            <div style={{display: "flex"}}>
                <h5 >Logo</h5>
                <TabMenu model={items}/>
            </div>          
        </div>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.trackers} element={<Trackers />} />
        <Route path={ROUTES.history} element={<History />} />
        <Route path={ROUTES.logout} element={<Logout />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
