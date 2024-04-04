import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Checkbox, Spin, message, Select, Typography, List, notification } from 'antd';
import 'sweetalert2/dist/sweetalert2.min.css';


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
          <b>Estado:</b> {data.order.status}
        </Typography.Paragraph>
        <Typography.Title level={5}>Detalles del Pedido:</Typography.Title>
        <List
          size="small"
          dataSource={[
            { title: 'ID del Pedido', value: data.order.id },
            { title: 'Coursier', value: data.order.shipping_data.coursier },
            { title: 'Zona', value: data.order.shipping_data.zone },
            { title: 'Nombre del Cliente', value: data.order.customer.name },
            { title: 'Dirección de Entrega', value: data.order.customer.address },
            { title: 'Vendedor', value: data.order.seller.name },
            { title: 'Condición de la Transacción', value: data.order.transactions.condition },
            { title: 'Total', value: data.order.transactions.total },
            { title: 'Dinero Entregado', value: data.order.money_delivered || "No especificado" },
            {
              title: 'Observaciones', value: data.order.remarks.length > 0 ? (
                <List
                  size="small"
                  dataSource={data.order.remarks}
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

const EditModal = ({ setReloadData, data, API_URL }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onFinish = (e) => {
    console.log(e)
    Modal.confirm({
      title: '¿Seguro que quieres editar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setVisible(false)
        fetch(API_URL + "delivery/travel/edit", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(e)
        })
          .then(response => response.json())
          .then(data => {
            message.success('Contenido editado exitosamente');
            setReloadData(true);
          })
          .catch(error => {
            console.error('Error changing row:', error);
            message.info('no se pudo completar la operación')
          });
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
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}
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
                    initialValue={data.order.shipping_data.zone}
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
                    initialValue={data.order.shipping_data.coursier}
                    rules={[{ required: true, message: 'Por favor reingresa el mensajero' }]}
                  >
                    <Select placeholder="selecciona un método">
                      {["raul", "brayan", "edgar", "richard", "estiven", "hernando", "Servicio Externo"].map((coursier, index) => (
                        <Select.Option value={coursier} key={index}>{coursier}</Select.Option>
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
};

const ConfirmModal = ({ setReloadData, data, API_URL, user }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const Methods = ["EFECTIVO", "NEQUI ANDREA", "NEQUI NICOLAS", "DAVIPLATA ANDREA", "BANCOLOMBIA NICOLAS", "BANCOLOMBIA ANDREA", "MERCADOPAGO", "CRÉDITO"]

  const onFinish = (e) => {
    e.id = data.id
    e.user = user.email

    if (e.status == "ENTREGADO" && (e.method == '' || e.money_delivered == undefined)) {
      notification.warning({
        message: 'Campos vacíos',
        description: 'tienes que llenar los campos faltantes',
      });
      return
    }

    Modal.confirm({
      title: '¿Seguro que quieres actualizar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setVisible(false)
        fetch(API_URL + "delivery/travel/update", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(e)
        })
          .then(response => response.json())
          .then(data => {
            message.success('Contenido editado exitosamente');
            setReloadData(true);
          })
          .catch(error => {
            console.error('Error changing row:', error);
            message.info('no se pudo completar la operación')
          });
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
      <Button type='primary' style={{ backgroundColor: "orange" }} onClick={showModal}>
        Actualizar
      </Button>
      <Modal
        visible={visible}
        title="Actualizar"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="main-user-info-group">
            <div className="user-input-box-group">
              <div className="end-input-group-form">
                <div className="input-group-form">
                  <Form.Item
                    name="method"
                    label="Medio de pago"
                    initialValue={data.order.transactions.method}
                    labelAlign="left"
                  >
                    <Select placeholder="selecciona un método">
                      {Methods.map((method, index) => (
                        <Select.Option value={method} key={index}>{method}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="input-group-form">
                  <Form.Item
                    name="money_delivered"
                    label="Dinero entregado"
                    rules={[
                      {
                        pattern: /^[0-9]*$/, // Expresión regular para permitir solo números
                        message: 'Por favor ingresa solo números.',

                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="end-input-group-form">
                <div className="input-group-form">
                  <Form.Item
                    name="notation"
                    label="Observaciones"
                    rules={[{ required: true, message: 'Por favor escribe alguna observación' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="input-group-form">
                  <Form.Item
                    name="status"
                    label="Estado del pedido"
                  >
                    <Select placeholder="selecciona un método">
                      {user.email !== "contableducor@gmail.com" && (
                        <>
                          <Select.Option value={"ENTREGADO"} key={0}>ENTREGADO</Select.Option>
                          <Select.Option value={"REPROGRAMADO"} key={0}>REPROGRAMADO</Select.Option>
                        </>
                      )}
                      {(user.email == "contableducor@gmail.com" || user.email == "inducorsas@gmail.com") && (
                        <>
                          <Select.Option value={"COMPLETO"} key={0}>COMPLETO</Select.Option>
                        </>
                      )}
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

export { ModalData, EditModal, ConfirmModal };