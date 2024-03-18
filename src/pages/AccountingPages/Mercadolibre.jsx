import React, { useState, useEffect } from "react";
import { Button, Spin, Menu } from "antd"
import DataTableGrid from "../../controllers/DataGridPro";
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
    const [newRow, setNewRow] = useState({})

    const loadData = () => {
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbybXfVUusQoptK2mafMn2gQymQRDcfbNfy8P7RHRY7q8rE6tNM2gTEurhliFtmXbK3vjA/exec")
            .then(response => response.json())
            .then(parsedData => {
                var newData = parsedData.map(obj => {
                    return { ...obj, name: obj.client.name };
                });
                setData(newData);
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

    useEffect(() => {
        setData((prevRows) => {
            const updatedRows = prevRows.map((row) => {
                // Comprobar si la fila es la que estamos editando
                if (row.id === newRow.id) {
                    // Actualizar la fila con el objeto editado
                    return { ...row, ...newRow };
                }
                return row;
            });
            return updatedRows;
        });

    }, [newRow])


    const columns = [
        { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
        { headerName: 'Cliente', field: "name", flex: 1, headerAlign: 'left' },
        { headerName: 'Productos', field: "name", flex: 1, headerAlign: 'left' },
        { headerName: 'Metodo de Pago', field: "method", flex: 1, headerAlign: 'left', renderCell: (params) => {
            <div>{params.row.transaction.method}</div>
        } },
        { headerName: 'Valor', field: "name", flex: 1, headerAlign: 'left' },
        { headerName: 'Acciones', field: "name", flex: 1, headerAlign: 'left' },

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