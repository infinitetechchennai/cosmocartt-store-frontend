import fs from "fs";
import path from "path";

const ROOT = "./server/uploads/backcase";

const rows = [];

function brandFromFolder(folder) {

    const name = folder.toLowerCase();

    if (name.includes("iphone")) return "Apple";
    if (name.includes("samsung")) return "Samsung";
    if (name.includes("vivo")) return "Vivo";
    if (name.includes("oppo")) return "Oppo";
    if (name.includes("realme")) return "Realme";
    if (name.includes("xiaomi")) return "Xiaomi";
    if (name.includes("poco")) return "POCO";
    if (name.includes("iqoo")) return "iQOO";
    if (name.includes("nothing")) return "Nothing";
    if (name.includes("motorola")) return "Motorola";
    if (name.includes("google")) return "Google";
    if (name.includes("infinix")) return "Infinix";
    if (name.includes("1plus")) return "OnePlus";

    return folder;
}

const brandFolders =
    fs.readdirSync(ROOT);

let counter = 1;

for (const brandFolder of brandFolders) {

    const brandPath =
        path.join(ROOT, brandFolder);

    if (
        !fs.statSync(brandPath).isDirectory()
    ) {
        continue;
    }

    const modelFolders =
        fs.readdirSync(brandPath);

    for (const modelFolder of modelFolders) {

        const modelPath =
            path.join(
                brandPath,
                modelFolder
            );

        if (
            !fs.statSync(modelPath)
                .isDirectory()
        ) {
            continue;
        }

        const files =
            fs.readdirSync(modelPath)
                .filter(file =>
                    /\.(jpg|jpeg|png|webp)$/i
                        .test(file)
                );

        if (files.length === 0)
            continue;

        const images =
            files.map(file =>
                `/uploads/backcase/${brandFolder}/${modelFolder}/${file}`
            ).join("|");

        const brand =
            brandFromFolder(
                brandFolder
            );

        const sku =
            `${brand
                .substring(0, 3)
                .toUpperCase()}-${String(counter)
                    .padStart(5, "0")}`;

        rows.push({
            name: modelFolder,
            brand,
            category:
                "Mobile Accessories",
            subcategory:
                "Back Cases",
            description:
                `Premium transparent back case designed for ${modelFolder}. Shockproof protection, precise cutouts and lightweight design.`,
            sku,
            costPrice: 55,
            wholesalePrice: 99,
            retailPrice: 199,
            stock: 50,
            images,
            status: "Active"
        });

        counter++;
    }
}

const headers = [
    "name",
    "brand",
    "category",
    "subcategory",
    "description",
    "sku",
    "costPrice",
    "wholesalePrice",
    "retailPrice",
    "stock",
    "images",
    "status"
];

let csv =
    headers.join(",") + "\n";

rows.forEach(row => {

    csv += headers
        .map(h =>
            `"${String(row[h] ?? "")
                .replace(/"/g, '""')}"`
        )
        .join(",") + "\n";

});

fs.writeFileSync(
    "products.csv",
    csv
);

console.log(
    `Generated ${rows.length} products`
);