"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";

const supabase = createClient();
export async function submit(formData: FormData) {
  const id = formData.get("projectId");

  const data = {
    amenity_name: formData.get("amenityName") as string,
    default_amount: formData.get("defaultAmount"),
    category: formData.get("category") as string,
    project_id: id,
  };

  console.log(data);

  const { error } = await supabase.from("amenities").insert([data]).select();

  if (error) redirect('/error?error=' + encodeURIComponent(serializeError(error)))

  //   revalidatePath("/", "layout");
  redirect(`/amenities?id=${id}`);
}

export async function update(formData: FormData) {
  try {
    const id = formData.get("id")

    const form = {
      amenity_name: formData.get("amenityName") as string,
      default_amount: formData.get("defaultAmount"),
      category: formData.get("category") as string,
      project_id: formData.get("projectId"),
    };

    const { data, error, status } = await supabase
      .from("amenities")
      .update(form)
      .eq("amenity_id", id)
      .select();
    
    console.log("status code", status)

    if (error) throw error;

    if (data) console.log("Amenity Updated!", data);
    return { success: true, data, status };
  } catch (error: any) {
    console.log("An error occured!", error);
    return { success: false, error: error.message, status};
  }
}

export async function del(id: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error, status } = await supabase
      .from("amenities")
      .delete()
      .eq("amenity_id", id);

    if (error) redirect('/error?error=' + encodeURIComponent(serializeError(error)))

    revalidatePath("/", "layout");
    redirect("/history");
  }
}