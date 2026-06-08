import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
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

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50">

            <AnnouncementBar />

            <Navbar />

            <CategoryNavbar />

            <QuickLinks />

            <Hero />

            <FeaturesStrip />


            <FeaturedCategories />

            {/* <Categories /> */}

            <Stats />

            <WhyChooseUs />

            <PremiumBanner />

            <FeaturedProducts />

            <TopDeals />

            <DealBanner />

            <Brands />

            {/* <Testimonials /> */}

            <Newsletter />

            <Footer />

        </div>
    );
}