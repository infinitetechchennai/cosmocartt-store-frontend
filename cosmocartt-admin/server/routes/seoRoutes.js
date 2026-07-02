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
<loc>https://www.cosmocartt.com/</loc>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/products</loc>
<changefreq>daily</changefreq>
<priority>0.9</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/about</loc>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/contact</loc>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/faq</loc>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/privacy-policy</loc>
<changefreq>yearly</changefreq>
<priority>0.5</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/terms</loc>
<changefreq>yearly</changefreq>
<priority>0.5</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/shipping-policy</loc>
<changefreq>yearly</changefreq>
<priority>0.5</priority>
</url>

<url>
<loc>https://www.cosmocartt.com/refund-policy</loc>
<changefreq>yearly</changefreq>
<priority>0.5</priority>
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