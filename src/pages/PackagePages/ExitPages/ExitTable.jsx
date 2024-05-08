import React, { useEffect, useState } from "react";
import { Button, Spin, Menu } from "antd"
import DataTableGrid from "../../../controllers/Tables/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

const ExitTable = ({ ordersData, setOrdersData, socket }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const returnToPicking = (data) => {

        socket.emit("returnToPicking", data)
        window.location.reload()
    }

    useEffect(() => {

        socket.on('getExits', (loadedData) => {
            try {
                setOrdersData(loadedData)
                setLoading(false);
            } catch (error) {
                console.error('Error handling loadOrders event:', error);
            }
        });

        return () => {
            socket.off('getExits')
        }
    }, [])

    const columns = [
        { headerName: 'Fecha de picking', field: "date_generate", flex: 1 },
        {
            headerName: 'Fecha de packing', field: "date_packing", flex: 1, renderCell: params => (
                <>
                    {params.row.date_packing}
                </>
            )
        },
        { headerName: 'Número de orden', field: "order_number", flex: 1 },
        { headerName: 'Plataforma', field: "platform", flex: 1 },
        {
            headerName: 'Artículos', field: "items", valueFormatter: (params) => {
                return params.value.map(item => `${item.sku} - ${item.name} - ${item.quantity}`).join('; ');
            }
        },
        {
            headerName: 'Usuario Picking', field: "picking", flex: 1, valueFormatter: (params) => {
                return `Usuario: ${params.value.user} - IP: ${params.value.IP}`;
            },
        },
        {
            headerName: 'Usuario Packing', field: "packing", flex: 1, valueFormatter: (params) => {
                return `Usuario: ${params.value.user} - IP: ${params.value.IP}`;
            },
        },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones" key="sub-menu">
                        <Menu.Item key="0">
                            <Button onClick={() => { returnToPicking(params.row) }}>
                                retornar
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
                            TABLA DE SALIDAS
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={ordersData.length}
                        data={ordersData.map(obj => { return { ...obj, date_packing: obj.packing.hour } }).reverse()}
                        columns={columns}
                        setReloadData={setOrdersData}
                    />
                </Box>
            )}
        </div>

    );
};

export default ExitTable;