import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Swiper styles import karein
import 'swiper/css';
import barnd01 from '../../assets/new/icon/barnd01-2.png';
import barnd02 from '../../assets/new/icon/barnd02-2.png';
import barnd03 from '../../assets/new/icon/barnd03-2.png';
import barnd04 from '../../assets/new/icon/barnd04-2.png';
import barnd05 from '../../assets/new/icon/barnd05-2.png';
import barnd06 from '../../assets/new/icon/barnd06-2.png';


const LogoSlider = () => {
  const logos = [
    { name: 'Slack', url: barnd01 },
    { name: 'Dropbox', url: barnd02 },
    { name: 'Webflow', url: barnd03 },
    { name: 'Zoom', url: barnd04 },
    { name: 'Coinbase', url: barnd05 },
    { name: 'Spotify', url: barnd06 },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="bg-[#eefcf7] py-5 flex justify-center items-center ">
      <div className='w-5/6 '>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          slidesPerView={2} 
          loop={true}
          speed={4000} 
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          className="flex items-center"
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center">
              <img
                src={logo.url}
                alt={logo.name}
                className="h-15 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default LogoSlider;