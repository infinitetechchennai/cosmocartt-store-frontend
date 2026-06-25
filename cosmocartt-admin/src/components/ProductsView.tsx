import { API_URL, apiPath } from "../config/api";
import { useState } from "react";
import { Product } from "../types";
import { Search, Trash2, Edit2 } from "lucide-react";
import { categories } from "../data/categories";

interface ProductsViewProps {
  products: Product[];
  setProducts: (prods: Product[]) => void;
}

const emptyProduct = {
  name: "",
  brand: "",
  model: "",
  category: "",
  description: "",
  subcategory: "",
  sku: "",
  hsnCode: "",
  gstPercentage: 18,
  costPrice: 0,
  wholesalePrice: 0,
  retailPrice: 0,
  stock: 0,
  images: [] as string[],
  status: "Active",
  approvalStatus: "Approved",
};

export default function ProductsView({
  products,
  setProducts,
}: ProductsViewProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [newProduct, setNewProduct] = useState(emptyProduct);

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("blob:")) return image;
    return `${API_URL}${image}`;
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock > 10).length;
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return "SKU-" + random;
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) return alert("Product name is required");
    if (!newProduct.brand.trim()) return alert("Brand is required");
    if (!newProduct.category) return alert("Select a category");
    if (!newProduct.subcategory) return alert("Select a subcategory");
    if (!newProduct.sku.trim()) return alert("SKU is required");
    if (newProduct.retailPrice <= 0)
      return alert("Retail price must be greater than 0");
    if (newProduct.stock < 0) return alert("Stock cannot be negative");
    if (!productFiles.length) return alert("Please upload product images");

    try {
      const formData = new FormData();

      Object.entries(newProduct).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, String(value));
        }
      });

      productFiles.slice(0, 6).forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(apiPath("/api/products"), {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setProducts([data.product, ...products]);
        setShowModal(false);
        setNewProduct(emptyProduct);
        setProductFiles([]);
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct?._id) return;

    if (!editProduct.name.trim()) return alert("Product name is required");
    if (!editProduct.category) return alert("Select category");
    if (!editProduct.subcategory) return alert("Select subcategory");
    if (editProduct.retailPrice <= 0)
      return alert("Retail price must be valid");

    try {
      const res = await fetch(`${API_URL}/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editProduct),
      });

      const data = await res.json();

      if (data.success) {
        setProducts(
          products.map((p) =>
            p._id === editProduct._id ? data.product : p
          )
        );
        setEditProduct(null);
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const toggleStatus = async (product: Product) => {
    const updatedStatus = product.status === "Active" ? "Inactive" : "Active";

    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product,
          status: updatedStatus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProducts(
          products.map((p) =>
            p._id === product._id ? data.product : p
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const exportProductsCSV = () => {
    const headers = [
      "Name",
      "Brand",
      "Model",
      "Category",
      "Subcategory",
      "SKU",
      "HSN Code",
      "GST %",
      "Cost Price",
      "Wholesale Price",
      "Retail Price",
      "Stock",
      "Status",
    ];

    const rows = products.map((product) => [
      product.name,
      product.brand,
      product.model,
      product.category,
      product.subcategory,
      product.sku,
      product.hsnCode || "",
      product.gstPercentage || 18,
      product.costPrice,
      product.wholesalePrice,
      product.retailPrice,
      product.stock,
      product.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${v ?? ""}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.csv";
    link.click();
  };

  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(
      `Delete ${selectedProducts.length} selected products?`
    );

    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE",
          })
        )
      );

      setProducts(
        products.filter((p) => !selectedProducts.includes(p._id))
      );

      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
      alert("Bulk delete failed");
    }
  };

  return (
    <div id="products-view-container" className="space-y-6 text-left">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">
            Corporate Inventory & Products
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Manage product listings, inventory, pricing, images and product status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBulkDelete}
            disabled={selectedProducts.length === 0}
            className="px-4 py-2 text-sm rounded-lg border bg-red-50 border-red-300 text-red-600 disabled:opacity-50"
          >
            Delete
          </button>

          <label className="bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 text-sm font-medium">
            Import CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const response = await fetch(apiPath("/api/products/import"), {
                    method: "POST",
                    body: formData,
                  });

                  const data = await response.json();

                  alert(`Imported: ${data.imported}\nSkipped: ${data.skipped}`);
                  window.location.reload();
                } catch (error) {
                  console.error(error);
                  alert("Import Failed");
                }
              }}
            />
          </label>

          <button
            onClick={exportProductsCSV}
            className="border border-zinc-300 bg-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Export Products CSV
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">Total Products</p>
          <h2 className="text-3xl font-bold mt-2">{totalProducts}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">In Stock</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {inStockProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">Low Stock</p>
          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {lowStockProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">Out Of Stock</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {outOfStockProducts}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by product name, SKU or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-zinc-50 text-xs font-semibold text-zinc-400 uppercase border-b text-left">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-sm">
              {filtered.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => setSelectedProduct(item)}
                  className="hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(item._id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleProduct(item._id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    {item.images?.[0] ? (
                      <img
                        src={getImageUrl(item.images[0])}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-400">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium max-w-[240px] truncate">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-xs font-mono">{item.sku}</td>

                  <td className="px-6 py-4">{item.brand}</td>

                  <td className="px-6 py-4">{item.category}</td>

                  <td className="px-6 py-4 text-center">
                    {item.stock === 0 ? (
                      <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    ) : (
                      <span
                        className={
                          item.stock < 10 ? "text-orange-500 font-semibold" : ""
                        }
                      >
                        {item.stock}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(item);
                      }}
                      className={`px-3 py-1 rounded text-xs font-semibold transition ${item.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                      {item.status}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditProduct(item);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id!);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black/50 z-[9999] overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
              <div className="px-6 py-4 border-b bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Update product information without changing backend structure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[75vh] overflow-y-auto">
                <input
                  className="border p-3 rounded-lg"
                  placeholder="Product Name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />

                <input
                  className="border p-3 rounded-lg"
                  placeholder="Brand"
                  value={editProduct.brand}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, brand: e.target.value })
                  }
                />

                <input
                  className="border p-3 rounded-lg"
                  placeholder="Model"
                  value={editProduct.model || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, model: e.target.value })
                  }
                />

                <input
                  className="border p-3 rounded-lg"
                  placeholder="SKU"
                  value={editProduct.sku}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sku: e.target.value })
                  }
                />

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-500">
                    Product Description
                  </label>
                  <textarea
                    placeholder="Enter product description..."
                    className="border p-3 rounded-lg w-full mt-1"
                    rows={4}
                    maxLength={300}
                    value={editProduct.description || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value.replace(/\s+/g, " "),
                      })
                    }
                  />
                  <p className="text-xs text-zinc-400 mt-1">
                    {(editProduct.description || "").length}/300 characters
                  </p>
                </div>

                <select
                  className="border p-3 rounded-lg"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value,
                      subcategory: "",
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  className="border p-3 rounded-lg"
                  value={editProduct.subcategory}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      subcategory: e.target.value,
                    })
                  }
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((cat) => cat.name === editProduct.category)
                    ?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  placeholder="HSN Code"
                  value={editProduct.hsnCode || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, hsnCode: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                />

                <select
                  value={editProduct.gstPercentage || 18}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      gstPercentage: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value={0}>GST 0%</option>
                  <option value={5}>GST 5%</option>
                  <option value={12}>GST 12%</option>
                  <option value={18}>GST 18%</option>
                  <option value={28}>GST 28%</option>
                </select>

                <input
                  type="number"
                  min="0"
                  placeholder="Stock Quantity"
                  className="border p-3 rounded-lg"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      stock: Number(e.target.value),
                    })
                  }
                />

                <select
                  value={editProduct.approvalStatus || "Approved"}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      approvalStatus: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <input
                  type="number"
                  min="0"
                  placeholder="Cost Price"
                  className="border p-3 rounded-lg"
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
                  min="0"
                  placeholder="Wholesale Price"
                  className="border p-3 rounded-lg"
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
                  min="0"
                  placeholder="Retail Price"
                  className="border p-3 rounded-lg"
                  value={editProduct.retailPrice}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      retailPrice: Number(e.target.value),
                    })
                  }
                />

                <select
                  value={editProduct.status || "Active"}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      status: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-500">
                    Product Images
                  </label>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-2">
                    {(editProduct.images || []).slice(0, 6).map((img, index) => (
                      <img
                        key={`${img}-${index}`}
                        src={getImageUrl(img)}
                        alt={`Product ${index + 1}`}
                        className="h-20 w-full object-cover rounded-lg border"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-zinc-400 mt-2">
                    Image upload update through edit will be connected with Cloudinary in the next media phase.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white sticky bottom-0">
                <button
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
              <div className="px-6 py-4 border-b bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold">Add Product</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Add a complete product with pricing, tax details and up to 6 images.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[75vh] overflow-y-auto">
                <input
                  placeholder="Product Name"
                  className="border p-3 rounded-lg"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />

                <input
                  placeholder="Brand"
                  className="border p-3 rounded-lg"
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                />

                <input
                  placeholder="Model"
                  value={newProduct.model}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, model: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                />

                <div className="flex gap-2">
                  <input
                    value={newProduct.sku}
                    readOnly
                    placeholder="SKU"
                    className="border p-3 rounded-lg w-full bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        sku: generateSKU(),
                      })
                    }
                    className="px-4 bg-black text-white rounded-lg"
                  >
                    Generate
                  </button>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-500">
                    Product Description
                  </label>

                  <textarea
                    placeholder="Enter product description..."
                    className="border p-3 rounded-lg w-full mt-1"
                    rows={4}
                    maxLength={300}
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value.replace(/\s+/g, " "),
                      })
                    }
                  />

                  <p className="text-xs text-zinc-400 mt-1">
                    {(newProduct.description || "").length}/300 characters
                  </p>
                </div>

                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                      subcategory: "",
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={newProduct.subcategory}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      subcategory: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((cat) => cat.name === newProduct.category)
                    ?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  value={newProduct.hsnCode}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, hsnCode: e.target.value })
                  }
                  placeholder="HSN Code, Ex: 4202"
                  className="border p-3 rounded-lg"
                />

                <select
                  value={newProduct.gstPercentage}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      gstPercentage: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value={0}>GST 0%</option>
                  <option value={5}>GST 5%</option>
                  <option value={12}>GST 12%</option>
                  <option value={18}>GST 18%</option>
                  <option value={28}>GST 28%</option>
                </select>

                <input
                  type="number"
                  min="0"
                  placeholder="Stock Quantity"
                  className="border p-3 rounded-lg"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
                    })
                  }
                />

                <select
                  value={newProduct.approvalStatus}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      approvalStatus: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <input
                  type="number"
                  min="0"
                  placeholder="Cost Price"
                  className="border p-3 rounded-lg"
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
                  min="0"
                  placeholder="Wholesale Price"
                  className="border p-3 rounded-lg"
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
                  min="0"
                  placeholder="Retail Price"
                  className="border p-3 rounded-lg"
                  value={newProduct.retailPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      retailPrice: Number(e.target.value),
                    })
                  }
                />

                <select
                  value={newProduct.status}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      status: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-zinc-500">
                    Upload Product Images - Maximum 6
                  </label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="border p-3 rounded-lg w-full mt-1"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).slice(0, 6);
                      if (!files.length) return;

                      setProductFiles(files);

                      setNewProduct({
                        ...newProduct,
                        images: files.map((file) => URL.createObjectURL(file)),
                      });
                    }}
                  />

                  {newProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                      {newProduct.images.map((img, index) => (
                        <img
                          key={`${img}-${index}`}
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-full object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white sticky bottom-0">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setProductFiles([]);
                    setNewProduct(emptyProduct);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-[9999] overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center px-4 py-8">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-1">
                {selectedProduct.name}
              </h2>

              <p className="text-sm text-zinc-500 mb-4">
                {selectedProduct.brand} • {selectedProduct.model || "Standard Model"}
              </p>

              {selectedProduct.images?.[0] && (
                <img
                  src={getImageUrl(selectedProduct.images[0])}
                  className="w-full h-56 object-cover rounded-xl mb-4 border"
                  alt={selectedProduct.name}
                />
              )}

              <p className="text-sm mb-4">
                {selectedProduct.description || "No description"}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <p>
                  <b>Category:</b> {selectedProduct.category}
                </p>
                <p>
                  <b>Subcategory:</b> {selectedProduct.subcategory}
                </p>
                <p>
                  <b>SKU:</b> {selectedProduct.sku}
                </p>
                <p>
                  <b>HSN:</b> {selectedProduct.hsnCode || "-"}
                </p>
                <p>
                  <b>GST:</b> {selectedProduct.gstPercentage || 18}%
                </p>
                <p>
                  <b>Stock:</b> {selectedProduct.stock}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}