import React, { useEffect, useState } from "react";
import { Spin } from "antd"
import DataTableGrid from "../../controllers/Tables/DataGridPro";
import {useTheme,  Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";

const TableDCBOGOTA = ({ URL_SERVER ="https://script.google.com/macros/s/AKfycbybXfVUusQoptK2mafMn2gQymQRDcfbNfy8P7RHRY7q8rE6tNM2gTEurhliFtmXbK3vjA/exec?path=platforms/orders" }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        axios.get("https://script.google.com/macros/s/AKfycbybXfVUusQoptK2mafMn2gQymQRDcfbNfy8P7RHRY7q8rE6tNM2gTEurhliFtmXbK3vjA/exec?path=platforms/orders/DCBOGOTA")
            .then((resp) => {
                setOrders(resp.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })

        // axios.post("http://localhost:8080/inventory/settings", [{code: "ITEM1", quantity: 999999}])
        // .then(resp => {
        //     console.log(resp.data)
        // })
    }, [])

    const columns = [
        { headerName: 'Fecha', field: "date_generate", flex: 1 },
        { headerName: 'ID', field: "id", flex: 0.5 },
        {
            headerName: 'Vendedor', field: "seller", flex: 1, valueFormatter: (params) => {
                return params.value.name;
            }
        },
        {
            headerName: 'Cliente', field: "customer", flex: 1, valueFormatter: (params) => {
                return params.value.name;
            }
        },
        {
            headerName: 'Total', field: "transactions", renderCell: params => (
                <p>
                    {params.row.order.transactions.total_payments}
                </p>
            )
        },
        {
            headerName: 'Estado', field: "delivery", renderCell: params => (
                <p>
                    {params.row.order.delivery.status}
                </p>
            )
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
                            TABLA DE PEDIDOS DCBOGOTA
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

export default TableDCBOGOTA;