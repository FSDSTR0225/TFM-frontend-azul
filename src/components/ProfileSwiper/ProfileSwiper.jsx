import React from "react";
import "./ProfileSwiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

export default function ProfileSwiper({
  spaceBetween,
  slidesPerView,
  delay,
  swiperArray,
}) {

  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      autoplay={{
        delay: delay,
        disableOnInteraction: false,
      }}
      // modules={[Autoplay, Pagination, Navigation]}
      modules={[Autoplay]}
      // freeMode={false}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {swiperArray.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="swiperItem">
            <img className="swiperImg" src={item.img} />
            <div className="swiperText">{item.title}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
