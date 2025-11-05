import { Footer } from '../footer/footer'
import { Navbar2 } from '../nav/navbar2'
import './aboutUs.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BuildIcon from '@mui/icons-material/Build';
import demoIcon  from '../../assets/demoIcon.png';
import demoIcon1 from '../../assets/demoIcon1.png';
import team from '../../assets/team.jpg';

export const AboutUs = () => {
    return (
        <div>
            <Navbar2 />
            <div className='aboutMain'>
                <div className="about-container">
                    <div className="about-text">
                        <h2>Who We Are</h2>
                        <p>
                            Welcome to <strong>Cogent Devs</strong>, your premier destination for
                            innovative digital solutions in Karachi, Pakistan.
                        </p>
                        <p>
                            As a dynamic and forward-thinking company, we are committed to
                            excellence in every project we undertake. With a strong foundation in
                            cutting-edge technologies, we pride ourselves on being at the
                            forefront of the digital landscape, delivering bespoke solutions that
                            are tailored to meet the unique needs of our clients.
                        </p>
                        <p>
                            Our talented team of developers, designers, and strategists brings
                            years of industry experience to deliver scalable, high-performance
                            solutions – from web and mobile app development to SEO and digital
                            marketing.
                        </p>
                    </div>

                    <div className="about-image-section">
                        <div className="blue-block"></div>
                        <img src={team} alt="Team" className="about-image" />
                    </div>
                </div>
                {/* ----------------------------------------------------------- */}
                <div className='mission_vision_main'>
                    <div className='mission_vision'>
                        <div className='mission_vision_heading'>
                            <TrackChangesIcon sx={{ fontSize: '52px' }} />
                            <span>Mission Statement</span>

                        </div>
                        <span className='mission_vision_text'>Our talented team of developers, designers, and strategists brings
                            years of industry experience to deliver scalable, high-performance
                            solutions – from web and mobile app development to SEO and digital
                            marketing.</span>
                    </div>
                    <div className='mission_vision'>
                        <div className='mission_vision_heading'>
                            <RemoveRedEyeIcon sx={{ fontSize: '52px' }} />
                            <span>Vision Statement</span>

                        </div>
                        <span className='mission_vision_text'>Our talented team of developers, designers, and strategists brings
                            years of industry experience to deliver scalable, high-performance
                            solutions – from web and mobile app development to SEO and digital
                            marketing.</span>
                    </div>
                </div>
                {/* ----------------------------------------------------------- */}
                <div className='tools_div'>
                    <div>
                        <span className='tools_Heading'>Our Tools and Widgets <BuildIcon sx={{ fontSize: '42px' }} /></span>
                    </div>
                    <div className='tools_text_div'>
                        <span className='tools_text'>Our talented team of developers, designers, and strategists brings
                            years of industry experience to deliver scalable, high-performance
                            solutions – from web and mobile app development to SEO and digital
                            marketing.
                            Our talented team of developers, designers, and strategists brings
                            years of industry experience to deliver scalable, high-performance
                            solutions – from web and mobile app development to SEO and digital
                            marketing.</span>
                    </div>
                    <div>
                        <span className='tools_text'>From web and mobile app development to SEO</span>
                    </div>
                    <div className="widgets-container">
                        <div className="widget-item">
                           <img src={demoIcon} alt="PSX Market Watch" /> 
                            <div>
                                <h3>PSX Market Watch</h3>
                                <p>A snapshot of all the indices on the Pakistan Stock Exchange</p>
                            </div>
                        </div>

                        <div className="widget-item">
                           <img src={demoIcon1} alt="Upcoming Payouts" /> 
                            <div>
                                <h3>Upcoming Payouts</h3>
                                <p>Keeps you up to date with upcoming dividend payouts</p>
                            </div>
                        </div>

                        <div className="widget-item">
                         < img src={demoIcon} alt="Today's Market Performers" /> 
                            <div>
                                <h3>Today's Market Performers</h3>
                                <p>An overview of the shares with the highest and lowest volumes</p>
                            </div>
                        </div>

                        <div className="widget-item">
                            <img src={demoIcon1} alt="Company Research" /> 
                            <div>
                                <h3>Company Research</h3>
                                <p>Offers comprehensive research reports by leading brokerage firms</p>
                            </div>
                        </div>

                        <div className="widget-item">
                            <img src={demoIcon} alt="Mutual Fund Performers" /> 
                            <div>
                                <h3>Mutual Fund Performers</h3>
                                <p>A useful widget that shows the Top Gainer and Top Loser Funds</p>
                            </div>
                        </div>

                        <div className="widget-item">
                          <img src={demoIcon1} alt="FIPI/LIPI Statistics" /> 
                            <div>
                                <h3>FIPI/LIPI Statistics</h3>
                                <p>
                                    A snapshot of foreign and local investors' portfolio investments
                                    per trading day
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>

    )
}