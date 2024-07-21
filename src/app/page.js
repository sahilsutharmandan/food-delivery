import Image from "next/image";
import BannerImage from "@/images/banner-bg-img.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SwiperSlider from "@/components/swiper/swiperSlider";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Logo from "@/images/logo.png";
export default function Home() {
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
          <Image src={BannerImage} />
        </div>
      </section>
      <section className="container px-4 py-6 mx-auto bg-white/30 h-96">
        <div className="flex items-center justify-between py-6 mx-8">
          <h2 className="text-3xl font-semibold">Trending Recipes</h2>
          <Link className="flex items-center font-semibold text-pink" href="/">
            View All <KeyboardArrowRightIcon />
          </Link>
        </div>
        <div className="mt-3 slider">
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
            {Array(15)
              .fill(1)
              .map((i) => (
                <TrendingSlide key={i} data={i} />
              ))}
          </SwiperSlider>
        </div>
      </section>
      <section className="container py-6 mx-auto h-96">
        <h2 className="text-3xl font-semibold text-center">Top Collections</h2>
        <p className="mt-2 text-center opacity-80">
          All our best meals in one delicious snap
        </p>
      </section>
    </div>
  );
}

export function TrendingSlide({ data }) {
  return (
    <div style={{ width: "290px" }} className="py-6 swiper-slide">
      <div className="relative p-5 bg-white shadow rounded-ss-3xl rounded-ee-3xl">
        <div className="absolute size-24 -right-6 -top-6">
          <Image src={Logo} />
        </div>
        <span className="font-semibold price text-pink">$11.22</span>
        <span className="block mt-6 font-semibold title">Pepear Steak</span>
        <p className="text-sm opacity-60">Restaurant Recommendation</p>
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
