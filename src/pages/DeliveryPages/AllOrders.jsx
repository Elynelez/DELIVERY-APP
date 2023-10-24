import React, { useState, useEffect } from "react";
import { Spin, Menu } from "antd"
import DataTableGrid from "../Controllers/DataGridPro";
import { ModalData, EditModal, ReviewModal } from "../Controllers/Modal";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
// auth
import { useAuth0 } from '@auth0/auth0-react';

const logisticEmails = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com"]

const AllOrders = () => {
  const { user } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [reloadData, setReloadData] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec")
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
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec")
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
  }, []);

  const statusColorMap = {
    'EN RUTA': 'blue',
    'REPROGRAMADO': 'darkorange',
    'ENTREGADO': 'green',
    'ANULADO': 'red',
    'PENDIENTE': '#dccd30',
    'COMPLETO': 'lightblue',
    'INCOMPLETO': 'yellow',
  };

  const columns = [
    { headerName: 'Fecha desp.', field: "date_generate", flex: 1 },
    { headerName: 'Código', field: "code", flex: 1 },
    { headerName: 'Mensajero', field: "coursier", flex: 1 },
    { headerName: 'Cliente', field: "client", flex: 1 },
    { headerName: 'Vendedor', field: "seller", flex: 1 },
    { headerName: 'Dirección', field: "address", flex: 1 },
    { headerName: 'Condición', field: "condition", flex: 1 },
    {
      headerName: 'Valor', field: "total", flex: 1, renderCell: (params) => (
        params.row.method !== "EFECTIVO" ?
          <div style={{ color: 'lightblue' }}>
            {params.row.total}
          </div> : <div>
            {params.row.total}
          </div>
      )
    },
    {
      headerName: 'Estado', field: 'status', flex: 1, renderCell: (params) => (
        <div style={{ color: statusColorMap[params.row.status] || 'black' }}>
          {params.row.status}
        </div>
      )
    },
    {
      headerName: 'Acciones', renderCell: params => (
        <Menu defaultSelectedKeys={['1']} style={{ background: "none" }}>
          <Menu.SubMenu title="Acciones">
            <Menu.Item key="1">
              <ModalData arrayData={[{ title: "fecha de entrega", value: params.row.date_delivery }, { title: "Zona", value: params.row.zone }, { title: "Medio de pago", value: params.row.method }, { title: "Observaciones", value: JSON.parse(params.row.notation).map(obj => obj.notation).join(', ') }, { title: "Dinero entregado", value: params.row.money_delivered }]} />
            </Menu.Item>
            {user && logisticEmails.includes(user.email) ? (
              <Menu.Item key="2">
                <EditModal setReloadData={setReloadData} initialValues={{ order_id: params.row.order_id, date_delivery: (params.row.status === "REPROGRAMADO" || params.row.status === "COMPLETADO" || params.row.status === "COMPLETO (FR)") ? true : false, zone: params.row.zone, code: params.row.code, coursier: params.row.coursier, method: params.row.method, money_delivered: params.row.money_delivered }} />
              </Menu.Item>
            ) : (
              <Menu.Item key="3">
                <ReviewModal setReloadData={setReloadData} initialValues={{ order_id: params.row.order_id, total: params.row.total, money_delivered: params.row.money_delivered, status: params.row.status, disabled: (params.row.status === "COMPLETO (FR)" || params.row.status === "INCOMPLETO") ? false : true }} />
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
              RUTAS COMPLETAS
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              últimos detalles
            </Typography>
          </Box>
          <DataTableGrid columns={columns} data={data} setReloadData={setReloadData} setLoading={setLoading} />
        </Box>
      )}
    </div>
  );
};

export default AllOrders;