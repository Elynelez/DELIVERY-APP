import React, { useEffect, useState } from "react";
import { Spin } from "antd"
import axios from "axios";

const EnterTable = ({ URL_SERVER }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(URL_SERVER + "/entries")
            .then((resp) => {
                setOrders(resp.data)
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
                            <th>Fecha de Entrada</th>
                            <th>Número de factura</th>
                            <th>Proveedor</th>
                            <th>Artículos</th>
                            <th>Usuario Entrada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.date_generate}</td>
                                <td>{order.facture_number}</td>
                                <td>{order.provider}</td>
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
                                    {`Usuario: ${order.review.user}, IP: ${order.review.IP}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    );
};

export default EnterTable;
