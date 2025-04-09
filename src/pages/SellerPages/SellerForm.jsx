import React, { useState, useEffect } from "react";
import { useTheme, Box, Button, MenuItem, TextField, useMediaQuery, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { Spin, message, notification } from "antd";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "./../../theme";
import axios from "axios";

const phoneRegExp = /^\+?[0-9]{10}$/;

const checkoutSchema = yup.object().shape({
    branchOffice: yup.string().required("required"),
    clientName: yup.string().required("required"),
    address: yup.string().required("required"),
    department: yup.string().required("required"),
    city: yup.string().required("required"),
    phone: yup
        .string()
        .matches(phoneRegExp, "Número de teléfono inválido"),
    total: yup.string().required("required"),
    shipment: yup.string().required("required"),
    condition: yup.string().required("required"),
    method: yup.string().required("required"),
    seller: yup.string().required("required")
});

const SellerForm = ({ user, allProducts, setAllProducts, total, setTotal, setCountProducts, URL_SERVER }) => {
    const [loading, setLoading] = useState(true)
    const [conditions, setCondiions] = useState([])
    const [methods, setMethods] = useState([])
    const [places, setPlaces] = useState([])
    const [users, setUsers] = useState([])
    const [dataCities, setDataCities] = useState([])
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [conditionsResp, methodsResp, placesResp, usersResp] = await Promise.all([
                    axios.get(`${URL_SERVER}/sales/conditions`),
                    axios.get(`${URL_SERVER}/sales/methods`),
                    axios.get(`${URL_SERVER}/sales/places`),
                    axios.get(`${URL_SERVER}/database/users`)
                ]);

                setCondiions(conditionsResp.data)
                setMethods(methodsResp.data)
                setPlaces(placesResp.data)
                setUsers(usersResp.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData()
    }, [allProducts])

    const onFinish = (e) => {
        e.items = allProducts
        e.user = user.email

        setLoading(true)

        if (!e.items || e.items.length === 0) {
            notification.error({
                message: 'No puedes enviar un pedido vacío',
                description: 'Cámbialo antes de continuar.',
                duration: 5,
            });
            setLoading(false)
            return;
        }

        const invalidItems = e.items.filter(item => item.carQuantity > item.quantity);

        if (invalidItems.length > 0) {
            notification.error({
                message: 'Stock insuficiente',
                description: `No puedes enviar más cantidad de la disponible en: ${invalidItems.map(i => i.name).join(', ')}`,
                duration: 5,
            });
            setLoading(false)
            return;
        }

        axios.post(`${URL_SERVER}/sales/order`, { data: e })
            .then(resp => {
                message.success(resp.data.message);
                localStorage.setItem('allProducts', JSON.stringify([]));
                localStorage.setItem('total', 0);
                localStorage.setItem('countProducts', 0);
                setAllProducts([])
                setTotal(0)
                setCountProducts(0)
            })
            .catch(error => {
                message.error("error en el servidor");
            }).finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 5000);
            });
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <>
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
                                                        ${Number(product.sale_price.replace("$", "")) * product.carQuantity}
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
                                total: total,
                                shipment: '',
                                condition: '',
                                method: '',
                                notation: '',
                            }}
                            onSubmit={(values, { resetForm }) => {
                                onFinish(values);
                                resetForm();
                            }}
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
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            select
                                            label="Vendedor"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            name="seller"
                                            error={!!touched.seller && !!errors.seller}
                                            helperText={touched.seller && errors.seller}
                                            sx={{ gridColumn: "span 2" }}
                                        >
                                            <MenuItem key={0} value={"Vendedor Saca Producto"}>
                                                Vendedor Saca Producto
                                            </MenuItem>
                                            <MenuItem key={1} value={"Estilista"}>
                                                Estilista
                                            </MenuItem>
                                            <MenuItem key={2} value={"Mercadolibre"}>
                                                Mercadolibre
                                            </MenuItem>
                                            <MenuItem key={3} value={"Magic Mechas"}>
                                                Magic Mechas
                                            </MenuItem>
                                            <MenuItem key={4} value={"Falabella"}>
                                                Falabella
                                            </MenuItem>
                                            <MenuItem key={5} value={"Rappi"}>
                                                Rappi
                                            </MenuItem>
                                            {users
                                                .filter(obj => obj.email === user.email)
                                                .map((user, index) =>
                                                    user.email === "inducorsas@gmail.com" ? (
                                                        <>
                                                            <MenuItem key="andrea" value="Andrea">
                                                                Andrea
                                                            </MenuItem>
                                                            <MenuItem key="nicolas" value="Nicolás">
                                                                Nicolás
                                                            </MenuItem>
                                                        </>
                                                    ) : (
                                                        <MenuItem key={`user-${index}`} value={user.name}>
                                                            {user.name}
                                                        </MenuItem>
                                                    )
                                                )}
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
                                            label="Cédula"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.identification}
                                            name="identification"
                                            error={!!touched.identification && !!errors.identification}
                                            helperText={touched.identification && errors.identification}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Email del cliente"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.email}
                                            name="email"
                                            error={!!touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
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
                                                const filteredPlace = places.find(obj => obj.departamento == selectedDepartment)
                                                setDataCities(filteredPlace.ciudades)
                                                handleChange(event)
                                            }}
                                            value={values.department}
                                            name="department"
                                            error={!!touched.department && !!errors.department}
                                            helperText={touched.department && errors.department}
                                            sx={{ gridColumn: "span 2" }}
                                        >
                                            {
                                                places.map((obj, index) => (
                                                    <MenuItem key={index} value={obj.departamento}>
                                                        {obj.departamento}
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
                                                conditions.map(obj => (
                                                    <MenuItem key={obj.id} value={obj.value}>
                                                        {obj.value}
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
                                                methods.map(obj => (
                                                    <MenuItem key={obj.id} value={obj.value}>
                                                        {obj.value}
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
            )}
        </div>

    );
};

export default SellerForm;