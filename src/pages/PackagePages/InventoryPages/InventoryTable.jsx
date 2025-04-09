import React, { useState } from "react";
import { Button, Spin, Menu } from "antd"
import DataTableGrid from "../../../controllers/Tables/DataGridPro";
import { AddSkuModalServer, ModifyQuantityServer, EditCodeProduct } from "../../../controllers/Modals/InventoryModals";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { Link } from 'react-router-dom';

const InventoryTable = ({ hasPermission, rangeItems, setRangeItems, user, socket, URL_SERVER }) => {
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { headerName: 'Sku', field: "sku", flex: 1 },
        { headerName: 'Nombre', field: "name", flex: 2 },
        { headerName: 'Cantidad', field: "quantity", flex: 0.5 },
        { headerName: 'Marca', field: "brand", flex: 1 },
        { headerName: 'Precio', field: "sale_price", flex: 1 },
        {
            headerName: 'Acciones',
            renderCell: params => (
                <Menu
                    defaultSelectedKeys={['1']}
                    style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}
                >
                    <Menu.SubMenu title="Acciones" key="sub-menu">
                        {user && (
                            <>
                                {hasPermission(user.email, ['boss', 'inventory_setting']) && (
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
                                                <Button>Editar</Button>
                                            </Link>
                                        </Menu.Item>
                                    </>
                                )}
                                {hasPermission(user.email, 'boss') && (
                                    <>
                                        <Menu.Item key="3">
                                            <EditCodeProduct
                                                socket={socket}
                                                code={params.row.code}
                                                loading={loading}
                                                setLoading={setLoading}
                                            />
                                        </Menu.Item>
                                    </>
                                )}
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
