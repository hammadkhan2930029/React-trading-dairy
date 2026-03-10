import { Footer } from '../../footer/footer'
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import { motion, useInView } from "framer-motion";
// import '../blogsCard.css'
// import './blogsmultiCards.css'
import { useNavigate } from 'react-router-dom';
import { Nav } from '../../nav/nav';
import { New_breadCrumbs } from '../../newCrumbs/newcrumbs';
import { blogData } from '../../../../data/blog';
import PrimaryButton from '../../../Buttons/primaryButton';
import banner_bg from '../../../assets/new/banner_bg.png'

// -----------------------------------------------------------

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));


export const BlogsMultiCards = () => {

    const navigate = useNavigate();
    // -----------------------------------------------------------
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    // Calculate indexes
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogData.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(blogData.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    // ----------------------------------------------------------
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    // ------------------------------------------------
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <motion.div className='bg-white'>


            <Nav />
            <New_breadCrumbs />
            <div style={{ backgroundImage: `url(${banner_bg})` }}
                className="bg-cover bg-center min-h-screen ">
                <motion.div className=' py-10 lg:py-[100px] xl:py-[100px] px-4 md:px-10' >

                    <motion.div
                        className='text-start md:ml-10 mb-10'
                        ref={refOne}
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-[#0c263a] mb-4 font-sans">
                            Insights{" "}
                            <span className="text-blue-600">&</span>
                            {" "}Ideas
                        </h2>
                        <p className="text-gray-500 font-sans max-w-2xl">
                            Thoughts, trends, and practical knowledge to help you grow and innovate.
                        </p>
                    </motion.div>

                    <motion.div
                        ref={refOne}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2'
                    >
                        {currentPosts.map((item, index) => {
                            return (
                                <div key={index} className='group p-5 w-full flex flex-col justify-between bg-white rounded-xl transition-all duration-500 ease-in-out hover:border-2 hover:border-[#00d094] shadow hover:shadow-xl min-h-[450px] md:min-h-[500px]'>

                                    <div>
                                        <div className='overflow-hidden rounded-xl'>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className='w-full h-[200px] object-cover rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110'
                                            />
                                        </div>

                                        <div className='mt-4'>
                                            <h2 className="text-xl md:text-2xl font-bold text-[#0c263a] mb-3 font-sans transition-colors duration-300 group-hover:text-[#00d094] line-clamp-2">
                                                {item.title}
                                            </h2>
                                            <p className="text-gray-500 font-sans text-sm md:text-base line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex justify-end mt-6'>
                                        <PrimaryButton
                                            title='Read More'
                                            onClick={() => navigate("/blogs-details", { state: item })}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                    <div className=" flex flex-row justify-end py-5 items-center">
                        <button onClick={prevPage} disabled={currentPage === 1} className='bg-[#00d094] py-2 px-4 rounded-xl text-white font-sans font-bold'>Previous</button>
                        <span className='px-2 text-black font-sans text-lg'> Page {currentPage} of {Math.ceil(blogData.length / postsPerPage)} </span>
                        <button onClick={nextPage} disabled={currentPage === Math.ceil(blogData.length / postsPerPage)} className='bg-[#00d094] py-2 px-4 rounded-xl text-white font-sans font-bold'>Next</button>
                    </div>
                </motion.div>
            </div>
            {/* 
            <motion.div
                ref={refOne}
                initial={{ opacity: 0, y: 100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }} >
                <motion.div className='blogsMian_multi'>
                    <motion.div className='blogsCards_multi'>
                        {currentPosts.map((item, index) => (
                            <Card className='cardsBlogs_multi' sx={{ borderRadius: 6 }} key={index}>
                                <CardHeader title={item.title} sx={{color:'var(--primary-green)'}}/>
                                <CardMedia component="img" width="100%" className='blog_image' image={item.image} alt={item.title} />
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {item.excerpt}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <ExpandMore
                                        onClick={() => navigate("/blogs-details", { state: item })}
                                        aria-label="show more"
                                    >
                                    
                                            <div className='readMoreBtn_div' >
                                                <span className='btnText'>Read More</span>
                                            </div>
                                      

                                    </ExpandMore>
                                </CardActions>
                            </Card>
                        ))}
                    </motion.div>
                </motion.div>

             
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    <span> Page {currentPage} of {Math.ceil(blogData.length / postsPerPage)} </span>
                    <button onClick={nextPage} disabled={currentPage === Math.ceil(blogData.length / postsPerPage)}>Next</button>
                </div>
            </motion.div> */}
            <Footer />
        </motion.div>
    )
}
