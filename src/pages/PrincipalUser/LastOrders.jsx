import React, { useState, useEffect } from "react";
import { Button, Menu, Spin } from "antd"
import TableData from "../Controllers/TableData";
import { ModalData, ReviewModal, EditModal } from "../Controllers/Modal";
import { useAuth0 } from '@auth0/auth0-react';

const emailPrincipal = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com"]

const LastOrders = () => {
  const { user } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [reloadData, setReloadData] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec")
      .then(response => response.json())
      .then(parsedData => {
        setData(parsedData);
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
        setData(parsedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const downloadTable = (tableData, name) => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"/><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /><meta name="ProgId" content="Excel.Sheet"/><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style>table{border-collapse:collapse;}th,td{border:1px solid gray;padding:10px;}th{background-color:lightgray;}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    const tableHtml = tableData
      .map(row => {
        return `<tr>${row
          .map(cell => `<td>${cell}</td>`)
          .join('')}</tr>`;
      })
      .join('');

    const content = template.replace('{table}', tableHtml);
    const encodedUri = uri + base64(content);

    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `${name}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColorMap = {
    'EN RUTA': 'blue',
    'REPROGRAMADO': 'darkorange',
    'ENTREGADO': 'green',
    'ANULADO': 'red',
    'PENDIENTE': '#dccd30',
    'COMPLETO': 'gray',
    'INCOMPLETO': 'yellow',
  };

  const columns = [
    { name: 'Fecha desp.', selector: "date_generate", sortable: true },
    { name: 'Código', selector: "code", sortable: true},
    { name: 'Mensajero', selector: "coursier", sortable: true },
    { name: 'Cliente', selector: "client", sortable: true },
    { name: 'Vendedor', selector: "seller", sortable: true },
    { name: 'Dirección', selector: "address", sortable: true },
    { name: 'Condición', selector: "condition", sortable: true },
    { name: 'Valor', selector: "total", sortable: true },
    {
      name: 'Estado', selector: 'status', sortable: true, cell: row => (
        <div style={{ color: statusColorMap[row.status] || 'black' }}>
          {row.status}
        </div>
      )
    },
    {
      name: 'Acciones', button: true, cell: row => (
        <Menu defaultSelectedKeys={['1']} style={{ background: "none" }}>
          <Menu.SubMenu title="Acciones">
            <Menu.Item key="1">
              <ModalData arrayData={[{ title: "fecha de entrega", value: Date(row.date_delivery) }, { title: "Zona", value: row.zone }, { title: "Medio de pago", value: row.method }, { title: "Observaciones", value: JSON.parse(row.notation).map(obj => obj.notation).join(', ') }, { title: "Dinero entregado", value: row.money_delivered }]} />
            </Menu.Item>
            {user && emailPrincipal.includes(user.email) ? (
              <Menu.Item key="2">
                <EditModal setReloadData={setReloadData} initialValues={{ order_id: row.order_id, date_delivery: (row.status === "REPROGRAMADO" || row.status === "COMPLETADO" || row.status === "COMPLETO (FR)") ? true : false, zone: row.zone, code: row.code, coursier: row.coursier, method: row.method, money_delivered: row.money_delivered }} />
              </Menu.Item>
            ) : (
              <Menu.Item key="3">
                <ReviewModal setReloadData={setReloadData} initialValues={{ order_id: row.order_id, total: row.total, money_delivered: row.money_delivered, status: row.status, disabled: (row.status === "COMPLETO (FR)" || row.status === "INCOMPLETO") ? false : true }} />
              </Menu.Item>
            )}
          </Menu.SubMenu>
        </Menu>
      )
    }
  ]

  const tableData = data.map(row => [row.date_generate, row.date_delivery, row.coursier, row.zone, row.code, row.client, row.address, row.seller, row.condition, row.method, row.total, JSON.parse(row.notation).map(obj => obj.notation).join(', '), row.money_delivered]);
  tableData.reverse().unshift(["FECHA DESPACHO", "FECHA ENTREGA", "MENSAJERO", "ZONA", "CÓDIGO", "CLIENTE", "DIRECCIÓN", "VENDEDOR", "CONDICIÓN", "MEDIO DE PAGO", "VALOR", "OBSERVACIONES", "DINERO ENTREGADO"])
  return (
    <div className="container py-5">

      {loading ? (
        <div className="text-center">
          <Spin tip="Cargando datos..." />
        </div>
      ) : (
        <>
          <div className="row align-items-center mb-4">
            <div className="col">
              <h1 className="display-4">Últimos detalles</h1>
            </div>
            <div className="col-auto">
              <Button type="primary" onClick={() => downloadTable(tableData, "complete delivery")}>
                Descargar
              </Button>
            </div>
          </div>
          <TableData columns={columns} data={data} setReloadData={setReloadData} setLoading={setLoading}/>
        </>
      )}
    </div>
  );
};

export default LastOrders;
