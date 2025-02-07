import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NavbarNavigation, Sidebar } from './components';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { io } from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

// pages
import { Dashboard, ScreenRecorder } from './pages/DefaultPages';
import { SellerTable, SellerCar, SellerForm } from './pages/SellerPages';
import { DeliveryTable, DeliveryForm } from './pages/DeliveryPages';
import { PlatformTable, CSVReader } from './pages/AccountingPages';
import {
  CreateProduct,
  EditProduct,
  InventoryTable,
  EnterForm,
  EnterTable,
  ExitForm,
  ExitTable,
  CashForm,
  PendingOrders,
  SettingTable,
} from './pages/PackagePages';
import { PausePosting, PublicationTable } from './pages/PublicationPages';

// middlewares
import { hasPermission } from './middlewares';

// API URL'S
const API_DUCOR = process.env.REACT_APP_API_DUCOR
const URL_SERVER = process.env.REACT_APP_URL_SERVER
const URL_CARLOS = process.env.REACT_APP_URL_CARLOS
// const URL_SERVER = 'http://localhost:' + 8080

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

  const [blocked, setBlocked] = useState(false)

  const [rangeItems, setRangeItems] = useState([])

  const [ordersData, setOrdersData] = useState([])

  const [deliveryData, setDeliveryData] = useState([])

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Conexión exitosa:', socket.id);
      setBlocked(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Error en la conexión:', error);
      setBlocked(true);
    });

    socket.on('connect_timeout', (timeout) => {
      console.error('Tiempo de conexión agotado:', timeout);
      setBlocked(true);
    });

    socket.on('error', (error) => {
      console.error('Error general:', error);
      setBlocked(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Desconectado:', reason);
      setBlocked(true);
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
  //               <Route exact path='/record'
  //                 element={<ScreenRecorder
  //                 />} />
  //               <Route exact path="/"
  //                 element={<SellerCar
  //                   allProducts={allProducts}
  //                   setAllProducts={setAllProducts}
  //                   total={total} setTotal={setTotal}
  //                   countProducts={countProducts}
  //                   setCountProducts={setCountProducts}
  //                   rangeItems={rangeItems}
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
  //                   URL_SERVER={URL_SERVER}
  //                 />} />
  //               <Route exact path="/delivery/form"
  //                 element={<DeliveryForm
  //                   socket={socket}
  //                   URL_SERVER={URL_SERVER}
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
  //                   API_URL={URL_SERVER}
  //                 />} />
  //               <Route exact path="/inventory/setting/table"
  //                 element={<SettingTable
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   API_URL={URL_SERVER}
  //                 />} />
  //               <Route exact path="/inventory/exit/table"
  //                 element={<ExitTable
  //                   ordersData={ordersData}
  //                   setOrdersData={setOrdersData}
  //                   API_URL={URL_SERVER}
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
  //                   socket={socket}
  //                   API_URL={URL_SERVER}
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
    <div className="app-container">
      {blocked && (
        <div className="block-screen">
          <p>Conectando...</p>
        </div>
      )}
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div className='flex'>
              <Sidebar
                isAuthenticated={isAuthenticated}
                user={user}
                hasPermission={hasPermission}
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
                    element={<Dashboard
                      ordersData={ordersData}
                      setOrdersData={setOrdersData}
                      socket={socket}
                      receiveOrders={receiveOrders}
                    />} />
                  <Route exact path="/platforms/:id"
                    element={<PlatformTable
                      URL_SERVER={URL_SERVER}
                      ordersData={ordersData}
                      setOrdersData={setOrdersData}
                    />} />
                  <Route exact path="/screenrecord"
                    element={<ScreenRecorder
                    />} />
                  <Route exact path='publication/pause'
                    element={<PausePosting
                    />} />
                  <Route exact path='publication/table'
                    element={<PublicationTable
                      URL_SERVER={URL_CARLOS}
                    />} />
                  {isAuthenticated && (
                    <>
                      {hasPermission(user.email, 'boss') && (
                        <Route exact path='/platforms/rappi/form'
                          element={<CSVReader
                            API_URL={API_DUCOR}
                          />} />
                      )}
                      {hasPermission(user.email, ['boss', 'seller']) && (
                        <>
                          <Route exact path="/sales/table"
                            element={<SellerTable
                            />} />
                          <Route exact path="/sales/form"
                            element={<SellerForm
                              allProducts={allProducts}
                              total={total}
                            />} />
                          <Route exact path="/sales/car"
                            element={<SellerCar
                              allProducts={allProducts}
                              setAllProducts={setAllProducts}
                              total={total} setTotal={setTotal}
                              countProducts={countProducts}
                              setCountProducts={setCountProducts}
                              rangeItems={rangeItems}
                            />} />
                        </>
                      )}
                      {hasPermission(user.email, ['logistic', 'boss']) && (
                        <>
                          {hasPermission(user.email, ['logistic', 'boss']) && (
                            <>
                              <Route exact path="/delivery/form"
                                element={<DeliveryForm
                                  socket={socket}
                                  URL_SERVER={URL_SERVER}
                                />} />
                              <Route exact path="/delivery/:id"
                                element={<DeliveryTable
                                  user={user}
                                  hasPermission={hasPermission}
                                  deliveryData={deliveryData}
                                  setDeliveryData={setDeliveryData}
                                  socket={socket}
                                  URL_SERVER={URL_SERVER}
                                  API_URL={API_DUCOR}
                                />} />
                            </>
                          )}
                        </>
                      )}
                      {hasPermission(user.email, ['boss', 'inventory_entry', 'inventory_exit', 'inventory_setting']) && (
                        <>
                          <Route exact path="/inventory/table"
                            element={<InventoryTable
                              hasPermission={hasPermission}
                              rangeItems={rangeItems}
                              setRangeItems={setRangeItems}
                              user={user}
                              socket={socket}
                              URL_SERVER={URL_SERVER}
                            />} />
                          {hasPermission(user.email, ['boss', 'inventory_entry']) && (
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
                                  ordersData={ordersData}
                                  setOrdersData={setOrdersData}
                                  socket={socket}
                                  API_URL={URL_SERVER}
                                />} />
                            </>
                          )}
                          {hasPermission(user.email, ['boss', 'inventory_exit']) && (
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
                                  API_URL={URL_SERVER}
                                  socket={socket}
                                />} />
                            </>
                          )}
                          {hasPermission(user.email, ['boss', 'inventory_setting']) && (
                            <>
                              <Route exact path="/inventory/create/form"
                                element={<CreateProduct
                                  URL_SERVER={URL_SERVER}
                                  rangeItems={rangeItems}
                                  socket={socket}
                                />} />
                              <Route exact path="/inventory/setting/table"
                                element={<SettingTable
                                  ordersData={ordersData}
                                  setOrdersData={setOrdersData}
                                  API_URL={URL_SERVER}
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
    </div>
  )
}

export default App;




