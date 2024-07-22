"use client";
import Image from "next/image";
import BannerImage from "@/images/banner-bg-img.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SwiperSlider from "@/components/swiper/swiperSlider";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useTrendingStore } from "@/store/trendingStore";
import { useEffect } from "react";
export default function Home() {
  const { trending, getTrending } = useTrendingStore();
  useEffect(() => {
    getTrending();
  }, [getTrending]);
  return (
    <div className="space-y-6 home-page">
      <section className="container grid grid-cols-2 mx-auto hero-section">
        <div className="flex flex-col justify-center gap-6 content">
          <h1 className="text-6xl font-semibold">
            Best & Fastest <strong className="text-pink">Delivery</strong> in
            Your Place
          </h1>
          <p className="opacity-80">
            Order your food at any time and we will safely delivery them
            straight to your home. We will delivery it on time so you are not
            hungary.
          </p>
          <div className="flex items-center gap-6 action">
            <button className="px-5 py-3 font-semibold text-white duration-75 ease-linear delay-100 bg-pink rounded-e-3xl rounded-bl-3xl hover:opacity-80">
              Get Started
            </button>
            <div className="flex items-center gap-2">
              <button className="play-btn">
                <span className="flex items-center justify-center p-2 bg-white rounded-full shadow-sm ">
                  <PlayArrowIcon />
                </span>
              </button>
              <span className="text-base font-semibold">How to Order!</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <Image src={BannerImage} alt="banner" />
        </div>
      </section>
      <section className="container px-4 py-5 mx-auto bg-gradient-to-l from-white/10 via-white/60 to-white/10">
        <div className="flex items-center justify-between py-6 mx-8">
          <h2 className="text-3xl font-semibold">Trending Recipes</h2>
          <Link className="flex items-center font-semibold text-pink" href="/">
            View All <KeyboardArrowRightIcon />
          </Link>
        </div>
        <div className="mt-3 slider">
          {trending?.length ? (
            <SwiperSlider
              swiperName="trending-swiper"
              navIn={true}
              options={{
                lazy: true,
                slidesPerView: "auto",
                spaceBetween: 40,
                centeredSlides: true,
                loop: true,
              }}
            >
              {trending?.slice(0, 8)?.map(({ recipe }) => (
                <TrendingSlide key={recipe?.label} data={recipe} />
              ))}
            </SwiperSlider>
          ) : null}
        </div>
      </section>
      <section className="container mx-auto">
        <h2 className="mt-10 text-3xl font-semibold text-center">
          Top Collections
        </h2>
        <p className="mt-2 mb-5 text-center opacity-80">
          All our best meals in one delicious snap
        </p>
        <div className="">
          {trending?.length ? (
            <SwiperSlider
              swiperName="collection-swiper"
              navIn={true}
              options={{
                lazy: true,
                slidesPerView: "auto",
                spaceBetween: 40,
                centeredSlides: true,
                loop: true,
              }}
            >
              {trending?.slice(8, 16)?.map(({ recipe }) => (
                <CollectionCard key={recipe?.label} recipe={recipe} />
              ))}
            </SwiperSlider>
          ) : null}
        </div>
      </section>
      <section className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-6 mx-8">
          <h2 className="text-3xl font-semibold">Newest Recipes</h2>
          <Link className="flex items-center font-semibold text-pink" href="/">
            View All <KeyboardArrowRightIcon />
          </Link>
        </div>
        <div className="mt-3 slider">
          {trending?.length ? (
            <SwiperSlider
              swiperName="new-recipe-swiper"
              navIn={true}
              options={{
                lazy: true,
                slidesPerView: "auto",
                spaceBetween: 40,
                centeredSlides: true,
                loop: true,
              }}
            >
              {trending?.slice(16, 24)?.map(({ recipe }) => (
                <NewestRecipe key={recipe?.label} data={recipe} />
              ))}
            </SwiperSlider>
          ) : null}
        </div>
      </section>
      <section className="container px-4 mx-auto bg-gradient-to-l from-white/10 via-[#FCF8F3] to-white/10">
        <div className="flex items-center justify-between pt-10 pb-5 mx-8">
          <h2 className="text-3xl font-semibold">Popular Recipes</h2>
          <Link className="flex items-center font-semibold text-pink" href="/">
            View All <KeyboardArrowRightIcon />
          </Link>
        </div>
        <div className="mt-3 slider">
          {trending?.length ? (
            <SwiperSlider
              swiperName="popular-recipe-swiper"
              navIn={true}
              options={{
                lazy: true,
                slidesPerView: "auto",
                spaceBetween: 40,
                centeredSlides: true,
                loop: true,
              }}
            >
              {trending?.slice(30, 45)?.map(({ recipe }) => (
                <PopularRecipe key={recipe?.label} data={recipe} />
              ))}
            </SwiperSlider>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function TrendingSlide({ data }) {
  return (
    <div style={{ width: "290px" }} className="py-6 swiper-slide">
      <div className="relative p-5 bg-white shadow rounded-ss-3xl rounded-ee-3xl">
        <div className="absolute overflow-hidden rounded-full size-24 -right-6 -top-6">
          <img
            className="absolute object-cover w-full h-full"
            src={data?.image}
            alt={data?.label}
          />
        </div>
        <span className="font-semibold price text-pink">$11.22</span>
        <p className="mt-6 font-semibold title line-clamp-1">{data?.label}</p>
        <p className="text-sm opacity-60">{data?.mealType[0]}</p>
        <div className="flex items-center gap-1 mb-6 text-sm opacity-70">
          4.6{" "}
          <div className="flex items-center stars">
            <StarIcon className="text-base text-yellow-500" />
            <StarIcon className="text-base text-yellow-500" />
            <StarIcon className="text-base text-yellow-500" />
            <StarHalfIcon className="text-base text-yellow-500" />{" "}
            <StarOutlineIcon className="text-base text-yellow-500" />
          </div>
        </div>
        <button className="absolute bottom-0 left-0 px-3 py-2 text-xs font-semibold text-white duration-75 ease-linear delay-100 bg-pink rounded-e-3xl rounded-tl-3xl hover:opacity-80">
          Order Now
        </button>
      </div>
    </div>
  );
}

export function CollectionCard({ recipe }) {
  return (
    <div
      style={{ width: "310px" }}
      className="swiper-slide odd:bg-[#FFEFEF] even:bg-[#F6F5F2] overflow-hidden rounded-tr-[2.5rem] rounded-bl-3xl shadow my-4"
    >
      <div className="relative w-full h-52 rounded-bl-[2.5rem] overflow-hidden">
        <img
          src={recipe?.image}
          alt={recipe?.label}
          className="absolute object-cover w-full h-full"
        />
      </div>
      <p className="px-5 my-6 font-semibold line-clamp-1">{recipe?.label}</p>
    </div>
  );
}
export function NewestRecipe({ data }) {
  return (
    <div style={{ width: "290px" }} className="pt-20 pb-6 swiper-slide">
      <div className="relative p-5 bg-white shadow rounded-3xl">
        <div className="relative mx-auto -mt-[5.5rem] overflow-hidden rounded-full size-32">
          <img
            className="absolute object-cover w-full h-full"
            src={data?.image}
            alt={data?.label}
          />
        </div>
        <p className="h-12 mt-6 font-semibold text-center title line-clamp-2">
          {data?.label}
        </p>
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="">
            <p className="text-sm opacity-60">{data?.mealType[0]}</p>
            <div className="flex items-center gap-1 text-sm opacity-70">
              4.6{" "}
              <div className="flex items-center stars">
                <StarIcon className="text-base text-yellow-500" />
                <StarIcon className="text-base text-yellow-500" />
                <StarIcon className="text-base text-yellow-500" />
                <StarHalfIcon className="text-base text-yellow-500" />{" "}
                <StarOutlineIcon className="text-base text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="duration-100 ease-linear delay-75 rounded-full shadow-md size-10 hover:shadow-none group ">
              <FavoriteBorderIcon className="text-lg " />
            </button>
            <button className="duration-100 ease-linear delay-75 rounded-full shadow-md size-10 hover:shadow-none group ">
              <AddShoppingCartIcon className="text-lg " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PopularRecipe({ data }) {
  return (
    <div style={{ width: "290px" }} className="pt-20 pb-6 swiper-slide">
      <div className="relative">
        <div className="relative z-10 p-5 shadow bg-white/30 backdrop-blur rounded-3xl">
          <div className="relative mx-auto -mt-[5.5rem] overflow-hidden rounded-full size-32">
            <img
              className="absolute object-cover w-full h-full"
              src={data?.image}
              alt={data?.label}
            />
          </div>
          <p className="h-12 mt-6 font-semibold text-center title line-clamp-2">
            {data?.label}
          </p>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-gray)]">
            <div className="">
              <p className="text-sm opacity-80">{data?.mealType[0]}</p>
              <div className="flex items-center gap-1 text-sm opacity-70">
                4.6{" "}
                <div className="flex items-center stars">
                  <StarIcon className="text-base text-yellow-500" />
                  <StarIcon className="text-base text-yellow-500" />
                  <StarIcon className="text-base text-yellow-500" />
                  <StarHalfIcon className="text-base text-yellow-500" />{" "}
                  <StarOutlineIcon className="text-base text-yellow-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="duration-100 ease-linear delay-75 rounded-full shadow-md size-10 hover:shadow-none group ">
                <FavoriteBorderIcon className="text-lg " />
              </button>
              <button className="duration-100 ease-linear delay-75 rounded-full shadow-md size-10 hover:shadow-none group ">
                <AddShoppingCartIcon className="text-lg " />
              </button>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 left-0 z-0 object-cover w-full h-full rounded-3xl"
          src={data?.image}
          alt={data?.label}
        />
      </div>
    </div>
  );
}
