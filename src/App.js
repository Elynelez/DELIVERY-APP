import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import ESTable from './pages/DeliveryPages/ESTable';
import SellerCar from './pages/SellerPages/SellerCar';
import SellerForm from './pages/SellerPages/SellerForm';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

const logisticEmails = ["pedidos.ducor@gmail.com", "logistica.inducor@gmail.com",]
const bossEmails = ["pedidos.ducor@gmail.com", "contableducor@gmail.com", "inducorsas@gmail.com"]
const sellerEmails = ["pedidos.ducor@gmail.com"]
const ExternalServiceEmails = ["pedidos.ducor@gmail.com", "inducorsas@gmail.com", "linap.inducor@gmail.com"]



function App() {
  const { isAuthenticated, user } = useAuth0();
  const [theme, colorMode] = useMode();

  const [allProducts, setAllProducts] = useState(() => {
    const savedProducts = localStorage.getItem("allProducts");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem("total");
    return savedTotal ? Number(savedTotal) : 0;
  })
  const [countProducts, setCountProducts] = useState(() => {
    const savedCount = localStorage.getItem("countProducts");
    return savedCount ? Number(savedCount) : 0;
  })


  
  useEffect(() => {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    localStorage.setItem("total", total)
    localStorage.setItem("countProducts", countProducts)
  }, [allProducts]);


  // return (
  //   <ColorModeContext.Provider value={colorMode}>
  //     <ThemeProvider theme={theme}>
  //       <CssBaseline />
  //       <Router>
  //         <div className='flex'>
  //           <Sidebar couriers={["Brayan", "Edgar", "Juan David", "Raul", "Richard", "Estiven", "Nicolas", "Alexander", "Hernando", "Julian Morales", "Juano"]} />
  //           <div className='content'>
  //             <NavbarNavigation
  //               user={user}
  //               isAuthenticated={isAuthenticated}
  //               allProducts={allProducts}
  //               setAllProducts={setAllProducts}
  //               total={total} setTotal={setTotal}
  //               countProducts={countProducts}
  //               setCountProducts={setCountProducts}
  //             />
  //             <Routes>
  //               <Route exact path="/"
  //                 element={
  //                   <SellerCar
  //                     allProducts={allProducts}
  //                     setAllProducts={setAllProducts}
  //                     total={total} setTotal={setTotal}
  //                     countProducts={countProducts}
  //                     setCountProducts={setCountProducts}
  //                   />} />
  //               <Route exact path="/mensajeros/ExternalService" element={<ESTable bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
  //               <Route exact path="/AllOrders" element={<AllOrders bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
  //               <Route exact path="/order/form" element={<SellerForm allProducts={allProducts}/>} />
  //             </Routes>
  //           </div>
  //         </div>
  //       </Router>
  //     </ThemeProvider>
  //   </ColorModeContext.Provider>
  // )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className='flex'>
            <Sidebar couriers={["Brayan", "Edgar", "Juan David", "Raul", "Richard", "Estiven", "Nicolas", "Alexander", "Hernando", "Julian Morales", "Juano"]} />
            <div className='content'>
              <NavbarNavigation
                user={user}
                isAuthenticated={isAuthenticated}
                allProducts={allProducts}
                setAllProducts={setAllProducts}
                total={total} 
                setTotal={setTotal}
                countProducts={countProducts}
                setCountProducts={setCountProducts}
              />
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
                    <Route exact path="/mensajeros/:id" element={<CoursiersTable bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
                    <Route exact path="/AllOrders" element={<AllOrders bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
                  </>
                )}
                {isAuthenticated && sellerEmails.includes(user.email) && (
                  <>
                    <Route exact path="/Sales" element={<SellerTable />} />
                  </>
                )}
                {isAuthenticated && (bossEmails.includes(user.email) || ExternalServiceEmails.includes(user.email)) && (
                  <>
                    <Route exact path="/mensajeros/ExternalService" element={<ESTable ExternalServiceEmails={ExternalServiceEmails} />} />
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





