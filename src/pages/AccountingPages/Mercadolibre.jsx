import React, { useState, useEffect } from "react";
import { Button, Spin, Menu } from "antd"
import DataTableGrid from "../Controllers/DataGridPro";
import {
    Box,
    Typography,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    UploadFile as UploadFileIcon,
    Link as LinkIcon,
} from "@mui/material";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Modal, message } from 'antd';

const TableMercadoLibre = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)

    const loadData = () => {
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbybXfVUusQoptK2mafMn2gQymQRDcfbNfy8P7RHRY7q8rE6tNM2gTEurhliFtmXbK3vjA/exec")
            .then(response => response.json())
            .then(parsedData => {
                setData(parsedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData()
        console.log(data)
    }, []);


    const columns = [
        { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
        { headerName: 'Cliente', field: "client", flex: 1, align: 'left', headerAlign: 'left', rendercell: ({value}) => {
            <p>{value.client.name}</p>
        }},
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
                            fontWeight="bold"
                            sx={{ m: "0 0 5px 0" }}
                        >
                            PEDIDOS MERCADOLIBRE
                        </Typography>
                        <Typography variant="h5">
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid columns={columns} data={data} />
                </Box>
            )}
        </div>
    )
}

export default TableMercadoLibre;