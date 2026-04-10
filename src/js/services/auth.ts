import { guestSupabase, supabase } from '../api/supabase';
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { syncLocalCartToDatabase } from './local-cart';

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}


export async function signUp(payload: RegisterPayload) {
  const { email, password, firstName, lastName } = payload;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { firstName, lastName } },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('Email already in use');
    }
    throw error;
  }

  const user = data.user;
  if (!user) throw new Error('User not created');

  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!existingProfile) {
    const { error: profileError } = await supabase.from('users').insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
    });
    if (profileError) throw profileError;
  }

  return user;
}


export async function signIn(payload: SignInPayload) {
  try {
    const { email, password } = payload;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }

      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email');
      }

      throw error;
    }

    const user = data.user;
    if (!user) {
      throw new Error('User not found');
    }

    return user;

  } catch (err: any) {
    console.error('SIGN IN FAILED:', err);
    throw new Error(err.message || 'Login failed');
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getClient() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? supabase : guestSupabase;
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export function listenAuthStatus(): void {
  supabase.auth.onAuthStateChange(
    async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event);

      switch (event) {
        case "SIGNED_IN":
          console.log("User signed in:", session?.user.email);

          try {
            await syncLocalCartToDatabase();
          } catch (err) {
            console.error("Cart sync failed:", err);
          }

          break;

        case "SIGNED_OUT":
          console.log("User signed out");
          window.location.href = "./login.html";
          break;

        case "USER_UPDATED":
          console.log("User updated");
          break;

        case "TOKEN_REFRESHED":
          console.log("Token refreshed");
          break;

        case "PASSWORD_RECOVERY":
          console.log("Password recovery");
          break;
      }
    }
  );
}
