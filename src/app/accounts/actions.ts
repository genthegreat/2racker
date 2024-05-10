"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function submit(id: string, formData: FormData) {
  const supabase = createClient();

  const data = {
    account_name: formData.get("name") as string,
    start_date: formData.get("startDate") as string,
    status: (formData.get("status")  as string).toLowerCase(),
    user_id: id,
  };

  console.log(data);

  const { error } = await supabase.from("accounts").insert([data]);
  
  if (error) {
    redirect("/error?message=" + encodeURIComponent(error.message));
  }

  //   revalidatePath("/", "layout");
  redirect("/accounts");
}
