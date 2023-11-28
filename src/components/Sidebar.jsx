import { React, useState } from "react";
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme.js";
import { ProSidebar, Menu as SidebarMenu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Inventory from "@mui/icons-material/Inventory";
import Games from "@mui/icons-material/Games";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Inventory } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isAuthenticated, user } = useAuth0();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <SidebarMenu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    ADM
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={user ? user.picture : "https://w7.pngwing.com/pngs/627/693/png-transparent-computer-icons-user-user-icon-thumbnail.png"}
                                    style={{ cursor: "pointer", borderRadius: "50%" }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {user ? user.name : "invitado"}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    Cargo
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {isAuthenticated && props.logisticEmails.includes(user.email) && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >
                                    Canales
                                </Typography>
                                <Item
                                    title="Delivery"
                                    to="/DeliveryApp"
                                    icon={<ContactsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="External Service"
                                    to="/ExternalServiceApp"
                                    icon={<ContactsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        {isAuthenticated && (props.bossEmails.includes(user.email) || props.logisticEmails.includes(user.email)) && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >
                                    Tablas
                                </Typography>
                                <SubMenu title="coursiers" icon={<PeopleOutlinedIcon />}>
                                    {props.couriers.map((coursier) => (
                                        <Item
                                            title={coursier}
                                            to={`/coursiers/${coursier}`}
                                            icon={<PersonOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                        />
                                    ))}
                                    <Item
                                        title="Servicio Externo"
                                        to={`/coursiers/ExternalService`}
                                        icon={<PersonOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                </SubMenu>
                                <Item
                                    title="Todos"
                                    to="/AllOrders"
                                    icon={<ReceiptOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        {isAuthenticated && user.email.includes("linap") && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >
                                    Interrapidísimo
                                </Typography>
                                <Item
                                    title="Servicio Externo"
                                    to="/coursiers/ExternalService"
                                    icon={<PersonOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        {isAuthenticated && props.sellerEmails.includes(user.email) && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >
                                    Ventas
                                </Typography>
                                <Item
                                    title="Mis ventas"
                                    to="/Sales"
                                    icon={<CalendarTodayOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        {isAuthenticated && props.exitsInventoryEmails.includes(user.email) && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >
                                    Salidas
                                </Typography>
                                <Item
                                    title="Formualrio de Salidas"
                                    to="/inventory/exit"
                                    icon={<Inventory />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Formulario RB"
                                    to="/inventory/cash"
                                    icon={<Games />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}
                    </Box>
                </SidebarMenu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;