import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Spin, message, Select, Row, Col, Typography, notification } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";

const AddSkuModalServer = ({ rangeItems, socket, data, loading, setLoading, URL_SERVER }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true)

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    axios.get(URL_SERVER + "/inventory/products")
      .then(resp => {
        rangeItems = resp.data

        var listSkus = rangeItems.map(obj => { return obj.sku })
        if (listSkus.includes(values.sku)) {
          message.error('este sku ya existe, no lo puedes poner nuevamente')
        } else {
          data.sku = values.sku
          Modal.confirm({
            title: '¿Seguro que quieres agregar este sku a este producto?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
              try {
                message.success('Cargado exitosamente')
                setLoading(true);
                socket.emit("addSku", data)
              } catch (err) {
                console.error('Error changing row:', err);
                message.error('No se pudo completar la operación')
              } finally {
                setVisible(false)
                window.location.reload()
              }
            },
          });
        }
      })
  }

  return (
    <div>
      <Button onClick={showModal}>Agregar Sku</Button>
      <Modal
        open={visible}
        title="Actualizar"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Sku"
              name="sku"
              labelAlign="left"
              required="true"
            >
              <Input onChange={() => { setDisabled(false) }} />
            </Form.Item>
            <Form.Item>
              <input type="submit" className="btn btn-primary m-2" disabled={disabled} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

const ModifyQuantityServer = ({ socket, data, loading, setLoading }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const { user } = useAuth0()

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    data.real_quantity = Number(values.real_quantity)
    data.id = v4()
    data.user = user ? user.email : "test"

    Modal.confirm({
      title: '¿Seguro que quieres ajustar la cantidad del inventario?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        try {
          message.success('Cargado exitosamente')
          setLoading(true);
          handleCancel()
          socket.emit("objectValuesSettings", data)
        } catch (err) {
          message.error("no se pudo completar la operación")
          console.log(err)
        } finally {
          window.location.reload()
        }

      }
    });
  }

  return (
    <div>
      <Button onClick={showModal}>Ajustar cantidad</Button>
      <Modal
        open={visible}
        title="Actualizar"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Cantidad"
              name="real_quantity"
              labelAlign="left"
              rules={[{ required: true, message: "sin vacíos niña" }, { pattern: /^[0-9]+$/, message: "no pueden haber negativos" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" >Enviar</Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

const ConfirmInventoryModalServer = ({ pendingData, data, setLoading, socket, user, rangeItems, receiveOrders, URL_SERVER }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true)
  const [allValues, setAllValues] = useState([]);

  useEffect(() => {
    const objectGroup = {}
    for (const obj of data.items) {
      const sku = obj.sku;
      objectGroup[sku] = Number(obj.quantity);
    }

    const resultArray = Array.from(Object.entries(objectGroup).flatMap(([key, value]) => Array(value).fill(key))).filter(function (i) { return i !== "undefined" })

    setAllValues(resultArray)
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const deleteRowById = () => {
    Modal.confirm({
      title: '¿Seguro que quieres eliminar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        socket.emit('deleteOrder', data);
        setLoading(false)
      },
    });

  }

  const onFinish = (values) => {
    Modal.confirm({
      title: '¿Seguro que quieres actualizar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        socket.emit('sendConfirmExit', { order_number: data.order_number, platform: values.platform, user: user ? user.email : "test" })
        setTimeout(() => {
          setVisible(false);
          try {
            message.success('cargado exitosamente')
            setLoading(false);
          } catch (err) {
            console.error('Error changing row:', err);
            message.info('no se pudo completar la operación')
            setLoading(false);
          }
        }, 5000);

      },
    });
  }

  return (
    <div>
      <Button type='primary' style={{ backgroundColor: "gray" }} onClick={showModal}>
        Confirmar
      </Button>
      <Modal
        open={visible}
        title="Actualizar"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}
      >
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
              {data.items.map((obj) => (
                <TableRow key={obj.sku}>
                  <TableCell>{obj.sku}</TableCell>
                  <TableCell>{obj.name}</TableCell>
                  <TableCell align="right">{obj.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br />


        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Plataforma"
            name="platform"
            labelAlign="left"
            required="true"
          >
            <Select placeholder="selecciona la plataforma" onChange={() => { setDisabled(false) }}>
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
            <input type="submit" className="btn btn-primary w-25" disabled={disabled} />
            <input className="btn btn-danger w-25 m-2" onClick={() => { deleteRowById() }} value="Eliminar" />
            <ExitElementsServer
              pendingData={pendingData}
              id={data.id}
              prev={allValues}
              rangeItems={rangeItems}
              setLoading={setLoading}
              nameButton={"Editar"}
              platformStatus={true}
              valueOrder={data.order_number}
              cash={false}
              socket={socket}
              receiveOrders={receiveOrders}
              URL_SERVER={URL_SERVER}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const ExitElementsServer = ({ pendingData, id, rangeItems, setLoading, prev, nameButton, platformStatus, valueOrder, cash, socket, receiveOrders, URL_SERVER }) => {
  const { user } = useAuth0();
  const [allValues, setAllValues] = useState(prev);
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);
  const [skuProduct, setSkuProduct] = useState('')
  const packers = ["ANYELO", "TATIANA", "KILIAN", "INDUCOR", "NICOLAS", "PILAR", "tatiana", "pilar"];
  const [status, setStatus] = useState(false)
  const [objectValues, setObjectValues] = useState({})
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false)


  const showModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    setKey(key => key + 1);
  }, [visible])

  const handleCancel = () => {
    setLoading(true);

    setTimeout(() => {
      setVisible(false);
      setAllValues([]);
      setSkuProduct("");
      setStatus(false);
      setObjectValues({});
      form.resetFields();
      setLoading(false);
    }, 2000);
  };

  const onFinish = (e) => {
    setDisabled(true)
    axios.get(URL_SERVER + "/inventory/products")
      .then(resp => {
        rangeItems = resp.data

        let notExistentSkus = []
        let foundError = [];
        var date = new Date()
        const idExit = v4()
        let order = pendingData.find(obj => obj.id == id)

        if (cash) {
          let rangeOrderNumbers = pendingData.map(obj => { return obj.order_number }).filter(orderNumber => !/^[A-Za-z]+$/.test(orderNumber))

          let blockExecution = rangeOrderNumbers.some(number => {
            number = number.toString().toUpperCase()
            e.facture_number = e.facture_number.toString().toUpperCase()
            return (
              number.includes(e.facture_number) || e.facture_number.includes(number)
            );
          });

          if (blockExecution) {
            notification.error({
              message: 'Número de factura bloqueado',
              description: 'Por favor, cambia el valor antes de continuar.',
              duration: 5,
            });
            setDisabled(false)
            return;
          }
        }

        if (cash) {

          e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

            if (matchingRangeItem) {

              return { ...matchingRangeItem, quantity_currently: obj.quantity_currently };
            } else {
              notExistentSkus.push(obj.sku)
            }

            return null;
          }).filter(obj => obj !== null);

          e.projects.forEach(obj => {
            if (Number(obj.quantity_currently) > Number(obj.quantity)) {
              foundError.push(obj.name);
              return;
            }
          });

        } else {

          e.projects = e.projects.map(obj => {
            const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

            const quantity_edit = order.items.find(item => item.sku == obj.sku)

            if (matchingRangeItem) {

              return {
                ...matchingRangeItem,
                quantity_currently: obj.quantity_currently,
                quantity_edit: quantity_edit ?
                  Number(quantity_edit.quantity) + Number(matchingRangeItem.quantity)
                  : Number(obj.quantity_currently) + Number(matchingRangeItem.quantity)
              };
            } else {
              notExistentSkus.push(obj.sku)
            }

            return null;
          }).filter(obj => obj !== null);

          e.projects.forEach(obj => {
            if (Number(obj.quantity_currently) > Number(obj.quantity_edit)) {
              foundError.push(obj.name);
              return;
            }
          });
        }

        if (foundError.length) {
          localStorage.setItem("exitData", JSON.stringify(e))
          notification.error({
            message: 'Estás intentando sacar más productos de los disponibles en ' + foundError,
            description: 'Por favor, cambia los valores antes de continuar.',
            duration: 5,
          });
          setDisabled(false)
          return;
        }

        var data = {
          id: cash ? idExit : id,
          date_generate_ISO: date.toISOString(),
          date_generate: date.toLocaleString('sv', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 }).replace(',', '.').replace(' ', 'T') + "Z",
          order_number: e.facture_number.toString().toUpperCase(),
          platform: e.platform == undefined ? "POR CONFIRMAR" : e.platform,
          items: [],
          picking: {
            user: user ? user.email : "test",
          },
          packing: {}
        }

        const allValues = e.projects.map(obj => {
          return {
            code: obj.code,
            sku: obj.sku,
            name: obj.name,
            quantity: obj.quantity_currently,
            quantity_currently: obj.quantity_currently,
            brand: obj.brand
          }
        })

        data.items = allValues

        switch (true) {
          case notExistentSkus.length > 0:
            alert("Estos códigos no existen: " + notExistentSkus.toString());
            setDisabled(false)
            break;
          case data.items.length < 1:
            alert("no seas tonto bro, ¿Cómo vas a enviar algo vacío 🙄?");
            setDisabled(false)
            break;
          default:
            setLoading(true)
            if (cash) {
              try {
                socket.emit('objectValuesExits', data)
                receiveOrders(data)
                message.success('cargado exitosamente')
                localStorage.setItem("exitData", JSON.stringify({ projects: [] }))
                handleCancel()
                setDisabled(false)
              } catch (err) {
                console.error('Error changing row:', err);
                message.info('no se pudo completar la operación')
              } finally {
                setLoading(false);
              }
            } else {
              socket.emit('exitEditOrder', data)
            }
        }
      })

  }

  const Modalito = (props) => {
    const values = Object.entries(props.oValues).map(([sku, quantity_currently]) => { return { sku, quantity_currently } })
    return (
      <Modal
        title="RESUMEN DE LA OPERACIÓN"
        open={visible}
        onCancel={handleCancel}
        onOk={undefined}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="número de pedido"
            name="facture_number"
            rules={[{ required: true }]}
            initialValue={valueOrder}
          >
            <Input placeholder="field name" />
          </Form.Item>
          <Form.Item
            label="Plataforma"
            name="platform"
            rules={[{ required: platformStatus, message: 'Por favor, selecciona un número de pedido' }]}
            style={{ display: platformStatus ? 'block' : 'none' }}
          >
            <Select
              id="platform_order"
              placeholder="Selecciona la plataforma"
              allowClear
            >
              <Select.Option value="Mercadolibre">Mercadolibre</Select.Option>
              <Select.Option value="Shopify">Magic Mechas</Select.Option>
              <Select.Option value="DC Bogotá">DC Bogotá</Select.Option>
              <Select.Option value="Linio">Linio</Select.Option>
              <Select.Option value="Falabella">Falabella</Select.Option>
              <Select.Option value="Rappi">Rappi</Select.Option>
              <Select.Option value="Otro">Otro</Select.Option>
            </Select>
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Typography.Text strong>SKU</Typography.Text>
            </Col>
            <Col span={8}>
              <Typography.Text strong>Cantidad</Typography.Text>
            </Col>
            <Col span={8}>
              <Typography.Text strong>Acciones</Typography.Text>
            </Col>
          </Row>
          <Form.List name="projects" initialValue={values}>
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
          <Form.Item>
            <input type="submit" className="btn btn-primary" disabled={disabled}/>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  const Sequence = (e) => {

    const objVal = {};
    for (const sku of allValues) {
      if (objVal[sku]) {
        objVal[sku]++;
      } else {
        objVal[sku] = 1;
      }
    }

    if (!skuProduct.trim()) {
      message.error("Ingresa un valor correcto");
    } else if (packers.includes(skuProduct)) {
      setStatus(true);
      setObjectValues(objVal);
    } else {
      setAllValues((values) => [...values, skuProduct]);
      setSkuProduct('');
      e.target.focus();
    }

  }

  return (
    <>
      <Button className="btn btn-secondary w-25 h-25" onClick={showModal}>
        {nameButton}
      </Button>
      {status ? <Modalito key={key} oValues={objectValues} /> : <Modal
        title={`Ya van ${allValues.length} elementos`}
        open={visible}
        onCancel={handleCancel}
        onOk={undefined}
      >
        <Input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.target.blur()
            }
          }}
          onBlur={Sequence}
          onChange={(e) => { setSkuProduct(e.target.value) }}
          value={skuProduct}
        />
      </Modal>}

    </>
  )
}

const PlatformAutoComplete = ({ socket, mainForm, colors }) => {
  const [form] = Form.useForm();
  const [visibleSH, setVisibleSH] = useState(false);
  const [visibleML, setVisibleML] = useState(false);

  const showModalSH = () => {
    setVisibleSH(true);
  };

  const showModalML = () => {
    setVisibleML(true);
  };

  const handleCancelSH = () => {
    setVisibleSH(false);
  };

  const handleCancelML = () => {
    setVisibleML(false);
  };

  const onFinishSH = (e) => {
    handleCancelSH()
    const parts = e.qr.replace("^", "{").replace("*", "}").replace(/\?/g, "_").replace(/Ñ/g, ":").replace(/¨/g, '"')
    const data = JSON.parse(parts)
    console.log(data)
    socket.emit("preloadOrderSH", data)

    socket.on('preloadOrderSH', (data) => {
      try {
        console.log(data);
        mainForm.setFieldsValue(data)
        form.resetFields()
      } catch (error) {
        console.error('Error handling loadOrders event:', error);
      }
    });
  }

  const onFinishML = (e) => {
    handleCancelML()
    const parts = e.qr.replace("^", "{").replace("*", "}").replace(/\?/g, "_").replace(/Ñ/g, ":").replace(/¨/g, '"')
    const data = JSON.parse(parts)
    console.log(data)
    socket.emit("preloadOrderML", data)

    socket.on('preloadOrderML', (data) => {
      try {
        console.log(data);
        mainForm.setFieldsValue(data)
        form.resetFields()
      } catch (error) {
        console.error('Error handling loadOrders event:', error);
      }
    });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button onClick={showModalML} style={{ padding: 0, margin: "10px", height: "80px", border: "none", backgroundColor: colors.primary[400] }}>
          <img src="https://seeklogo.com/images/M/mercado-livre-logo-49FAC6E19B-seeklogo.com.png" width={"80px"} height={"60px"} style={{ display: "block", filter: colors.black[200] }} />
        </Button>
        <Button onClick={showModalSH} style={{ padding: 0, margin: "10px", height: "80px", border: "none", backgroundColor: colors.primary[400] }}>
          <img src="https://freelogopng.com/images/all_img/1655873659shopify-black-logo.png" width={"80px"} height={"30px"} style={{ display: "block", filter: colors.black[200] }} />
        </Button>
      </div>
      <Modal
        open={visibleSH}
        title="Precaragr"
        onCancel={handleCancelSH}
        footer={[
          <Button key="cancel" onClick={handleCancelSH}>
            Cancelar
          </Button>
        ]}
      >
        <Form form={form} onFinish={onFinishSH} layout="vertical">
          <Form.Item
            label="QR Shopify"
            name="qr"
            labelAlign="left"
            required="true"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <input type="submit" className="btn btn-primary m-2" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={visibleML}
        title="Precaragr"
        onCancel={handleCancelML}
        footer={[
          <Button key="cancel" onClick={handleCancelML}>
            Cancelar
          </Button>
        ]}
      >
        <Form form={form} onFinish={onFinishML} layout="vertical">
          <Form.Item
            label="QR Mercadolibre"
            name="qr"
            labelAlign="left"
            required="true"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <input type="submit" className="btn btn-primary m-2" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const EditCodeProduct = ({ socket, code, loading, setLoading }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (data) => {
    data.code = code
    Modal.confirm({
      title: '¿Seguro que quieres cambiar el código?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        try {
          message.success('Cargado exitosamente')
          setLoading(true);
          socket.emit("editCodeProduct", data)
        } catch (err) {
          console.error('Error changing row:', err);
          message.error('No se pudo completar la operación')
        } finally {
          setVisible(false)
          window.location.reload()
        }
      },
    });
  };

  return (
    <div>
      <Button onClick={showModal}>Modificar Código</Button>
      <Modal
        open={visible}
        title="Actualizar"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="CODE"
              name="newCode"
              labelAlign="left"
              required="true"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <input type="submit" className="btn btn-primary m-2" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export { AddSkuModalServer, ModifyQuantityServer, ConfirmInventoryModalServer, ExitElementsServer, PlatformAutoComplete, EditCodeProduct };