import { useState } from "react";
import { Product } from "../types";
import { Search, Plus, Trash2, Edit2, Check, RefreshCw } from "lucide-react";
import { categories } from "../data/categories";
import { Upload } from "lucide-react";



interface ProductsViewProps {
  products: Product[];
  setProducts: (prods: Product[]) => void;
}

export default function ProductsView({ products, setProducts }: ProductsViewProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productFiles, setProductFiles] =
    useState<File[]>([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
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
    images: [],
    status: "Active",

    approvalStatus: "Approved",
  });

  const totalProducts = products.length;

  const inStockProducts =
    products.filter(
      (p) => p.stock > 10
    ).length;

  const lowStockProducts =
    products.filter(
      (p) => p.stock > 0 && p.stock <= 10
    ).length;

  const outOfStockProducts =
    products.filter(
      (p) => p.stock === 0
    ).length;

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

    // 🔴 VALIDATION
    if (!newProduct.name.trim()) {
      return alert("Product name is required");
    }

    if (!newProduct.brand.trim()) {
      return alert("Brand is required");
    }

    if (!newProduct.category) {
      return alert("Select a category");
    }

    if (!newProduct.subcategory) {
      return alert("Select a subcategory");
    }

    if (!newProduct.sku.trim()) {
      return alert("SKU is required");
    }

    if (newProduct.retailPrice <= 0) {
      return alert("Retail price must be greater than 0");
    }

    if (newProduct.stock < 0) {
      return alert("Stock cannot be negative");
    }

    if (
      !newProduct.images ||
      newProduct.images.length === 0
    ) {
      return alert("Please upload product image");
    }

    // 🔵 API CALL
    try {
      const formData = new FormData();

      formData.append(
        "name",
        newProduct.name
      );

      formData.append(
        "brand",
        newProduct.brand
      );

      formData.append(
        "category",
        newProduct.category
      );

      formData.append(
        "subcategory",
        newProduct.subcategory
      );

      formData.append(
        "description",
        newProduct.description
      );

      formData.append(
        "sku",
        newProduct.sku
      );

      formData.append(
        "hsnCode",
        newProduct.hsnCode
      );

      formData.append(
        "gstPercentage",
        String(newProduct.gstPercentage)
      );

      formData.append(
        "costPrice",
        String(newProduct.costPrice)
      );

      formData.append(
        "wholesalePrice",
        String(newProduct.wholesalePrice)
      );

      formData.append(
        "retailPrice",
        String(newProduct.retailPrice)
      );

      formData.append(
        "stock",
        String(newProduct.stock)
      );

      formData.append(
        "status",
        newProduct.status
      );

      formData.append(
        "approvalStatus",
        newProduct.approvalStatus
      );

      productFiles.forEach(file => {
        formData.append(
          "images",
          file
        );
      });

      const res = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          body: formData,
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
          description: "",
          subcategory: "",
          sku: "",
          hsnCode: "",
          gstPercentage: 18,
          costPrice: 0,
          wholesalePrice: 0,
          retailPrice: 0,
          stock: 0,
          images: [],
          status: "Active",

          approvalStatus: "Approved",
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

    if (!editProduct.name.trim()) {
      return alert("Product name is required");
    }

    if (!editProduct.category) {
      return alert("Select category");
    }

    if (!editProduct.subcategory) {
      return alert("Select subcategory");
    }

    if (editProduct.retailPrice <= 0) {
      return alert("Retail price must be valid");
    }

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
            p._id === editProduct._id ? data.product : p
          )
        );

        setEditProduct(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };



  const toggleStatus = async (product: Product) => {
    const updatedStatus = product.status === "Active" ? "Inactive" : "Active";

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product,
            status: updatedStatus,
          }),
        }
      );

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
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((item) => item !== id)
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        id
      ]);
    }
  };

  const toggleSelectAll = () => {
    if (
      selectedProducts.length === products.length
    ) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(
        products.map((p) => p._id)
      );
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

  const generateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return "SKU-" + random;
  };

  const exportProductsCSV = () => {

    const headers = [
      "Name",
      "Brand",
      "Category",
      "Subcategory",
      "SKU",
      "Cost Price",
      "Wholesale Price",
      "Retail Price",
      "Stock",
      "Status"
    ];

    const rows = products.map((product) => [

      product.name,

      product.brand,

      product.category,

      product.subcategory,

      product.sku,

      product.costPrice,

      product.wholesalePrice,

      product.retailPrice,

      product.stock,

      product.status

    ]);

    const csvContent = [

      headers.join(","),

      ...rows.map((row) => row.join(","))

    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "products.csv";

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
          fetch(
            `http://localhost:5000/api/products/${id}`,
            {
              method: "DELETE",
            }
          )
        )
      );

      setProducts(
        products.filter(
          (p) =>
            !selectedProducts.includes(p._id)
        )
      );

      setSelectedProducts([]);

    } catch (error) {

      console.error(error);

      alert("Bulk delete failed");

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



        <div className="flex gap-3">

          <button
            onClick={handleBulkDelete}
            disabled={selectedProducts.length === 0}
            className="
    px-2
    py-0.5
    text-[10px]
    rounded
    border
    bg-red-50
    border-red-300
    text-red-600
    disabled:opacity-50
  "
          >
            Delete
</button>

          <label
            className="
    bg-emerald-600
    text-white
    px-4
    py-2
    rounded-xl
    cursor-pointer
    hover:bg-emerald-700
    flex
    items-center
    gap-2
  "
          >
            Import CSV

  <input
              type="file"
              accept=".csv"
              hidden
              onChange={async (e) => {

                const file = e.target.files?.[0];

                if (!file) return;

                const formData = new FormData();

                formData.append(
                  "file",
                  file
                );

                try {

                  const response =
                    await fetch(
                      "http://localhost:5000/api/products/import",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                  const data =
                    await response.json();

                  alert(
                    `Imported: ${data.imported}
Skipped: ${data.skipped}`
                  );

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
            className="
      border
      border-zinc-300
      bg-white
      px-4
      py-2
      rounded-lg
      text-sm
      font-medium
    "
          >
            Export Products CSV
  </button>

          <button
            onClick={() => setShowModal(true)}
            className="
      bg-black
      text-white
      px-4
      py-2
      rounded-lg
      text-sm
      font-medium
      hover:bg-zinc-800
    "
          >
            + Add Product
  </button>

        </div>

      </div>

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">
            Total Products
    </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">
            In Stock
    </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {inStockProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">
            Low Stock
    </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {lowStockProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">
            Out Of Stock
    </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {outOfStockProducts}
          </h2>
        </div>

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
                    onClick={() => setSelectedProduct(item)}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(item._id)}
                        onChange={() =>
                          toggleProduct(item._id)
                        }
                      />
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={`http://localhost:5000${item.images?.[0]}`}
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
                      {item.stock === 0 ? (
                        <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      ) : (
                        <span
                          className={
                            item.stock < 10
                              ? "text-orange-500 font-semibold"
                              : ""
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {
        editProduct && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
              className="
  bg-white
  rounded-2xl
  p-6
  w-full
  max-w-4xl
  max-h-[90vh]
  overflow-y-auto
"
            >

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


                <div className="col-span-2">
                  <label className="text-xs text-zinc-500">
                    Product Description
  </label>

                  <textarea
                    placeholder="Enter product description..."
                    className="border p-2 rounded w-full mt-1"
                    rows={3}
                    maxLength={300}
                    value={editProduct.description || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s+/g, " ");
                      setEditProduct({
                        ...editProduct,
                        description: value,
                      });
                    }}
                  />

                  <p className="text-xs text-zinc-400 mt-1">
                    {(editProduct.description || "").length}/300 characters
  </p>
                </div>



                <select
                  className="border p-2 rounded"
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
                  className="border p-2 rounded"
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

                <div>
                  <label className="text-xs text-zinc-500">
                    SKU
  </label>

                  <input
                    type="text"
                    value={editProduct.sku}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        sku: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">
                    HSN Code
  </label>

                  <input
                    type="text"
                    value={editProduct.hsnCode || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        hsnCode: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">
                    GST %
  </label>

                  <select
                    value={editProduct.gstPercentage || 18}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        gstPercentage: Number(e.target.value),
                      })
                    }
                    className="border p-2 rounded w-full mt-1"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">
                    Approval Status
  </label>

                  <select
                    value={editProduct.approvalStatus || "Approved"}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        approvalStatus: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mt-1"
                  >
                    <option value="Approved">
                      Approved
    </option>

                    <option value="Pending">
                      Pending
    </option>

                    <option value="Rejected">
                      Rejected
    </option>
                  </select>
                </div>



                {/* STOCK */}
                <div>
                  <label className="text-xs text-zinc-500">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-2 rounded w-full mt-1"
                    value={editProduct.stock}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* COST */}
                <div>
                  <label className="text-xs text-zinc-500">Cost Price (₹)</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full mt-1"
                    value={editProduct.costPrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        costPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* WHOLESALE */}
                <div>
                  <label className="text-xs text-zinc-500">Wholesale Price (₹)</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full mt-1"
                    value={editProduct.wholesalePrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        wholesalePrice: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* RETAIL */}
                <div>
                  <label className="text-xs text-zinc-500">Retail Price (₹)</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full mt-1"
                    value={editProduct.retailPrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        retailPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-zinc-500">
                    Update Product Image
  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="border p-2 rounded w-full mt-1"
                    onChange={(e) => {
                      const files =
                        Array.from(
                          e.target.files || []
                        );
                      if (!file) return;

                      const reader = new FileReader();

                      reader.onloadend = () => {
                        setEditProduct({
                          ...editProduct,
                          image: reader.result as string,
                        });
                      };

                      reader.readAsDataURL(file);
                    }}
                  />

                  {editProduct.images?.[0] && (
                    <img
                      src={editProduct.images?.[0]}
                      alt="preview"
                      className="mt-3 h-20 rounded border"
                    />
                  )}
                </div>

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
          <div
            className="
  bg-white
  rounded-2xl
  p-6
  w-full
  max-w-4xl
  max-h-[90vh]
  overflow-y-auto
"
          >

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

              <div className="col-span-2">
                <label className="text-xs text-zinc-500">
                  Product Description
  </label>

                <textarea
                  placeholder="Enter product description..."
                  className="border p-2 rounded w-full mt-1"
                  rows={3}
                  maxLength={300}
                  value={newProduct.description}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, " ");
                    setNewProduct({
                      ...newProduct,
                      description: value,
                    });
                  }}

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
                    subcategory: ""
                  })
                }
                className="border p-2 rounded"
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
                    subcategory: e.target.value
                  })
                }
                className="border p-2 rounded"
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


              <div className="col-span-2">
                <label className="text-xs text-zinc-500">
                  SKU (Auto Generated)
  </label>

                <div className="flex gap-2">
                  <input
                    value={newProduct.sku}
                    readOnly
                    className="border p-2 rounded w-full bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        sku: generateSKU(),
                      })
                    }
                    className="px-3 bg-black text-white rounded"
                  >
                    Generate
    </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500">
                  HSN Code
  </label>

                <input
                  type="text"
                  value={newProduct.hsnCode}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      hsnCode: e.target.value,
                    })
                  }
                  placeholder="Ex: 4202"
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500">
                  GST %
  </label>

                <select
                  value={newProduct.gstPercentage}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      gstPercentage: Number(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              {/* STOCK */}
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Stock Quantity
  </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter stock (e.g. 50)"
                  className="border p-2 rounded w-full mt-1"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* COST PRICE */}
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Cost Price (₹)
  </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 15000"
                  className="border p-2 rounded w-full mt-1"
                  value={newProduct.costPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      costPrice: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* WHOLESALE */}
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Wholesale Price (₹)
  </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 17000"
                  className="border p-2 rounded w-full mt-1"
                  value={newProduct.wholesalePrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      wholesalePrice: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* RETAIL */}
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Retail Price (₹)
  </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 20000"
                  className="border p-2 rounded w-full mt-1"
                  value={newProduct.retailPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      retailPrice: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-zinc-500">
                  Upload Product Image
  </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="border p-2 rounded w-full mt-1"
                  onChange={(e) => {

                    const files =
                      Array.from(
                        e.target.files || []
                      );

                    if (!files.length) return;

                    setProductFiles(files);

                    setNewProduct({
                      ...newProduct,
                      images: files.map(file =>
                        URL.createObjectURL(file)
                      ),
                    });

                  }}
                />

                {newProduct.images?.[0] && (
                  <img
                    src={newProduct.images?.[0]}
                    alt="preview"
                    className="mt-3 h-20 rounded border"
                  />
                )}
              </div>

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

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-2">
              {selectedProduct.name}
            </h2>

            <p className="text-sm text-zinc-500 mb-3">
              {selectedProduct.brand}
            </p>

            <img
              src={selectedProduct.images?.[0]}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <p className="text-sm mb-3">
              {selectedProduct.description || "No description"}
            </p>

            <p className="text-sm">
              <b>Category:</b> {selectedProduct.category}
            </p>

            <p className="text-sm">
              <b>Stock:</b> {selectedProduct.stock}
            </p>

            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-5 px-4 py-2 bg-black text-white rounded"
            >
              Close
      </button>

          </div>
        </div>
      )}
    </div>
  );
}
