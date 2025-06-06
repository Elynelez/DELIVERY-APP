import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import {
  LightModeOutlined as LightModeOutlinedIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  Search as SearchIcon,
  ShoppingCart
} from "@mui/icons-material";
import {
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from 'reactstrap';

const NavbarNavigation = ({ user, isAuthenticated, logout, loginWithRedirect, allProducts, setAllProducts, total, setTotal, countProducts, setCountProducts, notifications }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [activeSession, setActiveSession] = useState(false);
  const [activeCar, setActiveCar] = useState(false)
  const [activeNotification, setActiveNotification] = useState(false)
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = () => {
    navigate(`/sales?search=${encodeURIComponent(search)}`);
  };

  const handleSettingsClick = async () => {
    if (isAuthenticated) {
      navigate("/user/settings");
    } else {
      try {
        await loginWithRedirect();
      } catch (err) {
        console.error("Error redirigiendo al login:", err);
      }
    }
  };


  const updateQuantity = (index, newQuantity) => {
    if (newQuantity === "" || newQuantity < 1) return;

    const updatedProducts = allProducts.map((product, i) =>
      i === index ? { ...product, carQuantity: newQuantity } : product
    );

    const newCount = updatedProducts.reduce((sum, item) => sum + item.carQuantity, 0);
    const newTotal = updatedProducts.reduce((sum, item) => sum + item.sale_price * item.carQuantity, 0);

    setAllProducts(updatedProducts);
    setCountProducts(newCount > 100 ? "+99" : newCount);
    setTotal(newTotal);
  };

  const onDeleteProduct = (product) => {
    const results = allProducts.filter(
      item => item.code !== product.code
    );

    setTotal(total - parseFloat(product.sale_price) * product.carQuantity);
    setCountProducts(countProducts - product.carQuantity);
    setAllProducts(results);
  }

  const onCleanCart = () => {
    setAllProducts([]);
    setTotal(0);
    setCountProducts(0);
  }

  const filterNotifications = () => {
    return notifications.filter(notification =>
      notification.to_users.some(userObj => userObj.email === user?.email)
    );
  }

  const getNotificationTitle = (type) => {
    switch (type) {
      case "inventory_exit": return "Salida de Inventario";
      case "inventory_entry": return "Entrada de Inventario";
      default: return "Notificación";
    }
  };

  const handleNotificationClick = (notification) => {
    // Por ejemplo, redirigir o abrir modal
    console.log("Notificación clickeada:", notification);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />
        <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box
        display="flex"
        borderRadius="3px"
      >
        <NavbarBrand href="/" className="text-primary">
          <img alt="logo" src="/logo.png" width='200px' style={{ filter: colors.black[200] }} />
        </NavbarBrand>
      </Box>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <Dropdown isOpen={activeCar} toggle={() => { setActiveCar(!activeCar) }}>
            <DropdownToggle nav caret>
              <div className="container-cart-icon">
                <ShoppingCart />
                <div className="count">
                  <span id="contador">{countProducts}</span>
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem header>Productos</DropdownItem>
              {allProducts.length ? (
                <>
                  <div className='row-product'>
                    {allProducts.map((product, index) => (
                      <DropdownItem key={index}>
                        <div className='info-cart-product'>
                          <input
                            type='number'
                            min='1'
                            value={product.carQuantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                            className='input-carQuantity'
                            onClick={(e) => e.stopPropagation()}
                          />
                          <p className='titulo-producto-carrito'>
                            {product.name}
                          </p>
                          <span className='precio-producto-carrito'>
                            {product.sale_price}
                          </span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='icon-close'
                            onClick={() => onDeleteProduct(product)}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </div>
                      </DropdownItem>
                    ))}
                  </div>

                  <DropdownItem className='cart-total'>
                    <h3>Total:</h3>
                    <span className='total-pagar'>${total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </DropdownItem>
                  <a href="/sales/form" className="link-button">
                    <button className='btn-clear-all' >
                      Ir a formulario
                    </button>
                  </a>
                  <button className='btn-clear-all' onClick={onCleanCart}>
                    Vaciar Carrito
                  </button>
                </>
              ) : (
                <p className='cart-empty'>El carrito está vacío</p>
              )
              }
              <DropdownItem divider />
            </DropdownMenu>
          </Dropdown>
        </IconButton>
        <IconButton>
          <Dropdown isOpen={activeNotification} toggle={() => setActiveNotification(!activeNotification)}>
            <DropdownToggle nav caret>
              <div className="container-cart-icon">
                <NotificationsOutlinedIcon />
                {filterNotifications().length > 0 && (
                  <div
                    className="count"
                    style={{ backgroundColor: 'red' }}
                  >
                    <span id="contador">
                      {
                        filterNotifications().length == 0
                          ? 0 :
                          filterNotifications().length
                      }
                    </span>
                  </div>
                )}
              </div>
            </DropdownToggle>
            <DropdownMenu right className="notification-dropdown">
              {filterNotifications().length === 0 ? (
                <DropdownItem disabled>No tienes notificaciones</DropdownItem>
              ) : (
                filterNotifications().map((notification, index) => (
                  <DropdownItem key={index} className="notification-item" onClick={() => handleNotificationClick(notification)}>
                    <div className="notification-header">
                      <strong>{getNotificationTitle(notification.to_receive)}</strong>
                      <span className="notification-date">{notification.date}</span>
                    </div>
                    <div className="notification-body">
                      Factura: <strong>{notification.data.facture_number}</strong><br />
                      Productos: <strong>{notification.data.projects.length}</strong>
                    </div>
                  </DropdownItem>
                ))
              )}
            </DropdownMenu>
          </Dropdown>
        </IconButton>
        <IconButton onClick={handleSettingsClick}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <Dropdown isOpen={activeSession} toggle={() => { setActiveSession(!activeSession) }}>
            <DropdownToggle nav caret>
              <PersonOutlinedIcon />
            </DropdownToggle>
            <DropdownMenu end>
              {isAuthenticated ? (
                <>
                  <DropdownItem>
                    <img
                      style={{ borderRadius: '50%', width: '30px', marginRight: '10px' }}
                      src={user.picture}
                      alt={user.name}
                    />
                    <div style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name}
                    </div>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => logout()}>Salir</DropdownItem>
                </>
              ) : (
                <DropdownItem onClick={() => loginWithRedirect()}>Iniciar sesión</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </IconButton>
      </Box>
    </Box>
  );
};

export default NavbarNavigation;