import { Box } from "@mui/material";
import { DataGridPro, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid-pro';
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useLocation } from 'react-router-dom';
import { React, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { DatePicker, Button, Modal, message, Select } from "antd";
// materials
import GetApp from '@mui/icons-material/GetApp';


const DataTableGrid = (props) => {
  const location = useLocation()
  const { user } = useAuth0();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalSum, setTotalSum] = useState(0);
  const [dataStatus, setDataStatus] = useState([]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [filteredData, setFilteredData] = useState(props.data);
  const [selectedStatus, setSelectedStatus] = useState(null)

  const downloadTable = () => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"/><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /><meta name="ProgId" content="Excel.Sheet"/><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style>table{border-collapse:collapse;}th,td{border:1px solid gray;padding:10px;}th{background-color:lightgray;}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };

    var thead = `<tr>` + ["GUÍA", "FECHA DESPACHO", "FECHA DESPACHO", "FECHA ENTREGA", "ZONA", "CÓDIGO", "MENSAJERO", "CLIENTE", "DIRECCIÓN", "VENDEDOR", "CONDICIÓN", "MEDIO DE PAGO", "TOTAL", "OBSERVACIONES", "DINERO ENTREGADO", "ESTADO"].map((e) => {
      return `<th>${e}</th>`
    }).join('') + `</tr>`

    const tbody = props.data.map(row => {
      return `<tr>${Object.keys(row).map((e) => {
        return `<td>${row[e]}</td>`
      }).join('')}</tr>`
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

  const CustomToolbar = () => {

    return (
      <GridToolbarContainer >
        <GridToolbar />
        {location.pathname.includes("AllOrders") && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={downloadTable}>
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
      setFilteredData(props.data)
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
    const filtered = props.data.filter((item) => {
      const itemDate = new Date(item.date_generate_ISO);
      console.log(item.date_generate_ISO)
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    setFilteredData(filtered);

  };

  const updateOrderStatus = () => {
    console.log("dbabdsa")
  }

  const updateMultipleStatus = () => {
    var dataStatusNew = dataStatus.map(arr => [...arr, selectedStatus])
    Modal.confirm({
      title: '¿Seguro que quieres cambiar el estado?',
      content: (
        <div>
          <p>Esta acción no se puede deshacer.</p>
          <Select
            placeholder="Selecciona una opción"
            onChange={(value) => setSelectedStatus(value)}
            style={{ width: '100%' }}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            required
          >
            <Select.Option value="COMPLETO">Completo</Select.Option>
            <Select.Option value="ENTREGADO">Entregado</Select.Option>
          </Select>
        </div>
      ),
      onOk: () => {
        if (!selectedStatus) {
          message.warning('Por favor, selecciona una opción.');
        } else {
          message.info('unos momentos');
          props.setLoading(true);
          fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?massiveStatus", {
            redirect: "follow",
            method: 'POST',
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(dataStatusNew)
          })
            .then(response => response.json())
            .then(data => {
              message.success('Contenido actualizado exitosamente');
              console.log(data);
              props.setReloadData(true);
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              message.info('no se pudo completar la operación');
            });
        }
      }
    });
  };

  const handleSelectedRowsChange = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRows = props.data.filter((row) =>
      selectedIDs.has(row.id.toString()))
    let sum = selectedRows.reduce((acc, object) => acc + (object.total === "" ? 0 : parseFloat(object.total)), 0);
    setTotalSum(sum.toLocaleString("es-ES", { style: "currency", currency: "COP" }));
  };

  const handleSelectedRowsStatus = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRows = props.data.filter((row) =>
      selectedIDs.has(row.id.toString())
    )
    let data = selectedRows.filter(object => object.status.includes("EN RUTA") || object.status.includes("ENTREGADO") || object.status.includes("INCOMPLETO") || object.status.includes("COMPLETO (FR)")).map(object => [object.order_id, object.total, user.email, props.typeSheet]);
    setDisabledButton(data.length < 2);
    setDataStatus(data);
  };

  const selectedRows = (ids) => {
    handleSelectedRowsChange(ids);
    handleSelectedRowsStatus(ids);
  };

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
      {props.typeSheet == "Inventory" ? (
        <></>
      ) : (
        <>
          Total sumado: $
          <p style={{ display: "inline-block" }}>{totalSum}</p>
          <br />
        </>
      )}

      <div style={{ display: 'flex', gap: "5px" }}>
        {props.typeSheet === "Inventory" ? (
          <Button
            type="primary"
            style={{ backgroundColor: colors.blueAccent[1000] }}
            onClick={() => { updateOrderStatus() }}
            disabled={false}>
            Cambiar Estado
          </Button>
        ) : props.typeSheet === "Delivery" || props.typeSheet === "ExternalService" ? (
          <Button
            type="primary"
            style={{ backgroundColor: colors.blueAccent[1000] }}
            onClick={() => { updateMultipleStatus() }}
            disabled={disabledButton}>
            Cambiar Estado
          </Button>
        ) : (
          <></>
        )}

        <DateRangeFilter onFilter={handleDateFilter} />
      </div>
      <DataGridPro
        onRowSelectionModelChange={selectedRows}
        checkboxSelection
        rows={filteredData}
        columns={props.columns}
        slots={{ toolbar: CustomToolbar }}
        pagination={{ paginationModel: { pageSize: 25 } }}
      />
    </Box>
  );
};

export default DataTableGrid;