import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarNavigation from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

// auth
import { useAuth0 } from '@auth0/auth0-react';

// pages
import TableDelivery from './pages/PrincipalUser/Table';
import ExternalService from './pages/PrincipalUser/ExternalService';
import Delivery from './pages/PrincipalUser/Delivery';
import LastOrders from './pages/PrincipalUser/LastOrders';
import ReviewOrders from './pages/SecondUser/ReviewOrders';
import DefaultInfo from './pages/DefaultInfo';

const emailPrincipal = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com", "elinarnyex@gmail.com", "mysql.ducor@gmail.com"]
const emailSecondly = ["contableducor@gmail.com", "pedidos.ducor@gmail.com", "inducorsas@gmail.com"]



function App() {
  const { isAuthenticated, user } = useAuth0();

  switch (true) {
    case isAuthenticated && emailPrincipal.includes(user.email):
      return (<Router>
        {/* {JSON.stringify(user)} */}
        <div className='flex'>
          <Sidebar couriers={["Brayan", "Omar", "Edgar", "Jairo", "Juan David", "Raul", "Richard", "Estiven", "Nicolas", "Alexander", "Juano"]} />
          <div className='content'>
            <NavbarNavigation user={user} isAuthenticated={isAuthenticated} />
            <Routes>
              <Route exact={true} path="/" Component={Delivery} />
              <Route exact={true} path="/ExternalService" Component={ExternalService} />
              <Route exact={true} path="/Mensajeros/:id" Component={TableDelivery} />
              <Route exact={true} path="/LastOrders" Component={LastOrders} />
            </Routes>
          </div>
        </div>
      </Router>
      )
    case isAuthenticated && emailSecondly.includes(user.email):
      return (
        <Router>
          <ReviewOrders>
            <div className='content'>
              <NavbarNavigation user={user} isAuthenticated={isAuthenticated} />
              <Routes>
                <Route exact={true} path="/" Component={LastOrders} />
              </Routes>
            </div>
          </ReviewOrders>
        </Router>
      )
    default:
      return (
        <div>
          <NavbarNavigation user={user} isAuthenticated={isAuthenticated} />
          <DefaultInfo />
        </div>
      )
  }
}

export default App;





