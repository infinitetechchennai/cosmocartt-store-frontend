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
        addToCart,
        buyNow
    } = useCart();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);

    const [product, setProduct] = useState<any>(null);

    const [selectedImage, setSelectedImage] =
        useState("");

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
        retailPrice
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

    useEffect(() => {

        window.scrollTo(0, 0);
        fetch(`http://localhost:5000/api/products/${id}`)
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

                const res = await fetch(
                    `http://localhost:5000/api/reviews/product/${id}`
                );

                const data = await res.json();

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

        if (!product) return;

        document.title = `${product.name} | CosmoCartt`;

        let metaDescription =
            document.querySelector('meta[name="description"]');

        if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.setAttribute("name", "description");
            document.head.appendChild(metaDescription);
        }

        metaDescription.setAttribute(
            "content",
            product.description
                ? product.description.slice(0, 160)
                : `Buy ${product.name} by ${product.brand} online at CosmoCartt.`
        );

        let structuredData =
            document.getElementById("product-structured-data");

        if (!structuredData) {
            structuredData = document.createElement("script");
            structuredData.id = "product-structured-data";
            (structuredData as HTMLScriptElement).type = "application/ld+json";
            document.head.appendChild(structuredData);
        }

        structuredData.textContent = JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images?.map(
                (img: string) => `http://localhost:5000${img}`
            ),
            description: product.description || product.name,
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
                    }
                }
                : {})
        });

    }, [product, averageRating, reviewCount, displayPrice]);

    const submitReview = async () => {

        if (!user) {
            toast.error("Please login to write a review");
            return;
        }

        setSubmittingReview(true);

        try {

            const res = await fetch(
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

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Could not submit review");
                return;
            }

            const newAverage =
                Math.round(
                    (
                        (
                            (averageRating * reviewCount) +
                            reviewRating
                        ) /
                        (reviewCount + 1)
                    ) * 10
                ) / 10;

            setReviews([data.review, ...reviews]);
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

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* BREADCRUMBS */}

                <nav className="text-sm text-zinc-500 mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 flex-wrap">
                        <li>
                            <Link to="/" className="hover:text-[#4B1E78]">
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

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* LEFT */}

                    <div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm">

                            <img
                                src={`http://localhost:5000${selectedImage}`}
                                alt={product.name}
                                className="w-full rounded-xl"
                            />

                        </div>

                        <div className="flex gap-2 mt-4">
                            {product.images?.map((img: string, index: number) => (

                                <img
                                    key={index}
                                    src={`http://localhost:5000${img}`}
                                    alt={`${product.name} view ${index + 1}`}
                                    onClick={() =>
                                        setSelectedImage(img)
                                    }
                                    className={`w-20 h-20 object-cover cursor-pointer border rounded-lg ${selectedImage === img
                                        ? "border-[#4B1E78] border-2"
                                        : "border-zinc-200"
                                        }`}
                                />
                            ))}
                        </div>

                    </div>

                    {/* RIGHT */}

                    <div>

                        <p className="text-[#4B1E78] font-semibold">
                            {product.brand}
                        </p>

                        <h1 className="text-4xl font-bold mt-2">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-4">

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                ★ {reviewCount > 0 ? averageRating : "New"}
                            </span>

                            <span className="text-zinc-500">
                                {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
                            </span>

                        </div>

                        <div className="mt-6 flex items-center gap-4">

                            <span className="text-4xl font-bold text-[#4B1E78]">
                                ₹{displayPrice?.toLocaleString()}
                            </span>

                            <span className="text-xl text-zinc-400 line-through">
                                ₹{product?.retailPrice?.toLocaleString() || 0}
                            </span>

                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                                {discount}% OFF
                            </span>

                        </div>

                        {
                            user?.customerType === "b2b" &&
                            user?.verificationStatus === "Verified" && (

                                <div className="text-green-600 text-sm font-semibold mt-2">
                                    Wholesale Pricing Applied
                                </div>

                            )
                        }

                        <div className="mt-6">

                            <span
                                className={`font-semibold ${product.stock > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {product.stock > 0
                                    ? `${product.stock} In Stock`
                                    : "Out Of Stock"}
                            </span>

                        </div>

                        <div className="mt-8">

                            <h3 className="font-semibold text-lg mb-3">
                                Product Description
                            </h3>

                            <p className="text-zinc-600 leading-7">
                                {product.description ||
                                    "No description available for this product yet."}
                            </p>

                        </div>

                        {/* QUANTITY */}

                        <div className="mt-8">

                            <h3 className="font-semibold mb-3">
                                Quantity
                            </h3>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            prev > 1 ? prev - 1 : 1
                                        )
                                    }
                                    className="w-10 h-10 border rounded-lg"
                                >
                                    -
                                </button>

                                <span className="font-semibold">
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
                                    className="w-10 h-10 border rounded-lg"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="grid grid-cols-2 gap-4 mt-10">

                            <button
                                onClick={() => {

                                    if (product.stock <= 0) {
                                        alert("Product is out of stock");
                                        return;
                                    }

                                    addToCart({
                                        ...product,
                                        quantity
                                    });
                                }}
                                disabled={product.stock <= 0}
                                className="bg-[#4B1E78] hover:bg-[#39155d] text-white py-4 rounded-xl font-semibold"
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
                                className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300"
                            >
                                Buy Now
                            </button>

                        </div>

                    </div>

                </div>

                {/* SPECIFICATIONS — only shows if real data exists */}

                {product.specifications && product.specifications.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm mt-12">

                        <h2 className="text-2xl font-bold mb-6">
                            Specifications
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">
                            {product.specifications.map((spec: any, index: number) => (
                                <div key={index}>
                                    <strong>{spec.key}:</strong> {spec.value}
                                </div>
                            ))}
                        </div>

                    </div>
                )}

                {/* REVIEWS */}

                <div className="bg-white rounded-3xl p-8 shadow-sm mt-12">

                    <h2 className="text-2xl font-bold mb-6">
                        Customer Reviews {reviewCount > 0 && `(${reviewCount})`}
                    </h2>

                    {user ? (
                        !userHasReviewed ? (
                            <div className="border border-zinc-200 rounded-2xl p-6 mb-8">

                                <h3 className="font-semibold mb-3">
                                    Write a Review
                                </h3>

                                <div className="flex items-center gap-2 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
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
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    className="w-full border rounded-xl p-3 text-sm"
                                    rows={3}
                                />

                                <button
                                    onClick={submitReview}
                                    disabled={submittingReview}
                                    className="mt-3 bg-[#4B1E78] hover:bg-[#39155d] text-white py-2 px-6 rounded-xl font-semibold disabled:opacity-50"
                                >
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </button>

                                <p className="text-xs text-zinc-400 mt-2">
                                    Only customers who have purchased this product can leave a review.
                                </p>

                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 mb-8">
                                You've already reviewed this product.
                            </p>
                        )
                    ) : (
                        <p className="text-sm text-zinc-500 mb-8">
                            <Link to="/login" className="text-[#4B1E78] font-semibold hover:underline">
                                Login
                            </Link>{" "}
                            to write a review.
                        </p>
                    )}

                    {reviewLoading && (
                        <p className="text-sm text-zinc-400">Loading reviews...</p>
                    )}

                    {!reviewLoading && reviews.length === 0 && (
                        <p className="text-sm text-zinc-400">
                            No reviews yet. Be the first to review this product.
                        </p>
                    )}

                    {!reviewLoading && reviews.length > 0 && (
                        <div className="space-y-6 divide-y divide-zinc-100">
                            {reviews.map((review) => (
                                <div key={review._id} className="pt-6 first:pt-0">

                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400">
                                            {"★".repeat(review.rating)}
                                            <span className="text-zinc-200">
                                                {"★".repeat(5 - review.rating)}
                                            </span>
                                        </span>
                                        <span className="font-semibold text-zinc-900">
                                            {review.customerName}
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p className="text-zinc-600 mt-2 leading-6">
                                            {review.comment}
                                        </p>
                                    )}

                                    <p className="text-xs text-zinc-400 mt-2">
                                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </p>

                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>

            <Footer />
        </div>
    );
}