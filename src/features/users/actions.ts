"use server";

import db from "@/lib/supabase/db";
import createServerClient from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin"; // ✅ novo import
import { type AuthUser } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { profiles } from "../../lib/supabase/schema";
import { AdminUserFormData } from "@/features/users/validations";
import { env } from "@/env.mjs";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient({ cookieStore });

  const { data, error } = await supabase.auth.getUser(); // ✅ corrigido
  if (error) throw new Error("Erro ao buscar usuário.");
  return data.user ?? null;
};

export const getCurrentUserSession = async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient({ cookieStore });

  const { data, error } = await supabase.auth.getSession(); // ✅ corrigido
  if (error) throw new Error("Erro ao buscar sessão.");
  return data.session;
};

export const isAdmin = async (currentUser: AuthUser | null) =>
  currentUser?.user_metadata?.isAdmin ?? false; // ✅ corrigido

export const getUser = async ({ userId }: { userId: string }) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId); // ✅ corrigido
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw new Error("Erro ao buscar o usuário.");
  }
};

export const listUsers = async ({
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
}) => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ // ✅ corrigido
    page,
    perPage,
  });

  if (error) throw new Error(error.message);
  return data.users;
};

export const createUser = async ({
  email,
  name,
  password,
}: AdminUserFormData) => {
  try {
    const existedUser = await db.query.profiles.findFirst({
      where: eq(profiles.email, email),
    });

    if (existedUser) throw new Error(`User with email ${email} already exists.`);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({ // ✅ corrigido
      email,
      password,
      role: "authenticated",
      user_metadata: { name, isAdmin: true },
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw new Error("Erro inesperado ao criar usuário.");
  }
};
