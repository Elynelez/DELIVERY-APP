import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select } from "antd"
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

const ExitProduct = () => {
    const { user } = useAuth0();
    const [loading, setLoading] = useState(true)
    const [rangeItems, setRangeItems] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec")
            .then(response => response.json())
            .then(parsedData => {
                setRangeItems(parsedData)
                setLoading(false);
                console.log(parsedData)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const onFinish = async (e) => {
        e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);
    
            if (matchingRangeItem) {
    
                return { ...matchingRangeItem, quantity_currently: obj.quantity };
            }
    
            return null; 
        }).filter(obj => obj !== null);

        const idExit = v4()

        const allValues = e.projects.map(obj => {
            return [e.facture_number, e.platform, obj.code, obj.sku, obj.name, obj.quantity_currently, obj.brand, user.email, idExit]

        })

        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?exit", {
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
                setLoading(false);
            })
            .catch(error => {
                console.error('Error changing row:', error);
                message.info('no se pudo completar la operación')
            });
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="body-exit">
                    <div className="container-exit" style={{ backgroundColor: colors.primary[400] }}>
                        <h1 className="form-title-exit"><span>SALIDA DE PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                            <div className="main-user-info-exit">
                                <div className="user-input-box-exit">
                                    <div className="end-input-group-exit">
                                        <div className="input-group-exit">
                                            <Form.Item
                                                label={<label className="form-label-exit">Número del pedido</label>}
                                                name="facture_number"
                                                labelAlign="left"
                                                rules={[{ required: true }]}
                                            >
                                                <Input className="input-info-exit" />
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-exit">
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
                                    <h4 className="form-label-exit">Productos</h4>

                                    <Form.List name="projects">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button type="dashed" onClick={add} >
                                                        Agregar
                                                    </Button>
                                                </Form.Item>
                                                <div className="limit-group-exit">
                                                    {fields.map((field, index, ...fields) => (
                                                        <Row gutter={[12, 16]} key={index}>
                                                            <Col span={10}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    name={[index, "sku"]}
                                                                    rules={[{ required: true }]}
                                                                >
                                                                    <Select
                                                                        className="input-info-exit"
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
                                                                    <Input className="input-info-exit" placeholder="Quantity" type="number" min="1" max="999" />
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
                                <input type="submit" className="btn btn-primary" />
                            </Form.Item>
                        </Form>
                    </div>
                </div >
            )}
        </div >

    )
}

export default ExitProduct