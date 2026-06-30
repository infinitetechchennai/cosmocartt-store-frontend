import { createContext, useContext, useEffect, useState } from "react";
import { apiPath } from "../config/api";

export type CatalogModel = {
  name: string;
  productCount: number;
  image?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockProducts?: number;
};

export type CatalogBrand = CatalogModel & {
  models: CatalogModel[];
};

export type CatalogSubcategory = CatalogModel & {
  brands: CatalogBrand[];
};

export type CatalogCategory = CatalogModel & {
  subcategories: CatalogSubcategory[];
};

type CatalogContextType = {
  catalog: CatalogCategory[];
  loading: boolean;
  error: string;
  refreshCatalog: () => void;
};

const CatalogContext = createContext<CatalogContextType>({
  catalog: [],
  loading: true,
  error: "",
  refreshCatalog: () => {},
});

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCatalog = () => {
    setLoading(true);
    setError("");

    fetch(apiPath("/api/products/catalog"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCatalog(data.catalog || []);
        } else {
          setError(data.message || "Failed to load catalog");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load catalog");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        catalog,
        loading,
        error,
        refreshCatalog: fetchCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
