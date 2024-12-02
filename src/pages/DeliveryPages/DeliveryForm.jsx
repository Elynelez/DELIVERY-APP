import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, Input, Form, Select, Space, notification, Modal, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const DeliveryForm = ({ socket, URL_SERVER }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [data, setData] = useState({ orders: [], coursiers: [] })
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    axios.get(`${URL_SERVER}/delivery/coursiers`)
      .then(resp => {
        setData(prevState => ({
          ...prevState,
          coursiers: resp.data
        }));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });

    axios.get(`${URL_SERVER}/delivery/travels`)
      .then(resp => {
        let filteredData = resp.data.map(obj => obj.order.id);
        setData(prevState => ({
          ...prevState,
          orders: filteredData
        }));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, [])

  const handleAddItem = async () => {

    const code = itemName.toString().toUpperCase().trim()

    switch (true) {
      case code == '':
        notification.warning({
          message: 'Celda vacía',
          description: 'No puedes enviar contenido vacío',
        });
        break;
      case items.includes(code):
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
            setItems([...items, code]);
            setItemName('');
          }
        })
        break;
      case code.includes("ID"):
        var qr = itemName.match(/\d+/)[0]

        socket.emit("autoCompleteDelivery", qr)

        socket.on('numberDelivery', (number) => {
          try {
            if (data.orders.includes(number)) {
              Modal.confirm({
                title: 'Este pedido ya está registrado',
                content: '¿Estás seguro de enviar este pedido?',
                onOk() {
                  setItems([...items, number]);
                  setItemName('');
                }
              })
            } else if (items.includes(number)) {
              notification.warning({
                message: 'Ruta repetida',
                description: 'No puedes poner un pedido más de una vez en una misma ruta',
              })
            } else {
              setItems([...items, number]);
              setItemName('');
            }

          } catch (error) {
            console.error('Error handling number:', error);
          }
        })
        break;
      default:
        setItems([...items, code]);
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
    let data = {
      coursier: e.coursier,
      zone: e.zone,
      orders: items,
    }

    axios.post(`${URL_SERVER}/delivery/travel`, { body: data })
      .then(resp => {
        message.success(resp.data.message)
        setData(prevState => ({
          ...prevState,
          orders: [...prevState.orders, ...items]
        }));
        setItems([])
        setItemName('')
      }).catch(error => {
        message.error("error en el servidor")
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
            <h1 className="form-title-group" style={{ color: colors.primary[100] }}><span>FORMULARIO MENSAJERÍA</span></h1>
            <Form layout="vertical" onFinish={onFinish}>
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
                            style={{ backgroundColor: colors.primary[100] }}
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
                <input type="submit" className="form-submit-btn" style={{ backgroundColor: colors.primary[100] }} />
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;