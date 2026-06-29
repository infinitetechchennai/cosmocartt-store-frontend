import axios from "axios";

let shiprocketToken = null;

const SHIPROCKET_BASE_URL =
    "https://apiv2.shiprocket.in/v1/external";

const getPickupLocation = () =>
    process.env.SHIPROCKET_PICKUP_LOCATION ||
    "Primary";

const sanitizePhone = (phone = "") =>
    String(phone).replace(/\D/g, "").slice(-10);

const sanitizePincode = (pincode = "") =>
    String(pincode).replace(/\D/g, "").slice(0, 6);

export const clearShiprocketToken = () => {
    shiprocketToken = null;
};

export const getShiprocketToken = async () => {

    try {

        if (shiprocketToken) {
            return shiprocketToken;
        }

        const response =
            await axios.post(
                `${SHIPROCKET_BASE_URL}/auth/login`,
                {
                    email:
                        process.env.SHIPROCKET_EMAIL,

                    password:
                        process.env.SHIPROCKET_PASSWORD
                }
            );

        shiprocketToken =
            response.data.token;

        return shiprocketToken;

    } catch (error) {

        console.error(
            "SHIPROCKET AUTH ERROR:",
            error.response?.data ||
            error.message
        );

        throw error;

    }

};

const requestWithTokenRetry = async (
    requestFn
) => {

    try {

        const token =
            await getShiprocketToken();

        return await requestFn(token);

    } catch (error) {

        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {

            clearShiprocketToken();

            const freshToken =
                await getShiprocketToken();

            return await requestFn(freshToken);

        }

        throw error;

    }

};

export const createShipment =
    async (order) => {

        try {

            const phone =
                sanitizePhone(order.phone);

            const pincode =
                sanitizePincode(order.pincode);

            if (
                !phone ||
                phone.length !== 10
            ) {
                throw new Error(
                    "Invalid customer phone number for Shiprocket"
                );
            }

            if (
                !pincode ||
                pincode.length !== 6
            ) {
                throw new Error(
                    "Invalid customer pincode for Shiprocket"
                );
            }

            const orderItems =
                order.products.map(
                    (item, index) => ({
                        name:
                            item.name ||
                            `Product ${index + 1}`,

                        sku:
                            item.sku ||
                            item.productId ||
                            `SKU-${index + 1}`,

                        units:
                            Number(item.quantity || 1),

                        selling_price:
                            Number(item.price || 0),

                        hsn:
                            item.hsnCode || ""
                    })
                );

            const subTotal =
                Number(
                    order.subtotal ||
                    order.totalAmount ||
                    0
                );

            const payload = {
                order_id:
                    order.orderNumber ||
                    order._id.toString(),

                order_date:
                    new Date(
                        order.createdAt ||
                        Date.now()
                    )
                        .toISOString()
                        .split("T")[0],

                pickup_location:
                    getPickupLocation(),

                billing_customer_name:
                    order.customerName ||
                    "CosmoCartt Customer",

                billing_last_name:
                    "",

                billing_address:
                    order.address ||
                    "Address not provided",

                billing_city:
                    order.city ||
                    "Chennai",

                billing_pincode:
                    pincode,

                billing_state:
                    order.state ||
                    "Tamil Nadu",

                billing_country:
                    "India",

                billing_email:
                    order.email ||
                    "support@cosmocartt.com",

                billing_phone:
                    phone,

                shipping_is_billing:
                    true,

                order_items:
                    orderItems,

                payment_method:
                    order.paymentMethod === "COD"
                        ? "COD"
                        : "Prepaid",

                sub_total:
                    subTotal,

                length:
                    Number(order.packageLength || 10),

                breadth:
                    Number(order.packageBreadth || 10),

                height:
                    Number(order.packageHeight || 10),

                weight:
                    Number(order.packageWeight || 0.5)
            };

            const response =
                await requestWithTokenRetry(
                    async (token) =>
                        axios.post(
                            `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
                            payload,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        )
                );

            return response.data;

        } catch (error) {

            console.error(
                "SHIPROCKET CREATE SHIPMENT ERROR:",
                error.response?.data ||
                error.message
            );

            throw error;

        }

    };

export const getCourierOptions =
    async (shipmentId) => {

        const response =
            await requestWithTokenRetry(
                async (token) =>
                    axios.get(
                        `${SHIPROCKET_BASE_URL}/courier/serviceability/?shipment_id=${shipmentId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )
            );

        return response.data;

    };

export const getShipmentDetails =
    async (shipmentId) => {

        const response =
            await requestWithTokenRetry(
                async (token) =>
                    axios.get(
                        `${SHIPROCKET_BASE_URL}/courier/track/shipment/${shipmentId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )
            );

        return response.data;

    };