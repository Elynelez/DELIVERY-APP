import React, { useState } from "react";
import { Spin, Radio, Input, Button } from "antd";
import { Alert } from "reactstrap";

const SearchES = () => {
    const [loading, setLoading] = useState(true)
    const [searchValue, setSearchValue] = useState("");

    setTimeout(() => {
        setLoading(false)
    }, 3000)

    const handleSearch = () => {
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?guide="+searchValue)
          .then(response => response.json())
          .then(data => {
            console.log(data[0].notation);
            if(data[0].notation.length >= 1){
                alert(data[0].notation[0].notation)
            } else {
                alert("pedido sin novedades")
            }
          })
          .catch(error => {
            console.error('Error changing row:', error);
          });
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <div>
            {loading ? (
                <Spin tip="Cargando datos..." >
                    <div style={{ height: '300px' }} />
                </Spin >
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                    <div className="bg_buscador_rast text-center p-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/44/44266.png" width={'150px'} alt="logo"/>
                        <h1 className="h1classRastreoEnvio">Rastrea la ubicación de tu envío</h1>

                        <Radio.Group defaultValue="g" className="mb-3">
                            <Radio value="g">Guía</Radio>
                            <Radio value="r">Remisión</Radio>
                            <Radio value="f">Factura</Radio>
                        </Radio.Group>

                        <Input
                            placeholder="Número de Guía (Ej: 12345678911)"
                            id="txtNumGuia"
                            step="1"
                            min="1"
                            maxLength="15"
                            className="mb-3"
                            value={searchValue}
                            onChange={handleInputChange}
                        />

                        <label id="lblEstado" style={{ display: 'none' }}></label>

                        <div className="d-flex justify-content-center">
                            <Button type="primary" onClick={handleSearch}>
                                Consultar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchES