// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { motion, useInView } from "framer-motion";
// import stock7 from '../../../assets/blog.webp'
// import './popularBlogs.css'
// import { useNavigate } from 'react-router-dom';

// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme }) => ({
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
//     variants: [
//         {
//             props: ({ expand }) => !expand,
//             style: {
//                 transform: 'rotate(0deg)',
//             },
//         },
//         {
//             props: ({ expand }) => !!expand,
//             style: {
//                 transform: 'rotate(180deg)',
//             },
//         },
//     ],
// }));


// const blogData = [
//     {
//         id: 1,
//         title: "Shrimp and Chorizo Paella",
//         image: stock7,
//         description: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like",
//         description2: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like"

//     },
//     {
//         id: 2,
//         title: "Delicious Pasta Recipe",
//         image: stock7,
//         description: "The contest is based on a points system: the more points you earn, the higher your chances of winning weekly ($5,000 for 1st place), monthly ($10,000), or annual super prizes ($50,000). Besides, referral activity not only boosts your points but also presents a chance to earn commissions of up to 70% through LiteFinance's affiliate program. Let's figure out how it works in practice.",
//         description2: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like"

//     },
//     {
//         id: 3,
//         title: "Healthy Smoothie Guide",
//         image: stock7,
//         description: "The contest is based on a points system: the more points you earn, the higher your chances of winning weekly ($5,000 for 1st place), monthly ($10,000), or annual super prizes ($50,000). Besides, referral activity not only boosts your points but also presents a chance to earn commissions of up to 70% through LiteFinance's affiliate program. Let's figure out how it works in practice."
//     },

// ];
// export const PopularBlogs = () => {
//     const navigate = useNavigate()

//     const refOne = React.useRef(null);


//     const inViewOne = useInView(refOne, { triggerOnce: true });

//     return (
//         <motion.div className='Popular_blogsMian'
//             ref={refOne}
//             initial={{ opacity: 0, y: -100 }}
//             animate={inViewOne ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: .8 }}>
//             <div className='Popular_blogs_h1_div'>
//                 <span className='Popular_blogs_h1'>Most Popular Blogs</span>
//             </div>

//             <motion.div className='Popular_blogsCards' >
//                 {blogData.map((item, index) => (
//                     <Card className='Popular_CardsBlogs' sx={{ borderRadius: 6 }}>
//                         <CardHeader
//                             sx={{ color: 'var(--primary-green)' }}
//                             title={item.title}
//                         />
//                         <CardMedia
//                             component="img"
//                             width="100%"
//                             className='blog_image'
//                             image={item.image}
//                             alt="Paella dish"
//                         />
//                         <CardContent>
//                             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                                 {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
//                             </Typography>
//                         </CardContent>
//                         <CardActions disableSpacing>

//                             <ExpandMore
//                                 onClick={() => navigate("/blogsDetails", { state: { title: item.title, image: item.image, description: item.description, id: item.id, description2: item.description2, } })}


//                                 aria-label="show more"
//                             >
//                                 <IconButton aria-label="show more">

//                                     <div className='Popular_readMoreBtn' >
//                                         <span className='btnText'>Read More</span>
//                                     </div>
//                                 </IconButton>

//                             </ExpandMore>
//                         </CardActions>

//                     </Card>

//                 ))}

//                 {/* ------------------------------------------------------------------------------------ */}
//                 {/* <Card className='Popular_CardsBlogs' sx={{ borderRadius: 6 }}>
//                     <CardHeader

//                         title="Shrimp and Chorizo Paella"
//                     />
//                     <CardMedia
//                         component="img"
//                         height="194"
//                         image={stock7}
//                         alt="Paella dish"
//                     />
//                     <CardContent>
//                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                             This impressive paella is a perfect party dish and a fun meal to cook
//                             together with your guests. Add 1 cup of frozen peas along with the mussels,
//                             if you like.
//                         </Typography>
//                     </CardContent>
//                     <CardActions disableSpacing>

//                     <ExpandMore
//                             onClick={() => navigate("/blogsMultiCards")}


//                             aria-label="show more"
//                         >
//                             <IconButton aria-label="show more">

//                                 <div className='Popular_readMoreBtn' >
//                                     <span className='Popular_btnText'>Read More</span>
//                                     <ExpandMoreIcon style={{ color: 'blue' }} />
//                                 </div>
//                             </IconButton>

//                         </ExpandMore>
//                     </CardActions>

//                 </Card> */}
//                 {/* --------------------------------------------------------------------------------------- */}
//                 {/* <Card className='Popular_CardsBlogs' sx={{ borderRadius: 6 }}>
//                     <CardHeader

//                         title="Shrimp and Chorizo Paella"
//                     />
//                     <CardMedia
//                         component="img"
//                         height="194"
//                         image={stock7}
//                         alt="Paella dish"
//                     />
//                     <CardContent>
//                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                             This impressive paella is a perfect party dish and a fun meal to cook
//                             together with your guests. Add 1 cup of frozen peas along with the mussels,
//                             if you like.
//                         </Typography>
//                     </CardContent>
//                     <CardActions disableSpacing>

//                     <ExpandMore
//                             onClick={() => navigate("/blogsMultiCards")}


//                             aria-label="show more"
//                         >
//                             <IconButton aria-label="show more">

//                                 <div className='Popular_readMoreBtn' >
//                                     <span className='Popular_btnText'>Read More</span>
//                                     <ExpandMoreIcon style={{ color: 'blue' }} />
//                                 </div>
//                             </IconButton>

//                         </ExpandMore>
//                     </CardActions>

//                 </Card> */}
//             </motion.div>
//         </motion.div>

//     );
// }
