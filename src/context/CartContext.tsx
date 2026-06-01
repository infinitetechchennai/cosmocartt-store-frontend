import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";

const CartContext = createContext<any>(null);

export const CartProvider = ({
    children
}: {
    children: ReactNode;
}) => {
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCart = localStorage.getItem("cart");

        return savedCart
            ? JSON.parse(savedCart)
            : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    const addToCart = (product: any) => {
        setCartItems((prev: any[]) => {

            const existing = prev.find(
                (item) => item.id === product.id
            );

            if (existing) {

                return prev.map((item) =>
                    item.id === product.id
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

    const removeFromCart = (id: number) => {

        setCartItems((prev: any[]) => {

            const item = prev.find(
                (p) => p.id === id
            );

            if (!item) return prev;

            if (item.quantity > 1) {

                return prev.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            quantity: p.quantity - 1
                        }
                        : p
                );

            }

            return prev.filter(
                (p) => p.id !== id
            );
        });
    };

    const deleteItem = (id: number) => {
        setCartItems((prev: any[]) =>
            prev.filter((item) => item.id !== id)
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                deleteItem
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () =>
    useContext(CartContext);