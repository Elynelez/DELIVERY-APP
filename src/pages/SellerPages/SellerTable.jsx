import React, { useState, useEffect } from "react";
import { Button, Menu, Spin } from "antd"
// import TableData from "../../controllers/DataTable/TableData";
import { useAuth0 } from '@auth0/auth0-react';

const SellerTable = () => {
  const { user } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [reloadData, setReloadData] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbybXfVUusQoptK2mafMn2gQymQRDcfbNfy8P7RHRY7q8rE6tNM2gTEurhliFtmXbK3vjA/exec?key="+user.email)
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
    fetch("https://script.google.com/macros/s/AKfycbybXfVUusQoptK2mafMn2gQymQRDcfbNfy8P7RHRY7q8rE6tNM2gTEurhliFtmXbK3vjA/exec?key="+user.email)
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

  

  const columns = [
    { name: 'Fecha desp.', selector: "date_generate", sortable: true },
    { name: 'Código', selector: "order_id", sortable: true},
    { name: 'Cliente', selector: "client", sortable: true },
    { name: 'Vendedor', selector: "seller", sortable: true },
    { name: 'Dirección', selector: "address", sortable: true },
    { name: 'Condición', selector: "condition", sortable: true },
    { name: 'Valor', selector: "total_price", sortable: true },
  ]

  const tableData = data.map(row => [row.date_generate, row.order_id, row.client, row.address, row.seller, row.condition, row.method, row.total_price]);
  tableData.reverse().unshift(["FECHA GENERACIÓN", "CÓDIGO", "CLIENTE", "DIRECCIÓN", "VENDEDOR", "CONDICIÓN", "MEDIO DE PAGO", "VALOR"])
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
              <h1 className="display-4">Mis ventas</h1>
            </div>
            <div className="col-auto">
              <Button type="primary" onClick={() => downloadTable(tableData, "complete delivery")}>
                Descargar
              </Button>
            </div>
          </div>
          {/* <TableData columns={columns} data={data} setReloadData={setReloadData} setLoading={setLoading}/> */}
        </>
      )}
    </div>
  );
};

export default SellerTable;