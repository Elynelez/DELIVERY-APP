import React, { useEffect, useState } from "react";
import { Spin } from "antd"

const ExitTable = ({ pendingData, setPendingData, socket, receiveOrders }) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        socket.on('loadOrdersExits', (loadedOrders) => {
            try {
                console.log('loadOrders event received:', loadedOrders);
                setPendingData(loadedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error handling loadOrders event:', error);
            }
        });

        socket.on('dataOrderExit', obj => {
            try {
                console.log('dataOrder event received:', obj);
                receiveOrders(obj);
            } catch (error) {
                console.error('Error handling dataOrder event:', error);
            }
        })

        return () => {
            socket.off('dataOrderExit')
        }
    }, [socket])

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <table style={{ minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th>Fecha de Picking</th>
                            <th>Fecha de Packing</th>
                            <th>Número de orden</th>
                            <th>Plataforma</th>
                            <th>Artículos</th>
                            <th>Usuario Picking</th>
                            <th>Usuario Packing</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingData.slice(0, 3000).map((order) => (
                            <tr key={order.id}>
                                <td>{order.date_generate}</td>
                                <td>{order.packing.hour}</td>
                                <td>{order.order_number}</td>
                                <td>{order.platform}</td>
                                <td style={{ width: '100px', overflowX: 'auto' }}>
                                    <ul>
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.sku} - {item.name} - {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    {`Usuario: ${order.picking.user}, IP: ${order.picking.IP}`}
                                </td>
                                <td>
                                    {`Usuario: ${order.packing.user}, IP: ${order.packing.IP}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    );
};

export default ExitTable;