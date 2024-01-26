import React, { useState, useEffect } from "react";
import { Spin, Menu, Button } from "antd"
import { ConfirmInventoryModal, ConfirmInventoryModalServer } from "../Controllers/Modals/InventoryModals";
import DataTableGrid from "../Controllers/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";

const PendingOrders = ({ rangeItems, setRangeItems, pendingData, setPendingData, socket, receiveOrders }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {

        socket.on('loadOrders', (loadedOrders) => {
            setPendingData(loadedOrders)
            setLoading(false);
        });

        socket.on('dataOrder', obj => {
            receiveOrders(obj)
        })

        return () => {
            socket.off('dataOrder')
        }
    }, [socket])

    const columns = [
        { headerName: 'Fecha', field: "date_generate", flex: 1 },
        { headerName: 'Número de orden', field: "order_number", flex: 1 },
        { headerName: 'Plataforma', field: "platform", flex: 1 },
        { headerName: 'Usuario', field: "user", flex: 1 },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones">
                        <Menu.Item key="0">
                            <ConfirmInventoryModalServer
                                orderNumber={params.row.order_number}
                                initialValues={{ cells: params.row.cells }}
                                rows={params.row.items}
                                setLoading={setLoading}
                                socket={socket}
                                setPendingData={setPendingData}
                            />
                            {/* <ConfirmInventoryModal
                                rangeItems={rangeItems}
                                orderNumber={params.row.order_number}
                                initialValues={{ cells: params.row.cells }}
                                rows={params.row.items}
                                setReloadData={setReloadData}
                                loadData={loadData}
                                setLoading={setLoading}
                            /> */}
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
                // <ul>
                //     {pendingData.map((obj, index) => (
                //         <li key={index}>{obj.order_number}</li>
                //     ))}
                // </ul>
                <Box m="20px">
                    <Box mb="30px">
                        <Typography
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ m: "0 0 5px 0" }}
                        >
                            PENDIENTES DE CONFIRMAR
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={pendingData.length}
                        columns={columns}
                        data={pendingData.map((obj, index) => {obj.id = index 
                            return obj})}
                        setReloadData={setPendingData}
                        // setReloadData={setReloadData}
                        setLoading={setLoading}
                        typeSheet={"Inventory"}
                    />
                </Box>
            )}
        </div>
    )
}

export default PendingOrders;