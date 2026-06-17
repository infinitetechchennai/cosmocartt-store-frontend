import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";

const CartContext = createContext<any>(null);

const getCartKey = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );

    return user
        ? `cart_${user._id}`
        : "cart_guest";
};

export const CartProvider = ({
    children
}: {
    children: ReactNode;
}) => {

    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCart =
            localStorage.getItem(
                getCartKey()
            );

        return savedCart
            ? JSON.parse(savedCart)
            : [];
    });

    useEffect(() => {
        localStorage.setItem(
            getCartKey(),
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    const addToCart = (product: any) => {

        setCartItems((prev) => {

            const existing = prev.find(
                (item) => item._id === product._id
            );

            if (existing) {

                return prev.map((item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const removeFromCart = (_id: string) => {

        setCartItems((prev) => {

            const item = prev.find(
                (p) => p._id === _id
            );

            if (!item) return prev;

            if (item.quantity > 1) {

                return prev.map((p) =>
                    p._id === _id
                        ? {
                            ...p,
                            quantity: p.quantity - 1
                        }
                        : p
                );
            }

            return prev.filter(
                (p) => p._id !== _id
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(
            getCartKey()
        );
    };

    const buyNow = (
        product: any,
        quantity: number
    ) => {

        const item = {
            ...product,
            quantity
        };

        setCartItems([item]);

        localStorage.setItem(
            getCartKey(),
            JSON.stringify([item])
        );

    };

    const deleteItem = (_id: string) => {

        setCartItems((prev) =>
            prev.filter(
                (item) => item._id !== _id
            )
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                buyNow,
                removeFromCart,
                deleteItem,
                clearCart
            }}

        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () =>
    useContext(CartContext);