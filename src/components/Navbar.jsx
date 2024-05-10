import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import {
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';

const NavbarNavigation = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isOpen, setIsOpen] = useState(false);
  const { logout, loginWithRedirect } = useAuth0()
  const [active, setActive] = useState(false)

  const onDeleteProduct = (product) => {
    const results = props.allProducts.filter(
      item => item.code !== product.code
    );

    props.setTotal(props.total - (parseFloat(product.sale_price.replace(/[\$,]/g, '')) * 1000) * product.carQuantity);
    props.setCountProducts(props.countProducts - product.carQuantity);
    props.setAllProducts(results);
  }

  const onCleanCart = () => {
    props.setAllProducts([]);
    props.setTotal(0);
    props.setCountProducts(0);
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        borderRadius="3px"
      >
        <NavbarBrand href="/" className="text-primary">
          <img alt="logo" src="/logo.png" width='200px' style={{filter: colors.black[200]}}/>
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
              <div class="container-cart-icon">
                <ShoppingCart />
                <div class="count-products">
                  <span id="contador-productos">{props.countProducts}</span>
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header>Productos</DropdownItem>
              {props.allProducts.length ? (
                <>
                  <div className='row-product'>
                    {props.allProducts.map((product, index) => (
                      <DropdownItem key={index}>
                        <div className='info-cart-product'>
                          <span className='cantidad-producto-carrito'>
                            {product.carQuantity}
                          </span>
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
                    <span className='total-pagar'>${props.total}</span>
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
            <DropdownMenu right>
              {props.isAuthenticated ? (
                <>
                  <DropdownItem>
                    <img
                      style={{ borderRadius: '50%', width: '30px', marginRight: '10px' }}
                      src={props.user.picture}
                      alt={props.user.name}
                    />
                    <div style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {props.user.name}
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