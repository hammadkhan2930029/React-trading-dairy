import React, { useState, useEffect } from "react";
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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContactPageIcon from "@mui/icons-material/ContactPage";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useLocation, useNavigate } from 'react-router-dom';
import RuleIcon from '@mui/icons-material/Rule';
import api from "../../../../api/axios";  

const Sidebar = ({ onSelect }) => {
    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenThree, setDropdownOpenThree] = useState(false);
    const [dropdownOpenReports, setDropdownOpenReports] = useState(false);
    const [headerLogo, setHeaderLogo] = useState(null);

    useEffect(() => {

        const fetchHeaderLogo = async () => {
            try {
                const res = await api.get("/adminpanel/header_settings/");
                const logoPath = res.data.header_logo;

                const BASE_URL = (api.defaults.baseURL)
                .replace(/\/api\/?$/, "")
                .replace(/\/$/, "");

                //  Build proper image URL
                const logoUrl = logoPath
                ? logoPath.startsWith("http")
                    ? logoPath
                    : logoPath.startsWith("/media/")
                    ? `${BASE_URL}${logoPath}`
                    : `${BASE_URL}/media/${logoPath}`
                : null;

                setHeaderLogo(logoUrl);
            } catch (err) {
                
            }

        };

        fetchHeaderLogo();

    }, []);

    const menuItemsOne = [
        { value: 1, name: "Dashboard", path: '/dashboard' },
        { value: 2, name: "Performance", path: '/performance' },
        { value: 4, name: "Buy / Sell", path: '/buy-sell/list' },
        { value: 99, name: "Holdings", path: '/holdings' },
        { value: 111, name: "Closed Trades", path: '/closed-trades' },
        { value: 333, name: "Trading Journal", path: '/trading-journal/list' },
        { value: 666, name: "Account Balance", path: '/account-balance' },
        { value: 18, name: "Extra Charges", path: '/extra-charges/list' },
    ];

    const menuItemsTwo = [
        { value: 5, name: "Broker", path: '/broker/list' },
        { value: 16, name: "Bonus", path: '/bonus/list' },
        { value: 17, name: "Dividend", path: '/dividend/list' },
        { value: 88, name: "Split", path: '/split/list' },
        { value: 89, name: "Right Shares", path: '/right-shares/list' },
    ];

    const menuItemsThree = [
        { value: 11, name: "Overview", path: '/market-overview' },
        { value: 12, name: "Summary", path: '/market-summary' },
    ];

    const menuItemsFour = [
        { value: 222, name: "My Rules Book", path: '/my-rules-book' },
        { value: 10, name: "Developer", path: '/developers' },
    ]

    const menuItemsReports = [
        { value: 25, name: "Import", path: '/imports' },
        { value: 26, name: "Summary", path: '/summary' },
    ]

    const handleClick = (item) => {
        setSelectedIndex(item.value);
        onSelect && onSelect(item.value);
        navigate(item.path)
    };

    return (
        <Box sx={{ backgroundColor: "#FAF9F6", height: "100%" }}>
            <div style={{ padding: 10, textAlign: "center" }}>
                <img
                    src={headerLogo}
                    alt="Logo"
                    style={{ cursor: "pointer" }}
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
                                {item.value === 4 ? <FormatListBulletedIcon /> : item.value === 99 ? <BusinessCenterOutlinedIcon /> : item.value === 1 ? <DashboardOutlinedIcon /> : item.value === 2 ? <BarChartIcon /> : item.value === 111 ? <CheckCircleOutlineIcon /> : item.value === 333 ? <ArticleOutlinedIcon /> :  item.value === 666 ? <CurrencyExchangeIcon /> : item.value === 18 ? <AttachMoneyOutlinedIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                sx={{ color: selectedIndex === item.value ? "#fff" : "#000" }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* ---------- Reports Dropdown ---------- */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setDropdownOpenReports(!dropdownOpenReports)}
                        sx={{
                            backgroundColor: dropdownOpenReports ? "#36454F" : "transparent",
                            "&:hover": { backgroundColor: "#C0C0C0" },
                        }}
                    >
                        <ListItemIcon sx={{ color: dropdownOpenReports ? "#fff" : "#000" }}>
                            <AssessmentOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Reports"
                            sx={{ color: dropdownOpenReports ? "#fff" : "#000" }}
                        />
                        {dropdownOpenReports ? (
                            <KeyboardArrowUpIcon sx={{ color: "#fff" }} />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </ListItemButton>
                </ListItem>

                {dropdownOpenReports &&
                    menuItemsReports.map((item) => (
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
                                    {item.value === 25 ? <FileUploadOutlinedIcon /> : item.value === 26 ? <AnalyticsIcon /> : <InboxIcon />}
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
                                    {item.value === 5 ? <PersonOutlineIcon /> : item.value === 16 ? <WorkspacePremiumIcon /> : item.value === 17 ? <AccountBalanceWalletOutlinedIcon /> : item.value === 88 ? <CallSplitIcon /> : item.value === 89 ? <SwapHorizIcon /> : <InboxIcon />}
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
                                {item.value === 10 ? <ContactPageIcon /> : item.value === 222 ? <RuleIcon /> : <InboxIcon />}
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
