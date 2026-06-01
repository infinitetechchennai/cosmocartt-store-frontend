import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Brands from "../components/Brands";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import Stats from "../components/Stats";

export default function Home() {

    return (

        <div className="min-h-screen bg-slate-50">

            <AnnouncementBar />

            <Navbar />

            <Hero />

            <Categories />

            <Stats />

            <FeaturedProducts />

            <Brands />

            <Footer />

        </div>

    );
}