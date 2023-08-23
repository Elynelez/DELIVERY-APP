import React, { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import FilterComponent from "./FilterComponent";

const TableData = (props) => {
  const [totalSum, setTotalSum] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = props.data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleSelectedRowsChange = (state) => {
    let sum = state.selectedRows.reduce((acc, object) => acc + (object.total === "" ? 0 : parseFloat(object.total)), 0);
    setTotalSum(sum.toLocaleString('es-ES', { style: 'currency', currency: 'COP' }))
  };

  return (
    <> 
      <h4>Total sumado: $<p style={{display: "inline-block"}}>{totalSum}</p></h4>
      <DataTable
        title="últimas vueltas"
        columns={props.columns}
        data={filteredItems}
        pagination
        selectableRows
        onSelectedRowsChange={handleSelectedRowsChange}
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