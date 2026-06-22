import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import {
    getDisplayPrice
} from "../utils/pricing";

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
    const [product, setProduct] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

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
        retailPrice && displayPrice < retailPrice
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
        ? reviews.some((r) => r.userId === user._id)
        : false;

    const ratingCounts =
        [5, 4, 3, 2, 1].map((rating) => {

            const count =
                reviews.filter((review) => review.rating === rating).length;

            const percentage =
                reviewCount > 0
                    ? Math.round((count / reviewCount) * 100)
                    : 0;

            return {
                rating,
                count,
                percentage
            };

        });

    useEffect(() => {

        window.scrollTo(0, 0);

        const isMongoId =
            /^[0-9a-fA-F]{24}$/.test(
                id || ""
            );

        const productUrl =
            isMongoId
                ? `http://localhost:5000/api/products/${id}`
                : `http://localhost:5000/api/products/slug/${id}`;

        fetch(productUrl)
            .then((res) => res.json())
            .then((data) => {

                if (data.success) {

                    setProduct(data.product);

                    setSelectedImage(
                        data.product.images?.[0] || ""
                    );

                    setQuantity(1);

                }

            })
            .catch((err) => console.error(err));

    }, [id]);

    useEffect(() => {

        const loadReviews = async () => {

            setReviewLoading(true);

            try {

                const res =
                    await fetch(
                        `http://localhost:5000/api/reviews/product/${id}`
                    );

                const data =
                    await res.json();

                if (data.success) {

                    setReviews(data.reviews);
                    setAverageRating(data.averageRating);
                    setReviewCount(data.reviewCount);

                }

            } catch (err) {

                console.error(err);

            } finally {

                setReviewLoading(false);

            }

        };

        loadReviews();

    }, [id]);

    useEffect(() => {

        const loadRelatedProducts = async () => {

            try {

                const res =
                    await fetch(
                        `http://localhost:5000/api/products/related/${product?._id || id}`
                    );

                const data =
                    await res.json();

                if (data.success) {

                    setRelatedProducts(data.products || []);

                }

            } catch (err) {

                console.error(err);

            }

        };

        loadRelatedProducts();

    }, [id]);

    useEffect(() => {

        const loadSeo = async () => {

            if (!product) return;

            try {

                const res =
                    await fetch(
                        `http://localhost:5000/api/products/seo/${product?._id || id}`
                    );

                const data =
                    await res.json();

                if (!data.success) return;

                document.title =
                    data.seo.title;

                let metaDescription =
                    document.querySelector('meta[name="description"]');

                if (!metaDescription) {

                    metaDescription =
                        document.createElement("meta");

                    metaDescription.setAttribute(
                        "name",
                        "description"
                    );

                    document.head.appendChild(metaDescription);

                }

                metaDescription.setAttribute(
                    "content",
                    data.seo.description.slice(0, 160)
                );

                let canonical =
                    document.querySelector('link[rel="canonical"]');

                if (!canonical) {

                    canonical =
                        document.createElement("link");

                    canonical.setAttribute(
                        "rel",
                        "canonical"
                    );

                    document.head.appendChild(canonical);

                }

                canonical.setAttribute(
                    "href",
                    data.seo.canonicalUrl
                );

            } catch (err) {

                console.error(err);

            }

        };

        loadSeo();

    }, [product, id]);

    useEffect(() => {

        if (!product) return;

        let structuredData =
            document.getElementById("product-structured-data");

        if (!structuredData) {

            structuredData =
                document.createElement("script");

            structuredData.id =
                "product-structured-data";

            (structuredData as HTMLScriptElement).type =
                "application/ld+json";

            document.head.appendChild(structuredData);

        }

        structuredData.textContent =
            JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product.name,
                sku: product.sku,
                image: product.images?.map(
                    (img: string) =>
                        `http://localhost:5000${img}`
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

        setSubmittingReview(true);

        try {

            const res =
                await fetch(
                    "http://localhost:5000/api/reviews",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            productId: id,
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
            <div className="min-h-screen flex items-center justify-center">
                Loading Product...
            </div>
        );

    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                <nav
                    className="text-sm text-zinc-500 mb-6"
                    aria-label="Breadcrumb"
                >
                    <ol className="flex items-center gap-2 flex-wrap">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-[#4B1E78]"
                            >
                                Home
                            </Link>
                        </li>

                        <li>/</li>

                        <li>
                            <Link
                                to={`/products?category=${encodeURIComponent(product.category)}`}
                                className="hover:text-[#4B1E78]"
                            >
                                {product.category}
                            </Link>
                        </li>

                        <li>/</li>

                        <li>
                            <Link
                                to={`/products?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(product.subcategory)}`}
                                className="hover:text-[#4B1E78]"
                            >
                                {product.subcategory}
                            </Link>
                        </li>

                        <li>/</li>

                        <li className="text-zinc-900 font-medium truncate max-w-xs">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                <div className="grid lg:grid-cols-[0.95fr_1.1fr_0.75fr] gap-7 items-start">

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100">

                        <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">

                            <img
                                src={`http://localhost:5000${selectedImage}`}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />

                        </div>

                        <div className="grid grid-cols-6 gap-2 mt-4">

                            {product.images?.map((img: string, index: number) => (

                                <button
                                    key={index}
                                    onClick={() =>
                                        setSelectedImage(img)
                                    }
                                    className={`aspect-square rounded-xl border bg-white overflow-hidden ${selectedImage === img
                                        ? "border-[#4B1E78] ring-2 ring-[#4B1E78]/20"
                                        : "border-zinc-200"
                                        }`}
                                >
                                    <img
                                        src={`http://localhost:5000${img}`}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                            ))}

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-zinc-100 min-h-[560px]">

                        <div className="flex items-center gap-3 flex-wrap mb-4">

                            <span className="bg-[#4B1E78]/10 text-[#4B1E78] px-3 py-1 rounded-full text-sm font-bold">
                                {product.brand}
                            </span>

                            {product.model && (
                                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                                    {product.model}
                                </span>
                            )}

                            {product.stock > 0 ? (
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    In Stock
                                </span>
                            ) : (
                                <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    Out Of Stock
                                </span>
                            )}

                        </div>

                        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-950 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-5 flex-wrap">

                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                ★ {reviewCount > 0 ? averageRating : "New"}
                            </span>

                            <a
                                href="#reviews"
                                className="text-[#4B1E78] font-semibold hover:underline text-sm"
                            >
                                {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
                            </a>

                            <span className="text-zinc-300">|</span>

                            <span className="text-sm text-zinc-500">
                                SKU: {product.sku}
                            </span>

                        </div>

                        <div className="mt-7 border-y border-zinc-100 py-7">

                            <div className="flex items-end gap-4 flex-wrap">

                                <span className="text-4xl md:text-5xl font-extrabold text-[#4B1E78]">
                                    ₹{displayPrice?.toLocaleString()}
                                </span>

                                {discount > 0 && (
                                    <>
                                        <span className="text-xl text-zinc-400 line-through">
                                            ₹{retailPrice.toLocaleString()}
                                        </span>

                                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}

                            </div>

                            <p className="text-sm text-zinc-500 mt-3">
                                Inclusive of GST. Shipping calculated at checkout.
                            </p>

                            {user?.customerType === "b2b" &&
                                user?.verificationStatus === "Verified" && (

                                    <div className="text-green-700 bg-green-50 rounded-2xl px-4 py-4 text-sm font-semibold mt-5">
                                        Wholesale pricing applied for your verified B2B account.
                                    </div>

                                )}

                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-7">

                            <div className="bg-slate-50 rounded-2xl p-5">
                                <p className="font-bold text-zinc-900">
                                    GST Invoice
                                </p>
                                <p className="text-sm text-zinc-500 mt-1 leading-6">
                                    Business-ready invoice available.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5">
                                <p className="font-bold text-zinc-900">
                                    Secure Payment
                                </p>
                                <p className="text-sm text-zinc-500 mt-1 leading-6">
                                    COD and online payment support.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5">
                                <p className="font-bold text-zinc-900">
                                    Fast Dispatch
                                </p>
                                <p className="text-sm text-zinc-500 mt-1 leading-6">
                                    Delivery tracking after shipment.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5">
                                <p className="font-bold text-zinc-900">
                                    Verified Reviews
                                </p>
                                <p className="text-sm text-zinc-500 mt-1 leading-6">
                                    Reviews only from real buyers.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100 lg:sticky lg:top-24">

                        <p className="text-sm text-zinc-500">
                            Current price
                        </p>

                        <p className="text-3xl font-extrabold text-[#4B1E78] mt-1">
                            ₹{displayPrice?.toLocaleString()}
                        </p>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 space-y-2 text-sm">

                            <p className="font-semibold text-zinc-900">
                                Delivery options
                            </p>

                            <p className="text-zinc-600 leading-6">
                                Check delivery details during checkout.
                            </p>

                            <p className="text-green-700 font-semibold">
                                {product.stock > 0
                                    ? `${product.stock} units available`
                                    : "Currently unavailable"}
                            </p>

                        </div>

                        <div className="mt-5">

                            <label className="text-sm font-bold text-zinc-900">
                                Quantity
                            </label>

                            <div className="flex items-center gap-3 mt-3">

                                <button
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            prev > 1 ? prev - 1 : 1
                                        )
                                    }
                                    className="w-10 h-10 border rounded-xl font-bold"
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
                                    className="w-10 h-10 border rounded-xl font-bold disabled:opacity-40"
                                >
                                    +
                                </button>

                            </div>

                        </div>

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
                            className="w-full bg-[#4B1E78] hover:bg-[#39155d] text-white py-4 rounded-2xl font-bold mt-6 disabled:bg-gray-300"
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
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold mt-3 disabled:bg-gray-300"
                        >
                            Buy Now
                        </button>

                        <div className="mt-5 text-xs text-zinc-500 space-y-2">

                            <p>✓ Secure checkout</p>
                            <p>✓ GST invoice supported</p>
                            <p>✓ Order tracking available</p>
                            <p>✓ Verified purchase review system</p>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100 mt-10">

                    <h2 className="text-2xl font-extrabold mb-4">
                        About this item
                    </h2>

                    <p className="text-zinc-600 leading-8 max-w-5xl">
                        {product.description ||
                            "No description available for this product yet."}
                    </p>

                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100 mt-6">

                    <h2 className="text-2xl font-extrabold mb-6">
                        Product Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 text-sm">

                        {[
                            ["Brand", product.brand],
                            ["Model", product.model || "Not specified"],
                            ["Category", product.category],
                            ["Subcategory", product.subcategory],
                            ["SKU", product.sku],
                            ["HSN Code", product.hsnCode || "Not specified"],
                            ["GST", `${product.gstPercentage || 0}%`],
                            ["Seller", product.sellerName || "CosmoCartt"]
                        ].map(([label, value]) => (

                            <div
                                key={label}
                                className="flex justify-between gap-6 border-b border-zinc-100 py-4"
                            >
                                <span className="text-zinc-500">
                                    {label}
                                </span>

                                <span className="font-semibold text-zinc-900 text-right">
                                    {value}
                                </span>
                            </div>

                        ))}

                    </div>

                </div>

                {product.specifications &&
                    product.specifications.length > 0 && (

                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100 mt-6">

                            <h2 className="text-2xl font-extrabold mb-6">
                                Specifications
                            </h2>

                            <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 text-sm">

                                {product.specifications.map((spec: any, index: number) => (

                                    <div
                                        key={index}
                                        className="flex justify-between gap-6 border-b border-zinc-100 py-4"
                                    >
                                        <span className="text-zinc-500">
                                            {spec.key}
                                        </span>

                                        <span className="font-semibold text-zinc-900 text-right">
                                            {spec.value}
                                        </span>
                                    </div>

                                ))}

                            </div>

                        </div>

                    )}

                <div
                    id="reviews"
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100 mt-10"
                >

                    <h2 className="text-2xl font-extrabold mb-6">
                        Customer Reviews
                    </h2>

                    <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">

                        <div>

                            <div className="bg-slate-50 rounded-3xl p-6">

                                <p className="text-5xl font-extrabold text-[#4B1E78]">
                                    {reviewCount > 0 ? averageRating : "New"}
                                </p>

                                <p className="text-yellow-400 text-xl mt-2">
                                    {reviewCount > 0
                                        ? "★".repeat(Math.round(averageRating))
                                        : "★★★★★"}
                                    <span className="text-zinc-300">
                                        {reviewCount > 0
                                            ? "★".repeat(5 - Math.round(averageRating))
                                            : ""}
                                    </span>
                                </p>

                                <p className="text-sm text-zinc-500 mt-2">
                                    Based on {reviewCount} verified {reviewCount === 1 ? "review" : "reviews"}
                                </p>

                                <div className="space-y-3 mt-6">

                                    {ratingCounts.map((item) => (

                                        <div
                                            key={item.rating}
                                            className="grid grid-cols-[45px_1fr_40px] items-center gap-3 text-sm"
                                        >
                                            <span className="text-zinc-600">
                                                {item.rating} ★
                                            </span>

                                            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-400"
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
                                                        className={`text-2xl ${star <= reviewRating
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
                                                className="w-full border rounded-2xl p-3 text-sm"
                                                rows={4}
                                            />

                                            <button
                                                onClick={submitReview}
                                                disabled={submittingReview}
                                                className="mt-3 bg-[#4B1E78] hover:bg-[#39155d] text-white py-3 px-6 rounded-2xl font-bold disabled:opacity-50"
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

                                <div className="space-y-4">

                                    {reviews.map((review) => (

                                        <div
                                            key={review._id}
                                            className="border border-zinc-100 rounded-3xl p-5"
                                        >

                                            <div className="flex items-center justify-between gap-4">

                                                <div>

                                                    <p className="font-bold text-zinc-900">
                                                        {review.customerName}
                                                    </p>

                                                    <p className="text-yellow-400 mt-1">
                                                        {"★".repeat(review.rating)}
                                                        <span className="text-zinc-200">
                                                            {"★".repeat(5 - review.rating)}
                                                        </span>
                                                    </p>

                                                </div>

                                                <p className="text-xs text-zinc-400">
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

                </div>

                {relatedProducts.length > 0 && (

                    <div className="mt-10">

                        <h2 className="text-2xl font-extrabold mb-5">
                            Related Products
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                            {relatedProducts.map((item) => (

                                <Link
                                    key={item._id}
                                    to={`/product/${item.slug || item._id}`}
                                    className="bg-white rounded-3xl p-4 shadow-sm border border-zinc-100 hover:shadow-md transition block"
                                >

                                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center">

                                        <img
                                            src={`http://localhost:5000${item.images?.[0]}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />

                                    </div>

                                    <p className="text-xs text-[#4B1E78] font-bold mt-4">
                                        {item.brand}
                                    </p>

                                    <h3 className="font-bold text-zinc-900 mt-1 line-clamp-2">
                                        {item.name}
                                    </h3>

                                    <p className="font-extrabold text-[#4B1E78] mt-2">
                                        ₹{getDisplayPrice(item, user).toLocaleString()}
                                    </p>

                                </Link>

                            ))}

                        </div>

                    </div>

                )}

            </div>

            <Footer />
        </div>
    );
}