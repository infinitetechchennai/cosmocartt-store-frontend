import { useState } from "react";
import { Product } from "../types";
import { Search, Plus, Trash2, Edit2, Check, RefreshCw } from "lucide-react";


interface ProductsViewProps {
  products: Product[];
  setProducts: (prods: Product[]) => void;
}

export default function ProductsView({ products, setProducts }: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    sku: "",
    costPrice: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    stock: 0,
    image: "",
    status: "Active",
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleAddProduct = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      const data = await res.json();

      if (data.success) {
        setProducts([data.product, ...products]);

        setShowModal(false);

        setNewProduct({
          name: "",
          brand: "",
          category: "",
          subcategory: "",
          sku: "",
          costPrice: 0,
          wholesalePrice: 0,
          retailPrice: 0,
          stock: 0,
          image: "",
          status: "Active",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct?._id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${editProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProduct),
        }
      );

      const data = await res.json();

      if (data.success) {
        setProducts(
          products.map((p) =>
            p._id === editProduct._id
              ? data.product
              : p
          )
        );

        setEditProduct(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };



  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        setProducts(
          products.filter((p) => p._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div id="products-view-container" className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-zinc-950 font-sans">
            Corporate Inventory & Products
    </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Manage physical clothing apparel listings, adjust low-stock thresholds, and query SKUs.
    </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800"
        >
          + Add Product
</button>

      </div>

      {/* Main Filter & Table list block */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Search Header */}
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items by product SKU details or clothing brand name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">
                  Actions
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filtered.map((item) => {

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono">
                      {item.sku}
                    </td>

                    <td className="px-6 py-4">
                      {item.brand}
                    </td>

                    <td className="px-6 py-4">
                      {item.category}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {item.stock}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => setEditProduct(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item._id!)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {
        editProduct && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-4">
                Edit Product
      </h2>

              <div className="grid grid-cols-2 gap-4">

                <input
                  className="border p-2 rounded"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  className="border p-2 rounded"
                  value={editProduct.brand}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      brand: e.target.value,
                    })
                  }
                />

                <input
                  className="border p-2 rounded"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value,
                    })
                  }
                />

                <input
                  className="border p-2 rounded"
                  value={editProduct.subcategory}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      subcategory: e.target.value,
                    })
                  }
                />

                <input
                  className="border p-2 rounded"
                  value={editProduct.sku}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      sku: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  className="border p-2 rounded"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      stock: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  className="border p-2 rounded"
                  value={editProduct.costPrice}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      costPrice: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  className="border p-2 rounded"
                  value={editProduct.wholesalePrice}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      wholesalePrice: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  className="border p-2 rounded"
                  value={editProduct.retailPrice}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      retailPrice: Number(e.target.value),
                    })
                  }
                />

                <input
                  className="border p-2 rounded col-span-2"
                  value={editProduct.image}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      image: e.target.value,
                    })
                  }
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
        </button>

                <button
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Update Product
        </button>

              </div>

            </div>
          </div>
        )
      }




      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-4">
              Add Product
      </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Product Name"
                className="border p-2 rounded"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Brand"
                className="border p-2 rounded"
                value={newProduct.brand}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    brand: e.target.value,
                  })
                }
              />

              <input
                placeholder="Category"
                className="border p-2 rounded"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
              />

              <input
                placeholder="Subcategory"
                className="border p-2 rounded"
                value={newProduct.subcategory}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    subcategory: e.target.value,
                  })
                }
              />

              <input
                placeholder="SKU"
                className="border p-2 rounded"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    sku: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Stock"
                className="border p-2 rounded"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Cost Price"
                className="border p-2 rounded"
                value={newProduct.costPrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    costPrice: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Wholesale Price"
                className="border p-2 rounded"
                value={newProduct.wholesalePrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    wholesalePrice: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Retail Price"
                className="border p-2 rounded"
                value={newProduct.retailPrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    retailPrice: Number(e.target.value),
                  })
                }
              />

              <input
                placeholder="Image URL"
                className="border p-2 rounded col-span-2"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    image: e.target.value,
                  })
                }
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
        </button>

              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save Product
        </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
