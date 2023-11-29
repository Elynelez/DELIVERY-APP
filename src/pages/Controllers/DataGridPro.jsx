import { Box } from "@mui/material";
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { React, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Modal, message, Select } from "antd";

const DataTableGrid = (props) => {
  const { user } = useAuth0();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalSum, setTotalSum] = useState(0);
  const [dataStatus, setDataStatus] = useState([]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [filteredData, setFilteredData] = useState(props.data);
  const [selectedStatus, setSelectedStatus] = useState(null)

  // const DateRangeFilter = ({ onFilter }) => {
  //   const [startDate, setStartDate] = useState("");
  //   const [endDate, setEndDate] = useState("");

  //   const handleFilter = () => {
  //     onFilter(startDate, endDate);
  //   };

  //   return (
  //     <div>
  //       <input
  //         type="date"
  //         placeholder="Start Date"
  //         value={startDate}
  //         onChange={(e) => setStartDate(e.target.value)}
  //       />
  //       <input
  //         type="date"
  //         placeholder="End Date"
  //         value={endDate}
  //         onChange={(e) => setEndDate(e.target.value)}
  //       />
  //       <button onClick={handleFilter}>Filtrar</button>
  //     </div>
  //   );
  // };

  // const handleDateFilter = (startDate, endDate) => {
  //   const filtered = props.data.filter((item) => {
  //     const itemDate = new Date(item.startDate);
  //     return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  //   });

  //   setFilteredData(filtered);
  // };

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
      Total sumado: $
      <p style={{ display: "inline-block" }}>{totalSum}</p>
      <br />
      <Button
        type="primary"
        style={{ backgroundColor: colors.blueAccent[1000] }}
        onClick={() => { updateMultipleStatus() }}
        disabled={disabledButton}>
        Cambiar Estado
      </Button>
      {/* <DateRangeFilter onFilter={handleDateFilter} /> */}
      <DataGridPro
        onRowSelectionModelChange={selectedRows}
        checkboxSelection
        rows={props.data}
        columns={props.columns}
        slots={{ toolbar: GridToolbar }}
        pagination={{ paginationModel: { pageSize: 25 } }}
      />
    </Box>
  );
};

export default DataTableGrid;