import React, { useState } from "react";
import { Button, Spin, Menu } from "antd"
import DataTableGrid from "../../Controllers/DataGridPro";
import { AddSkuModalServer, ModifyQuantityServer, EditCodeProduct } from "../../Controllers/Modals/InventoryModals";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { Link } from 'react-router-dom';

const InventoryTable = ({ settingInventoryEmails, rangeItems, setRangeItems, user, socket, URL_SERVER }) => {
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const deleteSku = (data) => {
        socket.emit("deleteSku", data)
        window.location.reload()
    }

    const deleteProduct = (data) => {
        socket.emit("deleteProduct", data)
        window.location.reload()
    }

    const columns = [
        { headerName: 'Sku', field: "sku", flex: 1 },
        { headerName: 'Nombre', field: "name", flex: 2 },
        { headerName: 'Cantidad', field: "quantity", flex: 0.5 },
        { headerName: 'Marca', field: "brand", flex: 1 },
        { headerName: 'Precio', field: "sale_price", flex: 1 },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones" key="sub-menu">
                        {user && settingInventoryEmails.includes(user.email) && (
                            <>
                                <Menu.Item key="0">
                                    <AddSkuModalServer
                                        data={params.row}
                                        rangeItems={rangeItems}
                                        socket={socket}
                                        loading={loading}
                                        setLoading={setLoading}
                                        URL_SERVER={URL_SERVER}
                                    />
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <ModifyQuantityServer
                                        socket={socket}
                                        data={params.row}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to={`/inventory/edit/${params.row.code}`}>
                                        <Button>
                                            Editar
                                        </Button>
                                    </Link>
                                </Menu.Item>
                            </>
                        )}
                        {user && user.email == "pedidos.ducor@gmail.com" && (
                            <>
                                <Menu.Item key="3">
                                    <EditCodeProduct
                                        socket={socket}
                                        code={params.row.code}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Button onClick={() => { deleteSku(params.row) }}>
                                        Eliminar sku
                                    </Button>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Button onClick={() => { deleteProduct(params.row) }}>
                                        Eliminar item
                                    </Button>
                                </Menu.Item>
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
                            INVENTARIO DE PRODUCTOS
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={rangeItems.length}
                        columns={columns}
                        data={rangeItems.map((obj, index) => {
                            obj.id = index
                            return obj
                        }
                        )}
                        setReloadData={setRangeItems}
                        setLoading={setLoading}
                        typeSheet={"Nothing"}
                    />
                </Box>
            )}
        </div>
    )
}

export default InventoryTable
