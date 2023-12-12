import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message } from "antd"

const CreateProduct = () => {
    const [list, setList] = useState([1])
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const labelChangeProps = (tag) => {
        var label = tag.parentNode.querySelector("label")
        if (tag.value.trim() !== "") {
            label.style.top = "10px"
            label.style.fontSize = "10px"
        } else {
            label.style.top = "30px"
            label.style.fontSize = "15px"
        }
    }

    function deleteElement(index) {
        var newList = list.filter(num => num !== index)
        setList(newList)
    }

    const addRows = () => {
        setList(prevList => [...prevList, list.length === 0 ? 1 : Math.floor(Math.random() * 1000000)])
    }

    useEffect(() => {

    }, [list])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let skus = document.querySelectorAll("#sku")
        let names = document.querySelectorAll("#name")
        let brand = document.getElementById("brand")
        let category = document.getElementById("category")
        let cost = document.getElementById("cost")
        let salePrice = document.getElementById("sale_price")

        let allValues = Array.from(skus).map((sku, index) => {

            return ["", '["' + sku.value.toString() + '"]', names[index].value, "", cost.value, salePrice.value, brand.value, category.value, ""]
        })

        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?create", {
            redirect: "follow",
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(allValues)
        })
            .then(response => response.json())
            .then(data => {
                message.success('cargado exitosamente')
                setList([1])
                setLoading(false);
            })
            .catch(error => {
                console.error('Error changing row:', error);
                message.info('no se pudo completar la operación')
            });
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="body-create">
                    <div className="container-create" style={{ backgroundColor: colors.primary[400] }}>
                        <div className="button-add-create" style={{ backgroundColor: colors.primary[400] }}>
                            <Button type="primary" onClick={addRows}>AGREGAR</Button>
                        </div>
                        <h1 className="form-title-create"><span>CREACIÓN DE PRODUCTOS</span></h1>
                        <form onSubmit={handleSubmit}>
                            <div className="main-user-info-create">
                                <div className="user-input-box-create">
                                    <div className="end-input-group-create">
                                        <div className="input-group-create">
                                            <label htmlFor="brand" className="form-label-create">Marca de los productos</label>
                                            <input className="input-info-create" type="text" id="brand" name="brand" onInput={(event) => { labelChangeProps(event.target) }} required />
                                        </div>
                                        <div className="input-group-create">
                                            <label htmlFor="category" className="form-label-create">Categoría</label>
                                            <input className="input-info-create" type="text" id="category" name="category" onInput={(event) => { labelChangeProps(event.target) }} required />
                                        </div>
                                    </div>
                                    <h4>Productos</h4>
                                    <div className="limit-group-create">
                                        {list.map(num => (
                                            <div className="input-group-limit-create" id={num}>
                                                <div className="input-group-create">
                                                    <label htmlFor="sku" className="form-label-create">Sku del producto</label>
                                                    <input className="input-info-create" id="sku" name="sku" onInput={(event) => { labelChangeProps(event.target) }} required />
                                                </div>
                                                <div className="input-group-create">
                                                    <label htmlFor="name" className="form-label-create">Cantidad</label>
                                                    <input className="input-info-create" type="number" min="1" max="999" id="name" name="name" onInput={(event) => { labelChangeProps(event.target) }} required />
                                                </div>
                                                <div className="input-group-create">
                                                    <label htmlFor="cost" className="form-label-create">Costo</label>
                                                    <input className="input-info-create" type="number" id="cost" name="cost" onInput={(event) => { labelChangeProps(event.target) }} required />
                                                </div>
                                                <div className="input-group-create">
                                                    <label htmlFor="sale_price" className="form-label-create">Precio venta</label>
                                                    <input className="input-info-create" type="number" id="sale_price" name="sale_price" onInput={(event) => { labelChangeProps(event.target) }} required />
                                                </div>
                                                <div className="icon-info-create" onClick={() => { deleteElement(num) }} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                        <path fill="white"
                                                            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="form-submit-btn-create">
                                <input type="submit" value="Enviar" />
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >

    )
}

export default CreateProduct