import { useEffect, useRef, useState } from 'react'
import { Navbar } from './navbar/navbar'
import { Cards } from './cards/cards';
import { FullCard } from './fullCard/fullCard';
import { ChooseUs } from './chooseUs/chooseUs';
import { Faqs } from './faqs/faqs';
import { BlogsCard } from './blogs/blogsCard';
import { NewsLetter } from './newsletter/newsletter';
import { Footer } from './footer/footer';
import { Loader_f } from './loader/loader';
import { Nav } from './nav/nav';
import { LoginPage } from './login_singup/login_signup'
import { useSelector, useDispatch } from 'react-redux';
import { setScrollToSection } from './Redux/scrollSlice';
import { clearScrollToSection } from './Redux/scrollSlice';
import { HowWorks } from './How/howWorks';
import { Success } from './confirmationPage/Success';

function FrontPage() {
  const [count, setCount] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setCount(false)

    }, 2000);

  }, [])
  const chooseUsRef = useRef(null);
  const aboutRef = useRef(null);

  const loginRef = useRef(null);
  const blogsRef = useRef(null)
  const faqRef = useRef(null)

  const scrollToSection = useSelector((state) => state.scroll.scrollToSection);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollToSection === 'chooseUs' && chooseUsRef.current) {
      chooseUsRef.current.scrollIntoView({ behavior: 'smooth' });
      dispatch(setScrollToSection(null));
    }
    //  if (scrollToSection === 'about' && aboutRef.current) {
    //   aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    //   dispatch(setScrollToSection(null));
    // }

    if (scrollToSection === 'login' && loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: 'smooth' });
      dispatch(setScrollToSection(null));
    }

    if (scrollToSection === 'blogs' && blogsRef.current) {
      blogsRef.current.scrollIntoView({ behavior: 'smooth' });
      dispatch(setScrollToSection(null));
    }
    if (scrollToSection === 'faqs' && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
      dispatch(setScrollToSection(null));
    }
  }, [scrollToSection, dispatch]);

  // -------------------------------------------------------------------






  return (
    <>
      {count ? (
        <Loader_f />
      ) : (
        <div style={{ overflow: 'hidden',backgroundColor:'#E5F5E8'}}>
          <Nav chooseUsRef={chooseUsRef} />
          <Navbar />
          <Cards ref={aboutRef} />
          <FullCard />

          <ChooseUs  />
          <HowWorks ref={chooseUsRef}/>
          <LoginPage ref={loginRef} />
          <BlogsCard ref={blogsRef} />
          <Faqs ref={faqRef} />

          <NewsLetter />
          <Footer />


        </div>
      )}

    </>
  )
}

export default FrontPage;

