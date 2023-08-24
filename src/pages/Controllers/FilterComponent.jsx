import React from "react";
import { Input, Button, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const FilterComponent = ({ onFilter, onClear, onDateFilterChange }) => (
  <>
    <Input
      style={{ width: "50%" }}
      id="search"
      type="text"
      placeholder="Filtrar datos"
      onChange={onFilter}
    />
    <Button onClick={onClear}>X</Button>
    <RangePicker style={{ marginLeft: "20px" }} onChange={onDateFilterChange} />
  </>
);

export default FilterComponent;