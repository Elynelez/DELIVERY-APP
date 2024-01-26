import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Spin, message, Select, Row, Col, Typography } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';



const AddSkuModal = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true)

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    var listSkus = props.dataSkus.map(obj => { return obj.sku })
    if (listSkus.includes(values.sku)) {
      message.error('este sku ya existe, no lo puedes poner nuevamente')
    } else {
      Modal.confirm({
        title: '¿Seguro que quieres agregar este sku a este producto?',
        content: 'Esta acción no se puede deshacer.',
        onOk: () => {
          message.info('unos momentos')
          setLoading(true);
          values.cell = props.cell
          fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?addCode", {
            redirect: "follow",
            method: 'POST',
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(values)
          })
            .then(response => response.json())
            .then(data => {
              message.success('Contenido actualizado exitosamente');
              setLoading(false)
              setVisible(false)
              props.setReloadData(true)
            })
            .catch(error => {
              console.error('Error deleting row:', error);
              message.info('no se pudo completar la operación')
            });
        },
      });
    }

  }

  return (
    <div>
      <Button onClick={showModal}>Agregar Sku</Button>
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

const ModifyQuantity = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0()

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    values.inventory_quantity = props.data.quantity
    values.real_quantity = Number(values.real_quantity)
    values.sku = props.data.sku
    values.code = props.data.code
    values.name = props.data.name
    values.brand = props.data.brand
    values.user = user.email

    Modal.confirm({
      title: '¿Seguro que quieres ajustar la cantidad del inventario?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?settingQuantity", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(values)
        })
          .then(response => response.json())
          .then(data => {
            message.success('Contenido actualizado exitosamente');
            setLoading(false)
            setVisible(false)
            props.setReloadData(true)
          })
          .catch(error => {
            console.error('Error deleting row:', error);
            message.info('no se pudo completar la operación')
          });
      },
    });
  }

  return (
    <div>
      <Button onClick={showModal}>Ajustar cantidad</Button>
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

const ExitElements = ({ rangeItems, setLoading, prev, nameButton, platformStatus, urlFetch, valueOrder, cells, cash, setReloadData }) => {
  const { user } = useAuth0();
  const [allValues, setAllValues] = useState(prev);
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);
  const [skuProduct, setSkuProduct] = useState('')
  const packers = ["ANYELO", "TATIANA", "KILIAN", "INDUCOR", "NICOLAS", "PILAR", "tatiana", "pilar"];
  const [status, setStatus] = useState(false)
  const [objectValues, setObjectValues] = useState({})
  const [form] = Form.useForm();

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

  const onFinish = (values) => {
    const idExit = v4()

    const rangeSkus = rangeItems.map(objectValue => {
      return objectValue.sku
    })

    const notExistentSkus = values.projects.filter(obj => !rangeSkus.includes(obj.sku)).map(obj => { return obj.sku })
    const valuesFinal = values.projects.map(obj => { return obj.sku })

    const filterSKUS = rangeItems.filter(object => valuesFinal.includes(object.sku))

    var sentValues

    if (cash) {
      sentValues = filterSKUS.map((obj) => {
        var qt = values.projects.filter(object => object.sku == obj.sku)
        return [values.order_number, values.platform_order == undefined ? "POR CONFIRMAR" : values.platform_order, obj.code, obj.sku, obj.name, Number(qt[0].quantity), obj.brand, user ? user.email : "good", idExit]
      })
    } else {
      sentValues = filterSKUS.map((obj) => {
        var qt = values.projects.filter(object => object.sku == obj.sku)
        return [values.order_number, values.platform_order == undefined ? "POR CONFIRMAR" : values.platform_order, obj.code, obj.sku, obj.name, Number(qt[0].quantity), obj.brand, user ? user.email : "good", idExit, values.cells]
      })
    }

    if (notExistentSkus.length > 0) {
      alert("Estos códigos no existen: " + notExistentSkus.toString());
      return false;
    }

    if (values.projects.length < 1) {
      alert("no seas tonto bro, ¿Cómo vas a enviar algo vacío 🙄?");
      return false;
    }

    message.info('cargando...')
    fetch(urlFetch, {
      redirect: "follow",
      method: 'POST',
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(sentValues)
    })
      .then(response => response.json())
      .then(data => {
        message.success('cargado exitosamente')
        setTimeout(() => {
          handleCancel()
          setReloadData(true)
          form.resetFields()
        }, 1000)

      })
      .catch(error => {
        setLoading(false)
        console.error('Error changing row:', error);
        message.error('no se pudo completar la operación')
      });

  }

  const Modalito = (props) => {
    const values = Object.entries(props.oValues).map(([sku, quantity]) => { return { sku, quantity } })
    return (
      <Modal
        title="RESUMEN DE LA OPERACIÓN"
        open={visible}
        onCancel={handleCancel}
        onOk={undefined}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            hidden="true"
            label="Cd"
            name="cells"
            labelAlign="left"
            initialValue={cells}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="número de pedido"
            name="order_number"
            rules={[{ required: true }]}
            initialValue={valueOrder}
          >
            <Input placeholder="field name" />
          </Form.Item>
          <Form.Item
            label="Plataforma"
            name="platform_order"
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
                        name={[index, "quantity"]}
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
            <input type="submit" className="btn btn-primary" />
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
    <div>
      <Button type="primary" onClick={showModal}>
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

    </div>
  )
}

const ConfirmInventoryModal = (props) => {
  const [form] = Form.useForm();
  const [allValues, setAllValues] = useState([]);
  const [rangeItems, setRangeItems] = useState(props.rangeItems);
  const [deleteRow, setDeleteRow] = useState(null)
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true)

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    const objectGroup = {}
    for (const obj of props.rows) {
      const sku = obj.sku;
      objectGroup[sku] = obj.quantity;
    }

    const resultArray = Array.from(Object.entries(objectGroup).flatMap(([key, value]) => Array(value).fill(key))).filter(function (i) { return i !== "undefined" })

    setAllValues(resultArray)
  }, []);

  const deleteRowById = (cells) => {
    console.log(cells)
    Modal.confirm({
      title: '¿Seguro que quieres eliminar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?delete", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(cells)
        })
          .then(response => response.json())
          .then(data => {
            message.success('Contenido borrado exitosamente');
            setDeleteRow(data.data.id)
          })
          .catch(error => {
            console.error('Error deleting row:', error);
            message.info('no se pudo completar la operación')
          });
      },
    });

  }

  useEffect(() => {
    if (deleteRow !== null) {
      props.loadData()
    }
  }, [deleteRow]);

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

          <br />


          <Form form={form} onFinish={onFinish} initialValues={props.initialValues} layout="vertical">
            <Form.Item
              hidden="true"
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
              <input type="submit" className="btn btn-primary m-2" disabled={disabled} />
              <ExitElements
                prev={allValues}
                rangeItems={rangeItems}
                setLoading={props.setLoading}
                nameButton={"Editar"}
                platformStatus={true}
                urlFetch={"https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?exitCorrection"}
                valueOrder={props.orderNumber}
                cells={props.initialValues.cells}
                setReloadData={props.setReloadData}
              />
              <input className="btn btn-danger w-25 m-2" onClick={() => { deleteRowById(props.initialValues.cells) }} value="Eliminar" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

const ConfirmInventoryModalServer = (props) => {
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
    Modal.confirm({
      title: '¿Seguro que quieres actualizar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        props.setLoading(true);
        props.socket.emit('sendConfirmExit', { order_number: props.orderNumber, platform: values.platform })
        setTimeout(() => {
          setVisible(false);
          console.log(props.orderNumber)
          try {
            message.success('cargado exitosamente')
            props.setLoading(false);
          } catch (err) {
            console.error('Error changing row:', err);
            message.info('no se pudo completar la operación')
            props.setLoading(false);
          }
        }, 300);

      },
    });
  }

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

        <br />


        <Form form={form} onFinish={onFinish} initialValues={props.initialValues} layout="vertical">
          <Form.Item
            hidden="true"
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
            <input type="submit" className="btn btn-primary m-2" disabled={disabled} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export { ConfirmInventoryModal, AddSkuModal, ModifyQuantity, ExitElements, ConfirmInventoryModalServer };