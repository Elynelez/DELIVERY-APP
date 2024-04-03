import React, { useState, useEffect } from "react";
import { Button, Spin, Menu, Modal, message } from "antd"
import DataTableGrid from "../../controllers/Tables/DataGridPro";
import { ModalData, EditModal, ConfirmModal } from "../../controllers/Modals/DeliveryModals";
import { useTheme, Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useParams } from 'react-router-dom';

const DeliveryTable = ({ user, emails, deliveryData, setDeliveryData, API_URL }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [reloadData, setReloadData] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const loadData = () => {
        let data
        setLoading(true);
        fetch(API_URL + "delivery/travels")
            .then(response => response.json())
            .then(parsedData => {
                console.log(parsedData)
                data = parsedData.map(obj => {
                    return {
                        id: obj.id,
                        code: obj.order.id,
                        date_generate: obj.date_generate,
                        coursier: obj.order.shipping_data.coursier.toLowerCase(),
                        client: obj.order.customer.name,
                        seller: obj.order.seller.name,
                        address: obj.order.customer.address,
                        condition: obj.order.transactions.condition,
                        method: obj.order.transactions.method,
                        total: obj.order.transactions.total,
                        status: obj.order.status,
                        notation: obj.order.remarks,
                        complete: obj
                    }
                })

                if (id != "all") {
                    data = data.filter(obj => obj.coursier.includes(id))
                }

                setDeliveryData(data);
                setLoading(false);
                setReloadData(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const deleteRowById = (id) => {
        Modal.confirm({
            title: '¿Seguro que quieres eliminar este contenido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                fetch(API_URL + "delivery/travel/delete", {
                    redirect: "follow",
                    method: 'POST',
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify({ id: id })
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Contenido borrado exitosamente');
                        setReloadData(true)
                    })
                    .catch(error => {
                        console.error('Error deleting row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    }

    const canceledOrderById = (id) => {
        Modal.confirm({
            title: '¿Seguro que quieres anular este padido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                fetch(API_URL + "delivery/travel/canceled", {
                    redirect: "follow",
                    method: 'POST',
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify({ id: id })
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
        { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
        { headerName: 'Código', field: "code", flex: 1 },
        { headerName: 'Mensajero', field: "coursier", flex: 1 },
        { headerName: 'Cliente', field: "client", flex: 1 },
        { headerName: 'Vendedor', field: "seller", flex: 1 },
        { headerName: 'Dirección', field: "address", flex: 1 },
        { headerName: 'Condición', field: "condition", flex: 1 },
        { headerName: 'Método', field: "method", flex: 1, renderCell: (params) => (
            params.row.method === "EFECTIVO" ?
                <div style={{ color: '#052c65' }}>
                    {params.row.method}
                </div> : <div>
                    {params.row.method}
                </div>
        ) },
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
                            <ModalData data={params.row.complete} />
                        </Menu.Item>

                        {user && (
                            <>
                                {emails.includes(user.email) && (
                                    <>
                                        <Menu.Item key="2">
                                            <Button type="primary" style={{ backgroundColor: "#5e2129" }} onClick={() => canceledOrderById(params.row.order_id)}>Anular</Button>
                                        </Menu.Item>
                                        <Menu.Item key="3">
                                            <Button type="primary" style={{ backgroundColor: "red" }} onClick={() => deleteRowById(params.row.id)}>Borrar</Button>
                                        </Menu.Item>
                                        {params.row.status == "EN RUTA" && (
                                            <>
                                                <Menu.Item key="4">
                                                    <EditModal setReloadData={setReloadData} data={params.row.complete} API_URL={API_URL} />
                                                </Menu.Item>
                                                <Menu.Item key="5">
                                                    <ConfirmModal setReloadData={setReloadData} data={params.row.complete} API_URL={API_URL} user={user} />
                                                </Menu.Item>
                                            </>
                                        )}
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
                            RUTA DE <>{id == "all" ? "TODOS" : id.toLocaleUpperCase()}</>
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        columns={columns}
                        data={"user.email" == "contableducor@gmail.com" ? deliveryData.filter(obj => obj.method != "EFECTIVO") : deliveryData}
                        setReloadData={setReloadData}
                        setLoading={setLoading}
                        typeSheet={"Delivery"}
                    />
                </Box>
            )}
        </div>
    );
};

export default DeliveryTable;