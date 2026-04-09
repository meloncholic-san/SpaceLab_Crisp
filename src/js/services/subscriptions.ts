import { supabase } from "../api/supabase";
import { getCurrentUser } from "./auth";

export interface Subscriber {
  id: string;
  email: string;
  user_id: string | null;
  is_subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export async function subscribeToNewsletter(email: string): Promise<{success: boolean;message: string;data?: Subscriber;
}> {
  const user = await getCurrentUser();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing, error: checkError } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (checkError) {
    console.error("Check subscriber error:", checkError);
    return { success: false, message: "Database error. Please try again." };
  }

  if (existing) {
    if (existing.is_subscribed) {
      return { 
        success: false, 
        message: "already_subscribed"
      };
    } else {
      const { data: updated, error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          is_subscribed: true,
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
          user_id: user?.id || existing.user_id,
        })
        .eq("email", normalizedEmail)
        .select()
        .single();

      if (updateError) {
        return { success: false, message: "Failed to resubscribe" };
      }

      return {
        success: true,
        message: "resubscribed",
        data: updated,
      };
    }
  }
  
  const { data: newSubscriber, error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: normalizedEmail,
      user_id: user?.id || null,
      is_subscribed: true,
      subscribed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    console.error("Insert subscriber error:", insertError);
    return { success: false, message: "Failed to subscribe" };
  }

  return {
    success: true,
    message: "subscribed",
    data: newSubscriber,
  };
}

export async function getSubscriber() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();


  if (error) throw error;

  return data;
}