import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Select, Row, Col, notification } from 'antd';
import axios from "axios";

export const EditOrderPlatform = ({ rangeItems, data, user, users, conditions, methods, places, setReloadData, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const onFinish = (e) => {
        e.pos = data.pos
        e.user = user.email

        const notExistentSkus = []

        e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

            if (matchingRangeItem) {

                return { ...matchingRangeItem, quantity_currently: obj.quantity_currently };
            } else {
                notExistentSkus.push(obj.sku)
            }

            return null;
        }).filter(obj => obj !== null);

        if (notExistentSkus.length > 0) {
            notification.error({
                message: 'Los siguientes skus no existen en el inventario',
                description: notExistentSkus.join(", "),
                duration: 5,
            });
            return;
        }

        Modal.confirm({
            title: '¿Seguro que quieres editar este contenido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: async () => {
                try {
                    message.info("unos momentos");
                    setVisible(false);

                    await axios.post(`${URL_SERVER}/sales/edit/${e.id}`, e, {
                        headers: { "Content-Type": "application/json" }
                    });

                    message.success("Contenido editado exitosamente");
                    setReloadData(true);
                } catch (error) {
                    console.error("Error al subir:", error);
                    message.info("No se pudo completar la operación");
                }
            },
        });
    }

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Button type='primary' onClick={showModal}>
                Editar
            </Button>
            <Modal
                visible={visible}
                title="Editar Datos"
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <div className="main-user-info-group">
                        <div className="user-input-box-group">
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="id"
                                        label="ID del pedido"
                                        initialValue={data.id}
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                </div>
                                <div className="input-group-form">
                                    <Form.Item
                                        name="seller"
                                        label="Vendeddor"
                                        initialValue={data.seller}
                                        rules={[{ required: true, message: 'Por favor selecciona el vendedor' }]}
                                    >
                                        <Select placeholder="selecciona un vendedor">
                                            <Select.Option key={1} value={"Vendedor Saca Producto"}>
                                                Vendedor Saca Producto
                                            </Select.Option>
                                            <Select.Option key={1} value={"Estilista"}>
                                                Estilista
                                            </Select.Option>
                                            <Select.Option key={1} value={"Mercadolibre"}>
                                                Mercadolibre
                                            </Select.Option>
                                            <Select.Option key={1} value={"Magic Mechas"}>
                                                Magic Mechas
                                            </Select.Option>
                                            <Select.Option key={1} value={"Falabella"}>
                                                Falabella
                                            </Select.Option>
                                            <Select.Option key={1} value={"Rappi"}>
                                                Rappi
                                            </Select.Option>
                                            {Array.isArray(users) && user?.email &&
                                                users
                                                    .filter(obj => obj?.email === user.email)
                                                    .map((user, index) =>
                                                        user.email === "inducorsas@gmail.com" ? (
                                                            <React.Fragment key={`admin-${index}`}>
                                                                <Select.Option key="andrea" value="Andrea">
                                                                    Andrea
                                                                </Select.Option>
                                                                <Select.Option key="nicolas" value="Nicolás">
                                                                    Nicolás
                                                                </Select.Option>
                                                            </React.Fragment>
                                                        ) : (
                                                            <Select.Option key={`user-${index}`} value={user.name}>
                                                                {user.name}
                                                            </Select.Option>
                                                        )
                                                    )
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="client"
                                        label="Nombre del cliente"
                                        initialValue={data.client}
                                        rules={[{ required: true, message: 'Por favor reingresa el nombre del cliente' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div className="input-group-form">
                                    <Form.Item
                                        name="identification"
                                        label="Cédula"
                                        initialValue={data.identification}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="email"
                                        label="Email del cliente"
                                        initialValue={data.email}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div className="input-group-form">
                                    <Form.Item
                                        name="address"
                                        label="Dirección"
                                        initialValue={data.address}
                                        rules={[{ required: true, message: 'Por favor reingresa la dirección del cliente' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="department"
                                        label="Departamento"
                                        initialValue={data.department}
                                        rules={[{ required: true, message: 'Por favor reingresa el departamento' }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Selecciona un departamento"
                                            onChange={(selectedDepartment) => {
                                                const filteredPlace = places.find(obj => obj.departamento == selectedDepartment)
                                                form.setFieldsValue({ department: selectedDepartment, city: filteredPlace.ciudades[0] });
                                            }}
                                        >
                                            {places.map((obj, index) => (
                                                <Select.Option key={index} value={obj.departamento}>
                                                    {obj.departamento}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="input-group-form">
                                    <Form.Item
                                        name="city"
                                        label="Ciudad"
                                        initialValue={data.city}
                                        rules={[{ required: true, message: 'Por favor ingresa la ciudad' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="phone"
                                        label="Telefóno"
                                        initialValue={data.phone}
                                        rules={[
                                            {
                                                pattern: /^[0-9]*$/,
                                                message: 'Por favor ingresa solo números.',
                                            }
                                        ]}
                                    >
                                        <Input type="number" min="0" />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="total"
                                        label="Valor del pedido"
                                        initialValue={data.total_payments}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor reingresa el valor'
                                            },
                                            {
                                                pattern: /^[0-9]*$/,
                                                message: 'Por favor ingresa solo números.',
                                            }
                                        ]}
                                    >
                                        <Input type="number" min="0" />
                                    </Form.Item>
                                </div>
                                <div className="input-group-form">
                                    <Form.Item
                                        name="shipment"
                                        label="Envío"
                                        initialValue={data.total_shipping}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor reingresa el envío'
                                            },
                                            {
                                                pattern: /^[0-9]*$/,
                                                message: 'Por favor ingresa solo números.',
                                            }
                                        ]}
                                    >
                                        <Input type="number" min="0" />
                                    </Form.Item>
                                </div>

                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="condition"
                                        label="Condición"
                                        initialValue={data.condition}
                                        rules={[{ required: true, message: 'Por favor selecciona la condición' }]}
                                    >
                                        <Select placeholder="selecciona una condición">
                                            {conditions.map(condition => (
                                                <Select.Option
                                                    value={condition.value}
                                                    key={condition.id}
                                                >
                                                    {condition.value}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="input-group-form">
                                    <Form.Item
                                        name="method"
                                        label="Medio de pago"
                                        initialValue={data.method}
                                        rules={[{ required: true, message: 'Por favor selecciona algún medio de pago' }]}
                                    >
                                        <Select placeholder="selecciona un método">
                                            {methods.map(method => (
                                                <Select.Option
                                                    value={method.value}
                                                    key={method.id}
                                                >
                                                    {method.value}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="notation"
                                        label="Observaciones"
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.List name="projects" initialValue={data.items.map(obj => { return { sku: obj.item.sku, quantity_currently: obj.item.quantity } })}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button type="dashed" onClick={add} >
                                                        Add
                                                    </Button>
                                                </Form.Item>
                                                {fields.map((field, index, ...fields) => (
                                                    <Row gutter={[16, 16]} key={index}>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...fields}
                                                                name={[index, "sku"]}
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input placeholder="field name" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...fields}
                                                                name={[index, "quantity_currently"]}
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input placeholder="field name" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Button danger onClick={() => remove(index)}>
                                                                Eliminar
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                        </div>
                        <Form.Item>
                            <input type="submit" className="form-submit-btn" style={{ backgroundColor: "gray" }} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export const AuthOrderPlatform = ({ data, user, setReloadData, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const onFinish = (e) => {
        data.notation = e.notation
        data.user = user ? user.email : "test"
        data.to_receive = "inventory_exit"

        Modal.confirm({
            title: '¿Seguro que quieres actualizar masivamente este contenido?',
            content: 'Esta acción no se puede deshacer.',
            onOk: async () => {
                try {
                    message.info("unos momentos");
                    setVisible(false);

                    await axios.post(`${URL_SERVER}/platforms/auth/${data.id}`, data, {
                        headers: { "Content-Type": "application/json" }
                    });

                    message.success("Notificación enviada exitosamente");
                    setReloadData(true);
                } catch (error) {
                    console.error("Error al subir:", error);
                    message.info("No se pudo completar la operación");
                }
            },
        });
    }

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                onClick={showModal}
            >
                Autorizar
            </Button>
            <Modal
                visible={visible}
                title="Autorización"
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <div className="main-user-info-group">
                        <div className="user-input-box-group">
                            <div className="end-input-group-form">
                                <div className="input-group-form">
                                    <Form.Item
                                        name="notation"
                                        label="Observaciones"
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <Form.Item>
                            <input type="submit" className="form-submit-btn" style={{ backgroundColor: "gray" }} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}