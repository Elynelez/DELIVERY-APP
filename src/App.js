import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarNavigation from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';
import { io } from 'socket.io-client';

// auth
import { useAuth0 } from '@auth0/auth0-react';

// pages
import Dashboard from './pages/DefaultPages/Dashboard';
import SellerTable from './pages/SellerPages/SellerTable';
import SellerCar from './pages/SellerPages/SellerCar';
import SellerForm from './pages/SellerPages/SellerForm';
import CreateProduct from './pages/PackagePages/InventoryPages/CreateProduct';
import EditProduct from './pages/PackagePages/InventoryPages/EditProduct';
import EnterForm from './pages/PackagePages/EnterPages/EnterForm';
import EnterTable from './pages/PackagePages/EnterPages/EnterTable';
import ExitForm from './pages/PackagePages/ExitPages/ExitForm';
import ExitTable from './pages/PackagePages/ExitPages/ExitTable';
import CashForm from './pages/PackagePages/ExitPages/CashForm';
import PendingOrders from './pages/PackagePages/ExitPages/PendingOrders';
import InventoryTable from './pages/PackagePages/InventoryPages/InventoryTable';
import SettingTable from './pages/PackagePages/SettingPages/SettingTable';
import DeliveryTable from './pages/DeliveryPages/DeliveryTable';
import DeliveryForm from './pages/DeliveryPages/DeliveryForm';
import PlatformTable from './pages/AccountingPages/PlatformTable';
import CSVReader from './pages/AccountingPages/RappiForm';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// middlewares

// API URL'S
const API_URL_DELIVERY = "https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec"
const API_DUCOR = "https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?path="
// const URL_SERVER = 'http://localhost:' + 8080
const URL_SERVER = "https://server-cloud-mggp.onrender.com"

// Logistic Shipping
const logisticEmails = ["pedidos.ducor@gmail.com", "logistica.inducor@gmail.com"]
const ExternalServiceEmails = ["xsharick08@gmail.com"]

// Boss Functions
const bossEmails = ["pedidos.ducor@gmail.com", "contableducor@gmail.com", "inducorsas@gmail.com"]

// Sells
const sellerEmails = ["pedidos.ducor@gmail.com"]

// Inventory
const entriesInventoryEmails = ["pedidos.ducor@gmail.com", "inducorsas@gmail.com", "aocampo.inducor@gmail.com", "ainducor@gmail.com", "rramirez.inducor@gmail.com"]
const exitsInventoryEmails = ["pedidos.ducor@gmail.com", "inducorsas@gmail.com", "aocampo.inducor@gmail.com", "aforero.inducor@gmail.com", "empaque.inducor@gmail.com", "londono.ducor89@gmail.com", "pbello.inducor@gmail.com"]
const settingInventoryEmails = ["pedidos.ducor@gmail.com", "aocampo.inducor@gmail.com", "rramirez.inducor@gmail.com"]

const socket = io(URL_SERVER);

function App() {
  const { isAuthenticated, user } = useAuth0();
  const [theme, colorMode] = useMode();

  const [allProducts, setAllProducts] = useState(() => {
    const savedProducts = localStorage.getItem("allProducts");
    return savedProducts ? JSON.parse(savedProducts) : [];
  })

  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem("total");
    return savedTotal ? Number(savedTotal) : 0;
  })

  const [countProducts, setCountProducts] = useState(() => {
    const savedCount = localStorage.getItem("countProducts");
    return savedCount ? Number(savedCount) : 0;
  })

  const [rangeItems, setRangeItems] = useState([])

  const [ordersData, setOrdersData] = useState([])

  const [deliveryData, setDeliveryData] = useState([])

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Conexión exitosa:', socket.id);
    });


    socket.on('connect_error', (error) => {
      console.error('Error en la conexión:', error);
    });

    socket.on('connect_timeout', (timeout) => {
      console.error('Tiempo de conexión agotado:', timeout);
    });

    socket.on('error', (error) => {
      console.error('Error general:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Desconectado:', reason);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('connect_timeout');
      socket.off('error');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    socket.on('getProducts', (loadedData) => {
      try {
        setRangeItems(loadedData);
      } catch (error) {
        console.error('Error handling dataInventory event:', error);
      }
    });
  }, [socket, rangeItems])

  useEffect(() => {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    localStorage.setItem("total", total)
    localStorage.setItem("countProducts", countProducts)
  }, [allProducts]);

  const receiveOrders = order => setOrdersData(state => [order, ...state])

  // return (
  //   <ColorModeContext.Provider value={colorMode}>
  //     <ThemeProvider theme={theme}>
  //       <CssBaseline />
  //       <Router>
  //         <div className='flex'>
  //           <Sidebar
  //             couriers={["brayan", "edgar", "raul", "richard", "estiven", "hernando", "juano", "servicio externo"]}
  //             platforms={["SHOPIFY", "FALABELLA", "MERCADOLIBRE", "RAPPI", "DCBOGOTA", "DCMEDELLIN"]}
  //             logisticEmails={logisticEmails}
  //             bossEmails={bossEmails}
  //             sellerEmails={sellerEmails}
  //             ExternalServiceEmails={ExternalServiceEmails}
  //             exitsInventoryEmails={exitsInventoryEmails}
  //             entriesInventoryEmails={entriesInventoryEmails}
  //             settingInventoryEmails={settingInventoryEmails}
  //           />
  //           <div className='content'>
  //             <NavbarNavigation
  //               user={user}
  //               isAuthenticated={isAuthenticated}
  //               allProducts={allProducts}
  //               setAllProducts={setAllProducts}
  //               total={total}
  //               setTotal={setTotal}
  //               countProducts={countProducts}
  //               setCountProducts={setCountProducts}
  //             />
  //             <Routes>
  //               <Route exact path="/"
  //                 element={<SellerCar
  //                   allProducts={allProducts}
  //                   setAllProducts={setAllProducts}
  //                   total={total} setTotal={setTotal}
  //                   countProducts={countProducts}
  //                   setCountProducts={setCountProducts}
  //                 />} />
  //               <Route exact path="/sales/form"
  //                 element={<SellerForm
  //                   allProducts={allProducts}
  //                   total={total}
  //                 />} />
  //               <Route exact path="/delivery/:id"
  //                 element={<DeliveryTable
  //                   user={user}
  //                   emails={logisticEmails.concat(ExternalServiceEmails, bossEmails)}
  //                   deliveryData={deliveryData}
  //                   setDeliveryData={setDeliveryData}
  //                   API_URL={API_DUCOR}
  //                 />} />
  //               <Route exact path="/delivery/form"
  //                 element={<DeliveryForm
  //                   socket={socket}
  //                   API_URL={API_DUCOR}
  //                 />} />
  //               <Route exact path="/inventory/create/form"
  //                 element={<CreateProduct
  //                   URL_SERVER={URL_SERVER}
  //                   rangeItems={rangeItems}
  //                   socket={socket}
  //                 />} />
  //               <Route exact path="/inventory/edit/:id"
  //                 element={<EditProduct
  //                   rangeItems={rangeItems}
  //                   socket={socket}
  //                 />} />
  //               <Route exact path="/inventory/table"
  //                 element={<InventoryTable
  //                   settingInventoryEmails={settingInventoryEmails}
  //                   rangeItems={rangeItems}
  //                   setRangeItems={setRangeItems}
  //                   user={user}
  //                   socket={socket}
  //                   URL_SERVER={URL_SERVER}
  //                 />} />
  //               <Route exact path="/inventory/enter/form"
  //                 element={<EnterForm
  //                   user={user}
  //                   socket={socket}
  //                   rangeItems={rangeItems}
  //                   URL_SERVER={URL_SERVER}
  //                 />} />
  //               <Route exact path="/inventory/enter/table"
  //                 element={<EnterTable
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   socket={socket}
  //                 />} />
  //               <Route exact path="/inventory/setting/table"
  //                 element={<SettingTable
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   socket={socket}
  //                 />} />
  //               <Route exact path="/inventory/exit/table"
  //                 element={<ExitTable
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   socket={socket}
  //                 />} />
  //               <Route exact path="/inventory/exit/form"
  //                 element={<ExitForm
  //                   user={user}
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   socket={socket}
  //                   rangeItems={rangeItems}
  //                   receiveOrders={receiveOrders}
  //                   URL_SERVER={URL_SERVER}
  //                   API_URL={API_DUCOR}
  //                 />} />
  //               <Route exact path="/inventory/exit/cash"
  //                 element={<CashForm
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   socket={socket}
  //                   rangeItems={rangeItems}
  //                   receiveOrders={receiveOrders}
  //                   URL_SERVER={URL_SERVER}
  //                 />} />
  //               <Route exact path="/inventory/exit/pending"
  //                 element={<PendingOrders
  //                   rangeItems={rangeItems}
  //                   user={user}
  //                   socket={socket}
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   receiveOrders={receiveOrders}
  //                   URL_SERVER={URL_SERVER}
  //                 />} />
  //               <Route exact path="/platforms/:id"
  //                 element={<PlatformTable
  //                   API_URL={API_DUCOR}
  //                 />} />
  //               <Route exact path='/platforms/rappi/form'
  //                 element={<CSVReader
  //                   API_URL={API_DUCOR}
  //                 />} />
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
            <Sidebar
              couriers={["brayan", "edgar", "raul", "richard", "estiven", "hernando", "juano", "servicio externo"]}
              platforms={["SHOPIFY", "FALABELLA", "MERCADOLIBRE", "RAPPI", "DCBOGOTA", "DCMEDELLIN"]}
              logisticEmails={logisticEmails}
              bossEmails={bossEmails}
              sellerEmails={sellerEmails}
              ExternalServiceEmails={ExternalServiceEmails}
              exitsInventoryEmails={exitsInventoryEmails}
              entriesInventoryEmails={entriesInventoryEmails}
              settingInventoryEmails={settingInventoryEmails}
            />
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
                <Route exact path="/"
                  element={<SellerCar
                    allProducts={allProducts}
                    setAllProducts={setAllProducts}
                    total={total} setTotal={setTotal}
                    countProducts={countProducts}
                    setCountProducts={setCountProducts}
                  />} />
                <Route exact path="/platforms/:id"
                  element={<PlatformTable
                    API_URL={API_DUCOR}
                  />} />
                <Route exact path="/dashboard"
                  element={<Dashboard
                    ordersData={ordersData}
                    setOrdersData={setOrdersData}
                    socket={socket}
                    receiveOrders={receiveOrders}
                  />} />
                <Route exact path="/inventory/exit/pending"
                  element={<PendingOrders
                    rangeItems={rangeItems}
                    user={user}
                    socket={socket}
                    ordersData={ordersData}
                    setOrdersData={setOrdersData}
                    receiveOrders={receiveOrders}
                    URL_SERVER={URL_SERVER}
                  />} />
                {isAuthenticated && (
                  <>
                    {bossEmails.includes(user.email) && (
                      <Route exact path='/platforms/rappi/form'
                        element={<CSVReader
                          API_URL={API_DUCOR}
                        />} />
                    )}
                    {sellerEmails.includes(user.email) && (
                      <Route exact path="/sales/table"
                        element={<SellerTable
                        />} />
                    )}
                    {logisticEmails.concat(bossEmails, ExternalServiceEmails).includes(user.email) && (
                      <>
                        {logisticEmails.includes(user.email) && (
                          <Route exact path="/delivery/form"
                            element={<DeliveryForm
                              socket={socket}
                              API_URL={API_DUCOR}
                            />} />
                        )}
                        {logisticEmails.concat(bossEmails).includes(user.email) && (
                          <Route exact path="/delivery/:id"
                            element={<DeliveryTable
                              user={user}
                              emails={logisticEmails.concat(ExternalServiceEmails, bossEmails)}
                              deliveryData={deliveryData}
                              setDeliveryData={setDeliveryData}
                              API_URL={API_DUCOR}
                            />} />
                        )}
                        {ExternalServiceEmails.includes(user.email) && (
                          <Route exact path="/delivery/servicio externo"
                            element={<DeliveryTable
                              user={user}
                              emails={logisticEmails.concat(ExternalServiceEmails, bossEmails)}
                              deliveryData={deliveryData}
                              setDeliveryData={setDeliveryData}
                              API_URL={API_DUCOR}
                            />} />
                        )}
                      </>
                    )}
                    {entriesInventoryEmails.concat(exitsInventoryEmails, settingInventoryEmails).includes(user.email) && (
                      <>
                        <Route exact path="/inventory/table"
                          element={<InventoryTable
                            settingInventoryEmails={settingInventoryEmails}
                            rangeItems={rangeItems}
                            setRangeItems={setRangeItems}
                            user={user}
                            socket={socket}
                            URL_SERVER={URL_SERVER}
                          />} />
                        {entriesInventoryEmails.includes(user.email) && (
                          <>
                            <Route exact path="/inventory/enter/form"
                              element={<EnterForm
                                user={user}
                                socket={socket}
                                rangeItems={rangeItems}
                                URL_SERVER={URL_SERVER}
                              />} />
                            <Route exact path="/inventory/enter/table"
                              element={<EnterTable
                                socket={socket}
                              />} />
                          </>
                        )}
                        {exitsInventoryEmails.includes(user.email) && (
                          <>
                            <Route exact path="/inventory/exit/form"
                              element={<ExitForm
                                user={user}
                                ordersData={ordersData}
                                setOrdersData={setOrdersData}
                                socket={socket}
                                rangeItems={rangeItems}
                                receiveOrders={receiveOrders}
                                URL_SERVER={URL_SERVER}
                                API_URL={API_DUCOR}
                              />} />
                            <Route exact path="/inventory/exit/cash"
                              element={<CashForm
                                ordersData={ordersData}
                                setOrdersData={setOrdersData}
                                socket={socket}
                                rangeItems={rangeItems}
                                receiveOrders={receiveOrders}
                                URL_SERVER={URL_SERVER}
                              />} />
                            <Route exact path="/inventory/exit/pending"
                              element={<PendingOrders
                                rangeItems={rangeItems}
                                user={user}
                                socket={socket}
                                ordersData={ordersData}
                                setOrdersData={setOrdersData}
                                receiveOrders={receiveOrders}
                                URL_SERVER={URL_SERVER}
                              />} />
                            <Route exact path="/inventory/exit/table"
                              element={<ExitTable
                                ordersData={ordersData}
                                setOrdersData={setOrdersData}
                                socket={socket}
                              />} />
                          </>
                        )}
                        {settingInventoryEmails.includes(user.email) && (
                          <>
                            <Route exact path="/inventory/create/form"
                              element={<CreateProduct
                                URL_SERVER={URL_SERVER}
                                rangeItems={rangeItems}
                                socket={socket}
                              />} />
                            <Route exact path="/inventory/setting/table"
                              element={<SettingTable
                                URL_SERVER={URL_SERVER}
                              />} />
                            <Route exact path="/inventory/edit/:id"
                              element={<EditProduct
                                rangeItems={rangeItems}
                                socket={socket}
                              />} />
                          </>
                        )}
                      </>
                    )}
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




