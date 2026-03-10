import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion, useInView } from "framer-motion";
// import './blogsCard.css'
import { useNavigate } from 'react-router-dom';
import { blogData } from '../../../data/blog';
// import blogpost01 from '../../assets/new/blog_post01-2.jpg';
import PrimaryButton from '../../Buttons/primaryButton';



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

// ----------------------------------------------------------------------

export const BlogsCard = forwardRef((props, ref) => {

    const navigate = useNavigate()
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    return (
        <motion.div className='bg-gradient-to-r from-gray-200 to-gray-50 py-10 lg:py-[100px] xl:py-[100px] px-4 md:px-10' ref={ref}>

            {/* Header Section */}
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

            {/* Blogs Grid */}
            <motion.div
                ref={refOne}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2'
            >
                {blogData.map((item, index) => {
                    return (
                        <div key={index} className='group p-5 w-full flex flex-col justify-between bg-white rounded-xl transition-all duration-500 ease-in-out hover:border-2 hover:border-[#00d094] shadow hover:shadow-xl min-h-[450px] md:min-h-[500px]'>

                            {/* Image Container */}
                            <div>
                                <div className='overflow-hidden rounded-xl'>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className='w-full h-[200px] object-cover rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110'
                                    />
                                </div>

                                {/* Content */}
                                <div className='mt-4'>
                                    <h2 className="text-xl md:text-2xl font-bold text-[#0c263a] mb-3 font-sans transition-colors duration-300 group-hover:text-[#00d094] line-clamp-2">
                                        {item.title}
                                    </h2>
                                    <p className="text-gray-500 font-sans text-sm md:text-base line-clamp-3">
                                        {item.excerpt}
                                    </p>
                                </div>
                            </div>

                            {/* Button - Hamesha card ke bottom par rahega */}
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
        </motion.div>
        // <motion.div className='bg-gradient-to-r from-gray-200 to-gray-50 py-10 px-3 md:px-10 lg:px-10' ref={ref}>

        //     <motion.div className='text-start ml-10'
        //         ref={refOne}
        //         initial={{ opacity: 0, y: -100 }}
        //         whileInView={{ opacity: 1, x: 0 }}
        //         transition={{ duration: .8 }}>
        //         <h2 className="text-3xl md:text-5xl font-bold text-[#0c263a] mb-4 font-sans">
        //             Insights{" "}
        //             <span className="text-blue-600">
        //                 &
        //             </span>
        //             {" "}Ideas
        //         </h2>
        //         <p className="text-gray-500  font-sans">
        //             Thoughts, trends, and practical knowledge to help you grow and innovate.
        //         </p>
        //     </motion.div>
        //     <motion.div ref={refOne}
        //         initial={{ opacity: 0, x: 100 }}
        //         whileInView={{ opacity: 1, x: 0 }}
        //         transition={{ duration: .8 }}
        //         className='flex flex-col md:flex-row lg:flex-row justify-around items-center p-2'>
        //         {blogData.map((item, index) => {
        //             return (



        //                 <div className='group p-5 w-full md:w-[28%]  lg:w-[32%] xl:w-[32%]  h-[400px] md:h-[500px] lg:h-[550px] mt-2  bg-white rounded-xl transition-all duration-500 ease-in-out  hover:border-2 hover:border-[#00d094] shadow hover:shadow-xl'>
        //                     <div className='overflow-hidden rounded-xl'>
        //                         <img src={item.image} className='w-full  h-[120px] md:h-[200px] lg:h-[200px] rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110' />
        //                     </div>
        //                     <div className='flex flex-col justify-between  h-[230px] md:h-[260px] lg:h-[320px] '>
        //                         <div className='mt-2 md:mt-2 lg:mt-2 transition-all duration-300'>
        //                             <h2 className="text-2xl font-bold text-[#0c263a] mb-4 font-sans transition-colors duration-300 group-hover:text-[#00d094]">
        //                                 {item.title}

        //                             </h2>
        //                             <p className="text-gray-500  font-sans">
        //                                 {item.excerpt}
        //                             </p>
        //                         </div>
        //                         <div className='flex justify-end mt-5'>
        //                             <PrimaryButton title='Read More' onClick={() => navigate("/blogs-details", { state: item })} />
        //                         </div>
        //                     </div>
        //                 </div>
        //             )
        //         })}

        //     </motion.div>





        // </motion.div>
        //----old------------------------
        // <div ref={ref}>

        //     <motion.div className='blogsMian'
        //         ref={refOne}
        //         initial={{ opacity: 0, y: -100 }}
        //         animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        //         transition={{ duration: .8 }}
        //     >
        //         <div className='blogs_h1_div'>
        //             <span className='blogs_h1'>Blogs</span>
        //         </div>

        //         <motion.div className='blogsCards' >
        //             {blogData.map((item, index) => (
        //                 <Card className='cardsBlogs' sx={{ borderRadius: 6 }} key={index}>
        //                     <CardHeader title={item.title} sx={{ color: 'var(--primary-green)' }} />
        //                     <CardMedia component="img" width="100%" className='blog_image' image={item.image} alt={item.title} />
        //                     <CardContent>
        //                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        //                             {item.excerpt}
        //                         </Typography>
        //                     </CardContent>
        //                     <CardActions disableSpacing>
        //                         <ExpandMore
        //                             onClick={() => navigate("/blogs-details", { state: item })}
        //                             aria-label="show more"
        //                         >
        //                             {/* <IconButton aria-label="show more"> */}
        //                             <div className='readMoreBtn_div' >
        //                                 <span className='btnText'>Read More</span>
        //                             </div>
        //                             {/* </IconButton> */}

        //                         </ExpandMore>
        //                     </CardActions>
        //                 </Card>
        //             ))}
        //         </motion.div>
        //     </motion.div>
        // </div>

    );
})
