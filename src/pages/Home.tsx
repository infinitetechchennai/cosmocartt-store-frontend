import Navbar from "../components/Navbar";
import FeaturedProducts from "../components/FeaturedProducts";
import Brands from "../components/Brands";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import Stats from "../components/Stats";
import PremiumBanner from "../components/PremiumBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import CategoryNavbar from "../components/CategoryNavbar";
import QuickLinks from "../components/QuickLinks";
import DealBanner from "../components/DealBanner";
import TopDeals from "../components/TopDeals";
import TrendingProducts from "../components/TrendingProducts";
import CategoryShowcase from "../components/CategoryShowcase";
import AIExperienceSection from "../components/AIExperienceSection";
import CampaignBanner from "../components/CampaignBanner";

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
    <div className="min-h-screen bg-white">

      <AnnouncementBar />

      <Navbar />

      <CategoryNavbar />

      <QuickLinks />

      {/* HERO SLIDER */}
      <div className="max-w-7xl mx-auto px-4 mt-4 relative">
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
          className="rounded-3xl overflow-hidden shadow-2xl home-swiper"
        >
          <SwiperSlide>
            <img
              src={mobileBanner}
              alt="Mobile Cases"
              className="w-full h-[500px] object-cover"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={tvBanner}
              alt="TV Remote"
              className="w-full h-[500px] object-cover"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={acBanner}
              alt="AC Remote"
              className="w-full h-[500px] object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* <Categories /> */}

      <CampaignBanner />

      <TrendingProducts />

      <Stats />

      <CategoryShowcase />

      <WhyChooseUs />

      <PremiumBanner />

      <FeaturedProducts />

      <TopDeals />

      <DealBanner />

      {/* NEW AI EXPERIENCE SECTION */}
      <AIExperienceSection />

      <Brands />

      {/* <Testimonials /> */}

      <Newsletter />

      <Footer />

    </div>
  );
}