import React, { useState, useEffect } from "react";
import { Button, Avatar, Input, Form, Spin } from "antd";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UserSettings = ({ isAuthenticated, user, logout, loginWithRedirect }) => {
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleLogout = () => {
        logout({ returnTo: window.location.origin });
    };

    useEffect(()=>{
        if(!isAuthenticated){
            loginWithRedirect()
        }
        setLoading(false)
    },[])

    return (
        <div className="container mx-auto py-5 px-4">
            {loading ? (
                <div className="flex justify-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <>
                    <div className="container mx-auto py-5 px-4">
                        <div
                            className="max-w-md mx-auto rounded-xl shadow-md p-6"
                            style={{ backgroundColor: colors.primary[400] }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar src={user.picture} size={64} />
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-500">{user.name}</h2>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <Form layout="vertical">
                                <Form.Item
                                    label={<label style={{ color: colors.primary[100] }}>Nombre Completo</label>}
                                    name="name"
                                >
                                    <Input
                                        style={{ color: colors.primary[100], borderBottom: "1px solid gray", marginLeft: "10px" }}
                                        defaultValue={user.name}
                                        disabled
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<label style={{ color: colors.primary[100] }}>Correo electrónico</label>}
                                    name="email"
                                >
                                    <Input
                                        style={{ color: colors.primary[100], borderBottom: "1px solid gray", marginLeft: "10px" }}
                                        defaultValue={user.email}
                                        disabled
                                    />
                                </Form.Item>
                                <Button type="primary" danger onClick={handleLogout}>
                                    Cerrar sesión
                                </Button>
                            </Form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserSettings;
