import React, { useEffect, useState } from "react";
import { Spin } from "antd"
import DataTableGrid from "../../../controllers/Tables/DataGridPro";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import axios from "axios";

const EnterTable = ({ ordersData, setOrdersData, API_URL }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        axios.get(`${API_URL}/inventory/entries`)
            .then(resp => {
                setOrdersData(resp.data)
                setLoading(false);
            })
    }, [])

    const columns = [
        { headerName: 'Fecha de entrada', field: "date_generate", flex: 1 },
        { headerName: 'Número de factura', field: "facture_number", flex: 1 },
        { headerName: 'Proveedor', field: "provider", flex: 1 },
        {
            headerName: 'Artículos', field: "items", valueFormatter: (params) => {
                return params.value.map(obj => `${obj.item.sku} - ${obj.item.name} - ${obj.item.quantity}`).join('; ');
            }
        },
        {
            headerName: 'Usuario Entrada', field: "review", flex: 1, valueFormatter: (params) => {
                return `Usuario: ${params.value.user} - IP: ${params.value.IP}`;
            },
        },
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
                            TABLA DE ENTRADAS
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

export default EnterTable;
