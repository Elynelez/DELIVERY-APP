import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd"
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";

const SellerCar = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [reloadData, setReloadData] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const loadData = () => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec")
      .then(response => response.json())
      .then(parsedData => {
        let dataO = parsedData.map(product => {
          product.carQuantity = 1
          return product
        });
        setData(dataO);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (reloadData) {
      loadData();
      setReloadData(false);
    }
  }, [reloadData]);

  useEffect(() => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec")
      .then(response => response.json())
      .then(parsedData => {
        let dataO = parsedData.map(product => {
          product.carQuantity = 1
          return product
        });
        setData(dataO);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const onAddProduct = (product) => {

    if(props.allProducts.find(item => item.code === product.code)){
      
      const products = props.allProducts.map(item => item.code === product.code 
        ? {...item, carQuantity: item.carQuantity + 1}
        : item
      )
      props.setTotal(props.total + (parseFloat(product.sale_price.replace(/[\$,]/g, ''))*1000) * product.carQuantity);
      props.setCountProducts(props.countProducts + product.carQuantity)
      return props.setAllProducts([...products])
    }

    props.setTotal(props.total + (parseFloat(product.sale_price.replace(/[\$,]/g, ''))*1000) * product.carQuantity)
    props.setCountProducts(props.countProducts + product.carQuantity)
    props.setAllProducts([...props.allProducts, product])
  }

  return (
    <div className="container py-5">

      {loading ? (
        <div className="text-center">
          <Spin tip="Cargando datos..." />
        </div>
      ) : (
        <div className='container-items'>
          {data.slice(1, 10).map(product => (
            <div className='item' key={product.code}>
              <figure>
                <img src={product.image} alt={product.name} />
              </figure>
              <div className='info-product' style={{backgroundColor: colors.primary[400]}}>
                <h2>{product.name}</h2>
                <p className='price'>{product.sale_price}</p>
                <Button type="primary" onClick={() => {onAddProduct(product)}}>
                  Añadir al carrito
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerCar;