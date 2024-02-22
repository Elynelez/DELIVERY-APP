import React, { useState, useEffect } from "react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, notification } from "antd"
import { useParams, Redirect } from 'react-router-dom';

const EditProduct = ({ rangeItems, socket }) => {
    const [initialData, setInitialData] = useState({})
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();
    const { id } = useParams()

    useEffect(()=>{
        let data = rangeItems.find(obj => obj.code == id)
        setInitialData(data)
        setLoading(false)
    },[])

    const onFinish = (e) => {
        setLoading(true)
        let data = {
            code: id,
            name: e.name,
            brand: e.brand,
            category: e.category,
            cost: e.cost,
            sale_price: e.sale_price
        }

        socket.emit("editProduct", data)

        window.location.href = '/inventory/table'
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
                        <h1 className="form-title-group" style={{ color: "gray" }}><span>EDICIÓN DE </span>{id}</h1>
                        <Form form={form} onFinish={onFinish} initialValues={initialData} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "gray" }}>Nombre del producto</label>}
                                                name="name"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid gray" }} />
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "gray" }}>Marca de los productos</label>}
                                                name="brand"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid gray" }} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "gray" }}>Categoría</label>}
                                                name="category"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid gray" }} />
                                            </Form.Item>
                                        </div>
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "gray" }}>Costo</label>}
                                                name="cost"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid gray" }} type="number" />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "gray" }}>Precio</label>}
                                                name="sale_price"
                                                labelAlign="left"
                                                rules={[{
                                                    required: true,
                                                }]}
                                            >
                                                <Input className="input-info-form" style={{ borderBottom: "1px solid gray" }} type="number" />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <h4 className="h4-bottom-form" style={{ color: "gray" }}></h4>

                                    {/* <Form.List name="projects">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button className="button-add-form" style={{ backgroundColor: "gray" }} onClick={add} >
                                                        Agregar
                                                    </Button>
                                                </Form.Item>
                                                <div className="limit-group-form">
                                                    {fields.map((field, index, ...fields) => (
                                                        <Row gutter={[12, 16]} key={index}>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    {...fields}
                                                                    label={<label style={{ color: "gray" }}>Sku</label>}
                                                                    name={[index, "sku"]}
                                                                    rules={[{ required: true }]}
                                                                >
                                                                    <Input className="input-info-form" style={{ borderBottom: "1px solid gray" }} />
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
                                    </Form.List> */}
                                </div>
                            </div>
                            <Form.Item>
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "gray" }} />
                            </Form.Item>
                        </Form>
                    </div>
                </div >
            )}
        </div >

    )
}

export default EditProduct