import { NavLink } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import { Menu, Button } from 'antd';

// auth
import { useAuth0 } from '@auth0/auth0-react';
const logisticEmails = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com"]
const bossEmails = ["contableducor@gmail.com", "pedidos.ducor@gmail.com", "inducorsas@gmail.com"]

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

    return (
        <div className="sidebar bg-light">
            <Button type="primary" className='button-burger' onClick={(event) => { showSidebar(event.nativeEvent) }}>&#9776;</Button>
            <Menu defaultSelectedKeys={['1']} className='bg-light'>
                <Menu.Item key="1">
                    <NavLink to="/" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaHome className='me-2' />
                        Dashboard
                    </NavLink>
                </Menu.Item>
                {isAuthenticated && logisticEmails.includes(user.email) && (
                    <>
                        <Menu.Item key="2">
                            <NavLink to="/DeliveryApp" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaHome className='me-2' />
                                Crear Ruta
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <NavLink to="/ExternalServiceApp" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaDeezer className='me-2' />
                                Subir Inter
                            </NavLink>
                        </Menu.Item>
                    </>
                )}
                {(isAuthenticated && bossEmails.includes(user.email)) || (isAuthenticated && logisticEmails.includes(user.email)) && (
                    <>
                        <Menu.Item key="4">
                            <Menu.SubMenu key="4" title="Mensajeros">
                                {props.couriers.map((mensajero, index) => (
                                    <Menu.Item key={index + mensajero}>
                                        <NavLink to={`/Mensajeros/${mensajero}`} exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active">
                                            {mensajero}
                                        </NavLink>
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <NavLink to="/AllOrders" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active">
                                Últimos pedidos
                            </NavLink>
                        </Menu.Item>
                    </>
                )}

            </Menu>
        </div>
    )

}

export default Sidebar