import DataTableGrid from "../Controllers/DataGridPro";
import { Box, Typography } from "@mui/material";

const TableMercadoLibre = () => {
    const data = [{
        id: 1,
        date_generate: 321312,
        code: 23,
        coursier: "gdgdg"
    }]
    const columns = [
        { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
        { headerName: 'Código', field: "code", flex: 1 },
        { headerName: 'Mensajero', field: "coursier", flex: 1 }
    ]
    return (
        <div className="container py-5">
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
        </div>
    )
}

export default TableMercadoLibre;