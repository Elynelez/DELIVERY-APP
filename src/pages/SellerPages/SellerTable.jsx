import React, { useState, useEffect } from "react";
import { Button, Spin, Form } from "antd"
import { tokens } from "../../theme";
import { Box, useTheme, Typography } from "@mui/material";
import DataTableGrid from "../../controllers/Tables/DataGridPro";

const SellerTable = ({ allProducts, setAllProducts, total, setTotal, countProducts, setCountProducts, rangeItems, setRangeItems }) => {
  const [loading, setLoading] = useState(true)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setRangeItems(rangeItems.map(obj => {
      return {
        ...obj,
        carQuantity: 1
      }
    }));
    setLoading(false)
  }, [rangeItems])

  const onAddProduct = (product) => {

    if (allProducts.find(item => item.code === product.code)) {

      const products = allProducts.map(item => item.code === product.code
        ? { ...item, carQuantity: item.carQuantity + 1 }
        : item
      )
      setTotal(total + (parseFloat(product.sale_price)) * product.carQuantity);
      setCountProducts(countProducts + product.carQuantity)
      return setAllProducts([...products])
    }

    setTotal(total + (parseFloat(product.sale_price)) * product.carQuantity)
    setCountProducts(countProducts + product.carQuantity)
    setAllProducts([...allProducts, product])
  }

  const columns = [
    {
      headerName: 'Imagen', field: 'image', flex: 1, renderCell: (params) => (
        <img src={params.row.image} />
      )
    },
    { headerName: 'Sku', field: "sku", flex: 1 },
    { headerName: 'Nombre', field: "name", flex: 2 },
    { headerName: 'Cantidad', field: "quantity", flex: 0.5 },
    { headerName: 'Marca', field: "brand", flex: 1 },
    { headerName: 'Precio', field: "sale_price", flex: 1 },
    {
      headerName: 'Acciones', renderCell: params => (
        <Button
          className="bg-green-500 hover:bg-green-600 text-white"
        onClick={() => onAddProduct(params.row)}
        >
          Añadir
        </Button>
      )
    }
  ];

  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center">
          <Spin tip="Cargando datos..." />
        </div>
      ) : (
        <Box m="20px">
          <Box mb="30px">
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "0 0 5px 0" }}
            >
              TABLA DE PRODUCTOS
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              últimos detalles
            </Typography>
          </Box>
          <DataTableGrid
            key={rangeItems.length}
            data={rangeItems.map((obj, index) => {
              obj.id = index
              return obj
            })}
            columns={columns}
            setReloadData={setRangeItems}
          />
        </Box>
      )}
    </div>
  );
};

export default SellerTable;