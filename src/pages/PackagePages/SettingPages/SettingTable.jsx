import React, { useEffect, useState } from "react";
import { Spin } from "antd"
import axios from "axios";

const SettingTable = ({ URL_SERVER }) => {
    const [ordersSetting, setOrdersSetting] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(URL_SERVER + "/settings")
            .then((resp) => {
                setOrdersSetting(resp.data)
                setLoading(false)
            })
    }, [])

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Fecha de Ajuste</th>
                            <th>Artículos</th>
                            <th>Cantidad Anterior</th>
                            <th>Usuario Ajuste</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersSetting.map((order,index) => (
                            <tr key={order.id+index}>
                                <td>{order.date_generate}</td>
                                <td>
                                    <ul>
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.sku} - {item.name} - {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.last_quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    {`Usuario: ${order.setting.user}, IP: ${order.setting.IP}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    );
};

export default SettingTable;
