import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({
    children
}: {
    children: ReactNode;
}) => {

    const [wishlistItems, setWishlistItems] =
        useState<any[]>(() => {

            const saved =
                localStorage.getItem("wishlist");

            return saved
                ? JSON.parse(saved)
                : [];
        });

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

        localStorage.setItem(
            "wishlist",
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

        localStorage.setItem(
            "wishlist",
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