import ProductCard from "./ProductCard";
import { products } from "../data/products";

export default function FeaturedProducts() {

    return (

        <section className="max-w-7xl mx-auto px-6 py-16">

            <h2 className="text-3xl font-bold mb-8">
                Featured Products
      </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {products.map((product) => (

                    <ProductCard
                        key={product.id}
                        product={product}
                    />

                ))}

            </div>

        </section>

    );
}