import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Spin } from "antd";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const ProductDetail = ({ ordersData, setOrdersData, allProducts, setAllProducts, total, setTotal, countProducts, setCountProducts, rangeItems }) => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            const filtered = rangeItems
                .map(obj => ({
                    ...obj,
                    sale_price: obj.sale_price !== "" ? Number(obj.sale_price) : 0,
                    carQuantity: 1,
                }))
                .filter(obj =>
                    obj.name.toLowerCase().includes(search.toLowerCase()) ||
                    obj.sku.includes(search)
                );

            setOrdersData(filtered.slice(0, 6));
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [rangeItems, search]);

    const onAddProduct = (product) => {
        if (allProducts.find(item => item.code === product.code)) {
            const updatedProducts = allProducts.map(item =>
                item.code === product.code
                    ? { ...item, carQuantity: item.carQuantity + 1 }
                    : item
            );
            setTotal(total + product.sale_price * product.carQuantity);
            setCountProducts(countProducts + product.carQuantity);
            return setAllProducts(updatedProducts);
        }

        setTotal(total + product.sale_price * product.carQuantity);
        setCountProducts(countProducts + product.carQuantity);
        setAllProducts([...allProducts, product]);
    };

    return (
        <div className="container mx-auto py-5 px-4">
            {loading ? (
                <div className="flex justify-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {ordersData.map(product => (
                            <div
                                key={product.code}
                                className="rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                                style={{ backgroundColor: colors.primary[400] }}
                            >
                                <figure className="overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-52 object-cover transform hover:scale-110 transition duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://png.pngtree.com/png-vector/20220520/ourmid/pngtree-shampoo-bottle-mockup-mock-up-png-image_4623289.png";
                                            e.target.style.filter = colors.black[200]
                                        }}
                                    />
                                </figure>
                                <div className="p-4 flex flex-col justify-between h-48">
                                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h2>
                                    <p className="text-xl font-bold mb-4">${product.sale_price.toFixed(2)}</p>
                                    <Button
                                        type="primary"
                                        className="bg-blue-600"
                                        onClick={() => onAddProduct(product)}
                                    >
                                        Añadir al carrito
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {ordersData.length === 0 && !loading && (
                        <div className="text-center text-gray-500 text-lg mt-8">
                            Sin resultados
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductDetail;
