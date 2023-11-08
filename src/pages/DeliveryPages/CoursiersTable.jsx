import React, { useState, useEffect } from "react";
import { Button, Spin, Menu } from "antd"
import { useParams } from 'react-router-dom';
import DataTableGrid from "../Controllers/DataGridPro";
import { ModalData, EditModal, ReviewModal } from "../Controllers/Modal";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
// auth
import { useAuth0 } from '@auth0/auth0-react';
import { Modal, message } from 'antd';

const CoursiersTable = (props) => {
  const { user } = useAuth0();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [deleteRow, setDeleteRow] = useState(null)
  const [cancelledOrder, setCancelledOrder] = useState(null)
  const [reloadData, setReloadData] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
      .then(response => response.json())
      .then(parsedData => {
        let dataO = parsedData.map(element => {
          element.id = element.order_id
          return element
        });
        setData(dataO);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (reloadData) {
      loadData();
      setReloadData(false);
    }
  }, [reloadData]);


  useEffect(() => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
      .then(response => response.json())
      .then(parsedData => {
        let dataO = parsedData.map(element => {
          element.id = element.order_id
          return element
        });
        setData(dataO);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]);

  const deleteRowById = (order_Id) => {
    Modal.confirm({
      title: '¿Seguro que quieres eliminar este contenido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?delete", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({ id: order_Id })
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

  const canceledOrderById = (order_Id) => {
    Modal.confirm({
      title: '¿Seguro que quieres anular este padido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos')
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?canceled", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({ id: order_Id, sheet: id })
        })
          .then(response => response.json())
          .then(data => {
            message.success('Pedido cancelado exitosamente');
            setCancelledOrder(data.data.id)
          })
          .catch(error => {
            console.error('Error cancelling order:', error);
            message.info('no se pudo completar la operación')
          });
      },
    });

  }



  useEffect(() => {
    if (deleteRow !== null) {
      fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
        .then(response => response.json())
        .then(parsedData => {
          let dataO = parsedData.map(element => {
            element.id = element.order_id
            return element
          });
          setData(dataO);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    } else if (cancelledOrder !== null) {
      fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
        .then(response => response.json())
        .then(parsedData => {
          let dataO = parsedData.map(element => {
            element.id = element.order_id
            return element
          });
          setData(dataO);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [deleteRow, cancelledOrder, id]);

  const statusColorMap = {
    'EN RUTA': '#A48BF4',
    'REPROGRAMADO': 'darkorange',
    'ENTREGADO': '#38BC3E ',
    'ANULADO': '#FF1C1C',
    'PENDIENTE': '#dccd30',
    'COMPLETO': '#76C3A5',
    'INCOMPLETO': '#EABD31 ',
  };

  const columns = [
    { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
    { headerName: 'Código', field: "code", flex: 1 },
    { headerName: 'Cliente', field: "client", flex: 1 },
    { headerName: 'Vendedor', field: "seller", flex: 1 },
    { headerName: 'Dirección', field: "address", flex: 1 },
    { headerName: 'Condición', field: "condition", flex: 1 },
    {
      headerName: 'Valor', field: "total", flex: 1, renderCell: (params) => (
        params.row.method === "EFECTIVO" ?
          <div style={{ color: '#5105DE' }}>
            {params.row.total}
          </div> : <div>
            {params.row.total}
          </div>
      )
    },
    {
      headerName: 'Estado', field: 'status', flex: 1, renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", textAlign: "center", backgroundColor: colors.black[100], width: "80px", height: "40px", borderRadius: "5px", color: statusColorMap[params.row.status] || 'white' }}>
          <p style={{ display: "inline-block", margin: "auto", overflow: "hidden", padding: "1px 2px 1px" }}>{params.row.status}</p>
        </div>
      )
    },
    {
      headerName: 'Acciones', renderCell: params => (
        <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
          <Menu.SubMenu title="Acciones">
            {user && props.logisticEmails.includes(user.email) && (
              <>
                <Menu.Item key="0">
                  <Button type="primary" style={{ backgroundColor: "#5e2129" }} onClick={() => canceledOrderById(params.row.order_id)}>Anular</Button>
                </Menu.Item>
                <Menu.Item key="1">
                  <Button type="primary" style={{ backgroundColor: "red" }} onClick={() => deleteRowById(params.row.order_id)}>Borrar</Button>
                </Menu.Item>
                <Menu.Item key="2">
                  <EditModal setReloadData={setReloadData} initialValues={{ order_id: params.row.order_id, date_delivery: (params.row.status === "REPROGRAMADO" || params.row.status === "COMPLETADO" || params.row.status === "COMPLETO (FR)") ? true : false, zone: params.row.zone, code: params.row.code, coursier: params.row.coursier, method: params.row.method, money_delivered: params.row.money_delivered }} />
                </Menu.Item>
              </>
            )}
            <Menu.Item key="3">
              <ModalData arrayData={[{ title: "fecha de entrega", value: params.row.date_delivery }, { title: "Zona", value: params.row.zone }, { title: "Medio de pago", value: params.row.method }, { title: "Observaciones", value: JSON.parse(params.row.notation).map(obj => obj.notation).join(', ') }, { title: "Dinero entregado", value: params.row.money_delivered }]} />
            </Menu.Item>
            {user && props.bossEmails.includes(user.email) && (
              <Menu.Item key="4">
                <ReviewModal setReloadData={setReloadData} initialValues={{ order_id: params.row.order_id, total: params.row.total, money_delivered: params.row.money_delivered, status: params.row.status, disabled: (params.row.status.includes("COMPLETO") && params.row.status !== "INCOMPLETO") ? true : false }} />
              </Menu.Item>
            )}
          </Menu.SubMenu>
        </Menu>
      )
    }
  ]

  return (
    <div className="container py-5">

      {loading ? (
        <div className="text-center">
          <Spin tip="Cargando datos..." />
        </div>
      ) : (
        <Box m="20px">
          <Box mb="30px">
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "0 0 5px 0" }}
            >
              RUTA DE <>{id.toLocaleUpperCase()}</>
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              últimos detalles
            </Typography>
          </Box>
          <DataTableGrid columns={columns} data={data} setReloadData={setReloadData} setLoading={setLoading} typeSheet={"Delivery"} />
        </Box>
      )}
    </div>
  );
};

export default CoursiersTable;
