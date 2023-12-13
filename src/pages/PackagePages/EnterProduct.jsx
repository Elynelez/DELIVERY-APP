import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message } from "antd"

const EnterProduct = () =>{
    const { user } = useAuth0();
    const [list, setList] = useState([1])
    const [loading, setLoading] = useState(true)
    const [rangeItems, setRangeItems] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec")
            .then(response => response.json())
            .then(parsedData => {
                setRangeItems(parsedData)
                setLoading(false);
                console.log(parsedData)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const getTextFromDatalist = (inputElement) => {
        const dataListId = inputElement.getAttribute("list");
        const dataList = document.getElementById(dataListId);

        const selectedValue = inputElement.value;

        const option = Array.from(dataList.options).find(option => option.value === selectedValue);

        const text = option ? option.innerText : "";

        return { text: text, code: option.getAttribute("code") }
    }

    function validateInput(input) {
        var dataList = document.getElementById('productsList');

        var options = Array.from(dataList.options).map(option => option.value);

        if (!options.includes(input.value)) {
            alert('Por favor, selecciona un valor válido de la lista.');
            input.value = '';
        }
    }

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
        setList(prevList => [...prevList, list.length === 0? 1 : list.reverse()[0]+1])
    }

    useEffect(()=> {

    }, [list])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let skus = document.querySelectorAll("#sku")
        let quantity = document.querySelectorAll("#quantity")
        let factureNumber = document.getElementById("facture-number")
        let provider = document.getElementById("provider")

        let allValues = Array.from(skus).map((sku, index) => {

            const skuText = getTextFromDatalist(sku);

            return [factureNumber.value, provider.value, skuText.code, sku.value, skuText.text, quantity[index].value, "", user.email]
        })

        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?enter", {
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
                <div className="body-enter">
                    <div className="container-enter" style={{ backgroundColor: colors.primary[400] }}>
                        <div className="button-add-enter" style={{ backgroundColor: colors.primary[400] }}>
                            <Button type="primary" onClick={addRows}>AGREGAR</Button>
                        </div>
                        <h1 className="form-title-enter"><span>ENTRADA DE PRODUCTOS</span></h1>
                        <form onSubmit={handleSubmit}>
                            <div className="main-user-info-enter">
                                <div className="user-input-box-enter">
                                    <div className="end-input-group-enter">
                                        <div className="input-group-enter">
                                            <label htmlFor="facture-number" className="form-label-enter">Número del pedido</label>
                                            <input className="input-info-enter" type="text" id="facture-number" name="facture-number" onInput={(event) => { labelChangeProps(event.target) }} required />
                                        </div>
                                        <div className="input-group-enter">
                                            <label htmlFor="provider" className="form-label-enter">Proveedor</label>
                                            <input className="input-info-enter" type="text" id="provider" name="provider" onInput={(event) => { labelChangeProps(event.target) }} required />
                                        </div>
                                    </div>
                                    <h4>Productos</h4>
                                    <div className="limit-group-enter">
                                        {list.map(num => (
                                            <div className="input-group-limit-enter" id={num}>
                                                <div className="input-group-enter">
                                                    <label htmlFor="sku" className="form-label-enter">Sku del producto</label>
                                                    <input list="productsList" className="input-info-enter" id="sku" name="sku" onInput={(event) => { labelChangeProps(event.target) }} onBlur={(event) => { validateInput(event.target) }} required />
                                                    <datalist id="productsList">
                                                        {rangeItems.map(obj => (
                                                            <option value={obj.sku} code={obj.code}>{obj.name}</option>
                                                        ))}
                                                    </datalist>
                                                </div>
                                                <div className="input-group-enter">
                                                    <label htmlFor="quantity" className="form-label-enter">Cantidad</label>
                                                    <input className="input-info-enter" type="number" min="1" max="999" id="quantity" name="quantity" onInput={(event) => { labelChangeProps(event.target) }} required />
                                                </div>
                                                <div className="icon-info-enter" onClick={() => { deleteElement(num) }} >
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
                            <div className="form-submit-btn-enter">
                                <input type="submit" value="Enviar" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default EnterProduct
