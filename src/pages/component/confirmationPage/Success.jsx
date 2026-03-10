import React, { useEffect } from "react";
import { Nav } from "../nav/nav";
import { Footer } from "../footer/footer";
import { useNavigate } from "react-router-dom";
import "./Success.css"; // CSS import
import { motion, useInView } from "framer-motion";

export const Success = () => {
    const navigate = useNavigate();
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
                    <p className="success-message">
                        You have registered successfully! 🎉
                    </p>
                    <button className="success-btn" onClick={() => navigate("/frontPage")}>
                        Go to Home
                    </button>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};
