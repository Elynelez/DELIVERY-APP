import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Checkbox, Spin, message, Select } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const ModalData = (props) => {
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
        title="Detalles del Registro"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ul>
          {props.arrayData.map(object => (
            object.title === "Observaciones" ? (
              <li key={object.order_id}>
                <b>{object.title}</b>
                <p>{object.value}</p>
              </li>
            ) : (
              <li key={object.order_id}>
                <b>{object.title}</b>
                <p>{object.value}</p>
              </li>
            )

          ))}
        </ul>
      </Modal>
    </div>
  );
};

const EditModal = (props) => {
  const Methods = ["EFECTIVO", "NEQUI ANDREA", "NEQUI NICOLAS", "DAVIPLATA ANDREA", "BANCOLOMBIA NICOLAS", "BANCOLOMBIA ANDREA", "BANCO DE OCCIDENTE", "DAVIVIENDA DUCOR", "MERCADOPAGO", "CRÉDITO", "CAMBIO", "FALTANTE", "ZELLE", "DATÁFONO", "ADDI"]
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [dateDeliveryChecked, setDateDeliveryChecked] = useState(false);
  const [activeChecked, setActiveChecked] = useState(true)

  useEffect(() => {
    if (dateDeliveryChecked) {
      setActiveChecked(false)
    } else {
      setActiveChecked(true)
    }
  }, [dateDeliveryChecked]);

  const onFinish = (values) => {
    values.date_delivery = dateDeliveryChecked
    console.log(values)
    Modal.confirm({
      title: '¿Seguro que quieres editar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?edit", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(values)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            message.success('Contenido editado exitosamente');
            setLoading(false);
            setVisible(false)
            props.setReloadData(true);
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
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} initialValues={props.initialValues} layout="vertical">
            <Form.Item
              name="order_id"
              label="ID del pedido"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="date_delivery"
              label="¿Pedido entregado?"
            >
              <Checkbox
                onChange={(e) => setDateDeliveryChecked(e.target.checked)}
                disabled={props.initialValues.date_delivery}
              />
            </Form.Item>
            <Form.Item
              name="zone"
              label="Zona"
              rules={[{ required: true, message: 'Por favor reingresa la zona' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="code"
              label="Código"
              rules={[{ required: true, message: 'Por favor reingresa el código' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="coursier"
              label="Mensajero"
              rules={[{ required: true, message: 'Por favor reingresa el mensajero' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Medio de pago"
              name="method"
              labelAlign="left"
            >
              <Select placeholder="selecciona un método" disabled={activeChecked}>
                {Methods.map((method, index) => (
                  <Select.Option value={method} key={index}>{method}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="notation"
              label="Observaciones"
            >
              <Input />
            </Form.Item>
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
              <Input disabled={activeChecked} />
            </Form.Item>
            <Form.Item>
              <input type="submit" className="btn btn-primary" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>

  );
};

const ReviewModal = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [activeChecked, setActiveChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    values.checked = activeChecked
    Modal.confirm({
      title: '¿Seguro que quieres actualizar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?update", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(values)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            message.success('Estado actualizado exitosamente');
            setLoading(false);
            setVisible(false)
            props.setReloadData(true);
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
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} initialValues={props.initialValues} layout="vertical">
            <Form.Item
              name="order_id"
              label="ID del pedido"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="platform"
              label="Tipo"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="user"
              label="usuario"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="total"
              label="Valor del pedido"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="money_delivered"
              label="Pagado por el mensajero"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="status"
              label="Estado del pedido"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="notation"
              label="Observaciones"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="checked"
              label="¿Revisado?"
            >
              <Checkbox
                onChange={(e) => (setActiveChecked(e.target.checked))}
                disabled={props.initialValues.disabled}
              />
            </Form.Item>
            <Form.Item>
              <input disabled={!activeChecked} type="submit" className="btn btn-primary" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

const ConfirmInventoryModal = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    Modal.confirm({
      title: '¿Seguro que quieres actualizar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?updateOrder", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(values)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            message.success('Estado actualizado exitosamente');
            setLoading(false);
            setVisible(false)
            props.setReloadData(true);
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
      <Button type='primary' style={{ backgroundColor: "green" }} onClick={showModal}>
        Confirmar
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
        <Spin spinning={loading}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sku</TableCell>
                  <TableCell>Nombre del Producto</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.rows.map((obj) => (
                  <TableRow key={obj.sku}>
                    <TableCell>{obj.sku}</TableCell>
                    <TableCell>{obj.name}</TableCell>
                    <TableCell align="right">{obj.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Form form={form} onFinish={onFinish} initialValues={props.initialValues} layout="vertical">
            <Form.Item
              label="Cd"
              name="cells"
              labelAlign="left"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Plataforma"
              name="platform"
              labelAlign="left"
            >
              <Select placeholder="selecciona la plataforma">
                <Select.Option value="Mercadolibre" key={1}>Mercadolibre</Select.Option>
                <Select.Option value="Shopify" key={2}>Magic Mechas</Select.Option>
                <Select.Option value="DC Bogotá" key={3}>DC Bogotá</Select.Option>
                <Select.Option value="Linio" key={4}>Linio</Select.Option>
                <Select.Option value="Falabella" key={5}>Falabella</Select.Option>
                <Select.Option value="Rappi" key={6}>Rappi</Select.Option>
                <Select.Option value="Otro" key={7}>Otro</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <input type="submit" className="btn btn-primary" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}
export { ModalData, EditModal, ReviewModal, ConfirmInventoryModal };