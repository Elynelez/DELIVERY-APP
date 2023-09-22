import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import ColumnFilter from './ColumnFilter';
import { Button, Modal, message } from "antd";
import { useAuth0 } from '@auth0/auth0-react';

const TableData = (props) => {
  const { user } = useAuth0();
  const [totalSum, setTotalSum] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [dataStatus, setDataStatus] = useState([]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [columns, setColumns] = useState({});

  const handleFilterChange = (value, selector) => {
    const newFilters = { ...columns, [selector]: value };
    setColumns(newFilters);
  };

  const newColumns = props.columns.map((column) => ({
    ...column,
    name: <div>{column.name}<ColumnFilter column={column} onFilter={handleFilterChange} /></div>,
  }));

  const applyFilters = (item, filterText, dateRange, columns) => {
    const containsFilterText = JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase());
    const dateInRange = !dateRange || (new Date(item.date_generate) >= dateRange[0] && new Date(item.date_generate) <= dateRange[1]);

    const columnFiltersPassed = Object.keys(columns).every(selector => {
      const filterValue = columns[selector];
      if (!filterValue) return true;

      const itemValue = item[selector];

      if (isNaN(filterValue)) {
        return itemValue.toLocaleString().toLowerCase().includes(filterValue.toLocaleString().toLowerCase());
      } else {
        return parseFloat(itemValue) >= parseFloat(filterValue);
      }
    });

    return containsFilterText && dateInRange && columnFiltersPassed;
  };

  const filteredItems = props.data.filter(item => applyFilters(item, filterText, dateRange, columns));

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText || dateRange) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
        setDateRange(null);
      }
    };

    const handleDateFilterChange = (dates) => {
      setDateRange(dates);
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        onDateFilterChange={handleDateFilterChange}
      />
    );
  }, [filterText, resetPaginationToggle, dateRange]);

  const updateMultipleStatus = () => {
    Modal.confirm({
      title: '¿Seguro que marcar como completos estos pedidos?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        message.info('unos momentos');
        props.setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?massiveStatus", {
          redirect: "follow",
          method: 'POST',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(dataStatus)
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
      },
    });
  };

  const handleSelectedRowsChange = (state) => {
    let sum = state.selectedRows.reduce((acc, object) => acc + (object.total === "" ? 0 : parseFloat(object.total)), 0);
    setTotalSum(sum.toLocaleString("es-ES", { style: "currency", currency: "COP" }));
  };

  const handleSelectedRowsStatus = (state) => {
    let data = state.selectedRows.filter(object => object.condition === "COBRAR").map(object => [object.order_id, object.total, user.email]);
    setDisabledButton(data.length < 2);
    setDataStatus(data);
  };

  const selectedRows = (state) => {
    handleSelectedRowsChange(state);
    handleSelectedRowsStatus(state);
  };

  return (
    <>
      <h4>
        Total sumado: $
        <p style={{ display: "inline-block" }}>{totalSum}</p>
        <br />
        <Button
          type="primary"
          style={{ backgroundColor: "green", margin: "10px" }}
          onClick={() => { updateMultipleStatus() }}
          disabled={disabledButton}>
          Corroborar masivo
        </Button>
      </h4>

      <DataTable
        title="Últimas vueltas"
        columns={newColumns}
        data={filteredItems}
        pagination
        selectableRows
        onSelectedRowsChange={selectedRows}
        striped
        subHeader
        subHeaderComponent={subHeaderComponent}
        responsive
        fixedHeaderScrollHeight="300px"
      />
    </>
  );
};

export default TableData;
