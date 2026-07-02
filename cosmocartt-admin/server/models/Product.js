import mongoose from "mongoose";
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      required: true,
    },
    answer: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
  type: String,
  unique: true,
  sparse: true,
  lowercase: true,
  trim: true,
  index: true,
},

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ==========================
    // SEO Fields
    // ==========================

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },

    focusKeyword: {
      type: String,
      default: "",
    },

    canonicalUrl: {
      type: String,
      default: "",
    },

    // ==========================

    sku: {
      type: String,
      required: true,
      unique: true,
    },

    costPrice: {
      type: Number,
      required: true,
    },

    wholesalePrice: {
      type: Number,
      required: true,
    },

    retailPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "Active",
    },

    hsnCode: {
      type: String,
      default: "",
    },

    gstPercentage: {
      type: Number,
      default: 18,
    },

    sellerId: {
      type: String,
      default: "ADMIN",
    },

    sellerName: {
      type: String,
      default: "CosmoCartt",
    },

    sellerGSTIN: {
      type: String,
      default: "",
    },

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },

    specifications: {
      type: [
        {
          key: String,
          value: String,
        },
      ],
      default: [],
    },

    faqs: {
  type: [faqSchema],
  default: [],
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);