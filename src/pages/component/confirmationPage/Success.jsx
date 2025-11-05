import React, { useEffect } from "react";
import { Nav } from "../nav/nav";
import { Footer } from "../footer/footer";
import { useNavigate } from "react-router-dom";
import "./Success.css"; // CSS import
import { motion, useInView } from "framer-motion";
import { useLocation } from "react-router-dom";

export const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activated = queryParams.get("activated");
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    // ----------------------------------------------------------
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });

    return (
        <div>
            <Nav />
            <div className="success-container">
                <motion.div className="success-card"
                    ref={refOne}
                    initial={{ opacity: 0, y: -100 }}
                    animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: .8 }}>
                    <div className="success-icon">🙂</div>
                    <h1 className="success-title">Success!</h1>
                    {activated ? (
                            <p className="success-message">Your account has been activated 🎉</p>
                        ) : (
                            <p className="success-message">You have registered successfully! 🎉</p>
                        )}
                                    
                    <button className="success-btn" onClick={() => navigate("/frontPage")}>
                        Go to Home
                    </button>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};
export default Success;