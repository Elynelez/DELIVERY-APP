import React, { useState, useEffect } from "react";
import { Button, Spin, Menu } from "antd"
import { useParams } from 'react-router-dom';
import TableData from "../Controllers/TableData";
import { ModalData, EditModal } from "../Controllers/Modal";
// auth
import { useAuth0 } from '@auth0/auth0-react';
import { Modal, message } from 'antd';

const emailPrincipal = ["logistica.inducor@gmail.com", "pedidos.ducor@gmail.com", "mysql.ducor@gmail.com"]

const TableDelivery = () => {
  const { user } = useAuth0();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [deleteRow, setDeleteRow] = useState(null)
  const [reloadData, setReloadData] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
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
    fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
      .then(response => response.json())
      .then(parsedData => {
        setData(parsedData);
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



  useEffect(() => {
    if (deleteRow !== null) {
      fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?key=" + id)
        .then(response => response.json())
        .then(parsedData => {
          setData(parsedData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [deleteRow, id]);


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
    { name: 'Código', selector: "code", sortable: true },
    { name: 'Cliente', selector: "client", sortable: true },
    { name: 'Vendedor', selector: "seller", sortable: true },
    { name: 'Dirección', selector: "address", sortable: true },
    { name: 'Condición', selector: "condition", sortable: true },
    {
      name: 'Valor', selector: "total", sortable: true, cell: row => (
        row.method !== "EFECTIVO" ?
          <div style={{ color: 'lightblue' }}>
            {row.total}
          </div> : <div>
            {row.total}
          </div>
      )
    },
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
            {user && emailPrincipal.includes(user.email) && (
              <Menu.Item key="1">
                <Button type="primary" style={{ backgroundColor: "red" }} onClick={() => deleteRowById(row.order_id)}>Borrar</Button>
              </Menu.Item>
            )}
            <Menu.Item key="2">
              <EditModal setReloadData={setReloadData} initialValues={{ order_id: row.order_id, date_delivery: (row.status === "REPROGRAMADO" || row.status === "COMPLETADO" || row.status === "COMPLETO (FR)") ? true : false, zone: row.zone, code: row.code, coursier: row.coursier, method: row.method, money_delivered: row.money_delivered }} />
            </Menu.Item>
            <Menu.Item key="3">
              <ModalData arrayData={[{ title: "fecha de entrega", value: Date(row.date_delivery) }, { title: "Zona", value: row.zone }, { title: "Medio de pago", value: row.method }, { title: "Observaciones", value: JSON.parse(row.notation).map(obj => obj.notation).join(', ') }, { title: "Dinero entregado", value: row.money_delivered }]} />
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      )
    }
  ]

  const tableData = data.map(row => [row.date_generate, row.date_delivery, row.zone, row.code, row.client, row.address, row.seller, row.condition, row.method, row.total, JSON.parse(row.notation).map(obj => obj.notation).join(', '), row.money_delivered]);
  tableData.reverse().unshift(["FECHA DESPACHO", "FECHA ENTREGA", "ZONA", "CÓDIGO", "CLIENTE", "DIRECCIÓN", "VENDEDOR", "CONDICIÓN", "MEDIO DE PAGO", "VALOR", "OBSERVACIONES", "DINERO ENTREGADO"])
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
              <h1 className="display-4">Detalles de Entrega de   <div style={{ display: 'inline-block' }}>{id}</div></h1>
            </div>
            <div className="col-auto">
              <Button type="primary" onClick={() => downloadTable(tableData, id)}>
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

export default TableDelivery;
