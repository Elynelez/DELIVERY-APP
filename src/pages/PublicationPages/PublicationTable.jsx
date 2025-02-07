import { useEffect, useState } from 'react';
import { Button, Spin, Menu } from "antd"
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from '../../theme';
import DataTableGrid from '../../controllers/Tables/DataGridPro';
import {
    ActivePauseModal,
    AddPublicationModal,
    AddSkuModal,
    DeletePublicationModal,
    DeleteSkuModal,
    EditProductModal,
    FixProductModal,
    UnfixProductModal
} from '../../controllers/Modals/DatabaseModals';

const PublicationTable = ({ URL_SERVER }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(URL_SERVER + '/v2/productos/coleccion/datos', { cache: 'no-store' });
                const result = await response.json();
                setData(result.data.map((producto, index) => ({
                    id: index.toString(),
                    producto_id: producto.producto_id,
                    tipo: producto.tipo,
                    nombre: producto.nombre,
                    url_imagen: producto.url_imagen,
                    publicaciones: producto.publicaciones,
                    skus: producto.skus,
                    acciones: 'Ver detalles'
                })));
                setLoading(false)
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        }

        async function fetchPlatforms() {
            try {
                const response = await fetch(URL_SERVER + '/v2/plataformas');
                const result = await response.json();
                setPlatforms(result.data);
            } catch (error) {
                console.error('Error al obtener plataformas:', error);
            }
        }

        fetchData();
        fetchPlatforms();
    }, []);

    const statusColorMap = (item) => {
        if (item.active) return 'bg-green-500';
        if (item.fijo) return 'bg-blue-500';
        return 'bg-red-500';
    };

    const columns = [
        {
            headerName: 'Imagen', field: 'url_imagen', flex: 1, renderCell: (params) => (
                <img src={params.row.url_imagen} />
            )
        },
        { headerName: 'Skus', field: 'skus', flex: 1 },
        { headerName: 'Nombre', field: 'nombre', flex: 1 },
        {
            headerName: 'Plataformas', field: 'publicaciones', flex: 1, renderCell: (params) => (
                <ul className="flex gap-1">
                    {params.row.publicaciones.map((item) => (
                        <li key={item.id} className='flex gap-3 content-center text-xs'>
                            <div className={`w-2 h-2 mt-1 ${statusColorMap(item)} rounded-full`} />
                            {platforms.find((obj) => obj.id == item.plataforma)?.nombre || 'Plataforma no encontrada'}
                        </li>
                    ))}
                </ul>
            )
        },
        {
            headerName: 'Acciones', renderCell: params => (
                <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
                    <Menu.SubMenu title="Acciones" key="sub-menu">
                        <Menu.Item key="0">
                            <ActivePauseModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                statusColorMap={statusColorMap}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="1">
                            <AddPublicationModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                platforms={platforms}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="2">
                            <AddSkuModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="3">
                            <DeletePublicationModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                statusColorMap={statusColorMap}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="4">
                            <DeleteSkuModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="5">
                            <EditProductModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="6">
                            <FixProductModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                        <Menu.Item key="7">
                            <UnfixProductModal
                                data={params.row}
                                loading={loading}
                                setLoading={setLoading}
                                URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                            />
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            )
        }
    ];

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
                            TABLA DE PUBLICACIONES
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            últimos detalles
                        </Typography>
                    </Box>
                    <DataTableGrid
                        key={data.length}
                        data={data}
                        columns={columns}
                        setReloadData={setData}
                        URL_SERVER={"https://server-cloud-mggp.onrender.com"}
                    />
                </Box>
            )}
        </div>
    );
}

export default PublicationTable;
