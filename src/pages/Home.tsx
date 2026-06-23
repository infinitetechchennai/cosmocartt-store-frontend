import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Brands from "../components/Brands";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import Stats from "../components/Stats";
import PremiumBanner from "../components/PremiumBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import CategoryNavbar from "../components/CategoryNavbar";
import QuickLinks from "../components/QuickLinks";
import DealBanner from "../components/DealBanner";
import FeaturedCategories from "../components/FeaturedCategories";
import TopDeals from "../components/TopDeals";
import FeaturesStrip from "../components/FeaturesStrip";
import TrendingProducts from "../components/TrendingProducts";
import CategoryShowcase from "../components/CategoryShowcase";
import AIExperienceSection from "../components/AIExperienceSection";

import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  EffectFade,
  Navigation,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import mobileBanner from "../assets/mobile-case-banner.jpg";
import tvBanner from "../assets/tv-remote-banner.jpg";
import acBanner from "../assets/acmod.jpeg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">

      <AnnouncementBar />

      <Navbar />

      <CategoryNavbar />

      <QuickLinks />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 mt-6 mb-12 relative">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">

          <Swiper
            modules={[
              Autoplay,
              Pagination,
              EffectFade,
              Navigation,
            ]}
            effect="fade"
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop={true}
            grabCursor={true}
            className="home-swiper"
          >
            <SwiperSlide>
              <img
                src={mobileBanner}
                alt="Mobile Cases"
                className="
                  w-full
                  h-[240px]
                  sm:h-[350px]
                  md:h-[450px]
                  lg:h-[550px]
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src={tvBanner}
                alt="TV Remote"
                className="
                  w-full
                  h-[240px]
                  sm:h-[350px]
                  md:h-[450px]
                  lg:h-[550px]
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src={acBanner}
                alt="AC Remote"
                className="
                  w-full
                  h-[240px]
                  sm:h-[350px]
                  md:h-[450px]
                  lg:h-[550px]
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />
            </SwiperSlide>
          </Swiper>

        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="py-10">
        <TrendingProducts />
      </section>

      {/* STATS */}
      <section className="py-12 bg-white">
        <Stats />
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="py-14 bg-gray-50">
        <CategoryShowcase />
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-14 bg-white">
        <WhyChooseUs />
      </section>

      {/* PREMIUM BANNER */}
      <section className="py-12 px-4">
        <PremiumBanner />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-14 bg-gray-50">
        <FeaturedProducts />
      </section>

      {/* TOP DEALS */}
      <section className="py-14 bg-white">
        <TopDeals />
      </section>

      {/* DEAL BANNER */}
      <section className="py-10 px-4">
        <DealBanner />
      </section>

      {/* AI EXPERIENCE */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-purple-50">
        <AIExperienceSection />
      </section>

      {/* BRANDS */}
      <section className="py-14 bg-white">
        <Brands />
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 px-4">
        <Newsletter />
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}