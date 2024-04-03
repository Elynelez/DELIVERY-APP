import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, Input, Form, Select, Space, notification, Modal } from 'antd';
import axios from 'axios';

const { Option } = Select;

const DeliveryForm = ({ socket, API_URL }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [orders, setOrders] = useState([])
  const [coursiers, setCoursiers] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {

    axios.get(API_URL + "delivery/coursiers")
      .then(resp => {
        setCoursiers(resp.data)
      })
      .catch(err => {
        console.log(err)
      })

    axios.get(API_URL + "delivery/travels")
      .then(resp => {
        let filteredData = resp.data.map(obj => { return obj.order.id })
        setOrders(filteredData)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })

  }, [])

  const handleAddItem = async () => {

    if (itemName.trim() !== '') {

      if (String(itemName).includes("id")) {

        var code = itemName.match(/\d+/) ? itemName.match(/\d+/)[0] : itemName

        socket.emit("autoCompleteDelivery", code)

        socket.on('numberDelivery', (data) => {
          try {
            if (orders.includes(data)) {
              Modal.confirm({
                title: 'Este pedido ya está registrado',
                content: '¿Estás seguro de enviar este pedido?',
                onOk() {
                  setItems([...items, data]);
                  setItemName('');
                }
              })

            } else {
              setItems([...items, data]);
              setItemName('');
            }

          } catch (error) {
            console.error('Error handling number:', error);
          }
        });

      } else {

        if (orders.includes(itemName)) {
          Modal.confirm({
            title: 'Este pedido ya está registrado',
            content: '¿Estás seguro de enviar este pedido?',
            onOk() {
              setItems([...items, itemName]);
              setItemName('');

            }
          });
        } else {
          setItems([...items, itemName]);
          setItemName('');
        }

      }

    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const onFinish = (e) => {
    const uniqueItems = [...new Set(items)];

    if (uniqueItems.length !== items.length) {
      notification.warning({
        message: 'Alerta de duplicados',
        description: 'Se han encontrado elementos duplicados en la lista de pedidos.',
      });
      return
    }

    let data = {
      coursier: e.coursier,
      zone: e.zone,
      orders: items,
      range: orders
    }

    fetch(API_URL + "delivery/travel/route", {
      redirect: "follow",
      method: 'POST',
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error cancelling order:', error);
      });

    setOrders([...orders, items])
    setItems([])
    setItemName('')

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
                          {coursiers.map(coursier => (
                            <Option value={coursier}>{coursier}</Option>
                          ))}
                          <Option value={"Servicio Externo"}>Servicio Externo</Option>
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
                          <Input className="input-info-form" style={{ borderBottom: "1px solid gray", marginLeft: "10px" }} value={itemName} onChange={(e) => setItemName(e.target.value)} />
                          <Button type="primary" style={{ backgroundColor: colors.primary[100] }} onClick={handleAddItem}>Agregar</Button>
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