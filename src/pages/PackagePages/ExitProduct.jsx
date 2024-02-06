import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select, notification } from "antd"
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

const ExitProduct = ({ pendingData, setPendingData, rangeItems, socket, receiveOrders }) => {
    const { user } = useAuth0();
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();

    useEffect(() => {

        socket.on('loadOrders', (loadedOrders) => {
            try {
                console.log('loadOrders event received:', loadedOrders);
                setPendingData(loadedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error handling loadOrders event:', error);
            }
        });

        socket.on('dataOrder', obj => {
            try {
                console.log('dataOrder event received:', obj);
                receiveOrders(obj);
            } catch (error) {
                console.error('Error handling dataOrder event:', error);
            }
        })

        return () => {
            socket.off('dataOrder')
        }
    }, [])

    const onFinish = (e) => {
        let rangeOrderNumbers = pendingData.map(obj => { return obj.order_number }).filter(orderNumber => !/^[A-Za-z]+$/.test(orderNumber))
        var date = new Date()
        const idExit = v4()

        e.facture_number = e.facture_number.toString().toUpperCase()

        let blockExecution = rangeOrderNumbers.some(number => {
            number = number.toString().toUpperCase()
            return (
                number.includes(e.facture_number) || e.facture_number.includes(number)
            );
        });

        if (blockExecution) {
            notification.error({
                message: 'Número de factura bloqueado',
                description: 'Por favor, cambia el valor antes de continuar.',
                duration: 5,
            });
            return;
        }

        e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

            if (matchingRangeItem) {

                return { ...matchingRangeItem, quantity_currently: obj.quantity };
            }

            return null;
        }).filter(obj => obj !== null);

        var data = {
            id: idExit,
            date_generate_ISO: date.toISOString(),
            date_generate: date.toLocaleString('sv', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 }).replace(',', '.').replace(' ', 'T') + "Z",
            order_number: e.facture_number.toUpperCase(),
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
                quantity: obj.quantity_currently,
                brand: obj.brand
            }
        })

        data.items = allValues

        receiveOrders(data)

        socket.emit('objectValues', data)

        setLoading(true)

        try {
            message.success('cargado exitosamente')
            form.resetFields()
            setLoading(false)
        } catch (err) {
            console.error('Error changing row:', err);
            message.info('no se pudo completar la operación')
            setLoading(false);
        }
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
                        <h1 className="form-title-group" style={{ color: "#6870fa" }}><span>SALIDA DE PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} layout="vertical">
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
                                                    pattern: new RegExp(/^[a-zA-Z0-9]+$/),
                                                    message: 'Solo se permiten letras y números',
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
                                                                        {rangeItems.map(obj => (
                                                                            <Select.Option value={obj.sku} code={obj.code}>{obj.name}</Select.Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    name={[index, "quantity"]}
                                                                    rules={[{ required: true }]}
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
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#6870fa" }} />
                            </Form.Item>
                        </Form>
                    </div>
                </div >
            )}
        </div >

    )
}

export default ExitProduct