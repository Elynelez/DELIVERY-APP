import React, { useState } from "react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, notification } from "antd"
import axios from "axios";

const CreateProduct = ({ URL_SERVER, rangeItems, socket }) => {
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();

    const onFinish = (e) => {
        setLoading(true)
        axios.get(URL_SERVER + "/inventory")
            .then(resp => {
                rangeItems = resp.data

                let existentSkus = []

                const data = e.projects.map((obj) => {
                    const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

                    if (matchingRangeItem) {
                        existentSkus.push(obj.sku)
                    }

                    return {
                        code: "ITEM" + ((rangeItems.length + 310) + 1),
                        sku: obj.sku,
                        name: obj.name,
                        quantity: 0,
                        cost: obj.cost,
                        sale_price: obj.sale_price,
                        brand: e.brand,
                        category: e.category,
                        image: ""
                    }
                })

                if (existentSkus.length) {
                    setLoading(false)
                    notification.error({
                        message: 'Estás intentando crear productos ya existentes ' + existentSkus,
                        description: 'Por favor, cambia los valores antes de continuar.',
                        duration: 5,
                    });
                    return;
                }

                try {
                    socket.emit("createProduct", data)
                    form.resetFields()
                    message.success('Cargado exitosamente')
                } catch (err) {
                    console.error('Error changing row:', err);
                    message.error('No se pudo completar la operación')
                } finally {
                    setLoading(false)
                }
            })
    }

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="body-group-form">
                    <div className="container-group-form" style={{ backgroundColor: colors.primary[400] }}>
                        <h1 className="form-title-group" style={{ color: "#4cceac" }}><span>CREACIÓN DE PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "#4cceac" }}>Marca de los productos</label>}
                                                name="brand"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid #4cceac" }} />
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "#4cceac" }}>Categoría</label>}
                                                name="category"
                                                labelAlign="left"
                                                rules={[{ required: true }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid #4cceac" }} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <h4 className="h4-bottom-form" style={{ color: "#4cceac" }}></h4>

                                    <Form.List name="projects">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button className="button-add-form" style={{ backgroundColor: "#4cceac" }} onClick={add} >
                                                        Agregar
                                                    </Button>
                                                </Form.Item>
                                                <div className="limit-group-form">
                                                    {fields.map((field, index, ...fields) => (
                                                        <Row gutter={[12, 16]} key={index}>
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    label={<label style={{ color: "#4cceac" }}>Sku</label>}
                                                                    name={[index, "sku"]}
                                                                    rules={[{ required: true }]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid #4cceac" }} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    label={<label style={{ color: "#4cceac" }}>Name</label>}
                                                                    name={[index, "name"]}
                                                                    rules={[
                                                                        { required: true }
                                                                    ]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid #4cceac" }} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    label={<label style={{ color: "#4cceac" }}>Cost</label>}
                                                                    name={[index, "cost"]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid #4cceac" }} type="number" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    label={<label style={{ color: "#4cceac" }}>Price</label>}
                                                                    name={[index, "sale_price"]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid #4cceac" }} type="number" />
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
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#4cceac" }} />
                            </Form.Item>
                        </Form>
                    </div>
                </div >
            )}
        </div >

    )
}

export default CreateProduct