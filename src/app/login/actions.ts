"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serializeError } from "../../utils/utils";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      captchaToken: formData.get("captchaToken") as string
    }
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function loginAnonymously(formData: FormData) {
  const supabase = createClient();

  const captchaToken = formData.get("captchaToken") as string

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      captchaToken: formData.get("captchaToken") as string
    }
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}
