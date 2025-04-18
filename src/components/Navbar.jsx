import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { useContext, useState } from "react";
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
import { useAuth0 } from '@auth0/auth0-react';

const NavbarNavigation = ({ user, isAuthenticated, allProducts, setAllProducts, total, setTotal, countProducts, setCountProducts }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isOpen, setIsOpen] = useState(false);
  const { logout, loginWithRedirect } = useAuth0()
  const [active, setActive] = useState(false)

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity === "" || newQuantity < 1) return;

    const updatedProducts = allProducts.map((product, i) =>
        i === index ? { ...product, carQuantity: newQuantity } : product
    );

    setAllProducts(updatedProducts); 
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

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
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
          <Dropdown isOpen={active} toggle={() => { setActive(!active) }}>
            <DropdownToggle nav caret>
              <div className="container-cart-icon">
                <ShoppingCart />
                <div className="count-products">
                  <span id="contador-productos">{countProducts}</span>
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
                    <span className='total-pagar'>${total}</span>
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
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <Dropdown isOpen={isOpen} toggle={() => { setIsOpen(!isOpen) }}>
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