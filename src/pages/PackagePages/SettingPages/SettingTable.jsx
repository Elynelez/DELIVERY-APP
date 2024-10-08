import React, { useEffect, useState } from "react";
import { Spin } from "antd"
import DataTableGrid from "../../../controllers/Tables/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

const SettingTable = ({ ordersData, setOrdersData, API_URL }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    useEffect(() => {
        fetch(API_URL + "/inventory/settings")
            .then(response => response.json())
            .then(parsedData => {
                console.log(parsedData)
                setOrdersData(parsedData)
                setLoading(false);
            })
    }, [])

    const columns = [
        { headerName: 'Fecha', field: "date_generate", flex: 0.5 },
        {
            headerName: 'Artículos', field: "items", flex: 2, valueFormatter: (params) => {
                return params.value.map(obj => `${obj.item.sku} - ${obj.item.name} - ${obj.item.quantity}`).join('; ');
            }
        },
        {
            headerName: 'Cantidad Anterior', field: "last_quantity", flex: 0.5, renderCell: params => (
                <>
                    {params.row.items[0].last_quantity}
                </>
            )
        },
        {
            headerName: 'Usuario Ajuste', field: "setting", flex: 1, valueFormatter: (params) => {
                return `Usuario: ${params.value.user} - IP: ${params.value.IP}`;
            },
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
                            TABLA DE AJUSTES
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={ordersData.length}
                        data={ordersData.reverse()}
                        columns={columns}
                        setReloadData={setOrdersData}
                    />
                </Box>
            )}
        </div>

    );
};

export default SettingTable;
