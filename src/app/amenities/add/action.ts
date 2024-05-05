"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function add(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    amenity_name: formData.get("amenity_name") as string,
    default_amount: formData.get("default_amount"),
    category: formData.get("category") as string,
    project_id: formData.get("project_id"),
  };

  const { error } = await supabase
    .from("amenities")
    .insert([data])
    .select();

  if (error) {
    redirect("/error?message=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/amenities");
}
