import React, { useEffect, useState } from 'react'
import { useLocation, } from 'react-router-dom';
// import './blogsDetails.css'
import { motion, useInView } from "framer-motion";
import { Nav } from '../../nav/nav';
import { Footer } from '../../footer/footer';
import { New_breadCrumbs } from '../../newCrumbs/newcrumbs';

export const BlogsDetails = () => {

    const location = useLocation();
    const { title, image, content = [] } = location.state || {};

    // ----------------------------------------------------------
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const renderContent = (block, index) => {
        switch (block.type) {
            case "heading":
                return (
                    <h2 key={index} className="blog_heading">
                        {block.text}
                    </h2>
                );

            case "paragraph":
                return (
                    <p key={index} className="blogs_detail">
                        {block.text}
                    </p>
                );

            case "list":
                return (
                    <ul key={index} className="blog_list">
                        {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                );

            default:
                return null;
        }
    };


    return (
        <div className="bg-[var(--primary-bg)] w-full overflow-hidden">
            <motion.div>
                <Nav />
            </motion.div>

            <motion.div>
                <New_breadCrumbs />
            </motion.div>
            <motion.div
                ref={refOne}
                initial={{ opacity: 0, y: 50 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="px-4 md:px-12 lg:px-32 py-12"
            >
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200 overflow-hidden border border-gray-100">

                    {/* ---------------------------------------------------*/}
                    <div className="relative overflow-hidden">
                        <img
                            src={image}
                            className="w-full h-72 md:h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8">
                            <span className="text-white text-sm font-medium bg-indigo-600 px-3 py-1 rounded-full">Blog</span>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {title}
                        </h1>

                        <div className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-relaxed">
                            {content.map((block, index) => (
                                <div key={index} className="mb-6">
                                    {renderContent(block, index)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div>
                <Footer />
            </div>
        </div>

        // <div style={{backgroundColor:"var(--primary-bg)"}}>
        //     <motion.div  >
        //         <Nav />

        //     </motion.div>
        //     <motion.div >
        //         <New_breadCrumbs/>
        //     </motion.div>

        //     <motion.div ref={refOne}
        //         initial={{ opacity: 0, y: -100 }}
        //         animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        //         transition={{ duration: .8 }}
        //         className='blogs_main'
        //     >
        //         <div className='blogImg_div'>
        //             <img src={image} className='blogImg' />
        //             <div className='text_div'>

        //                 <span className='blogs_heading'>{title}</span>
        //                 <div className="blog_content">
        //                     {content.map((block, index) => renderContent(block, index))}
        //                 </div>

        //             </div>
        //         </div>
        //     </motion.div>

        //     <PopularBlogs />
        //     <div>
        //         <Footer />
        //     </div>
        // </div>
    )
}
