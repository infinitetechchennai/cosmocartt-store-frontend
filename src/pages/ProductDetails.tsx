import { API_URL, apiPath } from "../config/api";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import {
    getDisplayPrice
} from "../utils/pricing";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductDetails() {

    const user =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );

    const { id } = useParams();

    const {
        addToCart
    } = useCart();

    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [bulkQuantity, setBulkQuantity] = useState(25);
    const [product, setProduct] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] =
        useState({
            x: 50,
            y: 50
        });
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const isB2BVerified =
        user?.customerType === "b2b" &&
        user?.verificationStatus === "Verified";

    const displayPrice =
        product
            ? getDisplayPrice(
                product,
                user
            )
            : 0;

    const retailPrice =
        product?.retailPrice || 0;

    const discount =
        retailPrice &&
            displayPrice < retailPrice
            ? Math.round(
                (
                    (
                        retailPrice -
                        displayPrice
                    ) /
                    retailPrice
                ) * 100
            )
            : 0;

    const userHasReviewed = user
        ? reviews.some(
            (r) =>
                r.userId === user._id
        )
        : false;

    const ratingCounts =
        [5, 4, 3, 2, 1].map((rating) => {

            const count =
                reviews.filter(
                    (review) =>
                        review.rating === rating
                ).length;

            const percentage =
                reviewCount > 0
                    ? Math.round(
                        (count / reviewCount) * 100
                    )
                    : 0;

            return {
                rating,
                count,
                percentage
            };

        });

    const productInfo = [
        ["Brand", product?.brand],
        ["Model", product?.model || "Not specified"],
        ["Category", product?.category],
        ["Subcategory", product?.subcategory],
        ["SKU", product?.sku],
        ["HSN Code", product?.hsnCode || "Not specified"],
        ["GST", `${product?.gstPercentage || 0}%`],
        ["Seller", product?.sellerName || "CosmoCartt"]
    ];

    const highlights = [
        "Premium quality product selected for everyday use",
        "GST invoice support for business and personal purchases",
        "Secure checkout with COD and online payment options",
        "Verified purchase reviews from real CosmoCartt customers",
        "Fast dispatch support with order tracking after shipment"
    ];

    const trustBadges = [
        { icon: "🔒", title: "Secure Pay", text: "256-bit encrypted checkout" },
        { icon: "💳", title: "COD Available", text: "Pay when it arrives" },
        { icon: "🧾", title: "GST Bill", text: "Tax invoice included" },
        { icon: "🚚", title: "Fast Ship", text: "Dispatched in 24-48 hrs" }
    ];

    useEffect(() => {

        window.scrollTo(0, 0);

        const loadProduct = async () => {

            try {

                const isMongoId =
                    /^[0-9a-fA-F]{24}$/.test(
                        id || ""
                    );

                const productUrl =
                    isMongoId
                        ? `${API_URL}/api/products/${id}`
                        : `${API_URL}/api/products/slug/${id}`;

                const res =
                    await fetch(productUrl);

                const data =
                    await res.json();

                if (data.success) {

                    setProduct(data.product);

                    setSelectedImage(
                        data.product.images?.[0] || ""
                    );

                    setQuantity(1);
                    setBulkQuantity(25);

                }

            } catch (err) {

                console.error(err);

            }

        };

        loadProduct();

    }, [id]);

    useEffect(() => {

        if (!product?._id) return;

        const loadReviews = async () => {

            setReviewLoading(true);

            try {

                const res =
                    await fetch(
                        `${API_URL}/api/reviews/product/${product._id}`
                    );

                const data =
                    await res.json();

                if (data.success) {

                    setReviews(data.reviews || []);
                    setAverageRating(data.averageRating || 0);
                    setReviewCount(data.reviewCount || 0);

                }

            } catch (err) {

                console.error(err);

            } finally {

                setReviewLoading(false);

            }

        };

        loadReviews();

    }, [product?._id]);

    useEffect(() => {

        if (!product?._id) return;

        const loadRelatedProducts = async () => {

            try {

                const res =
                    await fetch(
                        `${API_URL}/api/products/related/${product._id}`
                    );

                const data =
                    await res.json();

                if (data.success) {

                    setRelatedProducts(
                        data.products || []
                    );

                }

            } catch (err) {

                console.error(err);

            }

        };

        loadRelatedProducts();

    }, [product?._id]);

    useEffect(() => {

        if (!product?._id) return;

        const loadSeo = async () => {

            try {

                const res =
                    await fetch(
                        `${API_URL}/api/products/seo/${product._id}`
                    );

                const data =
                    await res.json();

                if (data.success) {

                    document.title =
                        data.seo.title;

                    let metaDescription =
                        document.querySelector(
                            'meta[name="description"]'
                        );

                    if (!metaDescription) {

                        metaDescription =
                            document.createElement("meta");

                        metaDescription.setAttribute(
                            "name",
                            "description"
                        );

                        document.head.appendChild(
                            metaDescription
                        );

                    }

                    metaDescription.setAttribute(
                        "content",
                        (data.seo.description || product.name).slice(0, 160)
                    );

                    let canonical =
                        document.querySelector(
                            'link[rel="canonical"]'
                        );

                    if (!canonical) {

                        canonical =
                            document.createElement("link");

                        canonical.setAttribute(
                            "rel",
                            "canonical"
                        );

                        document.head.appendChild(
                            canonical
                        );

                    }

                    canonical.setAttribute(
                        "href",
                        data.seo.canonicalUrl
                    );

                }

            } catch (err) {

                console.error(err);

            }

        };

        loadSeo();

    }, [product?._id]);

    useEffect(() => {

        if (!product) return;

        let structuredData =
            document.getElementById(
                "product-structured-data"
            );

        if (!structuredData) {

            structuredData =
                document.createElement("script");

            structuredData.id =
                "product-structured-data";

            (structuredData as HTMLScriptElement).type =
                "application/ld+json";

            document.head.appendChild(
                structuredData
            );

        }

        structuredData.textContent =
            JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product.name,
                sku: product.sku,
                image: product.images?.map(
                    (img: string) =>
                        getImageUrl(img)
                ),
                description:
                    product.description || product.name,
                brand: {
                    "@type": "Brand",
                    name: product.brand
                },
                offers: {
                    "@type": "Offer",
                    url: window.location.href,
                    priceCurrency: "INR",
                    price: displayPrice,
                    availability:
                        product.stock > 0
                            ? "https://schema.org/InStock"
                            : "https://schema.org/OutOfStock"
                },
                ...(reviewCount > 0
                    ? {
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: averageRating,
                            reviewCount: reviewCount
                        },
                        review: reviews.slice(0, 5).map((review) => ({
                            "@type": "Review",
                            author: {
                                "@type": "Person",
                                name: review.customerName
                            },
                            reviewRating: {
                                "@type": "Rating",
                                ratingValue: review.rating,
                                bestRating: 5
                            },
                            reviewBody: review.comment
                        }))
                    }
                    : {})
            });

    }, [product, averageRating, reviewCount, reviews, displayPrice]);

    const submitReview = async () => {

        if (!user) {

            toast.error("Please login to write a review");
            return;

        }

        if (!product?._id) {

            toast.error("Product is still loading");
            return;

        }

        setSubmittingReview(true);

        try {

            const res =
                await fetch(
                    apiPath("/api/reviews"),
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            productId: product._id,
                            userId: user._id,
                            customerName:
                                user.name ||
                                user.contactPerson ||
                                user.businessName ||
                                "Customer",
                            rating: reviewRating,
                            comment: reviewComment
                        })
                    }
                );

            const data =
                await res.json();

            if (!data.success) {

                toast.error(
                    data.message || "Could not submit review"
                );

                return;

            }

            const newAverage =
                Math.round(
                    (
                        (
                            averageRating * reviewCount
                        ) + reviewRating
                    ) /
                    (reviewCount + 1) * 10
                ) / 10;

            setReviews([
                data.review,
                ...reviews
            ]);

            setReviewCount(reviewCount + 1);
            setAverageRating(newAverage);
            setReviewComment("");
            setReviewRating(5);

            toast.success("Review submitted!");

        } catch (err) {

            console.error(err);
            toast.error("Something went wrong");

        } finally {

            setSubmittingReview(false);

        }

    };

    if (!product) {

        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="bg-white border border-zinc-100 rounded-3xl px-8 py-6 shadow-sm text-zinc-500 animate-pulse">
                        Loading product details...
                    </div>
                </div>
                <Footer />
            </div>
        );

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

                {/* BREADCRUMB */}

                <nav
                    className="text-sm text-zinc-500 mb-5 md:mb-6 overflow-x-auto"
                    aria-label="Breadcrumb"
                >
                    <ol className="flex items-center gap-2 whitespace-nowrap">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-[#4B1E78] transition-colors"
                            >
                                Home
                            </Link>
                        </li>

                        <li className="text-zinc-300">›</li>

                        <li>
                            <Link
                                to={`/products?category=${encodeURIComponent(product.category || "")}`}
                                className="hover:text-[#4B1E78] transition-colors"
                            >
                                {product.category}
                            </Link>
                        </li>

                        <li className="text-zinc-300">›</li>

                        <li>
                            <Link
                                to={`/products?category=${encodeURIComponent(product.category || "")}&subcategory=${encodeURIComponent(product.subcategory || "")}`}
                                className="hover:text-[#4B1E78] transition-colors"
                            >
                                {product.subcategory}
                            </Link>
                        </li>

                        <li className="text-zinc-300">›</li>

                        <li className="text-zinc-900 font-semibold truncate max-w-[180px] md:max-w-xs">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* MAIN STAGE — 2 COLUMN, ROBUST AT EVERY BREAKPOINT */}

                <section className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">

                    {/* IMAGE GALLERY — desktop: vertical thumb rail beside hero. mobile: horizontal scroll below. */}

                    <div className="relative bg-white border border-zinc-100 rounded-[2rem] p-4 md:p-6 shadow-sm lg:sticky lg:top-24">

                        <div className="flex gap-4">

                            <div className="hidden md:flex md:flex-col gap-3 w-16 lg:w-20 shrink-0 max-h-[440px] overflow-y-auto pr-1">
                                {product.images?.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedImage(img)
                                        }
                                        className={`shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl border bg-white overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#4B1E78]/30 ${selectedImage === img
                                            ? "border-[#4B1E78] ring-2 ring-[#4B1E78]/20"
                                            : "border-zinc-200 hover:border-zinc-400"
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            <div
                                className="
        relative
        flex-1
        aspect-square
        bg-gradient-to-br
        from-slate-50
        to-white
        rounded-[1.5rem]
        overflow-hidden
        flex
        items-center
        justify-center
        border
        border-zinc-100
        cursor-crosshair
    "
                                onMouseEnter={() =>
                                    setIsZooming(true)
                                }
                                onMouseLeave={() =>
                                    setIsZooming(false)
                                }
                                onMouseMove={(e) => {

                                    const rect =
                                        e.currentTarget.getBoundingClientRect();

                                    const x =
                                        ((e.clientX - rect.left) /
                                            rect.width) *
                                        100;

                                    const y =
                                        ((e.clientY - rect.top) /
                                            rect.height) *
                                        100;

                                    setZoomPosition({
                                        x,
                                        y
                                    });

                                }}
                            >
                                <img
                                    src={getImageUrl(selectedImage || product.images?.[0])}
                                    alt={product.name}
                                    className="
w-full
h-full
object-contain
p-4
"
                                />



                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    Hover to zoom
    </div>
                                <div
                                    className="
        absolute
        top-0
        left-0
        w-28
        h-28
        border
        border-[#4B1E78]
        bg-white/20
        pointer-events-none
        hidden
        lg:block
    "
                                    style={{
                                        display: isZooming
                                            ? "block"
                                            : "none",

                                        left: `calc(${Math.min(85, Math.max(15, zoomPosition.x))}% - 56px)`,

                                        top: `calc(${Math.min(85, Math.max(15, zoomPosition.y))}% - 56px)`
                                    }}
                                />

                            </div>

                        </div>

                        <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-1">
                            {product.images?.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        setSelectedImage(img)
                                    }
                                    className={`shrink-0 w-20 h-20 rounded-xl border bg-white overflow-hidden transition-all ${selectedImage === img
                                        ? "border-[#4B1E78] ring-2 ring-[#4B1E78]/20"
                                        : "border-zinc-200"
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {isZooming && (

                            <div
                                className="
            hidden
            xl:block
            absolute
            left-[105%]
top-0
            w-[520px]
            h-[520px]
            bg-white
            border
            border-zinc-200
            rounded-[2rem]
shadow-[0_30px_80px_rgba(0,0,0,0.18)]
overflow-hidden
z-50
pointer-events-none
        "
                            >
                                <img
                                    src={getImageUrl(selectedImage || product.images?.[0])}
                                    alt="Zoom Preview"
                                    className="w-full h-full object-cover"
                                    style={{
                                        transform: `scale(2.8) translate(${(50 - zoomPosition.x) / 2
                                            }%, ${(50 - zoomPosition.y) / 2
                                            }%)`,
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                    }}
                                />
                            </div>

                        )}

                        {/* RIGHT COLUMN — title, price, trust, buy box */}

                    </div>

                    {/* RIGHT COLUMN — title, price, trust, buy box, bulk order. one natural stack at every width. */}

                    <div className="flex flex-col gap-5">

                        <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 md:p-7 shadow-sm">

                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-[#4B1E78]/10 text-[#4B1E78] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                                    {product.brand}
                                </span>

                                {product.model && (
                                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                                        {product.model}
                                    </span>
                                )}

                                {isB2BVerified && (
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Verified B2B Pricing
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 leading-tight tracking-tight mt-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3 flex-wrap mt-3 text-sm">

                                <a
                                    href="#reviews"
                                    className="inline-flex items-center gap-1.5 bg-green-600 text-white px-2.5 py-1 rounded-full font-bold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    ★ {reviewCount > 0 ? averageRating : "New"}
                                </a>

                                <a
                                    href="#reviews"
                                    className="text-[#4B1E78] font-semibold hover:underline"
                                >
                                    {reviewCount} {reviewCount === 1 ? "Verified Review" : "Verified Reviews"}
                                </a>

                                <span className="text-zinc-300">|</span>

                                <span className="text-zinc-500">
                                    SKU: {product.sku || "-"}
                                </span>

                            </div>


                            <div className="mt-5 border-y border-zinc-100 py-5">
                                <div className="flex items-end gap-3 flex-wrap">
                                    <span className="text-3xl md:text-4xl font-black text-[#4B1E78] tracking-tight">
                                        ₹{displayPrice?.toLocaleString()}
                                    </span>

                                    {discount > 0 && (
                                        <>
                                            <span className="text-lg text-zinc-400 line-through pb-0.5">
                                                ₹{retailPrice.toLocaleString()}
                                            </span>

                                            <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-sm font-extrabold">
                                                {discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                <p className="text-sm text-zinc-500 mt-2">
                                    Inclusive of GST. Shipping charges calculated at checkout.
                                </p>

                                {isB2BVerified && (
                                    <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-green-800 font-semibold">
                                        Wholesale pricing has been automatically applied for your verified business account.
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {trustBadges.map((badge) => (
                                    <TrustCard
                                        key={badge.title}
                                        icon={badge.icon}
                                        title={badge.title}
                                        text={badge.text}
                                    />
                                ))}
                            </div>

                            <div className="mt-5">
                                <p
                                    className={`text-sm font-black ${
                                        product.stock <= 0
                                            ? "text-red-600"
                                            : product.stock <= 5
                                                ? "text-red-600"
                                                : product.stock <= 20
                                                    ? "text-amber-600"
                                                    : "text-green-700"
                                    }`}
                                >
                                    {product.stock <= 0
                                        ? "❌ Out of Stock"
                                        : product.stock <= 5
                                            ? `🔥 Hurry! Only ${product.stock} left`
                                            : product.stock <= 20
                                                ? `🟠 Only ${product.stock} left in stock`
                                                : "✅ In Stock"}
                                </p>
                            </div>

                        </div>

                        {/* BUY BOX */}

                        <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 md:p-7 shadow-sm">

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-zinc-900">
                                    Quantity
                                </span>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                prev > 1 ? prev - 1 : 1
                                            )
                                        }
                                        className="w-9 h-9 border border-zinc-200 rounded-xl font-bold bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4B1E78]/30"
                                    >
                                        -
                                    </button>

                                    <span className="font-bold min-w-6 text-center">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                prev < product.stock
                                                    ? prev + 1
                                                    : prev
                                            )
                                        }
                                        disabled={
                                            product.stock <= 0 ||
                                            quantity >= product.stock
                                        }
                                        className="w-9 h-9 border border-zinc-200 rounded-xl font-bold bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#4B1E78]/30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-5">
                                <button
                                    onClick={() => {
                                        if (product.stock <= 0) {
                                            toast.error("Product is out of stock");
                                            return;
                                        }

                                        addToCart({
                                            ...product,
                                            quantity
                                        });

                                        toast.success("Added to cart");
                                    }}
                                    disabled={product.stock <= 0}
                                    className="bg-[#4B1E78] hover:bg-[#39155d] active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold transition-all disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B1E78]/40"
                                >
                                    Add To Cart
                                </button>

                                <button
                                    disabled={product.stock <= 0}
                                    onClick={() => {
                                        navigate("/checkout", {
                                            state: {
                                                buyNowProduct: {
                                                    ...product,
                                                    quantity
                                                }
                                            }
                                        });
                                    }}
                                    className="bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold transition-all disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-center text-zinc-500">
                                <span>🚚 Delivery in 3-5 days</span>
                                <span className="border-x border-zinc-100">🧾 GST invoice</span>
                                <span>💳 COD &amp; online pay</span>
                            </div>

                        </div>

                        {/* BULK ORDER — BLUE, AS REQUESTED */}

                        {isB2BVerified && (
                            <div className="bg-blue-50/60 border border-blue-100 rounded-[2rem] p-5 md:p-7">

                                <h3 className="text-lg font-extrabold text-blue-700">
                                    B2B Bulk Order
                                </h3>

                                <p className="text-sm text-blue-700/70 mt-1">
                                    MOQ starts at 25 units with wholesale pricing.
                                </p>

                                <div className="mt-4 bg-white rounded-2xl p-4 border border-blue-100 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500">
                                            MOQ
                                        </span>
                                        <span className="font-bold text-blue-700">
                                            25 Units
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500">
                                            Wholesale Price
                                        </span>
                                        <span className="font-bold text-blue-700">
                                            ₹{product.wholesalePrice}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm font-bold text-zinc-900">
                                        Bulk Quantity
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() =>
                                                setBulkQuantity((prev) =>
                                                    prev > 25 ? prev - 25 : 25
                                                )
                                            }
                                            className="w-9 h-9 border border-blue-200 rounded-xl font-bold bg-white hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            -
                                        </button>

                                        <span className="font-bold min-w-8 text-center text-blue-700">
                                            {bulkQuantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                setBulkQuantity((prev) =>
                                                    prev + 25 <= product.stock
                                                        ? prev + 25
                                                        : prev
                                                )
                                            }
                                            disabled={
                                                bulkQuantity + 25 > product.stock
                                            }
                                            className="w-9 h-9 border border-blue-200 rounded-xl font-bold bg-white hover:bg-blue-50 transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 bg-white rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
                                    <span className="text-sm text-zinc-500">
                                        Bulk Total
                                    </span>
                                    <span className="text-xl font-black text-blue-700">
                                        ₹{(
                                            product.wholesalePrice *
                                            bulkQuantity
                                        ).toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        if (bulkQuantity > product.stock) {
                                            toast.error("Not enough stock available");
                                            return;
                                        }

                                        navigate("/checkout", {
                                            state: {
                                                buyNowProduct: {
                                                    ...product,
                                                    quantity: bulkQuantity,
                                                    price: product.wholesalePrice,
                                                    isBulkOrder: true,
                                                    orderType: "bulk"
                                                }
                                            }
                                        });
                                    }}
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                                >
                                    Place Bulk Order
                                </button>

                            </div>
                        )}



                    </div>



                </section>


                <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 md:p-7 shadow-sm mt-8">
                    <h2 className="text-xl font-extrabold text-zinc-950 mb-4">
                        About this item
                    </h2>

                    <p className="text-zinc-600 leading-7 md:leading-8">
                        {product.description ||
                            "No description available for this product yet."}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 mt-6">
                        {highlights.map((item) => (
                            <div
                                key={item}
                                className="flex gap-3 bg-slate-50 rounded-2xl p-4"
                            >
                                <span className="text-green-600 font-black shrink-0">
                                    ✓
                                </span>
                                <span className="text-sm text-zinc-700 leading-6">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                <section className="grid lg:grid-cols-2 gap-6 mt-8">

                    <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-6">
                            Product Information
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {productInfo.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex justify-between gap-4 border-b border-zinc-100 pb-3"
                                >
                                    <span className="text-zinc-500">
                                        {label}
                                    </span>
                                    <span className="font-bold text-zinc-900 text-right">
                                        {value || "-"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-6">
                            Why buy from CosmoCartt?
                        </h2>

                        <div className="space-y-4">
                            <ReasonRow
                                title="Verified purchase reviews"
                                text="Only customers who purchased this item can post reviews."
                            />
                            <ReasonRow
                                title="Business friendly billing"
                                text="B2B customers get wholesale pricing and GST invoice support."
                            />
                            <ReasonRow
                                title="Order tracking ready"
                                text="Track order status after shipment creation."
                            />
                            <ReasonRow
                                title="Dedicated admin operations"
                                text="Refunds, exchanges and delivery workflows are monitored from the admin panel."
                            />
                        </div>
                    </div>

                </section>


                {
                    product.specifications &&
                    product.specifications.length > 0 && (
                        <section className="bg-white border border-zinc-100 rounded-[2rem] p-6 md:p-8 shadow-sm mt-8">
                            <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-6">
                                Specifications
                            </h2>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                {product.specifications.map((spec: any, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-slate-50 rounded-2xl p-4"
                                    >
                                        <p className="text-zinc-500 text-xs uppercase font-bold">
                                            {spec.key}
                                        </p>
                                        <p className="font-bold text-zinc-900 mt-2">
                                            {spec.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }


                <section
                    id="reviews"
                    className="bg-white border border-zinc-100 rounded-[2rem] p-5 md:p-8 shadow-sm mt-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950">
                                Ratings & Reviews
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Real feedback from verified CosmoCartt buyers.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl px-5 py-3 text-center self-start md:self-auto">
                            <p className="text-2xl md:text-3xl font-black text-[#4B1E78]">
                                {reviewCount > 0 ? averageRating : "New"}
                            </p>
                            <p className="text-xs text-zinc-500 font-semibold mt-1">
                                {reviewCount} reviews
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8">
                        <div>
                            <div className="bg-slate-50 rounded-3xl p-6">
                                <p className="text-yellow-400 text-xl">
                                    {reviewCount > 0
                                        ? "★".repeat(Math.round(averageRating))
                                        : "★★★★★"}
                                    <span className="text-zinc-300">
                                        {reviewCount > 0
                                            ? "★".repeat(5 - Math.round(averageRating))
                                            : ""}
                                    </span>
                                </p>

                                <div className="space-y-3 mt-6">
                                    {ratingCounts.map((item) => (
                                        <div
                                            key={item.rating}
                                            className="grid grid-cols-[42px_1fr_42px] items-center gap-3 text-sm"
                                        >
                                            <span className="text-zinc-600">
                                                {item.rating} ★
                                            </span>
                                            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-400 transition-all duration-500"
                                                    style={{
                                                        width: `${item.percentage}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-zinc-500 text-right">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                {user ? (
                                    !userHasReviewed ? (
                                        <div className="border border-zinc-200 rounded-3xl p-5">
                                            <h3 className="font-bold mb-3">
                                                Write a Review
                                            </h3>

                                            <div className="flex items-center gap-2 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() =>
                                                            setReviewRating(star)
                                                        }
                                                        className={`text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#4B1E78]/30 rounded ${star <= reviewRating
                                                            ? "text-yellow-400"
                                                            : "text-zinc-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                value={reviewComment}
                                                onChange={(e) =>
                                                    setReviewComment(e.target.value)
                                                }
                                                placeholder="Share your experience with this product..."
                                                className="w-full border border-zinc-200 rounded-2xl p-3 text-sm outline-none focus:border-[#4B1E78] transition-colors"
                                                rows={4}
                                            />

                                            <button
                                                onClick={submitReview}
                                                disabled={submittingReview}
                                                className="mt-3 bg-[#4B1E78] hover:bg-[#39155d] text-white py-3 px-6 rounded-2xl font-bold disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B1E78]/40"
                                            >
                                                {submittingReview
                                                    ? "Submitting..."
                                                    : "Submit Review"}
                                            </button>

                                            <p className="text-xs text-zinc-400 mt-2">
                                                Only customers who purchased this product can review it.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-zinc-500">
                                            You've already reviewed this product.
                                        </p>
                                    )
                                ) : (
                                    <p className="text-sm text-zinc-500">
                                        <Link
                                            to="/login"
                                            className="text-[#4B1E78] font-bold hover:underline"
                                        >
                                            Login
                                        </Link>{" "}
                                        to write a review.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            {reviewLoading && (
                                <p className="text-sm text-zinc-400">
                                    Loading reviews...
                                </p>
                            )}

                            {!reviewLoading && reviews.length === 0 && (
                                <p className="text-sm text-zinc-400">
                                    No reviews yet. Be the first to review this product.
                                </p>
                            )}

                            {!reviewLoading && reviews.length > 0 && (
                                <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
                                    {reviews.map((review) => (
                                        <div
                                            key={review._id}
                                            className="border border-zinc-100 rounded-3xl p-5"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">

                                                        <p className="font-bold text-zinc-900">
                                                            {review.customerName}
                                                        </p>

                                                        {review.verifiedPurchase && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                                                ✓ Verified Purchase
                                                            </span>
                                                        )}

                                                    </div>
                                                    <p className="text-yellow-400 mt-1">
                                                        {"★".repeat(review.rating)}
                                                        <span className="text-zinc-200">
                                                            {"★".repeat(5 - review.rating)}
                                                        </span>
                                                    </p>
                                                </div>

                                                <p className="text-xs text-zinc-400 shrink-0">
                                                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </p>
                                            </div>

                                            {review.comment && (
                                                <p className="text-zinc-600 mt-4 leading-7">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>


                {
                    relatedProducts.length > 0 && (
                        <section className="mt-8">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950">
                                        Related Products
                                </h2>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        Similar products customers may also like.
                                </p>
                                </div>

                                <Link
                                    to={`/products?category=${encodeURIComponent(product.category || "")}&subcategory=${encodeURIComponent(product.subcategory || "")}`}
                                    className="hidden sm:inline-flex text-sm font-bold text-[#4B1E78] hover:underline"
                                >
                                    View all
                            </Link>
                            </div>

                            <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item._id}
                                        to={`/product/${item.slug || item._id}`}
                                        className="snap-start shrink-0 w-[240px] md:w-[270px] bg-white rounded-3xl p-4 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow block"
                                    >
                                        <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center">
                                            <img
                                                src={getImageUrl(item.images?.[0])}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        <p className="text-xs text-[#4B1E78] font-bold mt-4 uppercase">
                                            {item.brand}
                                        </p>

                                        <h3 className="font-bold text-zinc-900 mt-1 line-clamp-2 min-h-[48px]">
                                            {item.name}
                                        </h3>

                                        <p className="font-black text-[#4B1E78] mt-2">
                                            ₹{getDisplayPrice(item, user).toLocaleString()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )
                }

            </div >

            <Footer />
        </div >

    );
}

function TrustCard({
    icon,
    title,
    text
}: {
    icon: string;
    title: string;
    text: string;
}) {
    return (
        <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-base">{icon}</p>
            <p className="text-xs font-bold text-zinc-900 mt-1">{title}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{text}</p>
        </div>
    );
}

function ReasonRow({
    title,
    text
}: {
    title: string;
    text: string;
}) {
    return (
        <div className="flex gap-3">
            <span className="w-7 h-7 rounded-full bg-[#4B1E78]/10 text-[#4B1E78] flex items-center justify-center font-black text-sm shrink-0">
                ✓
            </span>
            <div>
                <p className="font-bold text-zinc-900">
                    {title}
                </p>
                <p className="text-sm text-zinc-500 mt-1 leading-6">
                    {text}
                </p>
            </div>
        </div>
    );
}
