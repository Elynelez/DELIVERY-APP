import React, { useState, useEffect } from "react";
import { Button, Spin, Form, Input } from "antd"
import { tokens } from "./../../theme";
import { Box, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SellerCar = ({ allProducts, setAllProducts, total, setTotal, countProducts, setCountProducts, rangeItems }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setData(rangeItems.slice(0, 6));
  }, [rangeItems])

  const searchProduct = (e) => {
    setLoading(true)
    let filteredData = rangeItems.filter(obj => obj.name.toLowerCase().includes(e.search) || obj.sku.includes(e.search))
    console.log(filteredData)
    setData(filteredData)
    setLoading(false)
  }

  const onAddProduct = (product) => {

    if (allProducts.find(item => item.code === product.code)) {

      const products = allProducts.map(item => item.code === product.code
        ? { ...item, carQuantity: item.carQuantity + 1 }
        : item
      )
      setTotal(total + (parseFloat(product.sale_price.replace(/[\$,]/g, '')) * 1000) * product.carQuantity);
      setCountProducts(countProducts + product.carQuantity)
      return setAllProducts([...products])
    }

    setTotal(total + (parseFloat(product.sale_price.replace(/[\$,]/g, '')) * 1000) * product.carQuantity)
    setCountProducts(countProducts + product.carQuantity)
    setAllProducts([...allProducts, product])
  }

  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center">
          <Spin tip="Cargando datos..." />
        </div>
      ) : (
        <>
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            alignItems="center"
          >
            <Form form={form} onFinish={searchProduct} layout="horizontal" style={{ display: "flex", flexDirection: "row"}}>
              <Form.Item
                name="search"
                labelAlign="left"
                rules={[{ required: true }]}
                style={{width: 600+"px"}}
              >
                <Input
                  style={{ backgroundColor: "transparent", border: "none", color: colors.grey[100] }}
                />
              </Form.Item>
              <button type="submit" style={{ backgroundColor: "transparent", border: "none", color: colors.grey[100] }}>
                <SearchIcon />
              </button>
            </Form>
          </Box>
          <br />
          <div className='container-items'>
            {data.map(product => (
              <div className='item' key={product.code}>
                {/* <figure>
                <img src={product.image} alt={product.name} />
              </figure> */}
                <div className='info-product' style={{ backgroundColor: colors.primary[400] }}>
                  <h2>{product.name}</h2>
                  <p className='price'>{product.sale_price}</p>
                  <Button type="primary" onClick={() => { onAddProduct(product) }}>
                    Añadir al carrito
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SellerCar;