import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';


const NavbarNavigation = (props) =>{
  const [isOpen, setIsOpen] = useState(false);
  const { logout, loginWithRedirect } = useAuth0()
  const toggle = () => setIsOpen(!isOpen);


  return (
    <div>
      <Navbar color='light' light expand="md">
        <NavbarBrand href="/" className="text-primary"><img alt="logo" src="https://static.wixstatic.com/media/06687e_4ce80914c2064ba3b0f8b3d0962d6577~mv2.png/v1/fill/w_406,h_109,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/06687e_4ce80914c2064ba3b0f8b3d0962d6577~mv2.png" width='200px'/></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Mi perfil
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
        <NavbarBrand><img alt="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAA1BMVEX///+nxBvIAAAAR0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPBgxUwAAU+n3sIAAAAASUVORK5CYII=" style={{opacity: 0, width:'60px'}}/></NavbarBrand>
      </Navbar>
    </div>
  );
}

export default NavbarNavigation;