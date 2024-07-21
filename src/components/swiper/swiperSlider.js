"use client";
import { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import { FreeMode, Navigation, Pagination, Grid } from "swiper/modules";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
function SwiperSlider({
  children,
  options,
  swiperName,
  className,
  navOut = false,
  navIn = false,
}) {
  useEffect(() => {
    const swiper = new Swiper(`.${swiperName}`, {
      modules: [FreeMode, Pagination, Navigation, Grid],
      navigation: {
        nextEl: `.${swiperName}-next`,
        prevEl: `.${swiperName}-prev`,
      },
      ...options,
    });
  }, []);
  return (
    <div className="relative swiper-sliders">
      <div class={`${swiperName} ${className}  overflow-hidden`}>
        <div class="swiper-wrapper">{children}</div>
        {options?.pagination ? <div class="swiper-pagination"></div> : null}
        {navIn ? (
          <>
            <div
              class={`swiper-button-next-unique ${swiperName}-next size-10 rounded-full shadow flex items-center justify-center bg-white absolute -translate-y-1/2 top-1/2 right-8 z-10`}
            >
              <KeyboardArrowRightIcon />
            </div>
            <div
              class={`swiper-button-prev-unique ${swiperName}-prev size-10 rounded-full shadow flex items-center justify-center bg-white absolute -translate-y-1/2 top-1/2 left-8 z-10`}
            >
              <KeyboardArrowLeftIcon />
            </div>
          </>
        ) : null}
      </div>
      {navOut ? (
        <>
          <div class={`swiper-button-next-unique ${swiperName}-next`}>
            <KeyboardArrowRightIcon />
          </div>
          <div class={`swiper-button-prev-unique ${swiperName}-prev`}>
            <KeyboardArrowLeftIcon />
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SwiperSlider;
