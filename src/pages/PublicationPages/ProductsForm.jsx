import React, { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message, Form, Input, Col, Row, Select } from "antd"
import axios from "axios";

const ProductsForm = ({ URL_SERVER, rangeItems, setRangeItems }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();
    const projectsValues = Form.useWatch("projects", form);

    useEffect(() => {
        axios.get(`${URL_SERVER}/database/products`)
            .then(resp => {
                setRangeItems(resp.data)
                setLoading(false);
            })
    }, [])

    const onFinish = async (e) => {
        setLoading(true);

        const fixes = [];
        const actives = [];
        const pauses = [];

        for (const project of e.projects) {
            const { sku, status, quantity } = project;
            const product = rangeItems.find(obj => obj.skus.includes(sku))

            if (status === "fix") {
                fixes.push({ sku, cantidad: quantity });
            } else if (status === "active") {
                const ids = product.publicaciones.map(obj => obj.id);
                actives.push(...ids);
            } else if (status === "pause") {
                const ids = product.publicaciones.map(obj => obj.id);
                pauses.push(...ids);
            }
        }

        await axios.delete(`${URL_SERVER}/database/publications/unfix`, {
            data: { datos: e.projects.map(({ sku }) => ({ sku })) },
        });

        if (fixes.length > 0) {
            await axios.post(`${URL_SERVER}/database/publications/fix`, { datos: fixes });
        }

        if (actives.length > 0) {
            await axios.put(`${URL_SERVER}/database/publications/active`, {
                ids: actives,
            });
        }

        if (pauses.length > 0) {
            await axios.put(`${URL_SERVER}/database/publications/inactive`, {
                ids: pauses,
            });
        }

        message.success("Publicaciones actualizadas correctamente");
        form.resetFields();
        setLoading(false);

        console.log("Fixes:", fixes);
        console.log("Actives:", actives);
        console.log("Pauses:", pauses);


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
                        <h1 className="form-title-group" style={{ color: "#055160" }}><span>ACTUALIZAR PRODUCTOS</span></h1>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
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
                                                    {fields.map((field, index) => {
                                                        const currentStatus = projectsValues?.[index]?.status;

                                                        return (
                                                            <Row gutter={[12, 16]} key={field.key}>
                                                                <Col span={8}>
                                                                    <Form.Item
                                                                        name={[index, "sku"]}
                                                                        rules={[{ required: true, message: "Selecciona un producto" }]}
                                                                    >
                                                                        <Select
                                                                            className="input-info-form"
                                                                            style={{ borderBottom: "1px solid #055160" }}
                                                                            showSearch
                                                                            placeholder="Selecciona un producto"
                                                                        >
                                                                            {rangeItems.map(obj => (
                                                                                <Select.Option key={obj.skus} value={obj.skus[0]}>
                                                                                    {obj.nombre}
                                                                                </Select.Option>
                                                                            ))}
                                                                        </Select>
                                                                    </Form.Item>
                                                                </Col>

                                                                <Col span={6}>
                                                                    <Form.Item
                                                                        name={[index, "status"]}
                                                                        rules={[{ required: true, message: "Selecciona un estado" }]}
                                                                    >
                                                                        <Select
                                                                            className="input-info-form"
                                                                            style={{ borderBottom: "1px solid #055160" }}
                                                                            showSearch
                                                                            placeholder="Selecciona un estado"
                                                                        >
                                                                            <Select.Option value="active">Activar 🟢</Select.Option>
                                                                            <Select.Option value="pause">Pausar 🔴</Select.Option>
                                                                            <Select.Option value="fix">Fijar 🔵</Select.Option>
                                                                        </Select>
                                                                    </Form.Item>
                                                                </Col>

                                                                {currentStatus === "fix" && (
                                                                    <Col span={4}>
                                                                        <Form.Item
                                                                            name={[index, "quantity"]}
                                                                            rules={[{ required: true, message: "Ingresa una cantidad" }]}
                                                                        >
                                                                            <Input
                                                                                className="input-info-form"
                                                                                style={{ borderBottom: "1px solid #055160" }}
                                                                                placeholder="Quantity"
                                                                                type="number"
                                                                                min="1"
                                                                                max="999"
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                )}

                                                                <Col span={4}>
                                                                    <Button danger onClick={() => remove(index)}>
                                                                        Eliminar
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                            <Form.Item>
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#055160" }} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </div>

    )
};

export default ProductsForm;