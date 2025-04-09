import React, { useState, useEffect } from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { Button, Spin, Menu, Modal, message } from "antd"
import axios from "axios";
import { tokens } from "../../theme";
import DataTableGrid from "../../controllers/Tables/DataGridPro";
import { EditOrderPlatform } from "../../controllers/Modals/PlatformsModals";

const SellerOrders = ({ user, ordersData, setOrdersData, rangeItems, reloadData, setReloadData, socket, URL_SERVER }) => {
  const [loading, setLoading] = useState(true)
  const [conditions, setCondiions] = useState([])
  const [methods, setMethods] = useState([])
  const [places, setPlaces] = useState([])
  const [users, setUsers] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const loadData = async () => {
    setLoading(true)

    try {
      const [platformsResp, conditionsResp, methodsResp, placesResp, usersResp] = await Promise.all([
        axios.get(`${URL_SERVER}/platforms/dcbogota`),
        axios.get(`${URL_SERVER}/sales/conditions`),
        axios.get(`${URL_SERVER}/sales/methods`),
        axios.get(`${URL_SERVER}/sales/places`),
        axios.get(`${URL_SERVER}/database/users`)
      ]);

      const seller = usersResp.data.find(obj => obj.email == user.email).name

      const dataWithPos = platformsResp.data.map((obj, index) => ({
        id: obj.id,
        date_generate: obj.date_generate,
        date_generate_ISO: obj.date_generate_ISO,
        coursier: obj.order.delivery.join(", "),
        seller: obj.seller.name,
        client: obj.customer.name,
        address: obj.customer.shipping_data.address,
        state: obj.customer.shipping_data.state,
        city: obj.customer.shipping_data.city,
        items: obj.order.items,
        condition: obj.order.transactions.condition,
        method: obj.order.transactions.method,
        total: Number(obj.order.transactions.total_payments) + Number(obj.order.transactions.total_shipping),
        total_payments: Number(obj.order.transactions.total_payments),
        total_shipping: Number(obj.order.transactions.total_shipping),
        status: obj.order.status,
        pos: index + 1
      }));

      let data

      if (seller === "Jefes") {
        data = dataWithPos.filter(obj => obj.seller === "Andrea" || obj.seller === "Nicolas");
      } else {
        data = dataWithPos.filter(obj => obj.seller === seller);
      }

      setCondiions(conditionsResp.data)
      setMethods(methodsResp.data)
      setPlaces(placesResp.data)
      setUsers(usersResp.data)
      setOrdersData(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setReloadData(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [rangeItems])

  useEffect(() => {
    if (reloadData) {
      loadData();
    }
  }, [reloadData]);

  const canceledOrderById = (data) => {
    Modal.confirm({
      title: '¿Seguro que quieres anular este padido?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('Procesando, por favor espera...');
        socket.emit("cancelPlatform", data.pos)
        socket.on("message", (response) => {
          if (response.success) {
            setReloadData(true);
            message.success(response.message);
          } else {
            message.error(response.message || 'Hubo un error inesperado.');
          }
        });
      },
    });
  }

  const statusColorMap = {
    'EN RUTA': '#A48BF4',
    'REPROGRAMADO': 'darkorange',
    'ENTREGADO': '#38BC3E ',
    'ANULADO': '#FF1C1C',
    'PENDIENTE': '#dccd30',
    'COMPLETO': '#76C3A5',
    'INCOMPLETO': '#EABD31 '
  };

  const columns = [
    { headerName: 'Fecha', field: "date_generate", flex: 1 },
    { headerName: 'Código', field: "id", flex: 1 },
    { headerName: 'Mensajeros', field: "coursier", flex: 1 },
    { headerName: 'Cliente', field: "client", flex: 1 },
    { headerName: 'Vendedor', field: "seller", flex: 1 },
    { headerName: 'Dirección', field: "address", flex: 1 },
    { headerName: 'Departamento', field: "state", flex: 1 },
    { headerName: 'Ciudad', field: "city", flex: 1 },
    {
      headerName: 'Artículos', field: "items", valueFormatter: (params) => {
        return params.value.map(obj => `${obj.item.sku} - ${obj.item.name} - ${obj.item.quantity}`).join(', ');
      }
    },
    { headerName: 'Condición', field: "condition", flex: 1 },
    { headerName: 'Método', field: "method", flex: 1 },
    { headerName: 'Valor', field: "total", flex: 1 },
    {
      headerName: 'Estado', field: 'status', flex: 1, renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", textAlign: "center", backgroundColor: colors.black[100], width: "200px", height: "40px", borderRadius: "5px", color: statusColorMap[params.row.status] || 'white' }}>
          <p style={{ display: "inline-block", margin: "auto", overflow: "hidden", padding: "1px 2px 1px" }}>{params.row.status}</p>
        </div>
      )
    },
    {
      headerName: 'Acciones', renderCell: params => (
        <Menu defaultSelectedKeys={['1']} style={{ background: "rgba(255,255,255,0.5)", width: "80px", height: "40px", borderRadius: "5px" }}>
          <Menu.SubMenu title="Acciones" key="sub-menu">
            <Menu.Item key="0">
              <Button type="primary" style={{ backgroundColor: "#5e2129" }} onClick={() => canceledOrderById(params.row)}>
                Anular
              </Button>
            </Menu.Item>
            <Menu.Item key="1">
              <EditOrderPlatform
                rangeItems={rangeItems}
                data={params.row}
                user={user}
                users={users}
                conditions={conditions}
                methods={methods}
                places={places}
                setReloadData={setReloadData}
                URL_SERVER={URL_SERVER}
              />
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
              TUS ÓRDENES
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              últimos detalles
            </Typography>
          </Box>
          <DataTableGrid
            key={ordersData.length}
            columns={columns}
            data={ordersData}
            setReloadData={setOrdersData}
            setLoading={setLoading}
          />
        </Box>
      )}
    </div>

  );
};

export default SellerOrders;