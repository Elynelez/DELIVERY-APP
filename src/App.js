import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NavbarNavigation, Sidebar } from './components';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { io } from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

// pages
import { Dashboard, ScreenRecorder, UserSettings } from './pages/DefaultPages';
import { SellerTable, SellerForm, SellerOrders, ProductDetail } from './pages/SellerPages';
import { DeliveryTable, DeliveryForm, CoursierForm } from './pages/DeliveryPages';
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
// const URL_SERVER = 'http://localhost:' + 8080

const socket = io(URL_SERVER);

function App() {
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();
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

  const [reloadData, setReloadData] = useState(true)

  const [blocked, setBlocked] = useState(false)

  const [rangeItems, setRangeItems] = useState([])

  const [ordersData, setOrdersData] = useState([])

  const [notifications, setNotifications] = useState([])

  const [permissions, setPermissions] = useState({
    boss: false,
    seller: false,
    logistic: false,
    coursier: false,
    publications: false,
    inventory_entry: false,
    inventory_exit: false,
    inventory_setting: false,
  });

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
    socket.on("getNotifications", (data) => {
      try {
        setNotifications(data);
      } catch (error) {
        console.error('Error handling event:', error);
      }
    });
  }, [])

  useEffect(() => {
    const fetchPermissions = async () => {
      if (user?.email) {
        const roles = Object.keys(permissions);
        const updatedPermissions = {};

        for (const role of roles) {
          updatedPermissions[role] = await hasPermission(user.email, role, URL_SERVER);
        }

        setPermissions(updatedPermissions);
      }
    };

    fetchPermissions();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    localStorage.setItem("total", total)
    localStorage.setItem("countProducts", countProducts)
  }, [allProducts]);

  const receiveOrders = order => setOrdersData(state => [order, ...state])

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
                permissions={permissions}
                URL_SERVER={URL_SERVER}
              />
              <div className='content'>
                <NavbarNavigation
                  user={user}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  loginWithRedirect={loginWithRedirect}
                  allProducts={allProducts}
                  setAllProducts={setAllProducts}
                  total={total}
                  setTotal={setTotal}
                  countProducts={countProducts}
                  setCountProducts={setCountProducts}
                  notifications={notifications}
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
                      user={user}
                      permissions={permissions}
                      ordersData={ordersData}
                      setOrdersData={setOrdersData}
                      rangeItems={rangeItems}
                      reloadData={reloadData}
                      setReloadData={setReloadData}
                      socket={socket}
                      URL_SERVER={URL_SERVER}
                    />} />
                  <Route exact path="/screenrecord"
                    element={<ScreenRecorder
                    />} />
                  {isAuthenticated && (
                    <>
                      <Route exact path='/user/settings'
                        element={<UserSettings
                          user={user}
                          isAuthenticated={isAuthenticated}
                          logout={logout}
                          loginWithRedirect={loginWithRedirect}
                        />} />
                      {permissions.boss && (
                        <Route exact path='/platforms/rappi/form'
                          element={<CSVReader
                            API_URL={API_DUCOR}
                          />} />
                      )}
                      {permissions.publications && (
                        <>
                          <Route exact path='publication/pause'
                            element={<PausePosting
                              URL_SERVER={URL_SERVER}
                              rangeItems={rangeItems}
                              setRangeItems={setRangeItems}
                            />} />
                          <Route exact path='publication/table'
                            element={<PublicationTable
                              URL_SERVER={URL_SERVER}
                            />} />
                        </>
                      )}
                      {permissions.seller && (
                        <>
                          <Route exact path="/sales/orders"
                            element={<SellerOrders
                              user={user}
                              ordersData={ordersData}
                              setOrdersData={setOrdersData}
                              rangeItems={rangeItems}
                              reloadData={reloadData}
                              setReloadData={setReloadData}
                              socket={socket}
                              URL_SERVER={URL_SERVER}
                            />} />
                          <Route exact path="/sales/form"
                            element={<SellerForm
                              user={user}
                              allProducts={allProducts}
                              setAllProducts={setAllProducts}
                              total={total}
                              setTotal={setTotal}
                              setCountProducts={setCountProducts}
                              URL_SERVER={URL_SERVER}
                            />} />
                          <Route exact path="/sales/table"
                            element={<SellerTable
                              allProducts={allProducts}
                              setAllProducts={setAllProducts}
                              total={total}
                              setTotal={setTotal}
                              countProducts={countProducts}
                              setCountProducts={setCountProducts}
                              rangeItems={rangeItems}
                              setRangeItems={setRangeItems}
                            />} />
                          <Route exact path="/sales"
                            element={<ProductDetail
                              ordersData={ordersData}
                              setOrdersData={setOrdersData}
                              allProducts={allProducts}
                              setAllProducts={setAllProducts}
                              total={total} setTotal={setTotal}
                              countProducts={countProducts}
                              setCountProducts={setCountProducts}
                              rangeItems={rangeItems}
                            />} />
                        </>
                      )}
                      {permissions.logistic && (
                        <>
                          <Route exact path="/delivery/form"
                            element={<DeliveryForm
                              socket={socket}
                              URL_SERVER={URL_SERVER}
                            />} />
                          <Route exact path="/delivery/:id"
                            element={<DeliveryTable
                              user={user}
                              permissions={permissions}
                              ordersData={ordersData}
                              setOrdersData={setOrdersData}
                              reloadData={reloadData}
                              setReloadData={setReloadData}
                              socket={socket}
                              URL_SERVER={URL_SERVER}
                            />} />
                        </>
                      )}
                      {permissions.coursier && (
                        <>
                          <Route exact path='/delivery/route'
                            element={<CoursierForm
                              user={user}
                              ordersData={ordersData}
                              setOrdersData={setOrdersData}
                              URL_SERVER={URL_SERVER}
                            />} />
                        </>
                      )}
                      {(permissions.inventory_entry || permissions.inventory_exit || permissions.inventory_setting) && (
                        <>
                          <Route exact path="/inventory/table"
                            element={<InventoryTable
                              permissions={permissions}
                              rangeItems={rangeItems}
                              setRangeItems={setRangeItems}
                              user={user}
                              socket={socket}
                              URL_SERVER={URL_SERVER}
                            />} />
                          {permissions.inventory_entry && (
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
                          {permissions.inventory_exit && (
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
                          {permissions.inventory_setting && (
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




