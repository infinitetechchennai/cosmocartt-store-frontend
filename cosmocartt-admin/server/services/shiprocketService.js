import axios from "axios";

let shiprocketToken = null;

export const getShiprocketToken = async () => {

    try {

        if (shiprocketToken) {
            return shiprocketToken;
        }

        const response =
            await axios.post(
                "https://apiv2.shiprocket.in/v1/external/auth/login",
                {
                    email:
                        process.env.SHIPROCKET_EMAIL,

                    password:
                        process.env.SHIPROCKET_PASSWORD,
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

export const createShipment =
    async (order) => {

        try {

            const token =
                await getShiprocketToken();

            const response =
                await axios.post(
                    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
                    {
                        order_id:
                            order.orderNumber,

                        order_date:
                            new Date()
                                .toISOString()
                                .split("T")[0],

                        pickup_location:
                            "Home",

                        billing_customer_name:
                            order.customerName,

                        billing_last_name:
                            "",

                        billing_address:
                            order.address,

                        billing_city:
                            order.city,

                        billing_pincode:
                            order.pincode,

                        billing_state:
                            order.state,

                        billing_country:
                            "India",

                        billing_email:
                            order.email,

                        billing_phone:
                            order.phone,

                        shipping_is_billing:
                            true,

                        order_items:
                            order.products.map(
                                (item) => ({
                                    name:
                                        item.name,

                                    sku:
                                        item.productId,

                                    units:
                                        item.quantity,

                                    selling_price:
                                        item.price,
                                })
                            ),

                        payment_method:
                            order.paymentMethod ===
                                "COD"
                                ? "COD"
                                : "Prepaid",

                        sub_total:
                            order.subtotal,

                        length: 10,
                        breadth: 10,
                        height: 10,
                        weight: 0.5,
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
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


export const getCourierOptions = async (
    shipmentId
) => {

    const token =
        await getShiprocketToken();

    const response =
        await axios.get(
            `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?shipment_id=${shipmentId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    return response.data;
};

export const getShipmentDetails = async (
    shipmentId
) => {

    const token =
        await getShiprocketToken();

    const response =
        await axios.get(
            `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};