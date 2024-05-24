"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";

const supabase = createClient();

export async function submit(formData: FormData) {
  const data = {
    project_name: formData.get("name") as string,
    description: formData.get("description") as string,
    account_id: formData.get("accountId"),
  };

  console.log(data);

  const { error } = await supabase.from("projects").insert([data]).select();

  if (error) redirect('/error?error=' + encodeURIComponent(serializeError(error)))

  revalidatePath("/", "layout");
  redirect("/accounts");
}

export async function update(formData: FormData) {
  try {
    const project_id = formData.get("id");

    const form = {
      project_name: formData.get("name") as string,
      description: formData.get("description") as string,
      account_id: formData.get("accountId"),
    };

    console.log(form);

    const { data, error, status } = await supabase
      .from("projects")
      .update(form)
      .eq("project_id", project_id)
      .select();

    console.log("status code", status);

    if (error) throw error;

    if (data) console.log("Project Updated!", data);
    return { success: true, data, status };
  } catch (error: any) {
    console.log("An error occured!", error);
    return { success: false, error: error.message };
  }
}

export async function del(id: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase
      .from("amenities")
      .delete()
      .eq("amenity_id", id);

    if (error) redirect('/error?error=' + encodeURIComponent(serializeError(error)))

    revalidatePath("/", "layout");
    redirect("/history");
  }
}