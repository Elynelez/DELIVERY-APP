import {NavLink} from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import { Menu } from 'antd';

const Sidebar = (props) => {
    return (
        <div className="sidebar bg-light">
            <Menu defaultSelectedKeys={['1']} className='bg-light'>
                <Menu.Item key="1">
                    <NavLink to="/" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaHome className='me-2'/>
                        Crear Ruta
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink to="/Inter" exact className='rounded py-2 w-100 d-inline-block px-3' activeclassname="active"><FaIcons.FaDeezer className='me-2'/>
                        Subir Inter
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <Menu.SubMenu key="3" title="Mensajeros">
                        {props.couriers.map((mensajero, index) => (
                            <Menu.Item key={index+mensajero}>
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
}

export default Sidebar