import React, { useState, useEffect } from "react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select, notification } from "antd"
import { v4 } from 'uuid';
import axios from "axios";
import { PlatformAutoComplete } from "../../../controllers/Modals/InventoryModals";

const ExitForm = ({ user, ordersData, setOrdersData, rangeItems, socket, receiveOrders, URL_SERVER, API_URL }) => {
    const [exitData, setExitData] = useState({})
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {

        if (exitData) {
            const savedExitData = localStorage.getItem("exitData")
            savedExitData ? setExitData(JSON.parse(savedExitData)) : setExitData({ facture_number: "", platform: "POR CONFIRMAR", projects: [] })
        }

        socket.on('getExits', (loadedOrders) => {
            try {
                setOrdersData(loadedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error handling loadOrders event:', error);
            }
        });

        socket.on('dataOrderExit', obj => {
            try {
                receiveOrders(obj);
            } catch (error) {
                console.error('Error handling dataOrder event:', error);
            }
        })

        return () => {
            socket.off('dataOrderExit')
        }
    }, [socket])

    const onFinish = (e) => {
        e.platform = "POR CONFIRMAR"
        setLoading(true)
        setDisabled(true)

        const skuSet = new Set();
        let hasDuplicates = false;

        for (const project of e.projects) {
            if (skuSet.has(project.sku)) {
                hasDuplicates = true;
                break;
            }
            skuSet.add(project.sku);
        }

        if (hasDuplicates) {
            notification.error({
                message: 'No puedes enviar elementos con SKU repetidos en una misma salida',
                description: 'Verifica y elimina los elementos duplicados antes de continuar.',
                duration: 5,
            });
            setDisabled(false);
            setLoading(false);
            return;
        }

        if (!e.projects || e.projects.length === 0) {
            notification.error({
                message: 'No puedes enviar una salida vacía',
                description: 'Cámbialo antes de continuar.',
                duration: 5,
            });
            setDisabled(false);
            setLoading(false);
            return;
        }

        axios.get(URL_SERVER + "/inventory/products")
            .then(resp => {
                if (/^\d+$/.test(e.facture_number)) {
                    notification.error({
                        message: 'Número de factura inválido',
                        description: 'No puedes poner sólo números tiene que tener la letra correspondiente.',
                        duration: 5,
                    });
                    setDisabled(false)
                    setLoading(false)
                    return;
                }

                rangeItems = resp.data

                let rangeOrderNumbers = ordersData.map(obj => { return obj.order_number }).filter(orderNumber => !/^[A-Za-z]+$/.test(orderNumber))
                var date = new Date()
                const idExit = v4()
                let foundError = [];

                let blockExecution = rangeOrderNumbers.some(number => {
                    number = number.toString().toUpperCase()
                    e.facture_number = e.facture_number.toString().toUpperCase()
                    return (
                        (number.includes(e.facture_number) || e.facture_number.includes(number)) &&
                        !e.facture_number.includes("REENVASAR") &&
                        !e.facture_number.includes("PORCIONAR")
                    );
                });

                if (blockExecution) {
                    notification.error({
                        message: 'Número de factura bloqueado',
                        description: 'Por favor, cambia el valor antes de continuar.',
                        duration: 5,
                    });
                    setDisabled(false)
                    setLoading(false)
                    return;
                }

                e.projects = e.projects.map(obj => {
                    const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

                    if (matchingRangeItem) {

                        return { ...matchingRangeItem, quantity_currently: obj.quantity_currently };
                    }

                    return null;
                }).filter(obj => obj !== null);

                e.projects.forEach(obj => {
                    if (Number(obj.quantity_currently) > Number(obj.quantity)) {
                        foundError.push(JSON.stringify([obj.name, obj.quantity]));
                        return;
                    }
                });

                if (foundError.length) {
                    localStorage.setItem("exitData", JSON.stringify(e))
                    notification.error({
                        message: 'Estás intentando sacar más productos de los disponibles en ' + foundError,
                        description: 'Por favor, cambia los valores antes de continuar.',
                        duration: 5,
                    });
                    setDisabled(false)
                    setLoading(false)
                    return;
                }

                var data = {
                    id: idExit,
                    date_generate_ISO: date.toISOString(),
                    date_generate: date.toLocaleString('sv', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 }).replace(',', '.').replace(' ', 'T') + "Z",
                    order_number: e.facture_number.toString().toUpperCase(),
                    platform: e.platform,
                    items: [],
                    picking: {
                        user: user ? user.email : "test",
                    },
                    packing: {}
                }

                const allValues = e.projects.map(obj => {
                    return {
                        code: obj.code,
                        sku: obj.sku,
                        name: obj.name,
                        db_quantity: obj.quantity,
                        quantity: obj.quantity_currently,
                        brand: obj.brand
                    }
                })

                data.items = allValues

                try {
                    socket.emit('postExit', data)
                    receiveOrders(data)
                    message.success('Cargado exitosamente')
                    localStorage.setItem("exitData", JSON.stringify({}))
                    setDisabled(false)
                } catch (err) {
                    console.error('Error changing row:', err);
                    message.error('No se pudo completar la operación')
                } finally {
                    form.setFieldsValue({ projects: [], facture_number: "" })
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
                    <PlatformAutoComplete
                        socket={socket}
                        mainForm={form}
                        colors={colors}
                    />
                    <div className="container-group-form" style={{ backgroundColor: colors.primary[400] }}>
                        <h1 className="form-title-group" style={{ color: "#6870fa" }}><span>SALIDA DE PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} initialValues={exitData} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "#6870fa" }}>Número del pedido</label>}
                                                name="facture_number"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                    type: "regexp",
                                                    pattern: new RegExp(/^[a-zA-Z]$/),
                                                    message: 'El número del pedido debe comenzar con una letra y puede contener letras y números.'
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid #6870fa" }} />
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-form">
                                            <Form.Item
                                                hidden="true"
                                                label="Plataforma"
                                                name="platform"
                                                labelAlign="left"
                                                rules={[{ required: true }]}
                                                initialValue={"POR CONFIRMAR"}
                                            >
                                                <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <h4 className="h4-bottom-form" style={{ color: "#6870fa" }}></h4>
                                    <Form.List name="projects">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button className="button-add-form" style={{ backgroundColor: "#6870fa" }} onClick={add} >
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
                                                                        style={{ borderBottom: "1px solid #6870fa" }}
                                                                        showSearch={true}
                                                                        placeholder="Select a product"
                                                                    >
                                                                        {rangeItems.map((obj, index) => (
                                                                            <Select.Option value={obj.sku} code={obj.code} key={index}>{obj.name}</Select.Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    name={[index, "quantity_currently"]}
                                                                    rules={[
                                                                        { required: true }
                                                                    ]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid #6870fa" }} placeholder="Quantity" type="number" min="1" max="999" />
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
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#6870fa" }} disabled={disabled} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </div >

    )
}

export default ExitForm