import { Box } from "@mui/material";
import { DataGridPro, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid-pro';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useLocation } from 'react-router-dom';
import { React, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { DatePicker, Button, message } from "antd";
// materials
import GetApp from '@mui/icons-material/GetApp';
import { MultipleStatusModal } from "../Modals/DeliveryModals";
import { MultiplePlatformModal } from "../Modals/InventoryModals";


const DataTableGrid = ({ data, columns, setReloadData }) => {
  const location = useLocation()
  const { user } = useAuth0();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalSum, setTotalSum] = useState(0);
  const [dataStatus, setDataStatus] = useState([]);
  const [filteredData, setFilteredData] = useState(data);

  const downloadTableDelivery = () => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"/><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /><meta name="ProgId" content="Excel.Sheet"/><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style>table{border-collapse:collapse;}th,td{border:1px solid gray;padding:10px;}th{background-color:lightgray;}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var thead = `<tr>` + ["ORDER_ID", "FECHA_DESPACHO", "FECHA_ENTREGA", "ZONA", "CODIGO", "MENSAJERO", "CLIENTE", "DIRECCION", "VENDEDOR", "CONDICION", "MEDIO DE PAGO", "VALOR", "OBSERVACIONES", "DINERO ENTREGADO", "ESTADO"].map((e) => {
      return `<th>${e}</th>`
    }).join('') + `</tr>`

    var tbody = data.map(obj => {
      const real_data = obj.complete
      return `
      <tr><td>${real_data.id}</td>
      <td>${real_data.date_generate}</td>
      <td>${real_data.date_delivery}</td>
      <td>${real_data.order.shipping_data.zone}</td>
      <td>${real_data.order.id}</td>
      <td>${real_data.order.shipping_data.coursier}</td>
      <td>${real_data.order.customer.name}</td>
      <td>${real_data.order.customer.address}</td>
      <td>${real_data.order.seller.name}</td>
      <td>${real_data.order.transactions.condition}</td>
      <td>${real_data.order.transactions.method}</td>
      <td>${real_data.order.transactions.total}</td>
      <td>${real_data.order.remarks.map(not => { return `fecha: ${not.date}, id: ${not.id_person}, observación: ${not.notation}` }).join("; ")}</td>
      <td>${real_data.order.money_delivered}</td>
      <td>${real_data.order.status}</td></tr>
      `
    }).join('')

    const tableHtml = thead + tbody

    const content = template.replace('{table}', tableHtml);
    const encodedUri = uri + base64(content);

    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Routes.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTableInventoryExits = () => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"/><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /><meta name="ProgId" content="Excel.Sheet"/><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style>table{border-collapse:collapse;}th,td{border:1px solid gray;padding:10px;}th{background-color:lightgray;}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var thead = `<tr>` + ["ID", "FECHA PICKING", "FECHA PACKING", "PEDIDO", "PLATAFORMA", "CODE", "SKU", "NOMBRE", "CANTIDAD", "MARCA", "USUARIO PICKING", "USUARIO PACKING", "IP PICKING", "IP PACKING"].map((e) => {
      return `<th>${e}</th>`
    }).join('') + `</tr>`

    var tbody = data.map(obj => {
      return obj.items.map(product => {
        return `
      <tr><td>${obj.id}</td>
      <td>${obj.date_generate}</td>
      <td>${obj.date_packing}</td>
      <td>${obj.order_number}</td>
      <td>${obj.platform}</td>
      <td>${product.item.code}</td>
      <td>${product.item.sku}</td>
      <td>${product.item.name}</td>
      <td>${product.item.quantity}</td>
      <td>${product.item.brand}</td>
      <td>${obj.picking.user}</td>
      <td>${obj.packing.user}</td>
      <td>${obj.picking.IP}</td>
      <td>${obj.packing.IP}</td></tr>
      `
      })
    }).flat().join('')

    const tableHtml = thead + tbody

    const content = template.replace('{table}', tableHtml);
    const encodedUri = uri + base64(content);

    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Exits.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const downloadTableInventoryEntries = () => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"/><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /><meta name="ProgId" content="Excel.Sheet"/><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style>table{border-collapse:collapse;}th,td{border:1px solid gray;padding:10px;}th{background-color:lightgray;}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var thead = `<tr>` + ["ID", "FECHA", "FACTURA", "PROVEEDOR", "CODE", "SKU", "NOMBRE", "CANTIDAD", "MARCA", "USUARIO", "IP"].map((e) => {
      return `<th>${e}</th>`
    }).join('') + `</tr>`

    var tbody = data.map(obj => {
      return obj.items.map(product => {
        return `
      <tr><td>${obj.id}</td>
      <td>${obj.date_generate}</td>
      <td>${obj.facture_number}</td>
      <td>${obj.provider}</td>
      <td>${product.item.code}</td>
      <td>${product.item.sku}</td>
      <td>${product.item.name}</td>
      <td>${product.item.quantity}</td>
      <td>${product.item.brand}</td>
      <td>${obj.review.user}</td>
      <td>${obj.review.IP}</td></tr>
      `
      })
    }).flat().join('')

    const tableHtml = thead + tbody

    const content = template.replace('{table}', tableHtml);
    const encodedUri = uri + base64(content);

    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Entries.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const downloadTableInventorySettings = () => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"/><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /><meta name="ProgId" content="Excel.Sheet"/><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style>table{border-collapse:collapse;}th,td{border:1px solid gray;padding:10px;}th{background-color:lightgray;}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var thead = `<tr>` + ["ID", "FECHA", "CODE", "SKU", "NOMBRE", "CANTIDAD", "CANTIDAD ANTERIOR", "MARCA", "USUARIO", "IP"].map((e) => {
      return `<th>${e}</th>`
    }).join('') + `</tr>`

    var tbody = data.map(obj => {
      return obj.items.map(product => {
        return `
      <tr><td>${obj.id}</td>
      <td>${obj.date_generate}</td>
      <td>${product.item.code}</td>
      <td>${product.item.sku}</td>
      <td>${product.item.name}</td>
      <td>${product.item.quantity}</td>
      <td>${product.item.last_quantity}</td>
      <td>${product.item.brand}</td>
      <td>${obj.setting.user}</td>
      <td>${obj.setting.IP}</td></tr>
      `
      })
    }).flat().join('')

    const tableHtml = thead + tbody

    const content = template.replace('{table}', tableHtml);
    const encodedUri = uri + base64(content);

    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Settings.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const CustomToolbar = () => {

    return (
      <GridToolbarContainer >
        <GridToolbar />
        {location.pathname.includes("delivery/all") && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={downloadTableDelivery}>
            <GetApp /><p style={{ fontSize: "10px", paddingTop: "15px" }}>EXPORTAR EXCEL COMPLETO</p>
          </div>
        )}
        {location.pathname.includes("exit/table") && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={downloadTableInventoryExits}>
            <GetApp /><p style={{ fontSize: "10px", paddingTop: "15px" }}>EXPORTAR EXCEL COMPLETO</p>
          </div>
        )}
        {location.pathname.includes("enter/table") && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={downloadTableInventoryEntries}>
            <GetApp /><p style={{ fontSize: "10px", paddingTop: "15px" }}>EXPORTAR EXCEL COMPLETO</p>
          </div>
        )}
        {location.pathname.includes("setting/table") && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={downloadTableInventorySettings}>
            <GetApp /><p style={{ fontSize: "10px", paddingTop: "15px" }}>EXPORTAR EXCEL COMPLETO</p>
          </div>
        )}
      </GridToolbarContainer>
    );
  };

  const DateRangeFilter = ({ onFilter }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleFilter = () => {
      if (startDate && endDate) {
        onFilter(startDate, endDate);
      } else {
        message.error('Por favor, selecciona fechas de inicio y fin');
      }
    };
    const deleteFilter = () => {
      setFilteredData(data)
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <DatePicker
          placeholder="Fecha de inicio"
          style={{ backgroundColor: colors.blueAccent[1000], color: "white" }}
          value={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <DatePicker
          placeholder="Fecha de fin"
          style={{ backgroundColor: colors.blueAccent[1000], color: "white" }}
          value={endDate}
          onChange={(date) => setEndDate(date)}
        />
        <Button
          type="primary"
          style={{ backgroundColor: colors.blueAccent[1000], color: "white" }}
          onClick={handleFilter}>
          Filtrar
        </Button>
        <Button
          onClick={deleteFilter}
          style={{ backgroundColor: colors.blueAccent[1000], color: "white" }}>
          Quitar filtro
        </Button>
      </div>
    );
  };

  const handleDateFilter = (startDate, endDate) => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date_generate_ISO);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    setFilteredData(filtered);

  };

  const handleSelectedRowsChange = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRows = data.filter((row) =>
      selectedIDs.has(row.id.toString()))
    let sum = selectedRows.reduce((acc, object) => acc + (object.total === "" ? 0 : parseFloat(object.total)), 0);
    setTotalSum(sum.toLocaleString("es-ES", { style: "currency", currency: "COP" }));
  };

  const handleSelectedRowsStatus = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRows = data.filter((row) =>
      selectedIDs.has(row.id.toString())
    )
    let filteredData = selectedRows.filter(obj => obj.status.includes("EN RUTA") || obj.status.includes("ENTREGADO") || obj.status.includes("COMPLETO (FR)")).map(obj => { return { ...obj.complete, user: user ? user.email : "test" } })
    setDataStatus(filteredData)
  };

  const handleInventoryUpdateMassive = (ids) => {
    setDataStatus(ids)
  }

  const selectedRowsDelivery = (ids) => {
    handleSelectedRowsChange(ids);
    handleSelectedRowsStatus(ids);
  };

  const selectedRowsInventory = (ids) => {
    handleInventoryUpdateMassive(ids)
  }

  return (
    <Box
      m="40px 0 0 0"
      height="75vh"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          color: "white",
          border: `1px solid ${colors.blueAccent[1000]} !important`,
          backgroundColor: `${colors.blueAccent[1000]} !important`
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: `${colors.primary[400]} !important`,
          border: `1px solid ${colors.blueAccent[1000]} !important`
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: "rgb(130, 130, 130)",
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: "#c2c2c2",
          color: "black"
        },
        "& .MuiToolbar-root.MuiToolbar-gutters": {
          color: "black"
        },
        "& .MuiCheckbox-root": {
          color: `${colors.greenAccent[200]} !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
      }}
    >

      <>
        Total sumado: $
        <p style={{ display: "inline-block" }}>{totalSum}</p>
        <br />
      </>

      <div style={{ display: 'flex', gap: "5px" }}>
        {location.pathname.includes("delivery") && (
          <MultipleStatusModal
            setReloadData={setReloadData}
            colors={colors}
            data={dataStatus}
          />
        )}
        {location.pathname.includes("pending") && (
          <MultiplePlatformModal
            ids={dataStatus}
            colors={colors}
          />
        )}
        <DateRangeFilter onFilter={handleDateFilter} />
      </div>
      <DataGridPro
        onRowSelectionModelChange={location.pathname.includes("delivery") ? selectedRowsDelivery : selectedRowsInventory}
        checkboxSelection
        rows={filteredData}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        pagination={{ paginationModel: { pageSize: 25 } }}
      />
    </Box>
  );
};

export default DataTableGrid;