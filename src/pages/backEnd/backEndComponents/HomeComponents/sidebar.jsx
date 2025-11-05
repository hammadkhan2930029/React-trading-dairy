import React, { useState } from "react";
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import logo from '../../../images/logo.png'
import { useLocation, useNavigate } from 'react-router-dom';
import RuleIcon from '@mui/icons-material/Rule';

const Sidebar = ({ onSelect }) => {
    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenThree, setDropdownOpenThree] = useState(false);


    const menuItemsOne = [
        { value: 1, name: "Dashboard", path: '/Dashboard' },
        { value: 99, name: "Holdings", path: '/Holdings' },
        { value: 4, name: "Buy / Sell", path: '/crudOperation' },
        { value: 111, name: "Closed Trades", path: '/ClosedTrades' },
    ];

    const menuItemsTwo = [
        { value: 5, name: "Broker", path: '/BrokerForm' },
        { value: 17, name: "Dividend", path: '/Dividend' },

    ];

    const menuItemsThree = [
        { value: 11, name: "Overview", path: '/OverView' },
        { value: 12, name: "Summary", path: '/Summary' },
    ];
    const menuItemsFour = [
        { value: 10, name: "Developer", path: '/Developers' },
        { value: 222, name: "My Rules Book", path: '/RulesView' },
        { value: 333, name: "Trading Journal", path: '/Trding-journal/list' },

    ]

    const handleClick = (item) => {
        setSelectedIndex(item.value);
        onSelect && onSelect(item.value);
        navigate(item.path)
        console.log(item.path)
    };

    return (
        <Box sx={{ backgroundColor: "#FAF9F6", height: "100%" }}>
            <div style={{ padding: 10, textAlign: "center" }}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "50%", cursor: "pointer" }}
                    onClick={() => handleClick(1)}
                />
            </div>
            <Divider />

            {/* ---------- Menu 1 ---------- */}
            <List>
                {menuItemsOne.map((item) => (
                    <ListItem key={item.value} disablePadding>
                        <ListItemButton
                            onClick={() => handleClick(item)}
                            sx={{
                                backgroundColor:
                                    selectedIndex === item.value ? "#1976d2" : "transparent",
                                "&:hover": { backgroundColor: "#B9D9EB" },
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                            >
                                {item.value === 4 ? <FormatListBulletedIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* ---------- Market Data Dropdown ---------- */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setDropdownOpenThree(!dropdownOpenThree)}
                        sx={{
                            backgroundColor: dropdownOpenThree ? "#36454F" : "transparent",
                            "&:hover": { backgroundColor: "#C0C0C0" },
                        }}
                    >
                        <ListItemIcon sx={{ color: dropdownOpenThree ? "#fff" : "#000" }}>
                            <ShowChartIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Market Data"
                            sx={{ color: dropdownOpenThree ? "#fff" : "#000" }}
                        />
                        {dropdownOpenThree ? (
                            <KeyboardArrowUpIcon sx={{ color: "#fff" }} />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </ListItemButton>
                </ListItem>

                {dropdownOpenThree &&
                    menuItemsThree.map((item) => (
                        <ListItem key={item.value} disablePadding sx={{ pl: 2 }}>
                            <ListItemButton
                                onClick={() => handleClick(item)}
                                sx={{
                                    backgroundColor:
                                        selectedIndex === item.value ? "#1976d2" : "transparent",
                                    "&:hover": { backgroundColor: "#B9D9EB" },
                                }}
                            >
                                <ListItemIcon
                                    sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                                >
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>

            {/* ---------- Settings Dropdown ---------- */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        sx={{
                            backgroundColor: dropdownOpen ? "#36454F" : "transparent",
                            "&:hover": { backgroundColor: "#C0C0C0" },
                        }}
                    >
                        <ListItemIcon sx={{ color: dropdownOpen ? "#fff" : "#000" }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Settings"
                            sx={{ color: dropdownOpen ? "#fff" : "#000" }}
                        />
                        {dropdownOpen ? (
                            <KeyboardArrowUpIcon sx={{ color: "#fff" }} />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </ListItemButton>
                </ListItem>

                {dropdownOpen &&
                    menuItemsTwo.map((item) => (
                        <ListItem key={item.value} disablePadding sx={{ pl: 2 }}>
                            <ListItemButton
                                onClick={() => handleClick(item)}
                                sx={{
                                    backgroundColor:
                                        selectedIndex === item.value ? "#1976d2" : "transparent",
                                    "&:hover": { backgroundColor: "#B9D9EB" },
                                }}
                            >
                                <ListItemIcon
                                    sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                                >
                                    {item.value === 10 ? <ContactPageIcon /> : <InboxIcon />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
            {/* ------------------------------------------------------ */}
            <List>
                {menuItemsFour.map((item) => (
                    <ListItem key={item.value} disablePadding>
                        <ListItemButton
                            onClick={() => handleClick(item)}
                            sx={{
                                backgroundColor:
                                    selectedIndex === item.value ? "#1976d2" : "transparent",
                                "&:hover": { backgroundColor: "#B9D9EB" },
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                            >
                                {item.value === 10 ? <ContactPageIcon /> : item.value === 222 ? <RuleIcon /> : item.value === 333 ? <FormatListBulletedIcon /> : <InboxIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>




        </Box>
    );
};

export default Sidebar;
