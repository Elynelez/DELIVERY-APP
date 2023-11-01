import { Box, Button, TextField, useMediaQuery, LinearProgress, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { Formik } from "formik";
import { styled } from '@mui/material/styles';
import * as yup from "yup";
import { linearProgressClasses } from '@mui/material/LinearProgress';
import React from "react";
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
    const allProducts = props.allProducts

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleFormSubmit = (values) => {
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
                                                    sx={{ display: 'inline'}}
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
                    onSubmit={handleFormSubmit}
                    validationSchema={checkoutSchema}
                >
                    {({
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
                                    label="Ducor"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    name="branchOffice"
                                    error={!!touched.branchOffice && !!errors.branchOffice}
                                    helperText={touched.branchOffice && errors.branchOffice}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Nombre del cliente"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
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
                                    name="address"
                                    error={!!touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Departamento"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    name="department"
                                    error={!!touched.department && !!errors.department}
                                    helperText={touched.department && errors.department}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Ciudad"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    name="city"
                                    error={!!touched.city && !!errors.city}
                                    helperText={touched.city && errors.city}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Teléfono"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    name="phone"
                                    error={!!touched.phone && !!errors.phone}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Total del pedido"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={"ffff"}
                                    name="total"
                                    error={!!touched.total && !!errors.total}
                                    helperText={touched.total && errors.total}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Envío"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={"ffff"}
                                    name="shipment"
                                    error={!!touched.shipment && !!errors.shipment}
                                    helperText={touched.shipment && errors.shipment}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Condición"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={"ffff"}
                                    name="condition"
                                    error={!!touched.condition && !!errors.condition}
                                    helperText={touched.condition && errors.condition}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Medio de pago"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={"ffff"}
                                    name="method"
                                    error={!!touched.method && !!errors.method}
                                    helperText={touched.method && errors.method}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Observaciones"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={"ffff"}
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
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    contact: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("required"),
    address1: yup.string().required("required"),
    address2: yup.string().required("required"),
});
const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address1: "",
    address2: "",
};

export default SellerForm;