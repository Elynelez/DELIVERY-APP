import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select } from "antd"
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

const EnterProduct = ({ rangeItems, setRangeItems }) => {
    const { user } = useAuth0();
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();
    const API_URL = "https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec";

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const loadRange = async () => {
        setLoading(true);
        console.log("generación nueva de datos")
        try {
            const parsedData = await fetchData(API_URL);
            setRangeItems(parsedData);
            localStorage.setItem("cacheRangeItems", JSON.stringify(parsedData));
        } finally {
            setLoading(false);
        }
    };

    const loadRangeAndUpdateHourly = async () => {

        const lastUpdateTimestamp = localStorage.getItem("lastUpdateTimestamp");

        const currentTimestamp = new Date().getTime();

        const oneHourInMilliseconds = 60 * 60 * 1000;
        const shouldUpdate = !lastUpdateTimestamp || (currentTimestamp - lastUpdateTimestamp) >= oneHourInMilliseconds;

        if (shouldUpdate) {
            await loadRange();

            localStorage.setItem("lastUpdateTimestamp", currentTimestamp);
        }

        setInterval(async () => {
            await loadRange();
        }, oneHourInMilliseconds);
    };

    useEffect(() => {
        console.log(rangeItems);
        (async () => {
            await loadRangeAndUpdateHourly();
        })();
    }, []);

    const onFinish = async (e) => {
        e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

            if (matchingRangeItem) {

                return { ...matchingRangeItem, quantity_currently: obj.quantity };
            }

            return null;
        }).filter(obj => obj !== null);

        const idEnter = v4()

        const allValues = e.projects.map(obj => {
            return [e.facture_number, e.provider, obj.code, obj.sku, obj.name, obj.quantity_currently, obj.brand, user.email, idEnter]
        })

        setLoading(true);
        fetch(API_URL + "?enter", {
            redirect: "follow",
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(allValues)
        })
            .then(response => response.json())
            .then(data => {
                message.success('cargado exitosamente')
                form.resetFields()
                setLoading(false);
            })
            .catch(error => {
                console.error('Error changing row:', error);
                message.info('no se pudo completar la operación')
                setLoading(false);
            });
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
                        <h1 className="form-title-group" style={{color: "#055160"}}><span>ENTRADA DE PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{color: "#055160"}}>Número del pedido</label>}
                                                name="facture_number"
                                                labelAlign="left"
                                                rules={[{ required: true }]}
                                            >
                                                <Input className="input-info-form" style={{borderBottom: "1px solid #055160"}}/>
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{color: "#055160"}}>Proveedor</label>}
                                                name="provider"
                                                labelAlign="left"
                                                rules={[{ required: true }]}
                                            >
                                                <Input className="input-info-form" style={{borderBottom: "1px solid #055160"}}/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <h4 className="h4-bottom-form" style={{color: "#055160"}}></h4>

                                    <Form.List name="projects">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button className="button-add-form" style={{backgroundColor: "#055160"}} onClick={add} >
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
                                                                        style={{borderBottom: "1px solid #055160"}}
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
                                                                    <Input className="input-info-form" style={{borderBottom: "1px solid #055160"}} placeholder="Quantity" type="number" min="1" max="999" />
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
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#055160" }}/>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default EnterProduct
