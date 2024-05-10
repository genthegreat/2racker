"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function submit(formData: FormData) {
  const supabase = createClient();

  const data = {
    notes: formData.get("name") as string,
    amount_paid: formData.get("amount"),
    transaction_date: formData.get("date") as string,
    platform: formData.get("platform"),
    receipt_info: formData.get("receipt"),
    status: formData.get("status"),
  };

  console.log(data);

    const { error } = await supabase
      .from("transactions")
      .insert([data])
      .select();

    if (error) {
      redirect("/error?message=" + encodeURIComponent(error.message));
    }

  //   revalidatePath("/", "layout");
    redirect("/history");
}
