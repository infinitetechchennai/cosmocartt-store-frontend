import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({
    children
}: {
    children: ReactNode;
}) => {

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const login = (userData: any) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

        window.location.reload();
    };

    const logout = () => {

        localStorage.removeItem("user");

        setUser(null);

        window.location.reload();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);