import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
import { useEffect } from "react";

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({
    children
}: {
    children: ReactNode;
}) => {

    const [wishlistItems, setWishlistItems] =
        useState<any[]>(() => {

            const user =
                JSON.parse(
                    localStorage.getItem("user") || "null"
                );

            const wishlistKey =
                user
                    ? `wishlist_${user._id}`
                    : "wishlist_guest";

            const saved =
                localStorage.getItem(
                    wishlistKey
                );

            return saved
                ? JSON.parse(saved)
                : [];
        });

    useEffect(() => {

        const user =
            JSON.parse(
                localStorage.getItem("user") || "null"
            );

        const wishlistKey =
            user
                ? `wishlist_${user._id}`
                : "wishlist_guest";

        const saved =
            localStorage.getItem(
                wishlistKey
            );

        setWishlistItems(
            saved
                ? JSON.parse(saved)
                : []
        );

    }, []);

    const addToWishlist = (product: any) => {

        const exists =
            wishlistItems.find(
                (item) => item._id === product._id
            );

        if (exists) return;

        const updated = [
            ...wishlistItems,
            product
        ];

        setWishlistItems(updated);

        const user =
            JSON.parse(
                localStorage.getItem("user") || "null"
            );

        const wishlistKey =
            user
                ? `wishlist_${user._id}`
                : "wishlist_guest";


        localStorage.setItem(
            wishlistKey,
            JSON.stringify(updated)
        );
    };

    const removeFromWishlist = (
        id: string
    ) => {

        const updated =
            wishlistItems.filter(
                (item) => item._id !== id
            );

        setWishlistItems(updated);

        const user =
            JSON.parse(
                localStorage.getItem("user") || "null"
            );

        const wishlistKey =
            user
                ? `wishlist_${user._id}`
                : "wishlist_guest";

        localStorage.setItem(
            wishlistKey,
            JSON.stringify(updated)
        );
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () =>
    useContext(WishlistContext);
