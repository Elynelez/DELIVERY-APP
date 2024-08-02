import React, { useState, useEffect } from "react";
import { Spin } from "antd"
import DataTableGrid from "../../controllers/Tables/DataGridPro";
import { useTheme, Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from 'react-router-dom';

const PlatformTable = ({ API_URL }) => {
    const { id } = useParams();
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const loadData = () => {
        let data
        setLoading(true);
        fetch(`${API_URL}/platforms/${id}`)
            .then(response => response.json())
            .then(parsedData => {
                console.log(parsedData)
                data = parsedData.map(obj => {
                    return {
                        id: obj.id,
                        date_generate: obj.date_generate,
                        coursier: Array.isArray(obj.order.delivery) ? obj.order.delivery.join(", ") : obj.order.delivery,
                        seller: obj.seller.name,
                        client: obj.customer.name,
                        address: obj.customer.shipping_data.address,
                        state: obj.customer.shipping_data.state,
                        city: obj.customer.shipping_data.city,
                        items: Array.isArray(obj.order.items) ? obj.order.items.map(item => `${item.item.sku} - ${item.item.name} - ${item.item.quantity}`).join('; ') : obj.order.items,
                        condition: obj.order.transactions.condition,
                        method: obj.order.transactions.method,
                        total: Number(obj.order.transactions.total_payments) + Number(obj.order.transactions.total_shipping),
                        status: obj.order.status
                    }
                })
                setOrders(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, [id])

    const statusColorMap = {
        'EN RUTA': '#A48BF4',
        'REPROGRAMADO': 'darkorange',
        'ENTREGADO': '#38BC3E ',
        'ANULADO': '#FF1C1C',
        'PENDIENTE': '#dccd30',
        'COMPLETO': '#76C3A5',
        'INCOMPLETO': '#EABD31 '
    };

    const columns = [
        { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
        { headerName: 'Código', field: "id", flex: 1 },
        { headerName: 'Mensajeros', field: "coursier", flex: 1 },
        { headerName: 'Cliente', field: "client", flex: 1 },
        { headerName: 'Vendedor', field: "seller", flex: 1 },
        { headerName: 'Dirección', field: "address", flex: 1 },
        { headerName: 'Departamento', field: "state", flex: 1 },
        { headerName: 'Ciudad', field: "city", flex: 1 },
        // {
        //     headerName: 'Artículos', field: "items", valueFormatter: (params) => {
        //         return Array.isArray(params.value) ? params.value.map(obj => `${obj.item.sku} - ${obj.item.name} - ${obj.item.quantity}`).join('; ') : params.value.items;
        //     }
        // },
        { headerName: 'Condición', field: "condition", flex: 1 },
        { headerName: 'Método', field: "method", flex: 1 },
        { headerName: 'Valor', field: "total", flex: 1 },
        {
            headerName: 'Estado', field: 'status', flex: 1, renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", backgroundColor: colors.black[100], width: "80px", height: "40px", borderRadius: "5px", color: statusColorMap[params.row.status] || 'white' }}>
                    <p style={{ display: "inline-block", margin: "auto", overflow: "hidden", padding: "1px 2px 1px" }}>{params.row.status}</p>
                </div>
            )
        }
    ]

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <Box m="20px">
                    <Box mb="30px">
                        <Typography
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ m: "0 0 5px 0" }}
                        >
                            TABLA DE PEDIDOS <p>{id.toUpperCase()}</p>
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={orders.length}
                        columns={columns}
                        data={orders}
                        setReloadData={setOrders}
                        setLoading={setLoading}
                    />
                </Box>
            )}
        </div>

    );
};

export default PlatformTable;