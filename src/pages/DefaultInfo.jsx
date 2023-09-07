import React, { useState } from "react";
import { Spin, Radio, Input, Button } from "antd";

const DefaultInfo = () => {
    const [loading, setLoading] = useState(true)

    setTimeout(() => {
        setLoading(false)
    }, 8000)

    const handleConsultar = () => {
        console.log("ok")
    }

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
                        />

                        <label id="lblEstado" style={{ display: 'none' }}></label>

                        <div className="d-flex justify-content-center">
                            <Button type="primary" onClick={handleConsultar}>
                                Consultar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DefaultInfo