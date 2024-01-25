import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarNavigation from './components/Navbar';
import Sidebar from './components/Sidebar';
// import { io } from 'socket.io'
import './App.css';
import { Socket, io } from 'socket.io-client';

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
import CreateProduct from './pages/PackagePages/CreateProduct';
import EnterProduct from './pages/PackagePages/EnterProduct';
import ExitProduct from './pages/PackagePages/ExitProduct';
import RBExitProduct from './pages/PackagePages/RBExitProduct';
import PendingOrders from './pages/PackagePages/PendingOrders';
import TableMercadoLibre from './pages/AccountingPages/Mercadolibre';
import InventoryTable from './pages/PackagePages/InventoryTable';
import SearchES from './pages/DefaultPages/SearchES';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// middlewares
import { loadRange, loadData, TimeLoad, TimeLoad20Minutes } from './middlewares';

// Logistic Shipping
const logisticEmails = ["pedidos.ducor@gmail.com", "logistica.inducor@gmail.com",]
const ExternalServiceEmails = ["atencionalcliente.magicmechas@gmail.com", "klcf.inducor@gmail.com"]

// Boss Functions
const bossEmails = ["pedidos.ducor@gmail.com", "contableducor@gmail.com", "inducorsas@gmail.com"]

// Sells
const sellerEmails = ["pedidos.ducor@gmail.com"]

// Inventory
const entriesInventoryEmails = ["pedidos.ducor@gmail.com", "inducorsas@gmail.com", "aocampo.inducor@gmail.com", "ainducor@gmail.com", "rramirez.inducor@gmail.com"]
const exitsInventoryEmails = ["pedidos.ducor@gmail.com", "inducorsas@gmail.com", "aocampo.inducor@gmail.com", "aforero.inducor@gmail.com", "empaque.inducor@gmail.com", "londono.ducor89@gmail.com", "pbello.inducor@gmail.com"]
const settingInventoryEmails = ["aocampo.inducor@gmail.com", "rramirez.inducor@gmail.com"]

// const socket = io('http://localhost:' + 8080);
const socket = io("https://server-cloud-mggp.onrender.com")

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

  const [rangeItems, setRangeItems] = useState(() => {
    const savedRangeItems = localStorage.getItem("rangeItems");
    return savedRangeItems ? JSON.parse(savedRangeItems) : [];
  })

  const [pendingData, setPendingData] = useState(() => {
    const savedPendingData = localStorage.getItem("pendingData");
    return savedPendingData ? JSON.parse(savedPendingData) : [];
  })

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
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    localStorage.setItem("total", total)
    localStorage.setItem("countProducts", countProducts)
  }, [allProducts]);

  useEffect(() => {
    console.log("ya esta")
    localStorage.setItem("rangeItems", JSON.stringify(rangeItems))
    localStorage.setItem("pendingData", JSON.stringify(pendingData))
  }, [pendingData, rangeItems]);

  useEffect(() => {
    loadRange(socket, rangeItems, setRangeItems)
  }, []);

  useEffect(() => {
    (async () => {
      await loadData(socket, pendingData, setPendingData)
      await TimeLoad(() => loadRange(socket, rangeItems, setRangeItems));
      await TimeLoad20Minutes(socket)
    })();
  }, [socket]);

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
  //               total={total}
  //               setTotal={setTotal}
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
  //               <Route exact path="/sales/form" element={<SellerForm allProducts={allProducts} total={total} />} />
  //               <Route exact path="/mensajeros/:id" element={<CoursiersTable bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
  //               <Route exact path="/create" element={<CreateProduct />} />
  //               <Route exact path="/inventory/ko" element={<InventoryTable />} />
  //               <Route exact path="/inventory/enter" element={<EnterProduct rangeItems={rangeItems} setRangeItems={setRangeItems} />} />
  //               <Route exact path="/inventory/exit"
  //                 element={<ExitProduct
  //                   socket={socket}
  //                   rangeItems={rangeItems}
  //                   setRangeItems={setRangeItems}
  //                   pendingData={pendingData}
  //                   setPendingData={setPendingData}
  //                 />} />
  //               <Route exact path="/inventory/cash" element={<RBExitProduct rangeItems={rangeItems} setRangeItems={setRangeItems} />} />
  //               <Route exact path="/inventory/pending"
  //                 element={<PendingOrders
  //                   socket={socket}
  //                   rangeItems={rangeItems}
  //                   setRangeItems={setRangeItems}
  //                   pendingData={pendingData}
  //                   setPendingData={setPendingData}
  //                 />} />
  //               <Route exact path="/platform/mercadolibre" element={<TableMercadoLibre />} />
  //               <Route exact path="/search/ES" element={<SearchES />} />
  //               {/* <Route exact path="/test/display" element={<div>
  //                 <form onSubmit={handleSubmit}>
  //                   <input
  //                     type="text"
  //                     placeholder='write your message...'
  //                     onChange={(e) => setMessage(e.target.value)} />
  //                   <button>
  //                     send
  //                   </button>
  //                 </form>
  //                 <ul>
  //                   {messages.map((message, index) => (
  //                     <li key={index}>{message}</li>
  //                   ))}
  //                 </ul>
  //               </div>} /> */}
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
              couriers={["Brayan", "Edgar", "Juan David", "Raul", "Richard", "Estiven", "Nicolas", "Alexander", "Hernando", "Julian Morales", "Juano"]}
              logisticEmails={logisticEmails}
              bossEmails={bossEmails}
              sellerEmails={sellerEmails}
              ExternalServiceEmails={ExternalServiceEmails}
              exitsInventoryEmails={exitsInventoryEmails}
              entriesInventoryEmails={entriesInventoryEmails}
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
                {/* <Route exact path="/" element={<Dashboard />} /> */}
                {/* <Route exact path="/test/display" element={<div>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder='write your message...'
                      onChange={(e) => setMessage(e.target.value)} />
                    <button>
                      send
                    </button>
                  </form>
                  <ul>
                    {messages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>} /> */}
                <Route exact path="/" element={<SearchES />} />
                {isAuthenticated && logisticEmails.includes(user.email) && (
                  <>
                    <Route exact path="/DeliveryApp" element={<DeliveryApp />} />
                    <Route exact path="/ExternalServiceApp" element={<ExternalServiceApp />} />
                  </>
                )}
                {isAuthenticated && (bossEmails.includes(user.email) || logisticEmails.includes(user.email)) && (
                  <>
                    <Route exact path="/coursiers/:id" element={<CoursiersTable bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
                    <Route exact path="/AllOrders" element={<AllOrders bossEmails={bossEmails} logisticEmails={logisticEmails} />} />
                  </>
                )}
                {isAuthenticated && sellerEmails.includes(user.email) && (
                  <>
                    <Route exact path="/Sales" element={<SellerTable />} />
                  </>
                )}
                {isAuthenticated && (bossEmails.includes(user.email) || logisticEmails.includes(user.email) || ExternalServiceEmails.includes(user.email)) && (
                  <>
                    <Route exact path="/coursiers/ExternalService" element={<ESTable bossEmails={bossEmails} logisticEmails={logisticEmails} ExternalServiceEmails={ExternalServiceEmails} />} />
                  </>
                )}
                {isAuthenticated && exitsInventoryEmails.includes(user.email) && (
                  <>
                    <Route exact path="/inventory/exit"
                      element={<ExitProduct
                        socket={socket}
                        rangeItems={rangeItems}
                        setRangeItems={setRangeItems}
                        pendingData={pendingData}
                        setPendingData={setPendingData}
                      />} />
                    <Route exact path="/inventory/cash" element={<RBExitProduct rangeItems={rangeItems} setRangeItems={setRangeItems} />} />
                    <Route exact path="/inventory/pending"
                      element={<PendingOrders
                        socket={socket}
                        rangeItems={rangeItems}
                        setRangeItems={setRangeItems}
                        pendingData={pendingData}
                        setPendingData={setPendingData}
                      />} />
                  </>
                )}
                {isAuthenticated && entriesInventoryEmails.includes(user.email) && (
                  <>
                    <Route exact path="/inventory/enter" element={<EnterProduct rangeItems={rangeItems} setRangeItems={setRangeItems}/>} />
                    <Route exact path="/inventory/create" element={<CreateProduct />} />
                    <Route exact path="/inventory/table" element={<InventoryTable settingInventoryEmails={settingInventoryEmails} />} />
                  </>
                )}
                {isAuthenticated && settingInventoryEmails.includes(user.email) && (
                  <>
                    <Route exact path="/inventory/table" element={<InventoryTable settingInventoryEmails={settingInventoryEmails} />} />
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





