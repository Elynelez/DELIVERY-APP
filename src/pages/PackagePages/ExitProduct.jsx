import React, { useState, useEffect } from "react";
import { tokens } from "./../../theme";
import { useTheme } from "@mui/material";
import { Button, Spin, message } from "antd"
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

const ExitProduct = () => {
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

        const idExit = v4()
        let skus = document.querySelectorAll("#sku")
        let quantity = document.querySelectorAll("#quantity")
        let factureNumber = document.getElementById("facture-number")
        let platform = document.getElementById("platform")

        let allValues = Array.from(skus).map((sku, index) => {

            const skuText = getTextFromDatalist(sku);

            return [factureNumber.value, platform.value, skuText.code, sku.value, skuText.text, quantity[index].value, "", user.email, idExit]
        })

        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?exit", {
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
                <div className="body-exit">
                    <div className="container-exit" style={{ backgroundColor: colors.primary[400] }}>
                        <div className="button-add-exit" style={{ backgroundColor: colors.primary[400] }}>
                            <Button type="primary" onClick={addRows}>AGREGAR</Button>
                        </div>
                        <h1 className="form-title-exit"><span>SALIDA DE PRODUCTOS</span></h1>
                        <form onSubmit={handleSubmit}>
                            <div className="main-user-info-exit">
                                <div className="user-input-box-exit">
                                    <div className="end-input-group-exit">
                                        <div className="input-group-exit">
                                            <label htmlFor="facture-number" className="form-label-exit">Número del pedido</label>
                                            <input className="input-info-exit" type="text" id="facture-number" name="facture-number" onInput={(event) => { labelChangeProps(event.target) }} required />
                                        </div>
                                        <div className="input-group-exit" style={{visibility: "hidden"}}>
                                            <label htmlFor="platform" className="form-label-exit" >Plataforma</label>
                                            <input className="input-info-exit" type="text" id="platform" name="platform" value="POR CONFIRMAR" onInput={(event) => { labelChangeProps(event.target) }} required />
                                        </div>
                                    </div>
                                    <h4>Productos</h4>
                                    <div className="limit-group-exit">
                                        {list.map(num => (
                                            <div className="input-group-limit-exit" id={num}>
                                                <div className="input-group-exit">
                                                    <label htmlFor="sku" className="form-label-exit">Sku del producto</label>
                                                    <input list="productsList" className="input-info-exit" id="sku" name="sku" onInput={(event) => { labelChangeProps(event.target) }} onBlur={(event) => { validateInput(event.target) }} required />
                                                    <datalist id="productsList">
                                                        {rangeItems.map(obj => (
                                                            <option value={obj.sku} code={obj.code}>{obj.name}</option>
                                                        ))}
                                                    </datalist>
                                                </div>
                                                <div className="input-group-exit">
                                                    <label htmlFor="quantity" className="form-label-exit">Cantidad</label>
                                                    <input className="input-info-exit" type="number" min="1" max="999" id="quantity" name="quantity" onInput={(event) => { labelChangeProps(event.target) }} required />
                                                </div>
                                                <div className="icon-info-exit" onClick={() => { deleteElement(num) }} >
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
                            <div className="form-submit-btn-exit">
                                <input type="submit" value="Enviar" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default ExitProduct