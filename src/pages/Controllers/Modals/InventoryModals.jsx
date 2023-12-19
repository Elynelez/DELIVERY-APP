import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Spin, message, Select } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuth0 } from '@auth0/auth0-react';

const ConfirmInventoryModal = (props) => {
  const [form] = Form.useForm();
  const { user } = useAuth0();
  const [allValues, setAllValues] = useState([]);
  const [rangeItems, setRangeItems] = useState([]);
  const packers = ["ANYELO", "TATIANA", "KILIAN", "INDUCOR", "NICOLAS", "PILAR", "tatiana", "pilar"];
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

  const ExitElements = () => {
    Swal.fire({
      title: "Ya van " + allValues.length + " elementos",
      input: "text",
      inputPlaceholder: "Ingresa el siguiente SKU",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar un SKU válido";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let valor = result.value;

        const objectValues = {};

        for (const sku of allValues) {
          if (objectValues[sku]) {
            objectValues[sku]++;
          } else {
            objectValues[sku] = 1;
          }
        }

        if (valor === null || valor.trim() === "" || packers.includes(valor)) {
          var allValuesInputs = Object.entries(objectValues).map((groupSKU, index) => {
            return `
              <tr>
                  <th scope="row">${index + 1}</th>
                  <td scope="row">
                      <input class="swal2-input input-sweet-table-main" value="${groupSKU[0]}" id="skuInput">
                  </td>
                  <td scope="row">
                      <input class="swal2-input input-sweet-table" type="number" value="${groupSKU[1]}" id="quantityInput">
                  </td>
                  <td scope="row">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" cursor="pointer" class="delete-button">
                          <path fill="gray" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                  </td>
              </tr>`;
          });

          Swal.fire({
            title: 'RESUMEN DE LA OPERACIÓN',
            html: `
            <div id="page" style="max-height: 200px; overflow-y: auto;">
                <div>
                  <label class="form-label">Número del pedido</label>
                  <br>
                  <input class="swal2-input input-sweet-table-main" id="factureNumber" value="`+ props.orderNumber + `" readonly>
                </div>
                <br>
                <div style="display: none">
                  <label class="form-label">Celdas</label>
                  <br>
                  <input class="swal2-input input-sweet-table-main" id="cells_order" value="`+ props.initialValues.cells + `" readonly>
                </div>
                <br>
                <div>
                  <label class="form-label">Plataforma de entrega</label>
                  <br>
                  <select class="swal2-input input-sweet-table-main" id="platform_order" required>
                    <option value="" selected disabled hidden></option>
                    <option value="Mercadolibre" >Mercadolibre</option>
                    <option value="Shopify" >Magic Mechas</option>
                    <option value="DC Bogotá" >DC Bogotá</option>
                    <option value="Linio" >Linio</option>
                    <option value="Falabella" >Falabella</option>
                    <option value="Rappi" >Rappi</option>
                    <option value="Otro" >Otro</option>
                  </select>
                </div>
                <br>
                <table style="width: 100%">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">EAN</th>
                            <th scope="col">Cant.</th>
                            <th scope="col">Elm.</th>
                        </tr>
                    </thead>
                    <tbody>`
              +
              allValuesInputs.join("")
              +
              `</tbody>
                </table>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {

              const skuInputs = document.querySelectorAll("#skuInput");
              const quantityInputs = document.querySelectorAll("#quantityInput");
              const factureNumber = document.getElementById("factureNumber")
              const platformOrder = document.getElementById("platform_order")
              const cellsOrder = document.getElementById("cells_order")

              const valuesFinal = Array.from(skuInputs).map(input => input.value)

              const rangeSkus = rangeItems.map(objectValue => {
                return objectValue.sku
              })

              const notExistentSkus = valuesFinal.filter(sku => !rangeSkus.includes(sku));

              const filterSKUS = rangeItems.filter(object => valuesFinal.includes(object.sku));

              const sentValues = filterSKUS.map((obj, index) => {
                return [factureNumber.value, platformOrder.value, obj.code, obj.sku, obj.name, quantityInputs[index].value, obj.brand, user.email, cellsOrder.value.split(",")]
              })

              if (notExistentSkus.length > 0) {
                Swal.showValidationMessage("Estos códigos no existen: " + notExistentSkus.toString());
                return false;
              }

              if (valuesFinal.length < 1 || platformOrder.value.trim() == "" || factureNumber.value.trim() == "") {
                Swal.showValidationMessage("no seas tonto bro, ¿Cómo vas a enviar algo vacío 🙄?");
                return false;
              }

              console.log(sentValues)

              setLoading(true);
              fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?exitCorrection", {
                redirect: "follow",
                method: 'POST',
                headers: {
                  "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify(sentValues)
              })
                .then(response => response.json())
                .then(data => {
                  console.log(data)
                  setLoading(false);
                  message.success('cargado exitosamente')
                  handleCancel()
                  props.setReloadData(true);
                })
                .catch(error => {
                  console.error('Error changing row:', error);
                  message.info('no se pudo completar la operación')
                });
              setAllValues([]);
            },
          });

          document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
              event.target.parentNode.parentNode.parentNode.remove()
            });
          });
        } else {
          allValues.push(valor);
          ExitElements(valor);
        }
      }
    });
  };

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

  useEffect(() => {
    setLoading(true);
    const objectGroup = {}
    for (const obj of props.rows) {
      const sku = obj.sku;
      objectGroup[sku] = obj.quantity;
    }

    const resultArray = Array.from(Object.entries(objectGroup).flatMap(([key, value]) => Array(value).fill(key))).filter(function (i) { return i !== "undefined" })

    setAllValues(resultArray)
    fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec")
      .then(response => response.json())
      .then(parsedData => {
        setRangeItems(parsedData)
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
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
              <input className="btn btn-warning w-25 m-2" onClick={ExitElements} value="Editar" />
              <input className="btn btn-danger w-25 m-2" onClick={() => { deleteRowById(props.initialValues.cells) }} value="Eliminar" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

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

  const onFinish = () => {
    console.log("ok")
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
              <Input />
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

export { ConfirmInventoryModal, AddSkuModal };