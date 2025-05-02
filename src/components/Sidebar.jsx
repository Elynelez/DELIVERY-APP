import { React, useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { ProSidebar, Menu as SidebarMenu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme.js";
import {
    Work,
    AddBusiness,
    AddchartSharp,
    Dashboard,
    LocalShipping,
    TableView,
    AddCircle,
    Poll,
    PendingActions,
    CurrencyExchangeOutlined as CurrencyExchangeOutlinedIcon,
    HomeOutlined as HomeOutlinedIcon,
    PeopleOutlined as PeopleOutlinedIcon,
    ContactsOutlined as ContactsOutlinedIcon,
    PersonOutlined as PersonOutlinedIcon,
    MenuOutlined as MenuOutlinedIcon,
    CalendarToday,
    Inventory,
    Games,
    RadioButtonChecked,
    PauseCircleFilledOutlined,
    DynamicFeedOutlined
} from "@mui/icons-material/"
import "react-pro-sidebar/dist/css/styles.css";
import { getCoursiers } from "../middlewares.js";

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

const Sidebar = ({ isAuthenticated, user, permissions, URL_SERVER }) => {
    const [coursiers, setCoursiers] = useState([]);
    const platforms = ["SHOPIFY", "FALABELLA", "MERCADOLIBRE", "RAPPI", "DCBOGOTA", "ADDI", "LINIO"]
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [selected, setSelected] = useState("Dashboard");

    useEffect(() => {
        const fetchCoursiers = async () => {
            try {
                const data = await getCoursiers(URL_SERVER);
                setCoursiers([...data, "servicio externo", "medellín", "dflex"]);
            } catch (error) {
                console.error("Error al obtener coursiers:", error);
            }
        };

        fetchCoursiers();
    }, []);

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
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Statistics
                        </Typography>
                        <SubMenu title="Rúbricas" icon={<AddchartSharp />}>
                            <Item
                                title="Dashboard"
                                to="/"
                                icon={<Dashboard />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title="Grabadora"
                                to="/screenrecord"
                                icon={<RadioButtonChecked />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </SubMenu>
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Platforms
                        </Typography>
                        <SubMenu title="Plataformas" icon={<AddBusiness />}>
                            {platforms.map((platform) => (
                                <Item
                                    key={platform.toLowerCase()}
                                    title={platform.toLowerCase()}
                                    to={`/platforms/${platform.toLowerCase()}`}
                                    icon={<Work />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            ))}
                            <Item
                                title="Subir rappi"
                                to="/platforms/rappi/form"
                                icon={<HomeOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </SubMenu>
                        {isAuthenticated && (
                            <>
                                {permissions.publications && (
                                    <>
                                        <Typography
                                            variant="h6"
                                            color={colors.grey[300]}
                                            sx={{ m: "15px 0 5px 20px" }}
                                        >
                                            Posts
                                        </Typography>
                                        <SubMenu title="Publicaciones" icon={<DynamicFeedOutlined />}>
                                            <Item
                                                title="Pausar"
                                                to="/publication/pause"
                                                icon={<PauseCircleFilledOutlined />}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                            <Item
                                                title="Publicaciones"
                                                to="/publication/table"
                                                icon={<CalendarToday />}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                        </SubMenu>
                                    </>
                                )}
                                {permissions.seller && (
                                    <>
                                        <Typography
                                            variant="h6"
                                            color={colors.grey[300]}
                                            sx={{ m: "15px 0 5px 20px" }}
                                        >
                                            Sales
                                        </Typography>
                                        <SubMenu title="Canales" icon={<CurrencyExchangeOutlinedIcon />}>
                                            <Item
                                                title="Pedidos"
                                                to="/sales/orders"
                                                icon={<CalendarToday />}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                            <Item
                                                title="Agregar"
                                                to="/sales/table"
                                                icon={<TableView />}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                        </SubMenu>
                                    </>
                                )}
                                {(permissions.logistic || permissions.coursier) && (
                                    <>
                                        <Typography
                                            variant="h6"
                                            color={colors.grey[300]}
                                            sx={{ m: "15px 0 5px 20px" }}
                                        >
                                            Delivery
                                        </Typography>
                                        <SubMenu title="Mensajería" icon={<LocalShipping />}>
                                            {permissions.logistic && (
                                                <>
                                                    <Typography
                                                        variant="h6"
                                                        color={colors.grey[300]}
                                                        sx={{ m: "15px 0 5px 20px" }}
                                                    >
                                                        Formulario
                                                    </Typography>
                                                    <Item
                                                        title="Crear ruta"
                                                        to="/delivery/form"
                                                        icon={<ContactsOutlinedIcon />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                </>
                                            )}
                                            {permissions.coursier && (
                                                <>
                                                    <Typography
                                                        variant="h6"
                                                        color={colors.grey[300]}
                                                        sx={{ m: "15px 0 5px 20px" }}
                                                    >
                                                        Formulario Entrega
                                                    </Typography>
                                                    <Item
                                                        title="Pedidos"
                                                        to={`/delivery/route`}
                                                        icon={<ContactsOutlinedIcon />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                </>
                                            )}
                                            {permissions.logistic && (
                                                <>
                                                    <Typography
                                                        variant="h6"
                                                        color={colors.grey[300]}
                                                        sx={{ m: "15px 0 5px 20px" }}
                                                    >
                                                        Mensajeros
                                                    </Typography>
                                                    {coursiers.map((coursier) => (
                                                        <Item
                                                            key={coursier}
                                                            title={coursier}
                                                            to={`/delivery/${coursier.toLowerCase()}`}
                                                            icon={<PersonOutlinedIcon />}
                                                            selected={selected}
                                                            setSelected={setSelected}
                                                        />
                                                    ))}
                                                    <Item
                                                        title="Todos"
                                                        to="delivery/all"
                                                        icon={<PeopleOutlinedIcon />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                </>
                                            )}
                                        </SubMenu>
                                    </>
                                )}
                                {(permissions.inventory_entry || permissions.inventory_exit || permissions.inventory_setting) && (
                                    <>
                                        <Typography
                                            variant="h6"
                                            color={colors.grey[300]}
                                            sx={{ m: "15px 0 5px 20px" }}
                                        >
                                            Inventory
                                        </Typography>
                                        <SubMenu title="Inventario" icon={<Inventory />}>
                                            <Typography
                                                variant="h6"
                                                color={colors.grey[300]}
                                                sx={{ m: "15px 0 5px 20px" }}
                                            >
                                                Productos
                                            </Typography>
                                            {permissions.inventory_setting && (
                                                <Item
                                                    title="Crear"
                                                    to="/inventory/create/form"
                                                    icon={<AddCircle />}
                                                    selected={selected}
                                                    setSelected={setSelected}
                                                />
                                            )}
                                            <Item
                                                title="Listado"
                                                to="/inventory/table"
                                                icon={<CalendarToday />}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                            {permissions.inventory_entry && (
                                                <>
                                                    <Typography
                                                        variant="h6"
                                                        color={colors.grey[300]}
                                                        sx={{ m: "15px 0 5px 20px" }}
                                                    >
                                                        Entradas
                                                    </Typography>
                                                    <Item
                                                        title="Generar"
                                                        to="/inventory/enter/form"
                                                        icon={<Poll />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                    <Item
                                                        title="Entradas"
                                                        to="/inventory/enter/table"
                                                        icon={<CalendarToday />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                </>
                                            )}
                                            {permissions.inventory_exit && (
                                                <>
                                                    <Typography
                                                        variant="h6"
                                                        color={colors.grey[300]}
                                                        sx={{ m: "15px 0 5px 20px" }}
                                                    >
                                                        Salidas
                                                    </Typography>
                                                    <Item
                                                        title="Generar"
                                                        to="/inventory/exit/form"
                                                        icon={<Poll />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                    <Item
                                                        title="Caja Registradora"
                                                        to="/inventory/exit/cash"
                                                        icon={<Games />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                    <Item
                                                        title="Pendientes"
                                                        to="/inventory/exit/pending"
                                                        icon={<PendingActions />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                    <Item
                                                        title="Salidas"
                                                        to="/inventory/exit/table"
                                                        icon={<CalendarToday />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                </>
                                            )}
                                            {permissions.inventory_setting && (
                                                <>
                                                    <Typography
                                                        variant="h6"
                                                        color={colors.grey[300]}
                                                        sx={{ m: "15px 0 5px 20px" }}
                                                    >
                                                        Ajustes
                                                    </Typography>
                                                    <Item
                                                        title="Ajustes"
                                                        to="/inventory/setting/table"
                                                        icon={<CalendarToday />}
                                                        selected={selected}
                                                        setSelected={setSelected}
                                                    />
                                                </>
                                            )}
                                        </SubMenu>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </SidebarMenu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;