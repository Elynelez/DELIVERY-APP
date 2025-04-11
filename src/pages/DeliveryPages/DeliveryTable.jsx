import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useTheme, Box, Typography } from "@mui/material";
import { Button, Spin, Menu, Modal, message } from "antd"
import { ModalData, EditModal, ConfirmModal } from "../../controllers/Modals/DeliveryModals";
import DataTableGrid from "../../controllers/Tables/DataGridPro";
import { tokens } from "./../../theme";
import axios from "axios";

const DeliveryTable = ({ user, hasPermission, ordersData, setOrdersData, reloadData, setReloadData, socket, URL_SERVER }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [methods, setMethods] = useState([])
    const [states, setStates] = useState([])
    const [users, setUsers] = useState([])
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const loadData = async () => {
        try {
            setLoading(true);

            const [methodsResp, travelsResp, statesResp, usersResp] = await Promise.all([
                axios.get(`${URL_SERVER}/delivery/methods`),
                axios.get(`${URL_SERVER}/delivery/travels`),
                axios.get(`${URL_SERVER}/delivery/states`),
                axios.get(`${URL_SERVER}/database/users`)
            ]);

            const parsedData = travelsResp.data;

            let data = parsedData.map((obj, index) => ({
                id: obj.id,
                code: obj.order.id,
                date_generate_ISO: obj.date_generate_ISO,
                date_generate: obj.date_generate,
                date_delivery: obj.date_delivery,
                coursier: obj.order.shipping_data.coursier.toLowerCase(),
                zone: obj.order.shipping_data.zone,
                customer: obj.order.customer.name,
                address: obj.order.customer.address,
                seller: obj.order.seller.name,
                condition: obj.order.transactions.condition,
                method: obj.order.transactions.method,
                total: obj.order.transactions.total,
                status: obj.order.status,
                notation: obj.order.remarks,
                money_delivered: obj.order.money_delivered,
                pos: index + 1
            }));

            if (id != "all") {
                data = data.filter(obj => obj.coursier.includes(id))
            }

            setMethods(methodsResp.data)
            setOrdersData(data.reverse());
            setStates(statesResp.data)
            setUsers(usersResp.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setReloadData(false);
        }
    };

    const deleteRowById = (id) => {
        const updatedData = ordersData.filter((item) => item.id !== id);
        setOrdersData(updatedData);

        Modal.confirm({
            title: '¿Seguro que quieres eliminar este contenido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                setLoading(true)
                message.info('Procesando, por favor espera...');
                socket.emit("deleteDelivery", id)
                socket.on("message", (response) => {
                    if (response.success) {
                        setOrdersData(updatedData);
                        message.success(response.message);
                        setLoading(false)
                    } else {
                        message.error(response.message || 'Hubo un error inesperado.');
                        setLoading(false)
                    }
                });
            },
        });
    }

    const cancelOrderById = (id) => {
        const reversedData = [...ordersData].reverse();
        const position = reversedData.findIndex((item) => item.id === id) + 1
        const updatedData = ordersData.map((item) =>
            item.id === id ? { ...item, status: 'ANULADO' } : item
        );
        setOrdersData(updatedData);

        Modal.confirm({
            title: '¿Seguro que quieres anular este padido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                setLoading(true)
                message.info('Procesando, por favor espera...');
                socket.emit("cancelDelivery", position)
                socket.on("message", (response) => {
                    if (response.success) {
                        setOrdersData(updatedData);
                        message.success(response.message);
                        setLoading(false)
                    } else {
                        message.error(response.message || 'Hubo un error inesperado.');
                        setLoading(false)
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
        { headerName: 'ID', field: "id", flex: 0.5, hidden: true },
        { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
        { headerName: 'Código', field: "code", flex: 1 },
        { headerName: 'Mensajero', field: "coursier", flex: 1 },
        { headerName: 'Zona', field: "zone", flex: 0.5, hidden: true },
        { headerName: 'Cliente', field: "customer", flex: 1 },
        { headerName: 'Vendedor', field: "seller", flex: 1 },
        { headerName: 'Dirección', field: "address", flex: 1 },
        { headerName: 'Condición', field: "condition", flex: 1 },
        {
            headerName: 'Método', field: "method", flex: 1, renderCell: (params) => (
                params.row.method === "EFECTIVO" ?
                    <div style={{ color: '#052c65' }}>
                        {params.row.method}
                    </div> : <div>
                        {params.row.method}
                    </div>
            )
        },
        { headerName: 'Valor', field: "total", flex: 1 },
        {
            headerName: 'Estado', field: 'status', flex: 1, renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", textAlign: "center", backgroundColor: colors.black[100], width: "80px", height: "40px", borderRadius: "5px", color: statusColorMap[params.row.status] || 'white' }}>
                    <p style={{ display: "inline-block", margin: "auto", overflow: "hidden", padding: "1px 2px 1px" }}>{params.row.status}</p>
                </div>
            )
        },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones">
                        <Menu.Item key="0">
                            <ModalData data={params.row} />
                        </Menu.Item>
                        {user && (
                            <>
                                {hasPermission(user.email, ['logistic', 'boss']) && (
                                    <>
                                        <Menu.Item key="2">
                                            <Button
                                                type="primary"
                                                style={{ backgroundColor: "#5e2129" }}
                                                onClick={() => cancelOrderById(params.row.id)}
                                            >
                                                Anular
                                            </Button>
                                        </Menu.Item>
                                        <Menu.Item key="3">
                                            <Button
                                                type="primary"
                                                style={{ backgroundColor: "red" }}
                                                onClick={() => deleteRowById(params.row.id)}
                                            >
                                                Borrar
                                            </Button>
                                        </Menu.Item>
                                        {params.row.status !== "REPROGRAMADO" && (
                                            <Menu.Item key="4">
                                                <EditModal
                                                    setReloadData={setReloadData}
                                                    data={params.row}
                                                    URL_SERVER={URL_SERVER}
                                                    user={user}
                                                    coursiers={users.filter(obj => obj.roles.includes("coursier"))}
                                                    methods={methods}
                                                />
                                            </Menu.Item>
                                        )}
                                        <Menu.Item key="5">
                                            <ConfirmModal
                                                setReloadData={setReloadData}
                                                data={params.row}
                                                URL_SERVER={URL_SERVER}
                                                user={user}
                                                states={states}
                                            />
                                        </Menu.Item>
                                    </>
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
                            RUTA DE {id == "all" ? "TODOS" : id.toLocaleUpperCase()}
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={ordersData.length}
                        columns={columns}
                        data={ordersData}
                        user={user}
                        setReloadData={setReloadData}
                        URL_SERVER={URL_SERVER}
                        states={states}
                    />
                </Box>
            )}
        </div>
    );
};

export default DeliveryTable;