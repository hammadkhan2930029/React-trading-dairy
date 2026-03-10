import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import "./newCrumbs.css";
import { motion, useInView } from "framer-motion";
import { useLocation, Link as RouterLink } from "react-router-dom";
import breadcrumb_bg from '../../assets/new/breadcrumb_bg.png'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export const New_breadCrumbs = () => {

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: false });

    const location = useLocation();

    // current path ko split karo e.g. "/shop/cart" -> ["shop","cart"]
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (

        <motion.div
            style={{ backgroundImage: `url(${breadcrumb_bg})` }}
            className="bg-cover bg-center min-h-[220px] md:min-h-[260px] lg:min-h-[300px]  flex items-center"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
            <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 text-center md:text-left">

                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold uppercase">
                    {pathnames.length === 0 ? "Home" : pathnames[pathnames.length - 1]}
                </span>

                <div className="mt-3">
                    <Breadcrumbs aria-label="breadcrumb"  separator={<span className="text-white">/</span>} className="text-white ">

                        <Link
                            component={RouterLink}
                            underline="hover"
                            color="inherit"
                            to="/"
                            className="hover:text-green-400"
                            sx={{ color: '#00d094' }}
                        >
                            Home
                        </Link>
                      

                        {pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                            const isLast = index === pathnames.length - 1;

                            return isLast ? (
                                <Typography key={to} className="text-white">
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </Typography>
                            ) : (
                                <Link
                                    component={RouterLink}
                                    underline="hover"
                                    color="inherit"
                                    to={to}
                                    key={to}
                                    className="hover:text-green-400"
                                >
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                </div>

            </div>
        </motion.div>
    );
};

