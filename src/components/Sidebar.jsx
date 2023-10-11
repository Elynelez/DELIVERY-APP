import { NavLink } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import { Menu, Button } from 'antd';

// auth
import { useAuth0 } from '@auth0/auth0-react';
const emailPrincipal = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com"]
// const emailSecondly = ["contableducor@gmail.com", "pedidos.ducor@gmail.com", "inducorsas@gmail.com"]

const Sidebar = (props) => {
    const { isAuthenticated, user } = useAuth0();

    const showSidebar = (e) => {
        let tag = e.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode;
        if (tag) {
          let sidebar = tag.querySelector(".sidebar");
          if (sidebar) {
            sidebar.classList.toggle("close");
          }
        }
      };
      

    switch (true) {
        case isAuthenticated && emailPrincipal.includes(user.email):
            return (
                <div className="sidebar bg-light">
                    <Button type="primary" className='button-burger' onClick={(event) => { showSidebar(event.nativeEvent) }}>&#9776;</Button>
                    <Menu defaultSelectedKeys={['1']} className='bg-light'>
                        <Menu.Item key="1">
                            <NavLink to="/" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaHome className='me-2' />
                                Crear Ruta
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <NavLink to="/ExternalService" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaDeezer className='me-2' />
                                Subir Inter
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Menu.SubMenu key="3" title="Mensajeros">
                                {props.couriers.map((mensajero, index) => (
                                    <Menu.Item key={index + mensajero}>
                                        <NavLink to={`/Mensajeros/${mensajero}`} exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active">
                                            {mensajero}
                                        </NavLink>
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <NavLink to="/LastOrders" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active">
                                Últimos pedidos
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                </div>
            )
        default:
            return (
                <div className="sidebar bg-light">
                    <Button type="primary" className='button-burger' onClick={(event) => { showSidebar(event.nativeEvent) }}>&#9776;</Button>
                    <Menu defaultSelectedKeys={['1']} className='bg-light'>
                        <Menu.Item key="1">
                            <NavLink to="/" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active">
                                Últimos pedidos
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Menu.SubMenu key="3" title="Mensajeros">
                                {props.couriers.map((mensajero, index) => (
                                    <Menu.Item key={index + mensajero}>
                                        <NavLink to={`/Mensajeros/${mensajero}`} exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active">
                                            {mensajero}
                                        </NavLink>
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        </Menu.Item>
                    </Menu>
                </div>
            )
    }

}

export default Sidebar