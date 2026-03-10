import { useEffect } from "react";
import { Footer } from "../../footer/footer"
import { Nav } from "../../nav/nav"
import { New_breadCrumbs } from "../../newCrumbs/newcrumbs"
import { HowWorks } from '../howWorks'
import '../howWorks.css'
import banner_bg from '../../../assets/new/banner_bg.png'


export const HowWorksPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div>
            <Nav />

            <New_breadCrumbs />

            <div  style={{ backgroundImage: `url(${banner_bg})` }}
                        className="bg-cover bg-center min-h-screen ">

                <HowWorks />
            </div>
            <Footer />
        </div>
    )
}
