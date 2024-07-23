"use server";

import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";
import { redirect } from "next/navigation";

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const options = {
    redirectTo: "/reset-password",
    captchaToken: formData.get("captchaToken") as string,
  };

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email,
    options
  );

  if (error) {
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }

  if (!error) {
    return 'success';
  }
}
