import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { Button, Modal, message } from "antd";
// auth
import { useAuth0 } from '@auth0/auth0-react';

const emailSecondly = ["contableducor@gmail.com", "pedidos.ducor@gmail.com", "inducorsas@gmail.com"]

const TableData = (props) => {
  const { user } = useAuth0();
  const [totalSum, setTotalSum] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [dataStatus, setDataStatus] = useState([])
  const [disabledButton, setDisabledButton] = useState(false)

  const filteredItems = props.data.filter((item) => {
    const containsFilterText =
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1;

    const dateInRange = (date) =>
      !dateRange || (date >= dateRange[0] && date <= dateRange[1]);

    const itemDate = new Date(item.date_generate);

    return containsFilterText && dateInRange(itemDate);
  });

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

  const handleSelectedRowsChange = (state) => {
    let sum = state.selectedRows.reduce(
      (acc, object) =>
        acc + (object.total === "" ? 0 : parseFloat(object.total)),
      0
    );
    setTotalSum(
      sum.toLocaleString("es-ES", { style: "currency", currency: "COP" })
    );
  };

  const handleSelectedRowsStatus = (state) => {
    let data = state.selectedRows.filter(object => object.condition === "COBRAR")
      .map(object => [object.order_id, object.total]);

    if (data.length < 2) {
      setDisabledButton(true)
    } else {
      setDisabledButton(false)
    }

    setDataStatus(data)
  }

  const updateMultipleStatus = () => {
    Modal.confirm({
      title: '¿Seguro que marcar como completos estos pedidos?',
      content: 'Esta acción no se puede deshacer.',
      onOk: () => {
        console.log(dataStatus)
        message.info('unos momentos')
        props.setLoading(true)
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
            console.log(data)
            props.setReloadData(true)
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            message.info('no se pudo completar la operación')
          });
      },
    });

  }

  const selectedRows = (state) => {
    handleSelectedRowsChange(state)
    handleSelectedRowsStatus(state)
  }

  return (
    <>
      <h4>
        Total sumado: $
        <p style={{ display: "inline-block" }}>{totalSum}</p>
        <br />
        {user && emailSecondly.includes(user.email)(
          <Button
            type="primary"
            style={{ backgroundColor: "green", margin: "10px" }}
            onClick={() => { updateMultipleStatus() }}
            disabled={disabledButton}>
            Corroborar masivo
          </Button>
        )}

      </h4>
      <DataTable
        title="últimas vueltas"
        columns={props.columns}
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