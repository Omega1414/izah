import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper CSS
import 'swiper/css/navigation'; // Navigation CSS
import 'swiper/css/pagination'; // Pagination CSS
import { Autoplay, Navigation, Pagination } from 'swiper'; // Import necessary modules
import "./swiper.css"
import { Blog } from '../../Context/Context';

const Banner = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { authModel, setAuthModel } = Blog();
  useEffect(() => {
    const header = document.querySelector('header'); // Assuming the header has a <header> tag
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    const handleResize = () => {
      if (header) {
        setHeaderHeight(header.offsetHeight); // Update header height on window resize
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const slides = [
    {
      title: 'Yenilikləri izlə',
      subtitle: 'Yazıçılarımızdan ən son yenilikləri əldə et.',
      imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D',
      buttonText: 'Məqalələri Oxu',
    },
    {
      title: 'İnkişaf Et',
      subtitle: 'Dərin məzmunla biliklərini artır.',
      imageUrl: 'https://images7.alphacoders.com/133/thumb-1920-1338193.png',
      buttonText: 'İndi Öyrən',
    },
    {
      title: 'Kəşf et',
      subtitle: 'Bir çox sahə haqqında ən son məqalələri tap.',
      imageUrl: 'https://i.pinimg.com/originals/82/e7/23/82e723caf0a88a0a900a64c352431e3c.jpg',
      buttonText: 'İndi Kəşf Et',
    },
   
  ];
console.log(authModel)
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-darkBg text-white">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // Include the Autoplay module
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000, // Delay between slides
          disableOnInteraction: false, // Keep autoplay after interaction
        }}
        navigation
        pagination={{ clickable: true }}
        className="swiper-container"
        style={{ height: `calc(100vh - ${headerHeight}px)` }} // Dynamically adjust the height
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                height: '100%',
                backgroundPosition: 'center',
              }}
            >
              <div
                className="absolute inset-0  bg-opacity-50 flex flex-col justify-end items-start p-10"
              >
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-xl font-medium mb-6">
                  {slide.subtitle}
                </p>
                <button onClick={() => setAuthModel(true)} className="bg-blue-800 text-white rounded-full text-lg px-5 py-2 transition-all duration-300 hover:bg-blue-900">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
