import React, { useState } from "react";
import { Spin, message, Form, Input } from "antd"
import { redirect } from "react-router-dom";

const PausePosting = () => {
    const [form] = Form.useForm();
    const [responseMessage, setResponseMessage] = useState("");

    const onFinish = async (e) => {
        console.log(e)

        const options = {
            redirect: 'follow',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sku: e.code }),
        };

        try {
            const response = await fetch(
                "https://apibd-88x1.onrender.com/v2/pausar",
                options
            );
            const data = await response.json();

            console.log(data)// Supone que el servidor responde con JSON
            setResponseMessage(`Servidor: ${JSON.stringify(data)}`);
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
            setResponseMessage("Error al conectar con el servidor.");
        }
    };

    return (
        <div>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label={<label style={{ color: "#055160" }}>MCO number</label>}
                    name="code"
                    labelAlign="left"
                    rules={[{ required: true }]}
                >
                    <Input className="input-info-form" style={{ borderBottom: "1px solid #055160" }} />
                </Form.Item>
                <Form.Item>
                    <input type="submit" style={{ backgroundColor: "#055160" }} />
                </Form.Item>
            </Form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default PausePosting;