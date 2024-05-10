"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function submit(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("projectId")

  const data = {
    amenity_name: formData.get("amenityName") as string,
    default_amount: formData.get("defaultAmount"),
    category: formData.get("category") as string,
    project_id: id
    };
    
    console.log(data)

  const { error } = await supabase
    .from("amenities")
    .insert([data])
    .select();

  if (error) {
    redirect("/error?message=" + encodeURIComponent(error.message));
  }

//   revalidatePath("/", "layout");
  redirect(`/amenities?id=${id}`);
}
