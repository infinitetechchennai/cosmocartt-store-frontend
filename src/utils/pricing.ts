export const getDisplayPrice = (
    product: any,
    user: any
) => {

    if (
        user?.customerType === "b2b" &&
        user?.verificationStatus === "Verified"
    ) {
        return (
            product.wholesalePrice ||
            product.retailPrice
        );
    }

    return product.retailPrice;
};