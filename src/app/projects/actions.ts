"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function submit(formData: FormData) {
  const supabase = createClient();

  const data = {
    project_name: formData.get("name") as string,
    description: formData.get("description") as string,
    account_id: formData.get("accountId"),
  };

  console.log(data);

    const { error } = await supabase
      .from("projects")
      .insert([data])
      .select();

    if (error) {
      redirect("/error?message=" + encodeURIComponent(error.message));
    }

  //   revalidatePath("/", "layout");
    redirect("/accounts");
}
