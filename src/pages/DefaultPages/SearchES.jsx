import React, { useState, useEffect } from "react";
import { Form, Spin, Radio, Input, Button } from "antd";
import { useTheme } from "@mui/material";
import { tokens } from "./../../theme";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const SearchES = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState([]);
    const [firstRender, setFirstRender] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbyu_G-OoCPMs9dVJuSNbE7Wc-jtDSGK2-RyrLO-IGTAYZxMf6BYfm8vGn6Wul0ADiXvDg/exec?guide=" + searchValue)
            .then(response => response.json())
            .then(data => {
                if (firstRender) {
                    setFirstRender(false);
                    setLoading(false)
                    return;
                } else {
                    if (data.length > 0 && data[0].notation.length >= 1) {
                        var messageResult = data[0].notation.map( not => {return not.notation})
                        Swal.fire({
                            icon: 'success',
                            title: 'Aquí estan las observaciones',
                            text: messageResult.join(", "),
                        });
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Pedido no registrado',
                            text: "tu pedido no ha salido por la inter u otra plataforma",
                        });
                    }
                    setLoading(false)
                }
            })
            .catch(error => {
                console.error('Error changing row:', error);
                setLoading(false)
            });
    }, [searchValue]);


    const onFinish = (values) => {
        setSearchValue(values.order)
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
                        <img src="https://cdn-icons-png.flaticon.com/512/44/44266.png" width={'150px'} alt="logo" style={{ filter: colors.black[200] }} />
                        <h1 className="h1classRastreoEnvio">Rastrea la ubicación de tu envío</h1>

                        <Form form={form} onFinish={onFinish} layout="vertical">

                            {/* <Radio.Group defaultValue="g" className="mb-3">
                                <Radio value="g">Interrapidísmo</Radio>
                                <Radio value="r">Remisión</Radio>
                                <Radio value="f">Factura</Radio>
                            </Radio.Group> */}

                            <Form.Item
                                name="order"
                                labelAlign="left"
                            >
                                <Input
                                    placeholder="Número de Guía (Ej: 12345678911)"
                                    id="txtNumGuia"
                                    step="1"
                                    min="1"
                                    maxLength="15"
                                    className="mb-3"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" className="btn btn-primary m-2">Enviar</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchES