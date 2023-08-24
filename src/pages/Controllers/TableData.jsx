import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";

const TableData = (props) => {
  const [totalSum, setTotalSum] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

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

  return (
    <>
      <h4>
        Total sumado: $
        <p style={{ display: "inline-block" }}>{totalSum}</p>
      </h4>
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