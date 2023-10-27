import React, { useState, useEffect } from "react";
import { Spin, Menu } from "antd"
import DataTableGrid from "../Controllers/DataGridPro";
import { ModalData, ReviewModal } from "../Controllers/Modal";
import { Box, Typography } from "@mui/material";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";

const ESTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [reloadData, setReloadData] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?dataExternalService")
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
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?dataExternalService")
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
    'EN RUTA': '#A48BF4',
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
            <Menu.Item key="1">
              <ModalData arrayData={[{ title: "fecha de entrega", value: params.row.date_delivery }, { title: "Zona", value: params.row.zone }, { title: "Medio de pago", value: params.row.method }, { title: "Observaciones", value: JSON.parse(params.row.notation).map(obj => obj.notation).join(', ') }, { title: "Dinero entregado", value: params.row.money_delivered }]} />
            </Menu.Item>
            <Menu.Item key="3">
              <ReviewModal setReloadData={setReloadData} initialValues={{ order_id: params.row.order_id, total: params.row.total, money_delivered: params.row.money_delivered, platform: "ExternalService", status: params.row.status, disabled: (params.row.status === "COMPLETO") ? true : false }} />
            </Menu.Item>
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
              PEDIDOS DE MENSAJERÍA EXTERNA
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              últimos detalles
            </Typography>
          </Box>
          <DataTableGrid columns={columns} data={data} setReloadData={setReloadData} setLoading={setLoading} typeSheet={"ExternalService"}/>
        </Box>
      )}
    </div>
  );
};

export default ESTable;