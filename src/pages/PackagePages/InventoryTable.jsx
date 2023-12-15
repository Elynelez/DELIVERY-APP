import React, { useState, useEffect } from "react";
import { Spin, Menu } from "antd"
import DataTableGrid from "../Controllers/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";

const InventoryTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [reloadData, setReloadData] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?")
            .then(response => response.json())
            .then(parsedData => {
                parsedData.forEach((obj, index)=>{
                    obj.id = index
                })
                setData(parsedData)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [])

    const columns = [
        { headerName: 'Sku', field: "sku", flex: 1 },
        { headerName: 'Nombre', field: "name", flex: 2 },
        { headerName: 'Cantidad', field: "quantity", flex: 0.5 },
        { headerName: 'Marca', field: "brand", flex: 1 },
        { headerName: 'Precio', field: "sale_price", flex: 1 },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones">
                        <Menu.Item key="0">
                            <button>Agregar Sku</button>
                            <button>Enlazar Mco</button>
                            <button>Ajustar Cantidad</button>
                            <button>Editar Producto</button>
                            <button>Eliminar Producto</button>
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
                            INVENTARIO DE PRODUCTOS
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        columns={columns}
                        data={data}
                        setReloadData={setReloadData}
                        setLoading={setLoading}
                        typeSheet={"Nothing"}
                    />
                </Box>
            )}
        </div>
    )
}

export default InventoryTable
