import React, { useEffect, useState } from "react";
import { Spin } from "antd"
import DataTableGrid from "../../Controllers/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import axios from "axios";

const EnterTable = ({ URL_SERVER }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        axios.get(URL_SERVER + "/entries")
            .then((resp) => {
                setOrders(resp.data)
                setLoading(false)
            })
    }, [])

    const columns = [
        { headerName: 'Fecha de entrada', field: "date_generate", flex: 1 },
        { headerName: 'Número de factura', field: "facture_number", flex: 1 },
        { headerName: 'Proveedor', field: "provider", flex: 1 },
        {
            headerName: 'Artículos', field: "items", renderCell: params => (
                <ul>
                    {params.row.items.map((item, index) => (
                        <li key={index}>
                            {item.sku} - {item.name} - {item.quantity}
                        </li>
                    ))}
                </ul>
            )
        },
        {
            headerName: 'Usuario Entrada', field: "review", flex: 1, renderCell: params => (
                <>
                    {`Usuario: ${params.row.review.user}, IP: ${params.row.review.IP}`}
                </>
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
                            TABLA DE ENTRADAS
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={orders.length}
                        columns={columns}
                        data={orders}
                        setReloadData={setOrders}
                        setLoading={setLoading}
                        typeSheet={"Inventory"}
                    />
                </Box>
            )}
        </div>

    );
};

export default EnterTable;
