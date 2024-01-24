import React, { useState, useEffect } from "react";
import { Spin, Menu, Button } from "antd"
import { ConfirmInventoryModal, ConfirmInventoryModalServer } from "../Controllers/Modals/InventoryModals";
import DataTableGrid from "../Controllers/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { loadData } from "../../middlewares";

const PendingOrders = ({ rangeItems, setRangeItems, pendingData, setPendingData, socket }) => {
    const [loading, setLoading] = useState(false) // true
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const API_URL = "https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec";

    useEffect(()=>{
        if(pendingData > 2){
            setLoading(false)
        } else {
            setLoading(true)
            setInterval(() => {
                setLoading(false)
            }, 5000);
        }
    },[])

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
                                loadData={loadData}
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
                        columns={columns}
                        data={pendingData}
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