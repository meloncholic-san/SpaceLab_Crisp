import { supabase } from '../api/supabase.ts';

type GetProductsByTagParams = {
  tag?: string;
  page?: number;
};

const PAGE_SIZE = 8;

export async function getProductsByTag({
  tag = 'top',
  page = 1,
}: GetProductsByTagParams) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (tag !== 'top') {
      query = query.contains('tags', [tag]);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await query.range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Error fetching products by tag:', err);
    throw err;
  }
}

export async function getFeaturedItems() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .not("discount_percent", "is", null) 
      .order("created_at", { ascending: false })
      .range(0, 15);

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.error("Error fetching featured items:", err);
    throw err;
  }
}


export type Filters = {
  brands: string[];
  sizes: string[];
  lengths: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
  sort: "price_asc" | "price_desc";
};

export async function getProductsWithFilters(filters: Filters) {
  try {
    let query = supabase.from("products").select("*");

    if (filters.brands?.length) {
      query = query.in("brand", filters.brands);
    }

    if (filters.sizes?.length) {
      query = query.overlaps("sizes", filters.sizes);
    }

    if (filters.lengths?.length) {
      query = query.in("dress_length", filters.lengths);
    }

    if (filters.colors?.length) {
      query = query.overlaps("colors", filters.colors);
    }

    if (filters.priceMin !== undefined) {
      query = query.gte("price", filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      query = query.lte("price", filters.priceMax);
    }

    if (filters.sort === "price_asc") {
      query = query.order("price", { ascending: true });
    }

    if (filters.sort === "price_desc") {
      query = query.order("price", { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.error("Filter error:", err);
    throw err;
  }
}


export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Get product error:", err);
    throw err;
  }
}