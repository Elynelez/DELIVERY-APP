import React from "react";
import { Input, Button } from "antd";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <Input
      style={{width: "95%"}}
      id="search"
      type="text"
      placeholder="Filrar datos"
      value={filterText}
      onChange={onFilter}
    />
    <Button onClick={onClear}>X</Button>
  </>
);

export default FilterComponent;