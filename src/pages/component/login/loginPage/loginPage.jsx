import { useEffect, useRef } from "react"
import { Footer } from "../../footer/footer"
import { LoginSignUpPage } from "../../login_singup/login_signup"
import { Nav } from "../../nav/nav"
import { New_breadCrumbs } from "../../newCrumbs/newcrumbs"
import banner_bg from '../../../assets/new/banner_bg.png'




export const LoginPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <div >
            <Nav />
            <div>

                <New_breadCrumbs />
            </div>

            <div style={{ backgroundImage: `url(${banner_bg})` }}
                                    className="bg-cover bg-center  ">

                <LoginSignUpPage />
            </div>
            <div>
                <Footer />

            </div>

        </div>
    )
}
