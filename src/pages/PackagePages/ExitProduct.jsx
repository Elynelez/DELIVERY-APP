import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select } from "antd"
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';
import { io } from "socket.io-client";
import { loadData } from "../../middlewares";
// const socket = io('http://localhost:' + 8080);

const ExitProduct = ({ rangeItems, setRangeItems, pendingData, setPendingData, socket }) => {
    const { user } = useAuth0();
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();
    const API_URL = "https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec";

    const onFinish = async (e) => {
        var date = new Date()
        const idExit = v4()

        e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

            if (matchingRangeItem) {

                return { ...matchingRangeItem, quantity_currently: obj.quantity };
            }

            return null;
        }).filter(obj => obj !== null);

        // const allValues = e.projects.map(obj => {
        //     return [e.facture_number, e.platform, obj.code, obj.sku, obj.name, obj.quantity_currently, obj.brand, user ? user.email : "test", idExit]
        // })

        var objectValues = {
            id: idExit,
            cells: [],
            date_generate_ISO: date.toISOString(),
            date_generate: date.toLocaleString('sv', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 }).replace(',', '.').replace(' ', 'T') + "Z",
            order_number: e.facture_number,
            platform: e.platform,
            items: [],
            user: user ? user.email : "test",
            new: true
        }

        const allValues = e.projects.map((obj, index) => {
            objectValues.cells.push(index)
            return {
                code: obj.code,
                sku: obj.sku,
                name: obj.name,
                quantity: obj.quantity_currently,
                brand: obj.brand
            }
        })

        objectValues.items = allValues

        setPendingData((prevInfo) => [objectValues, ...prevInfo])

        socket.emit('sendExitsData', objectValues)

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

        // fetch(API_URL + "?exit", {
        //     redirect: "follow",
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "text/plain;charset=utf-8",
        //     },
        //     body: JSON.stringify(allValues)
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         message.success('cargado exitosamente')
        //         form.resetFields()
        //         setLoading(false)
        //     })
        //     .catch(error => {
        //         console.error('Error changing row:', error);
        //         message.info('no se pudo completar la operación')
        //         setLoading(false);
        //     });

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
                                                rules={[{ required: true }]}
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
                                                <Input />
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