"use server";

import { createClient } from "@/utils/supabase/server";

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const redirectLink = formData.get("redirectLink") as string;
    
  console.log(email, redirectLink)

  const options = {
    redirectTo: `${redirectLink}/reset-password`,
    captchaToken: formData.get("captchaToken") as string,
  };

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email,
    options
  );

  if (error) {
    return error.message;
  }

  if (data) {
    return 'success';
  }
}
