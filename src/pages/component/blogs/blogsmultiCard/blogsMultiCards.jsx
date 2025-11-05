import { Footer } from '../../footer/footer'
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion, useInView } from "framer-motion";
import stock7 from '../../../assets/stock-7.jpg'
import '../blogsCard.css'
import './blogsmultiCards.css'
import { useNavigate } from 'react-router-dom';
import { Nav } from '../../nav/nav';
import { Navbar2 } from '../../nav/navbar2';

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
// -----------------------------------------------------------
const blogData = [
    {
        id: 1,
        title: "Shrimp and Chorizo Paella",
        image: stock7,
        description: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like",
        description2: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like"

    },
    {
        id: 2,
        title: "Delicious Pasta Recipe",
        image: stock7,
        description: "The contest is based on a points system: the more points you earn, the higher your chances of winning weekly ($5,000 for 1st place), monthly ($10,000), or annual super prizes ($50,000). Besides, referral activity not only boosts your points but also presents a chance to earn commissions of up to 70% through LiteFinance's affiliate program. Let's figure out how it works in practice.",
        description2: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like"

    },
    {
        id: 3,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "The contest is based on a points system: the more points you earn, the higher your chances of winning weekly ($5,000 for 1st place), monthly ($10,000), or annual super prizes ($50,000). Besides, referral activity not only boosts your points but also presents a chance to earn commissions of up to 70% through LiteFinance's affiliate program. Let's figure out how it works in practice."
    },
    {
        id: 4,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 5,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 6,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 7,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 8,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 9,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 10,
        title: "Shrimp and Chorizo Paella",
        image: stock7,
        description: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."
    },
    {
        id: 11,
        title: "Delicious Pasta Recipe",
        image: stock7,
        description: "Enjoy this simple and delicious pasta recipe that brings a mix of flavors and a healthy choice for your dinner."
    },
    {
        id: 12,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 13,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 14,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 15,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 16,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 17,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
    {
        id: 18,
        title: "Healthy Smoothie Guide",
        image: stock7,
        description: "A refreshing and healthy smoothie guide to start your day with energy. Try out different fruit combinations!"
    },
];

// ----------------------------------------------------------------------
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
    return (
        <motion.div>
            <motion.div
                ref={refOne}

                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>

                <Navbar2 />
            </motion.div>

            <motion.div className='banner'
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>
                <span className='banner_text'>Blogs</span>
            </motion.div>
            <motion.div
                ref={refOne}
                initial={{ opacity: 0, y: 100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>
                <motion.div className='blogsMian_multi'>
                    <motion.div className='blogsCards_multi'>
                        {currentPosts.map((item, index) => (
                            <Card className='cardsBlogs_multi' sx={{ borderRadius: 6 }} key={index}>
                                <CardHeader title={item.title} />
                                <CardMedia component="img" height="194" image={item.image} alt={item.title} />
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <ExpandMore
                                        onClick={() => navigate("/blogsDetails", { state: { title: item.title, image: item.image, description: item.description, id: item.id , description2: item.description2,} })}


                                        aria-label="show more"
                                    >
                                        <IconButton aria-label="show more">

                                            <div className='readMoreBtn' >
                                                <span className='btnText'>Read More</span>
                                                {/* <ExpandMoreIcon style={{ color: 'blue' }} /> */}
                                            </div>
                                        </IconButton>

                                    </ExpandMore>
                                </CardActions>
                            </Card>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Pagination Controls */}
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    <span> Page {currentPage} of {Math.ceil(blogData.length / postsPerPage)} </span>
                    <button onClick={nextPage} disabled={currentPage === Math.ceil(blogData.length / postsPerPage)}>Next</button>
                </div>
            </motion.div>
            <div>

                <Footer />
            </div>
        </motion.div>
    )
}
