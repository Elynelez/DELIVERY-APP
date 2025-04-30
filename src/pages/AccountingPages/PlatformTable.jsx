import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useTheme, Box, Typography } from "@mui/material";
import { Button, Spin, Menu, Modal, message } from "antd"
import { EditOrderPlatform, AuthOrderPlatform } from "../../controllers/Modals/PlatformsModals";
import DataTableGrid from "../../controllers/Tables/DataGridPro";
import { tokens } from "../../theme";
import axios from "axios";

const PlatformTable = ({ user, hasPermission, ordersData, setOrdersData, rangeItems, reloadData, setReloadData, socket, URL_SERVER }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [conditions, setCondiions] = useState([])
    const [methods, setMethods] = useState([])
    const [places, setPlaces] = useState([])
    const [users, setUsers] = useState([])
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const loadData = async () => {
        setLoading(true);

        try {
            const [platformsResp, conditionsResp, methodsResp, placesResp, usersResp] = await Promise.all([
                axios.get(`${URL_SERVER}/platforms/${id}`),
                axios.get(`${URL_SERVER}/sales/conditions`),
                axios.get(`${URL_SERVER}/sales/methods`),
                axios.get(`${URL_SERVER}/sales/places`),
                axios.get(`${URL_SERVER}/database/users`)
            ]);

            const parsedData = platformsResp.data;

            let data = parsedData.map((obj, index) => {
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
                    status: obj.order.status,
                    url_coursier_sheet: obj.order.formats.url_coursier_sheet,
                    url_external_service_sheet: obj.order.formats.url_external_service_sheet,
                    pos: index + 1
                }
            })

            setCondiions(conditionsResp.data)
            setMethods(methodsResp.data)
            setPlaces(placesResp.data)
            setUsers(usersResp.data)
            setOrdersData(data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setReloadData(false);
        }
    }

    const canceledOrderById = (data) => {
        Modal.confirm({
            title: '¿Seguro que quieres anular este padido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('Procesando, por favor espera...');
                socket.emit("cancelPlatform", data.pos)
                socket.on("message", (response) => {
                    if (response.success) {
                        message.success(response.message);
                        setReloadData(true);
                    } else {
                        message.error(response.message || 'Hubo un error inesperado.');
                    }
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
        { headerName: 'Código', field: "id", flex: 0.5 },
        { headerName: 'Mensajeros', field: "coursier", flex: 1 },
        { headerName: 'Cliente', field: "client", flex: 1 },
        { headerName: 'Vendedor', field: "seller", flex: 1 },
        { headerName: 'Dirección', field: "address", flex: 1 },
        { headerName: 'Departamento', field: "state", flex: 1 },
        { headerName: 'Ciudad', field: "city", flex: 0.6 },
        {
            headerName: 'Artículos', field: "items", valueFormatter: (params) => {
                return params.value.map(obj => `${obj.item.sku} - ${obj.item.name} - ${obj.item.quantity}`).join(', ');
            }
        },
        { headerName: 'Condición', field: "condition", flex: 1 },
        { headerName: 'Método', field: "method", flex: 1 },
        { headerName: 'Valor', field: "total", flex: 0.5 },
        {
            headerName: 'Hoja', field: "url_coursier_sheet", flex: 0.5, renderCell: (params) => (
                <a
                    href={params.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        backgroundColor: "rgba(100, 181, 246, 0.2)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: "bold",
                    }}
                >
                    Ver Hoja
                </a>
            )
        },
        {
            headerName: 'Etiqueta', field: "url_external_service_sheet", flex: 0.6, renderCell: (params) => (
                <a
                    href={params.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        backgroundColor: "rgba(165, 214, 167, 0.2)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: "bold",
                    }}
                >
                    Ver Etiqueta
                </a>
            )
        },
        {
            headerName: 'Estado', field: 'status', flex: 0.6, renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", backgroundColor: colors.black[100], width: "200px", height: "40px", borderRadius: "5px", color: statusColorMap[params.row.status] || 'white' }}>
                    <p style={{ display: "inline-block", margin: "auto", overflow: "hidden", padding: "1px 2px 1px" }}>{params.row.status}</p>
                </div>
            )
        },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones" key="sub-menu">
                        {user && (
                            <>
                                <Menu.Item key="0">
                                    <Button type="primary" style={{ backgroundColor: "#5e2129" }} onClick={() => canceledOrderById(params.row.id)}>
                                        Anular
                                    </Button>
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <EditOrderPlatform
                                        rangeItems={rangeItems}
                                        data={params.row}
                                        user={user}
                                        users={users}
                                        conditions={conditions}
                                        methods={methods}
                                        places={places}
                                        setReloadData={setReloadData}
                                        URL_SERVER={URL_SERVER}
                                    />
                                </Menu.Item>
                                {hasPermission(user.email, 'boss') && (
                                    <Menu.Item key="2">
                                        <AuthOrderPlatform
                                            data={params.row}
                                            user={user}
                                            setReloadData={setReloadData}
                                            URL_SERVER={URL_SERVER}
                                        />
                                    </Menu.Item>
                                )}
                            </>
                        )}
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
                        customised={{
                            columns: {
                                columnVisibilityModel: {
                                    coursier: false,
                                    seller: false,
                                    address: false,
                                    state: false,
                                    condition: false,
                                    method: false
                                }
                            }
                        }}
                    />
                </Box>
            )}
        </div>

    );
};

export default PlatformTable;