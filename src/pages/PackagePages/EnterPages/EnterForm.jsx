import React, { useState, useEffect } from "react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select, notification } from "antd"
import { v4 } from 'uuid';
import axios from "axios";

const EnterForm = ({ user, rangeItems, socket, URL_SERVER }) => {
    const [enterData, setEnterData] = useState({})
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {

        if (enterData) {
            const savedEnterData = localStorage.getItem("enterData")
            savedEnterData ? setEnterData(JSON.parse(savedEnterData)) : setEnterData({ facture_number: "", provider: "", projects: [] })
        }

        setLoading(false)

    }, [socket])

    const onFinish = (e) => {

        setDisabled(true)
        if (!e.projects || e.projects.length === 0) {
            notification.error({
                message: 'No puedes enviar una salida vacía',
                description: 'Cámbialo antes de continuar.',
                duration: 5,
            });
            setDisabled(false);
            return;
        }

        axios.get(URL_SERVER + "/inventory/products")
            .then(resp => {
                rangeItems = resp.data

                const now = new Date();
                const bogotaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
                const formattedDateTime = bogotaTime.toISOString();
                const idEnter = v4()
                let foundError = [];


                e.projects = e.projects.map(obj => {

                    const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku)

                    if (matchingRangeItem) {

                        return { ...matchingRangeItem, quantity_currently: obj.quantity_currently }

                    }

                    return null

                }).filter(obj => obj !== null);

                e.projects.forEach(obj => {
                    if (Number(obj.quantity) < 0) {
                        foundError.push(obj.name);
                        return;
                    }
                });

                if (foundError.length) {
                    localStorage.setItem("enterData", JSON.stringify(e))
                    notification.error({
                        message: 'Estás intentando ingresar productos pero hay negativos en ' + foundError,
                        description: 'Por favor, cambia los valores antes de continuar.',
                        duration: 5,
                    });
                    setDisabled(false)
                    return;
                }

                var data = {
                    id: idEnter,
                    date_generate_ISO: now.toISOString(),
                    date_generate: formattedDateTime,
                    facture_number: e.facture_number.toString().toUpperCase(),
                    provider: e.provider,
                    items: [],
                    review: {
                        user: user ? user.email : "test",
                    }
                }

                const allValues = e.projects.map(obj => {
                    return {
                        item: {
                            code: obj.code,
                            sku: obj.sku,
                            name: obj.name,
                            db_quantity: obj.quantity,
                            quantity: obj.quantity_currently,
                            brand: obj.brand
                        }
                    }
                })

                data.items = allValues

                setLoading(true);

                try {
                    socket.emit('postEnter', data)
                    message.success('Cargado exitosamente')
                    localStorage.setItem("enterData", JSON.stringify({}))
                    setDisabled(false)
                } catch (err) {
                    console.error('Error changing row:', err);
                    message.error('No se pudo completar la operación')
                } finally {
                    form.setFieldsValue({ projects: [], facture_number: "", provider: "" })
                    setLoading(false)
                }
            })
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="body-group-form">
                    <div className="container-group-form" style={{ backgroundColor: colors.primary[400] }}>
                        <h1 className="form-title-group" style={{ color: "#055160" }}><span>ENTRADA DE PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} initialValues={enterData} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "#055160" }}>Número del pedido</label>}
                                                name="facture_number"
                                                labelAlign="left"
                                                rules={[{ required: true }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid #055160" }} />
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "#055160" }}>Proveedor</label>}
                                                name="provider"
                                                labelAlign="left"
                                                rules={[{ required: true }]}

                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid #055160" }} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <h4 className="h4-bottom-form" style={{ color: "#055160" }}></h4>

                                    <Form.List name="projects">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button className="button-add-form" style={{ backgroundColor: "#055160" }} onClick={add} >
                                                        Agregar
                                                    </Button>
                                                </Form.Item>
                                                <div className="limit-group-form">
                                                    {fields.map((field, index, ...fields) => (
                                                        <Row gutter={[12, 16]} key={index}>
                                                            <Col span={10}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    name={[index, "sku"]}
                                                                    rules={[{ required: true }]}
                                                                >
                                                                    <Select
                                                                        className="input-info-form"
                                                                        style={{ borderBottom: "1px solid #055160" }}
                                                                        showSearch={true}
                                                                        placeholder="Select a product"
                                                                    >
                                                                        {rangeItems.map(obj => (
                                                                            <Select.Option value={obj.sku} code={obj.code}>{obj.name}</Select.Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    name={[index, "quantity_currently"]}
                                                                    rules={[{ required: true }]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid #055160" }} placeholder="Quantity" type="number" min="1" max="999" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Button danger onClick={() => remove(index)}>
                                                                    Eliminar
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                            <Form.Item>
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#055160" }} disabled={disabled} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default EnterForm
