import React, { useState, useEffect } from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { Button, Spin, Menu, Modal, message } from "antd"
import axios from "axios";
import { useParams } from 'react-router-dom';
import { tokens } from "../../theme";
import DataTableGrid from "../../controllers/Tables/DataGridPro";

const PlatformTable = ({ URL_SERVER, ordersData, setOrdersData }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [reloadData, setReloadData] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const loadData = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${URL_SERVER}/platforms/${id}`);
            const parsedData = response.data;

            let data = parsedData.map(obj => {
                return {
                    id: obj.id,
                    date_generate: obj.date_generate,
                    date_generate_ISO: obj.date_generate_ISO,
                    coursier: obj.order.delivery.join(", "),
                    seller: obj.seller.name,
                    client: obj.customer.name,
                    address: obj.customer.shipping_data.address,
                    state: obj.customer.shipping_data.state,
                    city: obj.customer.shipping_data.city,
                    items: obj.order.items,
                    condition: obj.order.transactions.condition,
                    method: obj.order.transactions.method,
                    total: Number(obj.order.transactions.total_payments) + Number(obj.order.transactions.total_shipping),
                    status: obj.order.status
                }
            })

            setOrdersData(data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setReloadData(false);
        }
    }

    const canceledOrderById = (id_order) => {
        Modal.confirm({
            title: '¿Seguro que quieres anular este padido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                fetch(`${URL_SERVER}/platforms/${id}/cancel`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: id_order })
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Pedido cancelado exitosamente');
                        setReloadData(true)
                    })
                    .catch(error => {
                        console.error('Error cancelling order:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    }

    useEffect(() => {
        loadData();
    }, [id])

    useEffect(() => {
        if (reloadData) {
            loadData();
        }
    }, [reloadData]);

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
        { headerName: 'Fecha', field: "date_generate", flex: 1 },
        { headerName: 'Código', field: "id", flex: 1 },
        { headerName: 'Mensajeros', field: "coursier", flex: 1 },
        { headerName: 'Cliente', field: "client", flex: 1 },
        { headerName: 'Vendedor', field: "seller", flex: 1 },
        { headerName: 'Dirección', field: "address", flex: 1 },
        { headerName: 'Departamento', field: "state", flex: 1 },
        { headerName: 'Ciudad', field: "city", flex: 1 },
        {
            headerName: 'Artículos', field: "items", valueFormatter: (params) => {
                return params.value.map(obj => `${obj.item.sku} - ${obj.item.name} - ${obj.item.quantity}`).join(', ');
            }
        },
        { headerName: 'Condición', field: "condition", flex: 1 },
        { headerName: 'Método', field: "method", flex: 1 },
        { headerName: 'Valor', field: "total", flex: 1 },
        {
            headerName: 'Estado', field: 'status', flex: 1, renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", backgroundColor: colors.black[100], width: "200px", height: "40px", borderRadius: "5px", color: statusColorMap[params.row.status] || 'white' }}>
                    <p style={{ display: "inline-block", margin: "auto", overflow: "hidden", padding: "1px 2px 1px" }}>{params.row.status}</p>
                </div>
            )
        },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones" key="sub-menu">
                        <Menu.Item key="0">
                            <Button type="primary" style={{ backgroundColor: "#5e2129" }} onClick={() => canceledOrderById(params.row.id)}>
                                Anular
                            </Button>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
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
                        key={ordersData.length}
                        columns={columns}
                        data={ordersData}
                        setReloadData={setReloadData}
                        setLoading={setLoading}
                    />
                </Box>
            )}
        </div>

    );
};

export default PlatformTable;