import { Box, Button, MenuItem, TextField, useMediaQuery, LinearProgress, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { Formik } from "formik";
import { styled } from '@mui/material/styles';
import * as yup from "yup";
import { linearProgressClasses } from '@mui/material/LinearProgress';
import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const SellerForm = (props) => {
    const conditions = ["Inter pago en casa", "Inter pago al contado", "Inter envío al cobro", "Pago", "Cobrar", "Cambio Pago", "Cambio Cobrar", "Devolución", "Faltante"]
    const methods = ['Efectivo', 'Nequi Andrea', 'Nequi Nicolas', 'Nequi Santiago', 'Daviplata Andrea', 'Bancolombia Andrea', 'Bancolombia Nicolas', 'Banco de occidente', 'Davivienda Ducor', 'MercadoPago', 'Credito', 'Zelle', 'Datafono', 'Addi']
    const [data, setData] = useState([]);
    const [dataCities, setDataCities] = useState([])
    const allProducts = props.allProducts
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json")
            .then(response => response.json())
            .then(parsedData => {
                let dataO = parsedData.map((object) => {
                    return object.departamento
                })
                setData(dataO)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleFormSubmit = (values) => {
        values.items = allProducts
        console.log(values);
    };

    return (
        <>
            <Box m="20px">
                <BorderLinearProgress variant="determinate" value={80} />
            </Box>
            <Box m="20px">
                <List sx={{ width: '100%', maxWidth: "100%", bgcolor: colors.primary[400] }}>
                    {
                        allProducts.map(product => (
                            <>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={product.image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={product.name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {product.brand}
                                                </Typography>
                                                <br />
                                                x{product.carQuantity}
                                                <br />
                                                {Number(product.sale_price.replace("$", "")) * 1000 * product.carQuantity}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>

                                <Divider variant="inset" component="li" />
                            </>
                        ))
                    }
                </List>
            </Box>
            <Box m="20px">
                <Formik
                    initialValues={{
                        branchOffice: '',
                        clientName: '',
                        address: '',
                        department: '',
                        city: '',
                        phone: '',
                        total: props.total,
                        shipment: '',
                        condition: '',
                        method: '',
                        notation: '',
                    }}
                    onSubmit={handleFormSubmit}
                    validationSchema={checkoutSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    select
                                    label="Sucursal"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    name="branchOffice"
                                    error={!!touched.branchOffice && !!errors.branchOffice}
                                    helperText={touched.branchOffice && errors.branchOffice}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    <MenuItem key={1} value={"BOG"}>
                                        Bogotá
                                    </MenuItem>
                                    <MenuItem key={2} value={"MED"}>
                                        Medellín
                                    </MenuItem>
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Nombre del cliente"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.clientName}
                                    name="clientName"
                                    error={!!touched.clientName && !!errors.clientName}
                                    helperText={touched.clientName && errors.clientName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Dirección"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address}
                                    name="address"
                                    error={!!touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    select
                                    label="Departamento"
                                    onBlur={handleBlur}
                                    onChange={(event) => {
                                        const selectedDepartment = event.target.value;
                                        fetch("https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json")
                                            .then(response => response.json())
                                            .then(parsedData => {
                                                let dataO = parsedData.filter((object) => {
                                                    return selectedDepartment === object.departamento ? object.ciudades : ""
                                                })
                                                setDataCities(dataO[0].ciudades)
                                            })
                                            .catch(error => {
                                                console.error('Error fetching data:', error);
                                            });
                                        handleChange(event)
                                    }}
                                    value={values.department}
                                    name="department"
                                    error={!!touched.department && !!errors.department}
                                    helperText={touched.department && errors.department}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    {
                                        data.map((department, index) => (
                                            <MenuItem key={index} value={department}>
                                                {department}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    select
                                    label="Ciudad"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.city}
                                    name="city"
                                    error={!!touched.city && !!errors.city}
                                    helperText={touched.city && errors.city}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    {
                                        dataCities.map((city, index) => (
                                            <MenuItem key={index} value={city}>
                                                {city}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Teléfono"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.phone}
                                    name="phone"
                                    error={!!touched.phone && !!errors.phone}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Total del pedido"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.total}
                                    name="total"
                                    error={!!touched.total && !!errors.total}
                                    helperText={touched.total && errors.total}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Envío"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.shipment}
                                    name="shipment"
                                    error={!!touched.shipment && !!errors.shipment}
                                    helperText={touched.shipment && errors.shipment}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    select
                                    label="Condición"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.condition}
                                    name="condition"
                                    error={!!touched.condition && !!errors.condition}
                                    helperText={touched.condition && errors.condition}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    {
                                        conditions.map((condition, index) => (
                                            <MenuItem key={index} value={condition}>
                                                {condition}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    select
                                    label="Medio de pago"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.method}
                                    name="method"
                                    error={!!touched.method && !!errors.method}
                                    helperText={touched.method && errors.method}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    {
                                        methods.map((method, index) => (
                                            <MenuItem key={index} value={method}>
                                                {method}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Observaciones"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.notation}
                                    name="notation"
                                    error={!!touched.notation && !!errors.notation}
                                    helperText={touched.notation && errors.notation}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Generar pedido
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

const phoneRegExp =
    /^\+?[0-9]{10}$/;

const checkoutSchema = yup.object().shape({
    branchOffice: yup.string().required("required"),
    clientName: yup.string().required("required"),
    address: yup.string().required("required"),
    department: yup.string().required("required"),
    city: yup.string().required("required"),
    phone: yup
        .string()
        .matches(phoneRegExp, "Número de teléfono inválido")
        .required("required"),
    total: yup.string().required("required"),
    shipment: yup.string().required("required"),
    condition: yup.string().required("required"),
    method: yup.string().required("required"),
});

export default SellerForm;