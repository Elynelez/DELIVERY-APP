import React, { useState, useEffect } from "react";
import { Spin, Menu, Button } from "antd"
import { ConfirmInventoryModal } from "../Controllers/Modals/InventoryModals";
import DataTableGrid from "../Controllers/DataGridPro";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";

const PendingOrders = ({ rangeItems, setRangeItems }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [reloadData, setReloadData] = useState(false);
    // const [rangeItems, setRangeItems] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const API_URL = "https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec";


    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const loadRange = async () => {
        setLoading(true);
        console.log("generación nueva de datos")
        try {
            const parsedData = await fetchData(API_URL);
            setRangeItems(parsedData);
            localStorage.setItem("cacheRangeItems", JSON.stringify(parsedData));
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const parsedData = await fetchData(`${API_URL}?exitsOrders`);
            setData(parsedData)
        } finally {
            setLoading(false);
        }
    }

    const loadRangeAndUpdateHourly = async () => {
       
        const lastUpdateTimestamp = localStorage.getItem("lastUpdateTimestamp");

        const currentTimestamp = new Date().getTime();

        const oneHourInMilliseconds = 60 * 60 * 1000; 
        const shouldUpdate = !lastUpdateTimestamp || (currentTimestamp - lastUpdateTimestamp) >= oneHourInMilliseconds;

        if (shouldUpdate) {
            await loadRange();
            
            localStorage.setItem("lastUpdateTimestamp", currentTimestamp);
        }

        setInterval(async () => {
            await loadRange();
        }, oneHourInMilliseconds);
    };

    useEffect(() => {
        (async () => {
            await loadRangeAndUpdateHourly();
            await loadData();
        })();
    }, []);

    useEffect(() => {
        if (reloadData) {
            (async () => {
                await loadRange()
                await loadData();
                setReloadData(false);
            })();
        }
    }, [reloadData]);


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
                            <ConfirmInventoryModal
                                rangeItems={rangeItems}
                                orderNumber={params.row.order_number}
                                initialValues={{ cells: params.row.cells }}
                                rows={params.row.items}
                                setReloadData={setReloadData}
                                loadData={loadData}
                                setLoading={setLoading}
                            />
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
                            {/* <Button
                                onClick={() => {
                                    var test = () => {
                                        cacheData[0].id = 10000
                                        cacheData[0].order_number = "TESTMAN"
                                        return cacheData[0]
                                    }
                                    cacheData.push(test())
                                    setCacheData(cacheData)
                                }}
                            >Test
                            </Button>
                            <Button
                                onClick={() => {
                                    console.log(cacheData)
                                }}
                            >Teggggg
                            </Button> */}
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
                        typeSheet={"Inventory"}
                    />
                </Box>
            )}
        </div>
    )
}

export default PendingOrders;