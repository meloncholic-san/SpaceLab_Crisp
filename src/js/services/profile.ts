import { supabase } from "../api/supabase";
import { getCurrentUser } from "./auth";


export interface ShippingData {
  country: string;
  state: string;
  city?: string;
  address?: string;
  address2?: string;
  address3?: string;
  zip?: number; 
  phone?: string;
  company?: string;
  fax?: string;
}

export async function toggleFavourite(productId: string) {
  const user = await getCurrentUser();

  if (!user) throw new Error("Not authorized");

  const { data: existing } = await supabase
    .from("favourites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();
    
    if (existing) {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;

    return { liked: false };
  }

  const { error } = await supabase.from("favourites").insert({
    user_id: user.id,
    product_id: productId,
  });

  if (error) throw error;

  return { liked: true };
}



export async function createShippingAddress(shipping: ShippingData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authorized");

  const { data: existing, error: fetchError } = await supabase
    .from("shipping_address")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const addressData = {
    country: shipping.country,
    state: shipping.state,
    city: shipping.city,
    address: shipping.address,
    address2: shipping.address2,
    address3: shipping.address3,
    zip: shipping.zip,
    phone: shipping.phone,
    company: shipping.company,
    fax: shipping.fax,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("shipping_address")
      .update(addressData)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) throw error || new Error("Shipping address update failed");
    return data;
  } else {
    const { data, error } = await supabase
      .from("shipping_address")
      .insert({
        user_id: user.id,
        ...addressData,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Shipping address creation failed");
    return data;
  }
}

export async function createOrUpdateUserProfile(data: {
  firstName: string;
  lastName: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authorized");

  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { data: updated, error } = await supabase
      .from("users")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error || !updated) throw error || new Error("Update failed");
    return updated;
  } else {
    const { data: inserted, error } = await supabase
      .from("users")
      .insert({
        id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
      })
      .select()
      .single();

    if (error || !inserted) throw error || new Error("Insert failed");
    return inserted;
  }
}

export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getShippingAddress() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("shipping_address")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function updateUserEmail(email: string) {
  const { data, error } = await supabase.auth.updateUser({
    email,
  });

  if (error) throw error;

  return data;
}

export async function updateUserPassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;

  return data;
}

export async function getUserOrders() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}


export async function getFavourites() {
  const { data, error } = await supabase
    .from("favourites")
    .select(`
      product:products (
        id,
        title,
        price,
        image,
        brand,
        discount_percent,
        tags,
        colors,
        sizes,
        product_code
      )
    `)

  if (error) throw error;

  return data;
}

export async function removeFavourite(productId: string) {
  const { error } = await supabase
    .from("favourites")
    .delete()
    .eq("product_id", productId);

  if (error) throw error;
}