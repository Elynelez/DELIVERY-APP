import React from "react";
import { Input } from "antd";

const ColumnFilter = ({ column, onFilter }) => {
  const handleFilterChange = (e) => {
    const value = e.target.value;
    onFilter(value, column.selector);
  };

  return (
    <Input
      style={{ width: "100%" }}
      placeholder={`Filter ${column.name}`}
      onChange={handleFilterChange}
    />
  );
};

export default ColumnFilter;

