import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get(
    "/sitemap.xml",
    async (req, res) => {

        try {

            const products =
                await Product.find({
                    status: "Active"
                });

            const urls =
                products.map(product => {

                    const slug =
                        product.slug ||
                        product._id;

                    return `
<url>
<loc>https://cosmocartt.com/product/${slug}</loc>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>`;

                }).join("");

            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>https://cosmocartt.com/</loc>
<priority>1.0</priority>
</url>

${urls}

</urlset>`;

            res.header(
                "Content-Type",
                "application/xml"
            );

            res.send(sitemap);

        } catch (error) {

            res.status(500).send(
                error.message
            );

        }

    }
);

router.get(
    "/robots.txt",
    (req, res) => {

        res.type("text/plain");

        res.send(
            `User-agent: *
Allow: /

Sitemap: https://cosmocartt.com/sitemap.xml`
        );

    }
);

export default router;