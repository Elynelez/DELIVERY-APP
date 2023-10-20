import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {
  Collapse,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';

const NavbarNavigation = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { logout, loginWithRedirect } = useAuth0()

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        borderRadius="3px"
      >
        <NavbarBrand href="/" className="text-primary">
          <img alt="logo" src="./logo.png" width='200px' />
        </NavbarBrand>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} >
            <Nav className="ms-auto" navbar>
              <UncontrolledDropdown >
                <DropdownToggle nav caret>
                  perfil
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
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </IconButton>
      </Box>
    </Box>
  );
};

export default NavbarNavigation;