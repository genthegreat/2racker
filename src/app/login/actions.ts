"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/utils/db/types";

export async function login(formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      captchaToken: formData.get("captchaToken") as string,
    },
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      status: 401,
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function loginAnonymously(formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const captchaToken = formData.get("captchaToken") as string;

  const { error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken,
    },
  });

  if (error) {
    return {
      status: 401,
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signup(formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      captchaToken: formData.get("captchaToken") as string,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      status: 400,
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}
