import React, { useState } from 'react';
import { Modal, Button, Form, Input, message, Select, Typography, List, notification } from 'antd';
import axios from 'axios';


const ModalData = ({ data }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button style={{ color: 'darkgray' }} onClick={showModal}>
        Más
      </Button>
      <Modal
        title="Detalles Generales:"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography.Paragraph>
          <b>ID del la Ruta:</b> {data.id}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Fecha de Generación:</b> {data.date_generate}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Fecha de Entrega:</b> {data.date_delivery || "No especificada"}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Estado:</b> {data.status}
        </Typography.Paragraph>
        <Typography.Title level={5}>Detalles del Pedido:</Typography.Title>
        <List
          size="small"
          dataSource={[
            { title: 'ID del Pedido', value: data.id },
            { title: 'Mensajero', value: data.coursier },
            { title: 'Zona', value: data.zone },
            { title: 'Nombre del Cliente', value: data.customer },
            { title: 'Dirección de Entrega', value: data.address },
            { title: 'Vendedor', value: data.seller },
            { title: 'Condición de la Transacción', value: data.condition },
            { title: 'Total', value: data.total },
            { title: 'Dinero Entregado', value: data.money_delivered || "No especificado" },
            {
              title: 'Observaciones', value: data.notation.length > 0 ? (
                <List
                  size="small"
                  dataSource={data.notation}
                  renderItem={(remark, index) => (
                    <List.Item key={index}>
                      <Typography.Text>Obs {index + 1}: {remark.date} - {remark.id_person} - {remark.notation}</Typography.Text>
                    </List.Item>
                  )}
                />
              ) : "Ninguna"
            }
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.title}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

const EditModal = ({ setReloadData, data, URL_SERVER, user, coursiers, methods }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onFinish = (e) => {
    e.pos = data.pos
    e.user = user.email

    Modal.confirm({
      title: '¿Seguro que quieres editar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: async () => {
        try {
          message.info("unos momentos");
          setVisible(false);

          await axios.post(`${URL_SERVER}/delivery/edit/${e.id}`, e, {
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
                    name="zone"
                    label="Zona"
                    initialValue={data.zone}
                    rules={[{ required: true, message: 'Por favor reingresa la zona' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="end-input-group-form">
                <div className="input-group-form">
                  <Form.Item
                    name="coursier"
                    label="Mensajero"
                    initialValue={data.coursier}
                    rules={[{ required: true, message: 'Por favor reingresa el mensajero' }]}
                  >
                    <Select placeholder="selecciona un método">
                      {coursiers.map((coursier, index) => (
                        <Select.Option value={coursier.name} key={index}>
                          {coursier.name}
                        </Select.Option>
                      ))}
                      <Select.Option value={"Servicio Externo"} key={"Servicio Externo"}>
                        Servicio Externo
                      </Select.Option>
                      <Select.Option value={"Medellín"} key={"Medellín"}>
                        Medellín
                      </Select.Option>
                      <Select.Option value={"Dflex"} key={"Dflex"}>
                        Dflex
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="input-group-form">
                  <Form.Item
                    name="method"
                    label="Medio de pago"
                    initialValue={data.method}
                    labelAlign="left"
                    rules={[{ required: true, message: 'Por favor selecciona algún medio de pago' }]}
                  >
                    <Select placeholder="selecciona un método">
                      {methods.map(method => (
                        <Select.Option
                          value={method.type}
                          key={method.id}
                        >
                          {method.type}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="end-input-group-form">
                <div className="input-group-form">
                  <Form.Item
                    name="money_delivered"
                    label="Dinero entregado"
                    initialValue={data.money_delivered ? data.money_delivered : 0}
                    rules={[
                      {
                        required: true,
                        message: 'Por favor reingresa la zona'
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: 'Por favor ingresa solo números.',

                      },
                    ]}
                  >
                    <Input type="number" min="0" />
                  </Form.Item>
                </div>
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
};

const ConfirmModal = ({ setReloadData, data, URL_SERVER, user, states }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onFinish = (e) => {
    e.id = data.id
    e.user = user.email
    e.pos = data.pos

    Modal.confirm({
      title: '¿Seguro que quieres actualizar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: async () => {
        try {
          message.info("unos momentos");
          setVisible(false);

          await axios.post(`${URL_SERVER}/delivery/update/${e.id}`, e, {
            headers: { "Content-Type": "application/json" }
          });

          message.success("Contenido actualizado exitosamente");
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
        type='primary'
        style={{ backgroundColor: "orange" }}
        onClick={showModal}
      >
        Actualizar
      </Button>
      <Modal
        visible={visible}
        title="Actualizar"
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="main-user-info-group">
            <div className="user-input-box-group">
              <div className="end-input-group-form">
                <div className="input-group-form">
                  <Form.Item
                    name="status"
                    label="Estado del pedido"
                  >
                    <Select placeholder="selecciona un método">
                      {states.map(state => (
                        <Select.Option value={state.value} key={state.id}>
                          {state.name}
                        </Select.Option>
                      ))}
                    </Select>
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

const MultipleStatusModal = ({ setReloadData, colors, user, data, URL_SERVER, states }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onFinish = (e) => {
    const obj = {
      status: e.status,
      orders: data,
      user: user
    }

    Modal.confirm({
      title: '¿Seguro que quieres actualizar masivamente este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: async () => {
        try {
          message.info("unos momentos");
          setVisible(false);

          await axios.post(`${URL_SERVER}/delivery/updates`, obj, {
            headers: { "Content-Type": "application/json" }
          });

          message.success("Contenido actualizado exitosamente");
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
        style={{ backgroundColor: colors.blueAccent[1000] }}
        onClick={showModal}
      >
        Cambiar Estado
      </Button>
      <Modal
        visible={visible}
        title="Actualización masiva"
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="main-user-info-group">
            <div className="user-input-box-group">
              <div className="end-input-group-form">
                <div className="input-group-form">
                  <Form.Item
                    name="status"
                    label="Estado del pedido"
                  >
                    <Select placeholder="selecciona un método">
                      {states.map(state => (
                        <Select.Option value={state.value} key={state.id}>
                          {state.name}
                        </Select.Option>
                      ))}
                    </Select>
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

export { ModalData, EditModal, ConfirmModal, MultipleStatusModal };