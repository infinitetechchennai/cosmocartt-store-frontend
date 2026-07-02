import { API_URL, apiPath } from "../config/api";
import { useState } from "react";
import { Product } from "../types";
import { Search, Trash2, Edit2, X } from "lucide-react";
import { categories } from "../data/categories";

interface ProductsViewProps {
  products: Product[];
  setProducts: (prods: Product[]) => void;
}

type ProductDraft = {
  faqs: { question: string; answer: string }[];
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  subcategory: string;
  sku: string;
  hsnCode: string;
  gstPercentage: number;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  stock: number;
  images: string[];
  status: string;
  approvalStatus: string;
};

type ProductFormState = ProductDraft & Partial<Pick<Product, "_id" | "image">>;

const emptyProduct: ProductDraft = {
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
  images: [],
faqs: [],
status: "Active",
  approvalStatus: "Approved",
};

export default function ProductsView({ products, setProducts }: ProductsViewProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductFormState | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [editProductFiles, setEditProductFiles] = useState<File[]>([]);

  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProduct);

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("blob:")) return image;
    if (image.startsWith("data:")) return image;
    return `${API_URL}${image}`;
  };

  const safeImages = (item?: Product | ProductDraft | ProductFormState | null) => {
    const images = (item as ProductFormState | undefined)?.images;
    if (!item || !Array.isArray(images)) return [];
    return images.filter(Boolean).slice(0, 6);
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock > 10).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  const filtered = products.filter((p) => {
    const keyword = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(keyword) ||
      p.sku?.toLowerCase().includes(keyword) ||
      p.brand?.toLowerCase().includes(keyword) ||
      p.model?.toLowerCase().includes(keyword)
    );
  });

  const generateSKU = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `COS-${random}`;
  };

  const openEditProduct = (product: Product) => {
    const productState = product as Product & ProductFormState;
    setNewProduct({
      ...productState,
      images: safeImages(productState),
      model: productState.model || "",
      hsnCode: productState.hsnCode || "",
      gstPercentage: productState.gstPercentage || 18,
      approvalStatus: productState.approvalStatus || "Approved",
      status: productState.status || "Active",
      faqs: productState.faqs || [],
    });
    setEditProductFiles([]);
  };

  const resetAddModal = () => {
    setShowModal(false);
    setProductDraft(emptyProduct);
    setProductFiles([]);
  };

  const handleAddProduct = async () => {
    if (!productDraft.name.trim()) return alert("Product name is required");
    if (!productDraft.brand.trim()) return alert("Brand is required");
    if (!productDraft.model.trim()) return alert("Model is required");
    if (!productDraft.category) return alert("Select a category");
    if (!productDraft.subcategory) return alert("Select a subcategory");
    if (!productDraft.sku.trim()) return alert("SKU is required");
    if (productDraft.retailPrice <= 0) return alert("Retail price must be greater than 0");
    if (productDraft.stock < 0) return alert("Stock cannot be negative");
    if (!productFiles.length) return alert("Please upload at least one product image");

    try {
      const formData = new FormData();

      formData.append("name", productDraft.name);
      formData.append("brand", productDraft.brand);
      formData.append("model", productDraft.model);
      formData.append("category", productDraft.category);
      formData.append("subcategory", productDraft.subcategory);
      formData.append("description", productDraft.description);
      formData.append("sku", productDraft.sku);
      formData.append("hsnCode", productDraft.hsnCode);
      formData.append("gstPercentage", String(productDraft.gstPercentage));
      formData.append("costPrice", String(productDraft.costPrice));
      formData.append("wholesalePrice", String(productDraft.wholesalePrice));
      formData.append("retailPrice", String(productDraft.retailPrice));
      formData.append("stock", String(productDraft.stock));
      formData.append("status", productDraft.status);
      formData.append("approvalStatus", productDraft.approvalStatus);
      formData.append("faqs", JSON.stringify(productDraft.faqs));

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
        resetAddModal();
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!newProduct?._id) return;

    if (!newProduct.name.trim()) return alert("Product name is required");
    if (!newProduct.brand.trim()) return alert("Brand is required");
    if (!newProduct.model?.trim()) return alert("Model is required");
    if (!newProduct.category) return alert("Select category");
    if (!newProduct.subcategory) return alert("Select subcategory");
    if (newProduct.retailPrice <= 0) return alert("Retail price must be valid");
    if (!safeImages(newProduct).length && !editProductFiles.length) {
      return alert("At least one image is required");
    }

    try {
      let res: Response;

      if (editProductFiles.length > 0) {
        const formData = new FormData();

        formData.append("name", newProduct.name);
        formData.append("brand", newProduct.brand);
        formData.append("model", newProduct.model || "");
        formData.append("category", newProduct.category);
        formData.append("subcategory", newProduct.subcategory);
        formData.append("description", newProduct.description || "");
        formData.append("sku", newProduct.sku);
        formData.append("hsnCode", newProduct.hsnCode || "");
        formData.append("gstPercentage", String(newProduct.gstPercentage || 18));
        formData.append("costPrice", String(newProduct.costPrice));
        formData.append("wholesalePrice", String(newProduct.wholesalePrice));
        formData.append("retailPrice", String(newProduct.retailPrice));
        formData.append("stock", String(newProduct.stock));
        formData.append("status", newProduct.status || "Active");
        formData.append("approvalStatus", newProduct.approvalStatus || "Approved");
        formData.append("faqs", JSON.stringify(newProduct.faqs || []));
        formData.append("existingImages", JSON.stringify(safeImages(newProduct).filter((img) => !img.startsWith("blob:"))));

        editProductFiles.slice(0, 6).forEach((file) => {
          formData.append("images", file);
        });

        res = await fetch(`${API_URL}/api/products/${newProduct._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch(`${API_URL}/api/products/${newProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newProduct,
            images: safeImages(newProduct),
          }),
        });
      }

      const text = await res.text();

      let data: any = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          success: false,
          message: text
        };
      }


      if (res.ok && data.success) {
        setProducts(products.map((p) => (p._id === newProduct._id ? data.product : p)));
        setNewProduct(null);
        setEditProductFiles([]);
      } else {
        alert(data.message || `Failed to update product. Status: ${res.status}`);
      }
    } catch (err: any) {
      console.error("UPDATE PRODUCT FRONTEND ERROR:", err);
      alert(err?.message || "Failed to update product");
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
        setProducts(products.map((p) => (p._id === product._id ? data.product : p)));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const toggleProduct = (id?: string) => {
    if (!id) return;
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((item) => item !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id).filter((id): id is string => Boolean(id)));
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
      product.model || "",
      product.category,
      product.subcategory,
      product.sku,
      (product as Product & ProductFormState).hsnCode || "",
      (product as Product & ProductFormState).gstPercentage || 18,
      product.costPrice,
      product.wholesalePrice,
      product.retailPrice,
      product.stock,
      product.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.csv";
    link.click();
  };

  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(`Delete ${selectedProducts.length} selected products?`);
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE",
          })
        )
      );

      setProducts(products.filter((p) => !p._id || !selectedProducts.includes(p._id)));
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
          <h1 className="text-2xl font-bold text-zinc-950 font-sans">
            Corporate Inventory & Products
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage product listings, inventory, pricing, tax details, images and product status.
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

          <label className="bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 flex items-center gap-2 text-sm font-medium">
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
  onClick={() => {
    setProductDraft({
      ...emptyProduct,
      faqs: [],
      images: [],
    });
    setProductFiles([]);
    setShowModal(true);
  }}
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
          <h2 className="text-3xl font-bold text-green-600 mt-2">{inStockProducts}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">Low Stock</p>
          <h2 className="text-3xl font-bold text-orange-500 mt-2">{lowStockProducts}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-zinc-500">Out Of Stock</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">{outOfStockProducts}</h2>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products by name, SKU, model or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Model</th>
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
                      checked={item._id ? selectedProducts.includes(item._id) : false}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleProduct(item._id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    {safeImages(item)[0] ? (
                      <img
                        src={getImageUrl(safeImages(item)[0])}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-zinc-100 border rounded-lg flex items-center justify-center text-[10px] text-zinc-400">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium max-w-[260px] truncate">{item.name}</td>
                  <td className="px-6 py-4 text-xs font-mono">{item.sku}</td>
                  <td className="px-6 py-4 max-w-[180px] truncate">{item.model || "-"}</td>
                  <td className="px-6 py-4">{item.brand}</td>
                  <td className="px-6 py-4">{item.category}</td>

                  <td className="px-6 py-4 text-center">
                    {item.stock === 0 ? (
                      <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    ) : (
                      <span className={item.stock < 10 ? "text-orange-500 font-semibold" : ""}>
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
                          openEditProduct(item);
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

      {newProduct && (
        <div className="fixed inset-0 bg-black/50 z-[9999] overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
              <div className="px-6 py-4 border-b bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Update product information, remove images, or add new product images.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="text-xs text-zinc-500">Product Name</label>
                  <input
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Brand</label>
                  <input
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Model</label>
                  <input
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.model || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-500">Product Description</label>
                  <textarea
                    placeholder="Enter product description..."
                    className="border p-3 rounded-lg w-full mt-1"
                    rows={4}
                    maxLength={300}
                    value={newProduct.description || ""}
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

                <div>
                  <label className="text-xs text-zinc-500">Category</label>
                  <select
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
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
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Subcategory</label>
                  <select
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
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
                </div>

                <div>
                  <label className="text-xs text-zinc-500">HSN Code</label>
                  <input
                    type="text"
                    value={newProduct.hsnCode || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, hsnCode: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">GST %</label>
                  <select
                    value={newProduct.gstPercentage || 18}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        gstPercentage: Number(e.target.value),
                      })
                    }
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value={0}>GST 0%</option>
                    <option value={5}>GST 5%</option>
                    <option value={12}>GST 12%</option>
                    <option value={18}>GST 18%</option>
                    <option value={28}>GST 28%</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Approval Status</label>
                  <select
                    value={newProduct.approvalStatus || "Approved"}
                    onChange={(e) => setNewProduct({ ...newProduct, approvalStatus: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Wholesale Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.wholesalePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, wholesalePrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Retail Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={newProduct.retailPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, retailPrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Status</label>
                  <select
                    value={newProduct.status || "Active"}
                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

<div className="md:col-span-2 border rounded-xl p-4 bg-zinc-50">
  <div className="flex items-center justify-between mb-3">
    <div>
      <h3 className="font-semibold text-zinc-900">Product FAQs</h3>
      <p className="text-xs text-zinc-500">
        Add questions and answers shown on the customer product page.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        setNewProduct({
          ...newProduct,
          faqs: [...(newProduct.faqs || []), { question: "", answer: "" }],
        })
      }
      className="px-3 py-2 bg-black text-white rounded-lg text-sm"
    >
      + Add FAQ
    </button>
  </div>

  {(newProduct.faqs || []).length === 0 && (
    <p className="text-sm text-zinc-400 border border-dashed rounded-lg p-4 bg-white">
      No FAQs added yet.
    </p>
  )}

  <div className="space-y-4">
    {(newProduct.faqs || []).map((faq, index) => (
      <div key={index} className="bg-white border rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-zinc-500">Question</label>
          <input
            className="border p-3 rounded-lg w-full mt-1"
            placeholder="Example: Is this compatible with OnePlus 8?"
            value={faq.question}
            onChange={(e) => {
              const updatedFaqs = [...(newProduct.faqs || [])];
              updatedFaqs[index].question = e.target.value;
              setNewProduct({ ...newProduct, faqs: updatedFaqs });
            }}
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Answer</label>
          <textarea
            className="border p-3 rounded-lg w-full mt-1"
            rows={3}
            placeholder="Example: Yes, this product is compatible with OnePlus 8."
            value={faq.answer}
            onChange={(e) => {
              const updatedFaqs = [...(newProduct.faqs || [])];
              updatedFaqs[index].answer = e.target.value;
              setNewProduct({ ...newProduct, faqs: updatedFaqs });
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const updatedFaqs = (newProduct.faqs || []).filter(
              (_, faqIndex) => faqIndex !== index
            );
            setNewProduct({ ...newProduct, faqs: updatedFaqs });
          }}
          className="text-sm text-red-600 font-medium"
        >
          Remove FAQ
        </button>
      </div>
    ))}
  </div>
</div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-xs text-zinc-500">Product Images - Maximum 6</label>
                    <span className="text-xs text-zinc-400">{safeImages(newProduct).length}/6 images</span>
                  </div>

                  {safeImages(newProduct).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-2">
                      {safeImages(newProduct).map((img, index) => (
                        <div key={`${img}-${index}`} className="relative group border rounded-lg overflow-hidden bg-zinc-50">
                          <img
                            src={getImageUrl(img)}
                            alt={`Product ${index + 1}`}
                            className="h-24 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setNewProduct({
                                ...newProduct,
                                images: safeImages(newProduct).filter((_, imgIndex) => imgIndex !== index),
                              })
                            }
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-4 text-sm text-zinc-400 mt-2">
                      No images selected.
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="border p-3 rounded-lg w-full mt-3"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length || !newProduct) return;

                      const existingImages = safeImages(newProduct);
                      const remainingSlots = Math.max(0, 6 - existingImages.length);
                      const acceptedFiles = files.slice(0, remainingSlots);

                      if (!acceptedFiles.length) {
                        alert("Maximum 6 images allowed");
                        return;
                      }

                      const previewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

                      setEditProductFiles([...editProductFiles, ...acceptedFiles]);
                      setNewProduct({
                        ...newProduct,
                        images: [...existingImages, ...previewUrls].slice(0, 6),
                      });
                    }}
                  />

                  <p className="text-xs text-zinc-400 mt-2">
                    Remove unwanted images first, then add new images. Only 6 images are allowed.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white sticky bottom-0">
                <button
                  onClick={() => {
                    setNewProduct(null);
                    setEditProductFiles([]);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button onClick={handleUpdateProduct} className="px-4 py-2 bg-black text-white rounded-lg">
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
                  Add product details, tax information and up to 6 product images.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="text-xs text-zinc-500">Product Name</label>
                  <input
                    placeholder="Product Name"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={productDraft.name}
                    onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Brand</label>
                  <input
                    placeholder="Brand"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={productDraft.brand}
                    onChange={(e) => setProductDraft({ ...productDraft, brand: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Model</label>
                  <input
                    type="text"
                    placeholder="Model, Ex: OnePlus 10 Pro 5G"
                    value={productDraft.model}
                    onChange={(e) => setProductDraft({ ...productDraft, model: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">SKU</label>
                  <div className="flex gap-2 mt-1">
                    <input value={productDraft.sku} readOnly className="border p-3 rounded-lg w-full bg-gray-100" />
                    <button
                      type="button"
                      onClick={() => setProductDraft({ ...productDraft, sku: generateSKU() })}
                      className="px-4 bg-black text-white rounded-lg"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-500">Product Description</label>
                  <textarea
                    placeholder="Enter product description..."
                    className="border p-3 rounded-lg w-full mt-1"
                    rows={4}
                    maxLength={300}
                    value={productDraft.description}
                    onChange={(e) =>
                      setProductDraft({
                        ...productDraft,
                        description: e.target.value.replace(/\s+/g, " "),
                      })
                    }
                  />
                  <p className="text-xs text-zinc-400 mt-1">
                    {(productDraft.description || "").length}/300 characters
                  </p>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Category</label>
                  <select
                    value={productDraft.category}
                    onChange={(e) => setProductDraft({ ...productDraft, category: e.target.value, subcategory: "" })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Subcategory</label>
                  <select
                    value={productDraft.subcategory}
                    onChange={(e) => setProductDraft({ ...productDraft, subcategory: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value="">Select Subcategory</option>
                    {categories
                      .find((cat) => cat.name === productDraft.category)
                      ?.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">HSN Code</label>
                  <input
                    type="text"
                    value={productDraft.hsnCode}
                    onChange={(e) => setProductDraft({ ...productDraft, hsnCode: e.target.value })}
                    placeholder="Ex: 4202"
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">GST %</label>
                  <select
                    value={productDraft.gstPercentage}
                    onChange={(e) => setProductDraft({ ...productDraft, gstPercentage: Number(e.target.value) })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value={0}>GST 0%</option>
                    <option value={5}>GST 5%</option>
                    <option value={12}>GST 12%</option>
                    <option value={18}>GST 18%</option>
                    <option value={28}>GST 28%</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-500">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter stock"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={productDraft.stock}
                    onChange={(e) => setProductDraft({ ...productDraft, stock: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Approval Status</label>
                  <select
                    value={productDraft.approvalStatus}
                    onChange={(e) => setProductDraft({ ...productDraft, approvalStatus: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-500">Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Cost price"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={productDraft.costPrice}
                    onChange={(e) => setProductDraft({ ...productDraft, costPrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-500">Wholesale Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Wholesale price"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={productDraft.wholesalePrice}
                    onChange={(e) => setProductDraft({ ...productDraft, wholesalePrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-500">Retail Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Retail price"
                    className="border p-3 rounded-lg w-full mt-1"
                    value={productDraft.retailPrice}
                    onChange={(e) => setProductDraft({ ...productDraft, retailPrice: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Status</label>
                  <select
                    value={productDraft.status}
                    onChange={(e) => setProductDraft({ ...productDraft, status: e.target.value })}
                    className="border p-3 rounded-lg w-full mt-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2 border rounded-xl p-4 bg-zinc-50">
  <div className="flex items-center justify-between mb-3">
    <div>
      <h3 className="font-semibold text-zinc-900">Product FAQs</h3>
      <p className="text-xs text-zinc-500">
        Add questions and answers shown on the customer product page.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        setProductDraft({
          ...productDraft,
          faqs: [...productDraft.faqs, { question: "", answer: "" }],
        })
      }
      className="px-3 py-2 bg-black text-white rounded-lg text-sm"
    >
      + Add FAQ
    </button>
  </div>

  {productDraft.faqs.length === 0 && (
    <p className="text-sm text-zinc-400 border border-dashed rounded-lg p-4 bg-white">
      No FAQs added yet.
    </p>
  )}

  <div className="space-y-4">
    {productDraft.faqs.map((faq, index) => (
      <div key={index} className="bg-white border rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs text-zinc-500">Question</label>
          <input
            className="border p-3 rounded-lg w-full mt-1"
            placeholder="Example: Is this compatible with OnePlus 8?"
            value={faq.question}
            onChange={(e) => {
              const updatedFaqs = [...productDraft.faqs];
              updatedFaqs[index].question = e.target.value;
              setProductDraft({ ...productDraft, faqs: updatedFaqs });
            }}
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500">Answer</label>
          <textarea
            className="border p-3 rounded-lg w-full mt-1"
            rows={3}
            placeholder="Example: Yes, this product is compatible with OnePlus 8."
            value={faq.answer}
            onChange={(e) => {
              const updatedFaqs = [...productDraft.faqs];
              updatedFaqs[index].answer = e.target.value;
              setProductDraft({ ...productDraft, faqs: updatedFaqs });
            }}
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setProductDraft({
              ...productDraft,
              faqs: productDraft.faqs.filter((_, faqIndex) => faqIndex !== index),
            })
          }
          className="text-sm text-red-600 font-medium"
        >
          Remove FAQ
        </button>
      </div>
    ))}
  </div>
</div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-xs font-medium text-zinc-500">Upload Product Images - Maximum 6</label>
                    <span className="text-xs text-zinc-400">{productDraft.images.length}/6 images</span>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="border p-3 rounded-lg w-full mt-1"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).slice(0, 6);
                      if (!files.length) return;

                      setProductFiles(files);
                      setProductDraft({
                        ...productDraft,
                        images: files.map((file) => URL.createObjectURL(file)),
                      });
                    }}
                  />

                  {productDraft.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                      {productDraft.images.map((img, index) => (
                        <div key={`${img}-${index}`} className="relative border rounded-lg overflow-hidden bg-zinc-50">
                          <img src={img} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setProductDraft({
                                ...productDraft,
                                images: productDraft.images.filter((_, imgIndex) => imgIndex !== index),
                              });
                              setProductFiles(productFiles.filter((_, fileIndex) => fileIndex !== index));
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white sticky bottom-0">
                <button onClick={resetAddModal} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>

                <button onClick={handleAddProduct} className="px-4 py-2 bg-black text-white rounded-lg">
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
              <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-sm text-zinc-500 mb-3">
                {selectedProduct.brand} • {selectedProduct.model || "No model"}
              </p>

              {safeImages(selectedProduct)[0] && (
                <img
                  src={getImageUrl(safeImages(selectedProduct)[0])}
                  className="w-full h-56 object-cover rounded-xl mb-4 border"
                  alt={selectedProduct.name}
                />
              )}

              <p className="text-sm mb-4">{selectedProduct.description || "No description"}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <p><b>Category:</b> {selectedProduct.category}</p>
                <p><b>Subcategory:</b> {selectedProduct.subcategory}</p>
                <p><b>SKU:</b> {selectedProduct.sku}</p>
                <p><b>Model:</b> {selectedProduct.model || "-"}</p>
                <p><b>HSN:</b> {(selectedProduct as Product & ProductFormState).hsnCode || "-"}</p>
                <p><b>GST:</b> {(selectedProduct as Product & ProductFormState).gstPercentage || 18}%</p>
                <p><b>Stock:</b> {selectedProduct.stock}</p>
                <p><b>Status:</b> {selectedProduct.status}</p>
              </div>

              {safeImages(selectedProduct).length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
                  {safeImages(selectedProduct).map((img, index) => (
                    <img
                      key={`${img}-${index}`}
                      src={getImageUrl(img)}
                      alt={`Product ${index + 1}`}
                      className="h-20 w-full object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}

              <button onClick={() => setSelectedProduct(null)} className="mt-6 px-4 py-2 bg-black text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
