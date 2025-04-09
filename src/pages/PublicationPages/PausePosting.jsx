import React, { useState } from "react";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Spin, message, Form, Select } from "antd"
import axios from "axios";

const PausePosting = ({ URL_SERVER, rangeItems }) => {
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [form] = Form.useForm();

    const onFinish = (e) => {

        setLoading(true)

        axios.post(`${URL_SERVER}/database/publication/pause`, e)
            .then(resp => {
              message.success(resp.data.message);
              form.resetFields();
            })
            .catch(error => {
              message.error("error en el servidor");
            }).finally(() => {
              setLoading(false)
            });
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="body-group-form">
                    <div className="container-group-form" style={{ backgroundColor: colors.primary[400] }}>
                        <h1 className="form-title-group" style={{ color: "#055160" }}><span>PAUSAR PRODUCTO</span></h1>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                            <div className="main-user-info-group">
                                <div className="user-input-box-group">
                                    <div className="end-input-group-form">
                                        <div className="input-group-form">
                                            <Form.Item
                                                label={<label style={{ color: "#055160" }}>Sku</label>}
                                                name={"sku"}
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    className="input-info-form"
                                                    style={{ borderBottom: "1px solid #055160" }}
                                                    showSearch={true}
                                                    placeholder="Select a product"
                                                >
                                                    {rangeItems.map(obj => (
                                                        <Select.Option value={obj.sku} code={obj.code}>{obj.name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Form.Item>
                                <input type="submit" className="form-submit-btn" style={{ backgroundColor: "#055160" }} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </div>

    )
};

export default PausePosting;