import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd"
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuth0 } from '@auth0/auth0-react';

const RBExitProduct = () => {
    const { user } = useAuth0();
    const [loading, setLoading] = useState(true)
    const [allValues, setAllValues] = useState([]);
    const [rangeItems, setRangeItems] = useState([]);
    const packers = ["ANYELO", "TATIANA", "KILIAN", "INDUCOR", "NICOLAS", "PILAR", "tatiana", "pilar"];

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

    const ExitElements = () => {
        Swal.fire({
            title: "Ya van " + allValues.length + " elementos",
            input: "text",
            inputPlaceholder: "Ingresa el siguiente SKU",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputValidator: (value) => {
                if (!value) {
                    return "Debes ingresar un SKU válido";
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let valor = result.value;

                const objectValues = {};
                for (const sku of allValues) {
                    if (objectValues[sku]) {
                        objectValues[sku]++;
                    } else {
                        objectValues[sku] = 1;
                    }
                }

                if (valor === null || valor.trim() === "" || packers.includes(valor)) {
                    var allValuesInputs = Object.entries(objectValues).map((groupSKU, index) => {
                        return `
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td scope="row">
                                <input class="swal2-input input-sweet-table-main" value="${groupSKU[0]}" id="skuInput">
                            </td>
                            <td scope="row">
                                <input class="swal2-input input-sweet-table" type="number" value="${groupSKU[1]}" id="quantityInput">
                            </td>
                            <td scope="row">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" cursor="pointer" class="delete-button">
                                    <path fill="gray" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                </svg>
                            </td>
                        </tr>`;
                    });

                    Swal.fire({
                        title: 'RESUMEN DE LA OPERACIÓN',
                        html: `
                        <div id="page" style="max-height: 200px; overflow-y: auto;">
                            <div>
                              <label class="form-label">Número del pedido</label>
                              <br>
                              <input class="swal2-input input-sweet-table-main" id="factureNumber" required>
                            </div>
                            <br>
                            <div>
                              <label class="form-label">Plataforma de entrega</label>
                              <br>
                              <input class="swal2-input input-sweet-table-main" id="platform" required>
                            </div>
                            <table style="width: 100%">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">EAN</th>
                                        <th scope="col">Cant.</th>
                                        <th scope="col">Elm.</th>
                                    </tr>
                                </thead>
                                <tbody>`
                            +
                            allValuesInputs.join("")
                            +
                            `</tbody>
                            </table>
                        </div>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Enviar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {

                            const skuInputs = document.querySelectorAll("#skuInput");
                            const quantityInputs = document.querySelectorAll("#quantityInput");
                            const factureNumber = document.getElementById("factureNumber")
                            const platform = document.getElementById("platform")

                            const valuesFinal = Array.from(skuInputs).map(input => input.value)

                            const rangeSkus = rangeItems.map(objectValue => {
                                return objectValue.sku
                            })

                            const notExistentSkus = valuesFinal.filter(sku => !rangeSkus.includes(sku));

                            const filterSKUS = rangeItems.filter(object => valuesFinal.includes(object.sku));

                            const sentValues = filterSKUS.map((obj, index) => {
                                return [factureNumber.value, platform.value, obj.code, obj.sku, obj.name, quantityInputs[index].value, "", user.email]
                            })

                            if (notExistentSkus.length > 0) {
                                console.log(rangeSkus)
                                Swal.showValidationMessage("Estos códigos no existen: " + notExistentSkus.toString());
                                return false;
                            }

                            if (valuesFinal.length < 1 || platform.value.trim() == "" || factureNumber.value.trim() == "") {
                                Swal.showValidationMessage("no seas tonto bro, ¿Cómo vas a enviar algo vacío 🙄?");
                                return false;
                            }
                            
                            setLoading(true);    
                            fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?exit", {
                                redirect: "follow",
                                method: 'POST',
                                headers: {
                                    "Content-Type": "text/plain;charset=utf-8",
                                },
                                body: JSON.stringify(sentValues)
                            })
                                .then(response => response.json())
                                .then(data => {
                                    setLoading(false); 
                                })
                                .catch(error => {
                                    console.error('Error changing row:', error);
                                });
                            setAllValues([]);
                        },
                    });

                    document.querySelectorAll('.delete-button').forEach(button => {
                        button.addEventListener('click', (event) => {
                            event.target.parentNode.parentNode.parentNode.remove()
                        });
                    });

                } else {
                    allValues.push(valor);
                    // const newText = document.querySelector(".container");
                    // newText.innerText = allValues.join(", ");
                    ExitElements(valor);
                }
            } else {

                setAllValues([])
            }
        });
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="container-main-RB">
                    <div className="container-RBTable">
                    </div>
                    <Button type="primary" onClick={ExitElements}>
                        Repetir operación
                    </Button>
                </div>
            )}
        </div>
    );
}

export default RBExitProduct