import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, Input, Form, Select, Space, notification, Modal, message } from 'antd';
import { v4 } from 'uuid';
import axios from 'axios';

const { Option } = Select;

const DeliveryForm = ({ socket, URL_SERVER }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([]);
  const [rescheduled, setRescheduled] = useState([])
  const [reloadData, setReloadData] = useState(true);
  const [itemName, setItemName] = useState('');
  const [data, setData] = useState({ orders: [], coursiers: [] })
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!reloadData) return;

    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    const storedRescheduled = JSON.parse(localStorage.getItem("rescheduled")) || [];
    setItems(storedItems);
    setRescheduled(storedRescheduled);

    const getData = async () => {
      setLoading(true);
      try {
        const [coursiersResp, travelsResp] = await Promise.all([
          axios.get(`${URL_SERVER}/delivery/coursiers`),
          axios.get(`${URL_SERVER}/delivery/travels`)
        ]);

        console.log(travelsResp.data)

        setData({
          coursiers: coursiersResp.data,
          orders: travelsResp.data.map((obj) => obj.order.id)
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setReloadData(false);
      }
    };

    getData();
  }, [reloadData]);


  const handleAddItem = async () => {

    const code = itemName.toString().toUpperCase().trim()

    switch (true) {
      case code == '':
        notification.warning({
          message: 'Celda vacía',
          description: 'No puedes enviar contenido vacío',
        });
        break;
      case items.includes(code) || items.includes(`${code}**`):
        notification.warning({
          message: 'Ruta repetida',
          description: 'No puedes poner un pedido más de una vez en una misma ruta',
        });
        break;
      case data.orders.includes(code):
        Modal.confirm({
          title: 'Este pedido ya está registrado',
          content: '¿Estás seguro de enviar este pedido?',
          onOk() {
            const updatedItems = [...items, `${code}**`];
            const updatedRescheduled = [...rescheduled, {
              code: code, position: data.orders.reduce((acc, numberCode, index) => {
                if (numberCode == code) {
                  acc.push(index + 1);
                }
                return acc;
              }, [])
            }];
            setItems(updatedItems);
            setRescheduled(updatedRescheduled);
            localStorage.setItem('items', JSON.stringify(updatedItems));
            localStorage.setItem('rescheduled', JSON.stringify(updatedRescheduled))
            setItemName('');
          }
        })
        break;
      case code.includes("ID"):
        var qr = itemName.match(/\d+/)[0]

        socket.emit("autoCompleteDelivery", qr)

        socket.once('numberDelivery', (number) => {
          try {
            if (data.orders.includes(number)) {
              Modal.confirm({
                title: 'Este pedido ya está registrado',
                content: '¿Estás seguro de enviar este pedido?',
                onOk() {
                  const updatedItems = [...items, `${number}**`];
                  const updatedRescheduled = [...rescheduled, {
                    code: number, position: data.orders.reduce((acc, numberCode, index) => {
                      if (numberCode == number) {
                        acc.push(index + 1);
                      }
                      return acc;
                    }, [])
                  }];
                  setItems(updatedItems);
                  setRescheduled(updatedRescheduled);
                  localStorage.setItem('items', JSON.stringify(updatedItems));
                  localStorage.setItem('rescheduled', JSON.stringify(updatedRescheduled))
                  setItemName('');
                }
              })
            } else if (items.includes(number)) {
              notification.warning({
                message: 'Ruta repetida',
                description: 'No puedes poner un pedido más de una vez en una misma ruta',
              })
            } else {
              const updatedItems = [...items, number];
              setItems(updatedItems);
              localStorage.setItem('items', JSON.stringify(updatedItems));
              setItemName('');
            }

          } catch (error) {
            console.error('Error handling number:', error);
          }
        })
        break;
      default:
        const updatedItems = [...items, code];
        setItems(updatedItems);
        localStorage.setItem('items', JSON.stringify(updatedItems));
        setItemName('')
        break;
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const onFinish = (e) => {
    setLoading(true)

    const payload = {
      coursier: e.coursier,
      zone: e.zone,
      orders: items,
      rescheduled,
      id: v4()
    };

    axios.post(`${URL_SERVER}/delivery/travel`, { body: payload })
      .then(resp => {
        message.success(resp.data.message);
        localStorage.setItem('items', JSON.stringify([]));
        localStorage.setItem('rescheduled', JSON.stringify([]));
        setItems([]);
        setItemName('');
        form.resetFields();
      })
      .catch(error => {
        message.error("error en el servidor");
      }).finally(() => {
        setTimeout(() => {
          setReloadData(true);
        }, 5000);
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
            <h1 className="form-title-group" style={{ color: colors.primary[100] }}>
              <span>FORMULARIO MENSAJERÍA</span>
            </h1>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <div className="main-user-info-group">
                <div className="user-input-box-group">
                  <div className="end-input-group-form">
                    <div className="input-group-form">
                      <Form.Item
                        label={<label style={{ color: colors.primary[100] }}>Mensajero</label>}
                        name="coursier"
                        rules={[{ required: true }]}
                      >
                        <Select
                          className="input-info-form"
                          style={{ borderBottom: "1px solid gray", color: "red" }}
                          showSearch={true}
                          placeholder="Select a coursier"
                        >
                          {data.coursiers.map(coursier => (
                            <Option value={coursier}>{coursier}</Option>
                          ))}
                          <Option value={"Servicio Externo"}>Servicio Externo</Option>
                          <Option value={"Medellín"}>Medellín</Option>
                          <Option value={"Dflex"}>Dflex</Option>
                          <Option value={"SAP"}>SAP</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="input-group-form">
                      <Form.Item
                        label={<label style={{ color: colors.primary[100] }}>Zona</label>}
                        name="zone"
                      >
                        <Input className="input-info-form" style={{ borderBottom: "1px solid gray", marginLeft: "10px" }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="end-input-group-form">
                    <div className="input-group-form">
                      <Form.Item
                        label={<label style={{ color: colors.primary[100], marginLeft: "10px" }}>Agregar Pedido</label>}
                      >
                        <Space>
                          <Input
                            className="input-info-form"
                            style={{ borderBottom: "1px solid gray", marginLeft: "10px" }}
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); // Evita que el formulario se envíe
                                handleAddItem(); // Agrega el pedido
                              }
                            }}
                          />
                          <Button
                            type="primary"
                            style={{ backgroundColor: colors.primary[300] }}
                            onClick={handleAddItem}
                          >
                            Agregar
                          </Button>
                        </Space>
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item
                    label={<label style={{ color: colors.primary[100] }}>Pedidos</label>}
                  >
                    <Select
                      name="orders"
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Selecciona o escribe un elemento"
                      value={items}
                      onChange={(value) => setItems(value)}
                      onDeselect={(value) => handleRemoveItem(items.indexOf(value))}
                    >
                      {items.map((item, index) => (
                        <Option key={item + index}>{item}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <Form.Item>
                <input type="submit" className="form-submit-btn" style={{ backgroundColor: colors.primary[300] }} />
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;