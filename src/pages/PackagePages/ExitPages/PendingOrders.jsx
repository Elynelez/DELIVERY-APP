import React, { useState, useEffect } from "react";
import { Spin, Menu } from "antd"
import { ConfirmInventoryModalServer } from "../../../controllers/Modals/InventoryModals";
import DataTableGrid from "../../../controllers/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

const PendingOrders = ({ rangeItems, pendingData, setPendingData, socket, receiveOrders, user, URL_SERVER }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
    }, [])

    const columns = [
        { headerName: 'Fecha', field: "date_generate", flex: 1 },
        { headerName: 'Número de orden', field: "order_number", flex: 1 },
        { headerName: 'Plataforma', field: "platform", flex: 1 },
        {
            headerName: 'Usuario', field: "picking", renderCell: params => (
                <>
                    {params.row.picking ?  params.row.picking.user : params.row.user}
                </>
            )
        },
        {
            headerName: 'Acciones', renderCell: params => (
                <div>
                    <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                        <Menu.SubMenu title="Acciones">
                            <Menu.Item key="0">
                                <ConfirmInventoryModalServer
                                    pendingData={pendingData}
                                    data={params.row}
                                    setLoading={setLoading}
                                    socket={socket}
                                    user={user}
                                    rangeItems={rangeItems}
                                    receiveOrders={receiveOrders}
                                    URL_SERVER={URL_SERVER}
                                />
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
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
                            PENDIENTES DE CONFIRMAR
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={pendingData.length}
                        columns={columns}
                        data={pendingData.filter(obj => obj.platform == "POR CONFIRMAR")}
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