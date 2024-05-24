"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";

const supabase = createClient();

export async function submit(id: string, formData: FormData) {
  const data = {
    account_name: formData.get("name") as string,
    start_date: formData.get("startDate") as string,
    status: (formData.get("status") as string).toLowerCase(),
    user_id: id,
  };

  console.log(data);

  const { error } = await supabase.from("accounts").insert([data]);

  if (error) {
    redirect('/error?error=' + encodeURIComponent(serializeError(error)))
  }

  revalidatePath("/", "layout");
  redirect("/accounts");
}

export async function update(formData: FormData) {
  try {
    const account_id = formData.get("id");

    const form = {
      account_name: formData.get("name") as string,
      start_date: formData.get("date") as string,
      status: (formData.get("status") as string).toLowerCase(),
    };

    console.log(form);

    const { data, error, status } = await supabase
      .from("accounts")
      .update(form)
      .eq("account_id", account_id)
      .select();

    console.log("status code", status);

    if (error) throw error;

    if (data) console.log("Account Updated!", data);
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
    const { error, status } = await supabase
      .from("accounts")
      .delete()
      .eq("account_id", id);

    if (error) redirect('/error?error=' + encodeURIComponent(serializeError(error)))

    revalidatePath("/", "layout");
    redirect("/history");
  }
}