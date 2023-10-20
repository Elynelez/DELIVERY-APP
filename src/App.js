import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarNavigation from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

// auth
import { useAuth0 } from '@auth0/auth0-react';

// pages
import CoursiersTable from './pages/DeliveryPages/CoursiersTable';
import ExternalServiceApp from './pages/DeliveryPages/ExternalServiceApp';
import DeliveryApp from './pages/DeliveryPages/DeliveryApp';
import AllOrders from './pages/DeliveryPages/AllOrders';
import Dashboard from './pages/DefaultPages/Dashboard';
import SellerTable from './pages/SellerPages/SellerTable';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

const logisticEmails = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com"]
const bossEmails = ["contableducor@gmail.com", "pedidos.ducor@gmail.com", "inducorsas@gmail.com"]
const sellerEmails = ["pedidos.ducor@gmail.com"]



function App() {
  const { isAuthenticated, user } = useAuth0();
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className='flex'>
            <Sidebar couriers={["Brayan", "Edgar", "Juan David", "Raul", "Richard", "Estiven", "Nicolas", "Alexander", "Hernando", "Julian Morales", "Juano"]} />
            <div className='content'>
              <NavbarNavigation user={user} isAuthenticated={isAuthenticated} />
              <Routes>
                <Route exact path="/" element={<Dashboard />} />
                {isAuthenticated && logisticEmails.includes(user.email) && (
                  <>
                    <Route exact path="/DeliveryApp" element={<DeliveryApp />} />
                    <Route exact path="/ExternalServiceApp" element={<ExternalServiceApp />} />
                  </>
                )}
                {isAuthenticated && (bossEmails.includes(user.email) || logisticEmails.includes(user.email)) && (
                  <>
                    <Route exact path="/Mensajeros/:id" element={<CoursiersTable />} />
                    <Route exact path="/AllOrders" element={<AllOrders />} />
                  </>
                )}
                {isAuthenticated && sellerEmails.includes(user.email) && (
                  <>
                    <Route exact path="/Sales" element={<SellerTable />} />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App;





